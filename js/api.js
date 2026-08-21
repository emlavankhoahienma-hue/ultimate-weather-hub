/**
 * Aetheris Weather Hub - API Service Layer
 * Interfaces with Open-Meteo Forecast, Geocoding, and Air Quality APIs.
 * Zero API keys required; 100% open and high performance.
 */

const ApiService = (() => {
  const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
  const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
  const REVERSE_GEO_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache
  const cache = new Map();

  /**
   * Helper to perform fetch with timeout
   */
  async function fetchWithTimeout(url, timeoutMs = 9000) {
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
   * @param {string} query Search text
   * @param {number} count Maximum number of results
   */
  async function searchLocations(query, count = 8) {
    if (!query || query.trim().length < 2) return [];
    const trimmed = query.trim();
    const url = `${GEO_URL}?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

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
        timezone: item.timezone || 'auto',
        population: item.population || null
      }));
    } catch (error) {
      console.error('[ApiService] searchLocations error:', error);
      return [];
    }
  }

  /**
   * Reverse geocode coordinates to find nearest city name
   */
  async function reverseGeocode(latitude, longitude) {
    try {
      const url = `${REVERSE_GEO_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      const data = await fetchWithTimeout(url, 6000);
      return {
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        admin1: data.principalSubdivision || '',
        country: data.countryName || '',
        countryCode: data.countryCode || '',
        latitude,
        longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
      };
    } catch (error) {
      console.warn('[ApiService] reverseGeocode fallback error:', error);
      return {
        name: 'Current Location',
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
   * Fetch comprehensive weather data from Open-Meteo Forecast API
   */
  async function fetchWeatherData(latitude, longitude, timezone = 'auto') {
    const cacheKey = `weather_${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

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

    const url = `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=${encodeURIComponent(timezone)}&forecast_days=8`;

    try {
      const data = await fetchWithTimeout(url, 10000);
      cache.set(cacheKey, { timestamp: Date.now(), data });
      return data;
    } catch (error) {
      console.error('[ApiService] fetchWeatherData error:', error);
      throw error;
    }
  }

  /**
   * Fetch Air Quality Index and pollutant metrics from Open-Meteo Air Quality API
   */
  async function fetchAirQuality(latitude, longitude, timezone = 'auto') {
    const cacheKey = `aqi_${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    const currentParams = [
      'european_aqi',
      'us_aqi',
      'pm10',
      'pm2_5',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone',
      'aerosol_optical_depth',
      'dust',
      'uv_index'
    ].join(',');

    const hourlyParams = [
      'european_aqi',
      'us_aqi',
      'pm10',
      'pm2_5'
    ].join(',');

    const url = `${AIR_QUALITY_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&timezone=${encodeURIComponent(timezone)}&forecast_days=3`;

    try {
      const data = await fetchWithTimeout(url, 9000);
      cache.set(cacheKey, { timestamp: Date.now(), data });
      return data;
    } catch (error) {
      console.warn('[ApiService] fetchAirQuality error or unavailable:', error);
      return null;
    }
  }

  /**
   * Clear in-memory cache
   */
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
