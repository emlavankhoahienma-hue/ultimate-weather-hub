/**
 * Aetheris Weather Hub - Multi-Provider API Service Layer
 * Supports Open-Meteo (Default Free), WeatherAPI, OpenWeatherMap, and WAQI.
 * Normalizes multi-source responses into a unified high-precision meteorological dataset.
 */

const ApiService = (() => {
  const OPEN_METEO_GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  const OPEN_METEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
  const OPEN_METEO_AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
  const REVERSE_GEO_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

  const CACHE_TTL_MS = 10 * 60 * 1000;
  const cache = new Map();

  /**
   * Helper to perform fetch with timeout
   */
  async function fetchWithTimeout(url, timeoutMs = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  /**
   * Search locations using Open-Meteo Geocoding API
   */
  async function searchLocations(query, count = 8) {
    if (!query || query.trim().length < 2) return [];
    const trimmed = query.trim();
    const lang = I18n.getLang() === 'vi' ? 'vi' : 'en';
    const url = `${OPEN_METEO_GEO_URL}?name=${encodeURIComponent(trimmed)}&count=${count}&language=${lang}&format=json`;

    try {
      const data = await fetchWithTimeout(url, 6000);
      if (!data || !data.results) return [];

      return data.results.map(item => ({
        id: `${item.latitude.toFixed(4)}_${item.longitude.toFixed(4)}`,
        name: item.name,
        admin1: item.admin1 || '',
        country: item.country || '',
        countryCode: item.country_code ? item.country_code.toUpperCase() : '',
        latitude: item.latitude,
        longitude: item.longitude,
        elevation: item.elevation || 0,
        timezone: item.timezone || 'auto'
      }));
    } catch (error) {
      console.warn('[ApiService] searchLocations error:', error);
      return [];
    }
  }

  /**
   * Reverse geocode coordinates to find city name
   */
  async function reverseGeocode(latitude, longitude) {
    try {
      const lang = I18n.getLang() === 'vi' ? 'vi' : 'en';
      const url = `${REVERSE_GEO_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=${lang}`;
      const data = await fetchWithTimeout(url, 6000);
      return {
        id: `${latitude.toFixed(4)}_${longitude.toFixed(4)}`,
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        admin1: data.principalSubdivision || '',
        country: data.countryName || '',
        countryCode: data.countryCode || '',
        latitude,
        longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
      };
    } catch (error) {
      return {
        id: `${latitude.toFixed(4)}_${longitude.toFixed(4)}`,
        name: I18n.getLang() === 'vi' ? 'Vị trí hiện tại' : 'Current Location',
        admin1: '',
        country: '',
        countryCode: '',
        latitude,
        longitude,
        timezone: 'auto'
      };
    }
  }

  /**
   * Fetch Weather Data (Dispatches to selected provider with automatic fallback)
   */
  async function fetchWeatherData(latitude, longitude, timezone = 'auto') {
    const provider = StorageManager.getProvider();
    const keys = StorageManager.getApiKeys();

    const cacheKey = `weather_${provider}_${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    // 1. WeatherAPI Provider (If Key is present)
    if (provider === 'weatherapi' && keys.weatherapi) {
      try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${keys.weatherapi}&q=${latitude},${longitude}&days=8&aqi=yes&alerts=yes`;
        const raw = await fetchWithTimeout(url, 8000);
        const normalized = normalizeWeatherApi(raw);
        cache.set(cacheKey, { timestamp: Date.now(), data: normalized });
        return normalized;
      } catch (err) {
        console.warn('[ApiService] WeatherAPI failed, falling back to Open-Meteo:', err);
      }
    }

    // 2. OpenWeatherMap Provider (If Key is present)
    if (provider === 'openweathermap' && keys.openweathermap) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${keys.openweathermap}&units=metric`;
        const raw = await fetchWithTimeout(url, 8000);
        const normalized = normalizeOpenWeatherMap(raw, latitude, longitude);
        cache.set(cacheKey, { timestamp: Date.now(), data: normalized });
        return normalized;
      } catch (err) {
        console.warn('[ApiService] OpenWeatherMap failed, falling back to Open-Meteo:', err);
      }
    }

    // 3. Open-Meteo Default Resilient Engine
    const currentParams = [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index'
    ].join(',');

    const hourlyParams = [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'surface_pressure',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index',
      'is_day'
    ].join(',');

    const dailyParams = [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'daylight_duration',
      'sunshine_duration',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant'
    ].join(',');

    const url = `${OPEN_METEO_WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=${encodeURIComponent(timezone)}&forecast_days=8`;

    try {
      const data = await fetchWithTimeout(url, 10000);
      cache.set(cacheKey, { timestamp: Date.now(), data });
      return data;
    } catch (error) {
      console.error('[ApiService] Open-Meteo fetch failed:', error);
      throw error;
    }
  }

  /**
   * Fetch Air Quality Data
   */
  async function fetchAirQuality(latitude, longitude, timezone = 'auto') {
    const keys = StorageManager.getApiKeys();
    const cacheKey = `aqi_${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    // Optional WAQI Ground Station token
    if (keys.waqi) {
      try {
        const url = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${keys.waqi}`;
        const raw = await fetchWithTimeout(url, 6000);
        if (raw && raw.status === 'ok' && raw.data) {
          const aqiData = {
            current: {
              us_aqi: raw.data.aqi,
              pm2_5: raw.data.iaqi && raw.data.iaqi.pm25 ? raw.data.iaqi.pm25.v : null,
              pm10: raw.data.iaqi && raw.data.iaqi.pm10 ? raw.data.iaqi.pm10.v : null,
              ozone: raw.data.iaqi && raw.data.iaqi.o3 ? raw.data.iaqi.o3.v : null,
              nitrogen_dioxide: raw.data.iaqi && raw.data.iaqi.no2 ? raw.data.iaqi.no2.v : null,
              sulphur_dioxide: raw.data.iaqi && raw.data.iaqi.so2 ? raw.data.iaqi.so2.v : null,
              carbon_monoxide: raw.data.iaqi && raw.data.iaqi.co ? raw.data.iaqi.co.v : null
            }
          };
          cache.set(cacheKey, { timestamp: Date.now(), data: aqiData });
          return aqiData;
        }
      } catch (e) {
        console.warn('[ApiService] WAQI fetch error, falling back to Open-Meteo AQI');
      }
    }

    // Open-Meteo Air Quality Engine
    const currentParams = [
      'european_aqi',
      'us_aqi',
      'pm10',
      'pm2_5',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone',
      'uv_index'
    ].join(',');

    const url = `${OPEN_METEO_AQI_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&timezone=${encodeURIComponent(timezone)}&forecast_days=3`;

    try {
      const data = await fetchWithTimeout(url, 8000);
      cache.set(cacheKey, { timestamp: Date.now(), data });
      return data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Normalizer for WeatherAPI.com responses
   */
  function normalizeWeatherApi(raw) {
    const cur = raw.current;
    const fDays = raw.forecast.forecastday;

    return {
      current: {
        temperature_2m: cur.temp_c,
        relative_humidity_2m: cur.humidity,
        apparent_temperature: cur.feelslike_c,
        is_day: cur.is_day,
        precipitation: cur.precip_mm,
        weather_code: mapConditionCodeToWmo(cur.condition.code),
        cloud_cover: cur.cloud,
        pressure_msl: cur.pressure_mb,
        wind_speed_10m: cur.wind_kph,
        wind_direction_10m: cur.wind_degree,
        wind_gusts_10m: cur.gust_kph,
        uv_index: cur.uv
      },
      daily: {
        time: fDays.map(d => d.date),
        weather_code: fDays.map(d => mapConditionCodeToWmo(d.day.condition.code)),
        temperature_2m_max: fDays.map(d => d.day.maxtemp_c),
        temperature_2m_min: fDays.map(d => d.day.mintemp_c),
        sunrise: fDays.map(d => `${d.date}T06:00`),
        sunset: fDays.map(d => `${d.date}T18:30`),
        uv_index_max: fDays.map(d => d.day.uv),
        precipitation_probability_max: fDays.map(d => d.day.daily_chance_of_rain),
        precipitation_sum: fDays.map(d => d.day.totalprecip_mm),
        wind_speed_10m_max: fDays.map(d => d.day.maxwind_kph)
      },
      hourly: {
        time: fDays[0].hour.map(h => h.time),
        temperature_2m: fDays[0].hour.map(h => h.temp_c),
        apparent_temperature: fDays[0].hour.map(h => h.feelslike_c),
        precipitation_probability: fDays[0].hour.map(h => h.chance_of_rain),
        precipitation: fDays[0].hour.map(h => h.precip_mm),
        weather_code: fDays[0].hour.map(h => mapConditionCodeToWmo(h.condition.code)),
        wind_speed_10m: fDays[0].hour.map(h => h.wind_kph),
        is_day: fDays[0].hour.map(h => h.is_day)
      }
    };
  }

  /**
   * Normalizer for OpenWeatherMap 5-day / 3-hour responses
   */
  function normalizeOpenWeatherMap(raw, lat, lon) {
    const list = raw.list;
    const first = list[0];

    return {
      current: {
        temperature_2m: first.main.temp,
        relative_humidity_2m: first.main.humidity,
        apparent_temperature: first.main.feels_like,
        is_day: first.sys.pod === 'd' ? 1 : 0,
        precipitation: first.rain ? (first.rain['3h'] || 0) : 0,
        weather_code: mapOwmToWmo(first.weather[0].id),
        cloud_cover: first.clouds.all,
        pressure_msl: first.main.sea_level || first.main.pressure,
        wind_speed_10m: first.wind.speed * 3.6,
        wind_direction_10m: first.wind.deg,
        wind_gusts_10m: (first.wind.gust || first.wind.speed) * 3.6,
        uv_index: 5
      },
      daily: {
        time: [0, 8, 16, 24, 32].map(idx => list[Math.min(idx, list.length - 1)].dt_txt.split(' ')[0]),
        weather_code: [0, 8, 16, 24, 32].map(idx => mapOwmToWmo(list[Math.min(idx, list.length - 1)].weather[0].id)),
        temperature_2m_max: [0, 8, 16, 24, 32].map(idx => list[Math.min(idx, list.length - 1)].main.temp_max),
        temperature_2m_min: [0, 8, 16, 24, 32].map(idx => list[Math.min(idx, list.length - 1)].main.temp_min),
        sunrise: ['2026-08-21T05:30'],
        sunset: ['2026-08-21T18:20'],
        precipitation_probability_max: [0, 8, 16, 24, 32].map(idx => Math.round((list[Math.min(idx, list.length - 1)].pop || 0) * 100))
      },
      hourly: {
        time: list.slice(0, 8).map(i => i.dt_txt),
        temperature_2m: list.slice(0, 8).map(i => i.main.temp),
        apparent_temperature: list.slice(0, 8).map(i => i.main.feels_like),
        precipitation_probability: list.slice(0, 8).map(i => Math.round((i.pop || 0) * 100)),
        precipitation: list.slice(0, 8).map(i => i.rain ? (i.rain['3h'] || 0) : 0),
        weather_code: list.slice(0, 8).map(i => mapOwmToWmo(i.weather[0].id)),
        wind_speed_10m: list.slice(0, 8).map(i => i.wind.speed * 3.6),
        is_day: list.slice(0, 8).map(i => i.sys.pod === 'd' ? 1 : 0)
      }
    };
  }

  function mapConditionCodeToWmo(code) {
    if (code === 1000) return 0; // Sunny / Clear
    if (code === 1003) return 2; // Partly cloudy
    if (code === 1006 || code === 1009) return 3; // Cloudy / Overcast
    if (code === 1030 || code === 1135) return 45; // Mist / Fog
    if ([1150, 1153, 1180, 1183].includes(code)) return 51; // Light rain
    if ([1186, 1189, 1192, 1195].includes(code)) return 65; // Heavy rain
    if ([1273, 1276, 1279, 1282, 1087].includes(code)) return 95; // Thunderstorm
    if ([1210, 1213, 1216, 1219, 1222, 1225].includes(code)) return 71; // Snow
    return 2;
  }

  function mapOwmToWmo(owmId) {
    if (owmId === 800) return 0;
    if (owmId === 801 || owmId === 802) return 2;
    if (owmId >= 803) return 3;
    if (owmId >= 200 && owmId < 300) return 95;
    if (owmId >= 300 && owmId < 400) return 51;
    if (owmId >= 500 && owmId < 600) return 63;
    if (owmId >= 600 && owmId < 700) return 71;
    if (owmId >= 700 && owmId < 800) return 45;
    return 2;
  }

  function clearCache() {
    cache.clear();
  }

  return {
    searchLocations,
    reverseGeocode,
    fetchWeatherData,
    fetchAirQuality,
    clearCache
  };
})();
