/**
 * Aetheris Weather Hub - Weather Intelligence Engine
 * Comprehensive WMO Code Mapping, Astronomical Calculations,
 * Air Quality Classifications, and Lifestyle Activity Indices.
 */

const WeatherEngine = (() => {
  /**
   * WMO Weather Interpretation Codes (WW)
   */
  const WMO_CODES = {
    0: { label: 'Clear Sky', category: 'clear', icon: 'sun' },
    1: { label: 'Mainly Clear', category: 'clear', icon: 'sun-cloud' },
    2: { label: 'Partly Cloudy', category: 'cloudy', icon: 'cloud-sun' },
    3: { label: 'Overcast', category: 'cloudy', icon: 'cloud' },
    45: { label: 'Foggy', category: 'fog', icon: 'fog' },
    48: { label: 'Depositing Rime Fog', category: 'fog', icon: 'fog' },
    51: { label: 'Light Drizzle', category: 'rain', icon: 'drizzle' },
    53: { label: 'Moderate Drizzle', category: 'rain', icon: 'drizzle' },
    55: { label: 'Dense Drizzle', category: 'rain', icon: 'drizzle' },
    56: { label: 'Light Freezing Drizzle', category: 'snow', icon: 'sleet' },
    57: { label: 'Dense Freezing Drizzle', category: 'snow', icon: 'sleet' },
    61: { label: 'Slight Rain', category: 'rain', icon: 'rain-light' },
    63: { label: 'Moderate Rain', category: 'rain', icon: 'rain-medium' },
    65: { label: 'Heavy Rain', category: 'rain', icon: 'rain-heavy' },
    66: { label: 'Light Freezing Rain', category: 'snow', icon: 'sleet' },
    67: { label: 'Heavy Freezing Rain', category: 'snow', icon: 'sleet' },
    71: { label: 'Slight Snow Fall', category: 'snow', icon: 'snow-light' },
    73: { label: 'Moderate Snow Fall', category: 'snow', icon: 'snow-medium' },
    75: { label: 'Heavy Snow Fall', category: 'snow', icon: 'snow-heavy' },
    77: { label: 'Snow Grains', category: 'snow', icon: 'snow-light' },
    80: { label: 'Slight Rain Showers', category: 'rain', icon: 'rain-shower' },
    81: { label: 'Moderate Rain Showers', category: 'rain', icon: 'rain-shower' },
    82: { label: 'Violent Rain Showers', category: 'rain', icon: 'rain-heavy' },
    85: { label: 'Slight Snow Showers', category: 'snow', icon: 'snow-shower' },
    86: { label: 'Heavy Snow Showers', category: 'snow', icon: 'snow-heavy' },
    95: { label: 'Thunderstorm', category: 'storm', icon: 'thunderstorm' },
    96: { label: 'Thunderstorm with Slight Hail', category: 'storm', icon: 'thunder-hail' },
    99: { label: 'Thunderstorm with Heavy Hail', category: 'storm', icon: 'thunder-hail' }
  };

  /**
   * Get weather metadata by WMO code and day/night state
   */
  function getWeatherInfo(code, isDay = 1) {
    const entry = WMO_CODES[code] || { label: 'Variable Weather', category: 'cloudy', icon: 'cloud' };
    const isNight = isDay === 0;

    let icon = entry.icon;
    let themeCategory = entry.category;

    if (isNight) {
      if (entry.category === 'clear') {
        icon = 'moon-stars';
        themeCategory = 'night-clear';
      } else if (entry.category === 'cloudy' && (code === 1 || code === 2)) {
        icon = 'moon-cloud';
        themeCategory = 'night-cloudy';
      } else {
        themeCategory = `night-${entry.category}`;
      }
    }

    return {
      code,
      label: entry.label,
      category: entry.category,
      themeCategory,
      icon,
      isDay: isDay === 1
    };
  }

  /**
   * Unit conversion functions
   */
  function celsiusToFahrenheit(c) {
    return (c * 9) / 5 + 32;
  }

  function kmhToMph(kmh) {
    return kmh * 0.621371;
  }

  function mmToInches(mm) {
    return mm * 0.0393701;
  }

  function hpaToInHg(hpa) {
    return hpa * 0.02953;
  }

  function kmToMiles(km) {
    return km * 0.621371;
  }

  /**
   * Format temperature based on unit system ('metric' or 'imperial')
   */
  function formatTemp(tempC, unit = 'metric', showUnit = true) {
    if (tempC === null || tempC === undefined) return '--';
    const val = unit === 'imperial' ? celsiusToFahrenheit(tempC) : tempC;
    const rounded = Math.round(val);
    return showUnit ? `${rounded}°${unit === 'imperial' ? 'F' : 'C'}` : `${rounded}°`;
  }

  /**
   * Format wind speed
   */
  function formatWindSpeed(kmh, unit = 'metric') {
    if (kmh === null || kmh === undefined) return '--';
    if (unit === 'imperial') {
      return `${Math.round(kmhToMph(kmh))} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  }

  /**
   * Get Wind Compass Heading
   */
  function getWindDirection(degrees) {
    if (degrees === null || degrees === undefined) return 'N/A';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((degrees % 360) / 22.5) % 16;
    return directions[index];
  }

  /**
   * Evaluate UV Index Risk
   */
  function getUVRating(uv) {
    if (uv === null || uv === undefined) return { level: 'N/A', color: '#94a3b8', description: 'No data' };
    if (uv <= 2.4) return { level: 'Low', color: '#10b981', advice: 'No protection needed. Safe for outdoors.' };
    if (uv <= 5.4) return { level: 'Moderate', color: '#f59e0b', advice: 'Wear sunglasses, hat, and apply SPF 30+.' };
    if (uv <= 7.4) return { level: 'High', color: '#f97316', advice: 'Reduce sun exposure between 10 AM - 4 PM.' };
    if (uv <= 10.4) return { level: 'Very High', color: '#ef4444', advice: 'Extra protection required. Seek shade.' };
    return { level: 'Extreme', color: '#8b5cf6', advice: 'Avoid outdoor sun exposure. Burn time < 10 mins.' };
  }

  /**
   * Evaluate US Air Quality Index (AQI)
   */
  function getAirQualityRating(usAqi) {
    if (usAqi === null || usAqi === undefined) {
      return { score: 0, status: 'Good', color: '#10b981', message: 'Air quality meets clean standards.' };
    }
    const val = Math.round(usAqi);
    if (val <= 50) return { score: val, status: 'Good', color: '#10b981', message: 'Air quality is satisfactory and poses little risk.' };
    if (val <= 100) return { score: val, status: 'Moderate', color: '#eab308', message: 'Acceptable; sensitive individuals should monitor symptoms.' };
    if (val <= 150) return { score: val, status: 'Unhealthy (Sensitive)', color: '#f97316', message: 'Sensitive groups may experience health effects.' };
    if (val <= 200) return { score: val, status: 'Unhealthy', color: '#ef4444', message: 'Everyone may begin to experience health effects.' };
    if (val <= 300) return { score: val, status: 'Very Unhealthy', color: '#a855f7', message: 'Health alert: serious risk for the entire population.' };
    return { score: val, status: 'Hazardous', color: '#7e22ce', message: 'Emergency conditions; entire population is affected.' };
  }

  /**
   * Calculate Solar Day Progress & Ephemeris
   */
  function calculateSolarPosition(sunriseIso, sunsetIso, currentIsoTime = null) {
    if (!sunriseIso || !sunsetIso) {
      return { progress: 0.5, isDaytime: true, daylightMinutes: 720, goldenHourMorning: '--', goldenHourEvening: '--' };
    }

    const sunrise = new Date(sunriseIso).getTime();
    const sunset = new Date(sunsetIso).getTime();
    const now = currentIsoTime ? new Date(currentIsoTime).getTime() : Date.now();

    const totalDaylightMs = Math.max(sunset - sunrise, 1);
    const daylightMinutes = Math.round(totalDaylightMs / 60000);

    let progress = 0;
    const isDaytime = now >= sunrise && now <= sunset;

    if (now < sunrise) {
      progress = 0;
    } else if (now > sunset) {
      progress = 1;
    } else {
      progress = (now - sunrise) / totalDaylightMs;
    }

    // Golden hours (Sunrise + 1 hr, Sunset - 1 hr)
    const ghMorning = new Date(sunrise + 60 * 60 * 1000);
    const ghEvening = new Date(sunset - 60 * 60 * 1000);

    const formatTimeShort = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return {
      progress: Math.min(Math.max(progress, 0), 1),
      isDaytime,
      daylightMinutes,
      daylightHours: (daylightMinutes / 60).toFixed(1),
      sunriseFormatted: formatTimeShort(new Date(sunrise)),
      sunsetFormatted: formatTimeShort(new Date(sunset)),
      goldenHourMorning: `${formatTimeShort(new Date(sunrise))} - ${formatTimeShort(ghMorning)}`,
      goldenHourEvening: `${formatTimeShort(ghEvening)} - ${formatTimeShort(new Date(sunset))}`
    };
  }

  /**
   * Calculate Moon Phase & Illumination
   */
  function getMoonPhase(date = new Date()) {
    // Approximate lunar age calculation
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let c = 0;
    let e = 0;
    let jd = 0;
    let b = 0;

    if (month < 3) {
      year - 1;
      month + 12;
    }

    // Simplified Julian Day
    const a = Math.floor(year / 100);
    b = 2 - a + Math.floor(a / 4);
    jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
    
    // Days since known new moon (2000-01-06)
    const daysSinceNew = jd - 2451549.5;
    const cycle = 29.53058867;
    const newMoons = daysSinceNew / cycle;
    const phaseRatio = newMoons - Math.floor(newMoons);
    const ageDays = (phaseRatio * cycle).toFixed(1);

    // Illumination percentage
    const illumination = Math.round((0.5 * (1 - Math.cos(2 * Math.PI * phaseRatio))) * 100);

    let phaseName = 'New Moon';
    let icon = 'moon-new';

    if (phaseRatio < 0.03 || phaseRatio > 0.97) {
      phaseName = 'New Moon';
      icon = 'moon-new';
    } else if (phaseRatio < 0.22) {
      phaseName = 'Waxing Crescent';
      icon = 'moon-waxing-crescent';
    } else if (phaseRatio < 0.28) {
      phaseName = 'First Quarter';
      icon = 'moon-first-quarter';
    } else if (phaseRatio < 0.47) {
      phaseName = 'Waxing Gibbous';
      icon = 'moon-waxing-gibbous';
    } else if (phaseRatio < 0.53) {
      phaseName = 'Full Moon';
      icon = 'moon-full';
    } else if (phaseRatio < 0.72) {
      phaseName = 'Waning Gibbous';
      icon = 'moon-waning-gibbous';
    } else if (phaseRatio < 0.78) {
      phaseName = 'Last Quarter';
      icon = 'moon-last-quarter';
    } else {
      phaseName = 'Waning Crescent';
      icon = 'moon-waning-crescent';
    }

    return {
      phaseName,
      illumination,
      ageDays,
      icon
    };
  }

  /**
   * Compute Smart Lifestyle & Activity Indices
   */
  function computeLifestyleIndex(weatherData, aqiData) {
    const current = weatherData.current;
    if (!current) return {};

    const temp = current.temperature_2m;
    const feelsLike = current.apparent_temperature;
    const humidity = current.relative_humidity_2m;
    const wind = current.wind_speed_10m;
    const rain = current.precipitation;
    const uv = current.uv_index || 0;
    const code = current.weather_code;
    const aqi = aqiData && aqiData.current ? (aqiData.current.us_aqi || 50) : 40;

    // 1. Running & Cycling Score (0 to 100)
    let runScore = 100;
    if (temp < 5) runScore -= (5 - temp) * 4;
    if (temp > 26) runScore -= (temp - 26) * 5;
    if (humidity > 80) runScore -= (humidity - 80) * 1.2;
    if (wind > 25) runScore -= (wind - 25) * 2;
    if (rain > 0.2) runScore -= rain * 25;
    if (aqi > 100) runScore -= (aqi - 100) * 0.5;
    runScore = Math.max(0, Math.min(100, Math.round(runScore)));

    // 2. Laundry Drying Efficiency
    let laundryRating = 'Fast';
    let laundryHours = '2 - 3 hrs';
    if (rain > 0 || code >= 50) {
      laundryRating = 'Indoor Only';
      laundryHours = 'Rain expected';
    } else if (humidity > 75 || temp < 12) {
      laundryRating = 'Slow';
      laundryHours = '6 - 8 hrs';
    } else if (humidity > 55 || temp < 20) {
      laundryRating = 'Moderate';
      laundryHours = '4 - 5 hrs';
    }

    // 3. Clothing Advisor
    let clothing = 'T-Shirt & Shorts';
    let clothingDetail = 'Lightweight breathable attire';
    if (feelsLike < 0) {
      clothing = 'Thermal Parka & Gloves';
      clothingDetail = 'Heavy insulation required';
    } else if (feelsLike < 12) {
      clothing = 'Warm Jacket or Coat';
      clothingDetail = 'Windproof layers recommended';
    } else if (feelsLike < 20) {
      clothing = 'Sweater / Light Jacket';
      clothingDetail = 'Comfortable mild outerwear';
    } else if (feelsLike > 32) {
      clothing = 'Ultra Light & Hydration';
      clothingDetail = 'Sunhat, sunglasses, stay hydrated';
    }

    // 4. Umbrella recommendation
    const umbrellaRequired = rain > 0.1 || [51,53,55,61,63,65,80,81,82,95,96,99].includes(code);

    // 5. Severe Weather Warnings
    const warnings = [];
    if (wind > 45) {
      warnings.push({ title: 'High Wind Advisory', desc: `Gusts up to ${Math.round(current.wind_gusts_10m || wind)} km/h detected.` });
    }
    if (temp > 37 || feelsLike > 40) {
      warnings.push({ title: 'Extreme Heat Warning', desc: 'Prolonged exposure increases heat stroke risk.' });
    }
    if (temp < -5) {
      warnings.push({ title: 'Freezing Hazard', desc: 'Sub-zero temperatures; watch for icy surfaces.' });
    }
    if ([95, 96, 99].includes(code)) {
      warnings.push({ title: 'Active Thunderstorm Watch', desc: 'Severe electrical activity in the sector.' });
    }
    if (aqi > 150) {
      warnings.push({ title: 'Hazardous Air Quality', desc: 'High particulate concentration; wear N95 outdoors.' });
    }

    return {
      runScore,
      runLevel: runScore >= 80 ? 'Ideal' : runScore >= 60 ? 'Good' : runScore >= 40 ? 'Moderate' : 'Poor',
      laundryRating,
      laundryHours,
      clothing,
      clothingDetail,
      umbrellaRequired,
      warnings
    };
  }

  return {
    getWeatherInfo,
    celsiusToFahrenheit,
    kmhToMph,
    mmToInches,
    hpaToInHg,
    kmToMiles,
    formatTemp,
    formatWindSpeed,
    getWindDirection,
    getUVRating,
    getAirQualityRating,
    calculateSolarPosition,
    getMoonPhase,
    computeLifestyleIndex
  };
})();
