/**
 * Aetheris Weather Hub - UI Rendering & Component Engine
 * Renders Glassmorphic widgets, Ephemeris Sun Arc, AQI Gauges,
 * 7-Day Forecast bars, Lifestyle ratings, and Skeleton Loaders.
 */

const UIManager = (() => {
  // SVG Icon definitions
  const ICONS = {
    'sun': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    'sun-cloud': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.5 8.5A5.5 5.5 0 0 0 5 13a4.5 4.5 0 0 0 4.5 4.5h8.5a4 4 0 0 0 4-4 4.5 4.5 0 0 0-6.5-5z"/></svg>`,
    'cloud-sun': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M17.5 19H9a5 5 0 0 1-5-5c0-2.5 1.8-4.6 4.2-4.9A6 6 0 0 1 19 11.2a4 4 0 0 1-1.5 7.8z"/></svg>`,
    'cloud': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M17.5 19H9a5 5 0 0 1-5-5c0-2.5 1.8-4.6 4.2-4.9A6 6 0 0 1 19 11.2a4 4 0 0 1-1.5 7.8z"/></svg>`,
    'fog': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M4 14h16"/><path d="M4 18h16"/><path d="M4 10h16"/><path d="M7 6h10"/></svg>`,
    'drizzle': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M17.5 19H9a5 5 0 0 1-5-5c0-2.5 1.8-4.6 4.2-4.9A6 6 0 0 1 19 11.2a4 4 0 0 1-1.5 7.8z"/><path d="M8 19v2"/><path d="M12 19v2"/><path d="M16 19v2"/></svg>`,
    'rain-light': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m9.2 18-1.4 3"/><path d="m14.2 18-1.4 3"/></svg>`,
    'rain-medium': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 16-1.5 4"/><path d="m12 16-1.5 4"/><path d="m16 16-1.5 4"/></svg>`,
    'rain-heavy': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m7 16-2 5"/><path d="m11 16-2 5"/><path d="m15 16-2 5"/><path d="m19 16-2 5"/></svg>`,
    'rain-shower': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="M15.5 8.5A5.5 5.5 0 0 0 5 13a4.5 4.5 0 0 0 4.5 4.5h8.5a4 4 0 0 0 4-4 4.5 4.5 0 0 0-6.5-5z"/><path d="m10 18-1.5 3"/><path d="m14 18-1.5 3"/></svg>`,
    'snow-light': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19h.01"/><path d="M12 19h.01"/><path d="M16 19h.01"/></svg>`,
    'snow-medium': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/><path d="M10 21h.01"/><path d="M14 21h.01"/></svg>`,
    'snow-heavy': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/><path d="M8 21h.01"/><path d="M12 21h.01"/><path d="M16 21h.01"/></svg>`,
    'snow-shower': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M12 2v2"/><path d="M15.5 8.5A5.5 5.5 0 0 0 5 13a4.5 4.5 0 0 0 4.5 4.5h8.5a4 4 0 0 0 4-4 4.5 4.5 0 0 0-6.5-5z"/><path d="M10 19h.01"/><path d="M14 19h.01"/></svg>`,
    'sleet': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17-1.5 3"/><path d="M12 18h.01"/><path d="m16 17-1.5 3"/></svg>`,
    'thunderstorm': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M17.5 19H9a5 5 0 0 1-5-5c0-2.5 1.8-4.6 4.2-4.9A6 6 0 0 1 19 11.2a4 4 0 0 1-1.5 7.8z"/><path d="m13 12-3 5h4l-2 5"/></svg>`,
    'thunder-hail': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M17.5 19H9a5 5 0 0 1-5-5c0-2.5 1.8-4.6 4.2-4.9A6 6 0 0 1 19 11.2a4 4 0 0 1-1.5 7.8z"/><path d="m13 11-3 4h4l-2 4"/><path d="M8 20h.01"/><path d="M16 20h.01"/></svg>`,
    'moon-stars': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>`,
    'moon-cloud': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M10.1 2.182a10 10 0 0 0 3.1 8.718A5.5 5.5 0 0 1 17 19H9a5 5 0 0 1-5-5c0-2.5 1.8-4.6 4.2-4.9A6 6 0 0 1 10.1 2.18z"/></svg>`
  };

  /**
   * Helper to retrieve SVG markup
   */
  function getIconSvg(iconName) {
    return ICONS[iconName] || ICONS['cloud'];
  }

  /**
   * Render Hero Section
   */
  function renderHero(location, weatherData, unit = 'metric') {
    const current = weatherData.current;
    const daily = weatherData.daily;
    const weatherInfo = WeatherEngine.getWeatherInfo(current.weather_code, current.is_day);

    const locationTitle = document.getElementById('heroLocation');
    const locationSub = document.getElementById('heroLocationSub');
    const currentTemp = document.getElementById('heroTemp');
    const weatherDesc = document.getElementById('heroWeatherDesc');
    const tempRange = document.getElementById('heroTempRange');
    const heroIcon = document.getElementById('heroIcon');
    const heroFavBtn = document.getElementById('heroFavBtn');
    const heroClock = document.getElementById('heroClock');

    if (locationTitle) locationTitle.textContent = location.name;
    if (locationSub) {
      const parts = [location.admin1, location.country].filter(Boolean);
      locationSub.textContent = parts.join(', ');
    }

    if (currentTemp) {
      currentTemp.innerHTML = WeatherEngine.formatTemp(current.temperature_2m, unit);
    }

    if (weatherDesc) {
      weatherDesc.textContent = weatherInfo.label;
    }

    if (tempRange && daily && daily.temperature_2m_max) {
      const maxT = WeatherEngine.formatTemp(daily.temperature_2m_max[0], unit);
      const minT = WeatherEngine.formatTemp(daily.temperature_2m_min[0], unit);
      const feelsLike = WeatherEngine.formatTemp(current.apparent_temperature, unit);
      tempRange.innerHTML = `<span>H: ${maxT}</span> <span>L: ${minT}</span> <span class="hero-feels">Feels like ${feelsLike}</span>`;
    }

    if (heroIcon) {
      heroIcon.innerHTML = getIconSvg(weatherInfo.icon);
    }

    // Favorite state
    if (heroFavBtn) {
      const isFav = StorageManager.isFavorite(location.latitude, location.longitude);
      heroFavBtn.classList.toggle('active', isFav);
      heroFavBtn.setAttribute('title', isFav ? 'Remove from favorites' : 'Add to favorites');
    }

    // Update Live Clock based on timezone
    if (heroClock) {
      try {
        const timeStr = new Date().toLocaleTimeString('en-US', {
          timeZone: location.timezone !== 'auto' ? location.timezone : undefined,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        heroClock.textContent = `${timeStr} (Local)`;
      } catch (e) {
        heroClock.textContent = '';
      }
    }
  }

  /**
   * Render Atmospheric Metrics Grid
   */
  function renderMetrics(weatherData, aqiData, unit = 'metric') {
    const current = weatherData.current;
    const daily = weatherData.daily;

    // 1. UV Index
    const uvVal = current.uv_index !== undefined ? current.uv_index : (daily.uv_index_max ? daily.uv_index_max[0] : 0);
    const uvRating = WeatherEngine.getUVRating(uvVal);
    const uvEl = document.getElementById('metricUv');
    if (uvEl) {
      uvEl.innerHTML = `
        <div class="metric-val">${uvVal ? uvVal.toFixed(1) : '0.0'}</div>
        <div class="metric-badge" style="background-color: ${uvRating.color}22; color: ${uvRating.color}; border: 1px solid ${uvRating.color}44;">
          ${uvRating.level}
        </div>
        <div class="metric-desc">${uvRating.advice}</div>
        <div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${Math.min(100, (uvVal / 11) * 100)}%; background-color: ${uvRating.color};"></div></div>
      `;
    }

    // 2. Wind Vector & Speed
    const windSpeed = current.wind_speed_10m || 0;
    const windGusts = current.wind_gusts_10m || windSpeed;
    const windDir = current.wind_direction_10m || 0;
    const windCompass = WeatherEngine.getWindDirection(windDir);
    const windEl = document.getElementById('metricWind');
    if (windEl) {
      windEl.innerHTML = `
        <div class="wind-metric-row">
          <div class="metric-val">${WeatherEngine.formatWindSpeed(windSpeed, unit)}</div>
          <div class="wind-compass-circle" style="transform: rotate(${windDir}deg);">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
          </div>
        </div>
        <div class="metric-badge">Heading: ${windCompass} (${windDir}°)</div>
        <div class="metric-desc">Gusts up to ${WeatherEngine.formatWindSpeed(windGusts, unit)}</div>
      `;
    }

    // 3. Humidity & Dew Point
    const humidity = current.relative_humidity_2m || 0;
    const dewPoint = weatherData.hourly && weatherData.hourly.dew_point_2m ? weatherData.hourly.dew_point_2m[0] : null;
    const humEl = document.getElementById('metricHumidity');
    if (humEl) {
      humEl.innerHTML = `
        <div class="metric-val">${humidity}%</div>
        <div class="metric-badge">${humidity > 70 ? 'High Moisture' : humidity < 35 ? 'Dry Air' : 'Comfortable'}</div>
        <div class="metric-desc">${dewPoint !== null ? `Dew point is ${WeatherEngine.formatTemp(dewPoint, unit)}` : 'Optimal ambient moisture'}</div>
        <div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${humidity}%; background: linear-gradient(90deg, #38bdf8, #6366f1);"></div></div>
      `;
    }

    // 4. Air Quality Index (AQI)
    const aqiEl = document.getElementById('metricAqi');
    if (aqiEl) {
      const usAqi = aqiData && aqiData.current ? aqiData.current.us_aqi : 35;
      const pm25 = aqiData && aqiData.current ? aqiData.current.pm2_5 : null;
      const pm10 = aqiData && aqiData.current ? aqiData.current.pm10 : null;
      const aqiRating = WeatherEngine.getAirQualityRating(usAqi);

      aqiEl.innerHTML = `
        <div class="metric-val" style="color: ${aqiRating.color};">${aqiRating.score} <span class="metric-unit">AQI</span></div>
        <div class="metric-badge" style="background-color: ${aqiRating.color}22; color: ${aqiRating.color}; border: 1px solid ${aqiRating.color}44;">
          ${aqiRating.status}
        </div>
        <div class="metric-desc">${aqiRating.message}</div>
        <div class="aqi-pollutants">
          ${pm25 !== null ? `<span>PM2.5: <b>${pm25.toFixed(1)}</b> µg/m³</span>` : ''}
          ${pm10 !== null ? `<span>PM10: <b>${pm10.toFixed(1)}</b> µg/m³</span>` : ''}
        </div>
      `;
    }

    // 5. Barometric Pressure
    const pressure = current.pressure_msl || current.surface_pressure || 1013;
    const pressEl = document.getElementById('metricPressure');
    if (pressEl) {
      const pressFormatted = unit === 'imperial' ? `${(pressure * 0.02953).toFixed(2)} inHg` : `${Math.round(pressure)} hPa`;
      const pStatus = pressure > 1018 ? 'High Pressure (Stable)' : pressure < 1008 ? 'Low Pressure (Stormy)' : 'Standard Pressure';
      pressEl.innerHTML = `
        <div class="metric-val">${pressFormatted}</div>
        <div class="metric-badge">${pStatus}</div>
        <div class="metric-desc">${pressure > 1013 ? 'Fair, clear skies prevailing' : 'Precipitation or wind likely'}</div>
      `;
    }

    // 6. Visibility
    const visibilityMeters = weatherData.hourly && weatherData.hourly.visibility ? weatherData.hourly.visibility[0] : 10000;
    const visKm = visibilityMeters / 1000;
    const visEl = document.getElementById('metricVisibility');
    if (visEl) {
      const visFormatted = unit === 'imperial' ? `${(visKm * 0.621371).toFixed(1)} mi` : `${visKm.toFixed(1)} km`;
      const visStatus = visKm >= 10 ? 'Crystal Clear' : visKm >= 5 ? 'Good Clarity' : 'Hazy / Low Visibility';
      visEl.innerHTML = `
        <div class="metric-val">${visFormatted}</div>
        <div class="metric-badge">${visStatus}</div>
        <div class="metric-desc">${visKm >= 10 ? 'Perfect horizon visibility' : 'Caution during fast transit'}</div>
      `;
    }

    // 7. Cloud Cover
    const cloudCover = current.cloud_cover !== undefined ? current.cloud_cover : 20;
    const cloudEl = document.getElementById('metricCloud');
    if (cloudEl) {
      cloudEl.innerHTML = `
        <div class="metric-val">${cloudCover}%</div>
        <div class="metric-badge">${cloudCover > 80 ? 'Heavy Overcast' : cloudCover > 40 ? 'Partly Cloudy' : 'Clear Skies'}</div>
        <div class="metric-desc">Atmospheric sky saturation</div>
        <div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${cloudCover}%; background: linear-gradient(90deg, #94a3b8, #64748b);"></div></div>
      `;
    }

    // 8. Precipitation Probability
    const precipProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
    const precipSum = daily.precipitation_sum ? daily.precipitation_sum[0] : 0;
    const precipEl = document.getElementById('metricPrecip');
    if (precipEl) {
      precipEl.innerHTML = `
        <div class="metric-val">${precipProb}%</div>
        <div class="metric-badge">${precipSum > 0 ? `${precipSum.toFixed(1)} mm volume` : 'No expected rain'}</div>
        <div class="metric-desc">${precipProb > 50 ? 'Umbrella recommended' : 'Dry conditions expected'}</div>
        <div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${precipProb}%; background: linear-gradient(90deg, #06b6d4, #3b82f6);"></div></div>
      `;
    }
  }

  /**
   * Render Ephemeris: Sun Arc & Moon Phase
   */
  function renderEphemeris(weatherData) {
    const daily = weatherData.daily;
    if (!daily || !daily.sunrise || !daily.sunset) return;

    const sunriseIso = daily.sunrise[0];
    const sunsetIso = daily.sunset[0];
    const solarInfo = WeatherEngine.calculateSolarPosition(sunriseIso, sunsetIso);
    const moonInfo = WeatherEngine.getMoonPhase(new Date());

    const ephemerisContainer = document.getElementById('ephemerisWidget');
    if (!ephemerisContainer) return;

    // Calculate position on SVG arc
    // Semicircle arc: Start at (30, 90), peak at (150, 20), end at (270, 90)
    const angle = Math.PI - solarInfo.progress * Math.PI;
    const r = 110;
    const cx = 150;
    const cy = 100;
    const sunX = cx + r * Math.cos(angle);
    const sunY = cy - r * Math.sin(angle);

    ephemerisContainer.innerHTML = `
      <div class="ephemeris-grid">
        <!-- Sun Arc -->
        <div class="ephemeris-sun-card">
          <div class="widget-subtitle">Solar Path & Daylight</div>
          <div class="sun-arc-svg-wrap">
            <svg viewBox="0 0 300 120" class="sun-arc-svg">
              <defs>
                <linearGradient id="sunArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#f59e0b"/>
                  <stop offset="50%" stop-color="#fde047"/>
                  <stop offset="100%" stop-color="#f97316"/>
                </linearGradient>
              </defs>
              <path d="M 40 100 A 110 70 0 0 1 260 100" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="3" stroke-dasharray="5"/>
              <path d="M 40 100 A 110 70 0 0 1 ${sunX} ${sunY}" fill="none" stroke="url(#sunArcGrad)" stroke-width="4"/>
              <line x1="20" y1="100" x2="280" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <!-- Sun Marker -->
              <circle cx="${sunX}" cy="${sunY}" r="7" fill="#fbbf24" stroke="#ffffff" stroke-width="2"/>
            </svg>
          </div>
          <div class="sun-times-row">
            <div class="sun-time-block">
              <span class="st-label">Sunrise</span>
              <span class="st-val">${solarInfo.sunriseFormatted}</span>
            </div>
            <div class="sun-time-block center">
              <span class="st-label">Daylight</span>
              <span class="st-val">${solarInfo.daylightHours} hrs</span>
            </div>
            <div class="sun-time-block">
              <span class="st-label">Sunset</span>
              <span class="st-val">${solarInfo.sunsetFormatted}</span>
            </div>
          </div>
          <div class="golden-hour-info">
            <span>Golden Hour: <b>${solarInfo.goldenHourEvening}</b></span>
          </div>
        </div>

        <!-- Moon Card -->
        <div class="ephemeris-moon-card">
          <div class="widget-subtitle">Lunar Ephemeris</div>
          <div class="moon-display">
            <div class="moon-icon-wrapper">
              <svg viewBox="0 0 64 64" width="56" height="56" class="moon-svg">
                <circle cx="32" cy="32" r="28" fill="#1e293b" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
                <path d="M32 4 A 28 28 0 0 1 32 60 A ${28 * (1 - moonInfo.illumination / 50)} 28 0 0 ${moonInfo.illumination > 50 ? '1' : '0'} 32 4" fill="#e2e8f0"/>
              </svg>
            </div>
            <div class="moon-info-text">
              <div class="moon-phase-name">${moonInfo.phaseName}</div>
              <div class="moon-illumination">${moonInfo.illumination}% Illumination</div>
              <div class="moon-age">Lunar cycle day ${moonInfo.ageDays}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render 7-Day Forecast
   */
  function renderDailyForecast(weatherData, unit = 'metric') {
    const daily = weatherData.daily;
    const container = document.getElementById('dailyForecastContainer');
    if (!container || !daily || !daily.time) return;

    // Calculate global weekly min and max to scale horizontal temperature bars
    let allMax = [];
    let allMin = [];
    for (let i = 0; i < daily.time.length; i++) {
      allMax.push(daily.temperature_2m_max[i]);
      allMin.push(daily.temperature_2m_min[i]);
    }
    const globalMin = Math.min(...allMin);
    const globalMax = Math.max(...allMax);
    const globalRange = Math.max(globalMax - globalMin, 1);

    let html = '';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
      const dateObj = new Date(daily.time[i]);
      const isToday = i === 0;
      const dayLabel = isToday ? 'Today' : dayNames[dateObj.getDay()];
      const dateFormatted = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

      const code = daily.weather_code[i];
      const weatherInfo = WeatherEngine.getWeatherInfo(code, 1);
      const minTemp = daily.temperature_2m_min[i];
      const maxTemp = daily.temperature_2m_max[i];
      const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;

      // Bar positioning relative to global weekly bounds
      const leftPercent = ((minTemp - globalMin) / globalRange) * 100;
      const barWidth = Math.max(8, ((maxTemp - minTemp) / globalRange) * 100);

      html += `
        <div class="daily-card ${isToday ? 'is-today' : ''}">
          <div class="daily-day-col">
            <span class="daily-day-name">${dayLabel}</span>
            <span class="daily-date">${dateFormatted}</span>
          </div>
          <div class="daily-icon-col">
            <div class="daily-icon">${getIconSvg(weatherInfo.icon)}</div>
            ${rainProb > 20 ? `<span class="daily-precip">${rainProb}%</span>` : ''}
          </div>
          <div class="daily-bar-col">
            <span class="daily-temp min">${WeatherEngine.formatTemp(minTemp, unit, false)}°</span>
            <div class="daily-temp-bar-track">
              <div class="daily-temp-bar-fill" style="left: ${leftPercent}%; width: ${barWidth}%;"></div>
            </div>
            <span class="daily-temp max">${WeatherEngine.formatTemp(maxTemp, unit, false)}°</span>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  /**
   * Render Smart Lifestyle & Activity Intelligence
   */
  function renderLifestyle(weatherData, aqiData) {
    const lifestyle = WeatherEngine.computeLifestyleIndex(weatherData, aqiData);
    const container = document.getElementById('lifestyleWidget');
    if (!container || !lifestyle.runScore) return;

    let warningsHtml = '';
    if (lifestyle.warnings && lifestyle.warnings.length > 0) {
      warningsHtml = `
        <div class="severe-alert-box">
          ${lifestyle.warnings.map(w => `
            <div class="alert-item">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <b>${w.title}:</b> ${w.desc}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      ${warningsHtml}
      <div class="lifestyle-grid">
        <!-- Running Score -->
        <div class="lifestyle-item">
          <div class="ls-header">
            <span class="ls-title">Running & Fitness</span>
            <span class="ls-badge badge-${lifestyle.runLevel.toLowerCase()}">${lifestyle.runLevel} (${lifestyle.runScore}/100)</span>
          </div>
          <div class="ls-desc">${lifestyle.runScore > 75 ? 'Optimal thermal & breathable conditions.' : 'Adjust exertion based on current weather.'}</div>
        </div>

        <!-- Laundry Drying -->
        <div class="lifestyle-item">
          <div class="ls-header">
            <span class="ls-title">Outdoor Laundry</span>
            <span class="ls-badge">${lifestyle.laundryRating}</span>
          </div>
          <div class="ls-desc">Est. dry time: ${lifestyle.laundryHours}</div>
        </div>

        <!-- Clothing Suggestion -->
        <div class="lifestyle-item">
          <div class="ls-header">
            <span class="ls-title">Outfit Advisor</span>
            <span class="ls-badge">${lifestyle.clothing}</span>
          </div>
          <div class="ls-desc">${lifestyle.clothingDetail} ${lifestyle.umbrellaRequired ? '• <b>Pack an umbrella</b>' : ''}</div>
        </div>
      </div>
    `;
  }

  /**
   * Render Favorite Locations Chips Tray
   */
  function renderFavoritesTray(onSelect, onRemove) {
    const tray = document.getElementById('favoritesTray');
    if (!tray) return;

    const favorites = StorageManager.getFavorites();
    if (favorites.length === 0) {
      tray.innerHTML = `<div class="fav-empty">No favorite cities saved. Click the star icon to pin your top locations.</div>`;
      return;
    }

    let html = '';
    favorites.forEach(fav => {
      html += `
        <div class="fav-chip" data-id="${fav.id}">
          <button class="fav-chip-btn" type="button" title="Switch to ${fav.name}">
            <span class="fav-name">${fav.name}</span>
            <span class="fav-country">${fav.countryCode || ''}</span>
          </button>
          <button class="fav-chip-del" type="button" title="Remove" data-del-id="${fav.id}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `;
    });

    tray.innerHTML = html;

    // Attach listeners
    tray.querySelectorAll('.fav-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chip = btn.closest('.fav-chip');
        const id = chip.dataset.id;
        const target = favorites.find(f => f.id === id);
        if (target && onSelect) onSelect(target);
      });
    });

    tray.querySelectorAll('.fav-chip-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.delId;
        if (onRemove) onRemove(id);
      });
    });
  }

  /**
   * Render Search Results Dropdown
   */
  function renderSearchResults(results, onSelect) {
    const dropdown = document.getElementById('searchResultsDropdown');
    if (!dropdown) return;

    if (!results || results.length === 0) {
      dropdown.innerHTML = `<div class="search-empty">No matching cities found. Check spelling or try a larger city.</div>`;
      dropdown.style.display = 'block';
      return;
    }

    let html = '';
    results.forEach(loc => {
      const region = [loc.admin1, loc.country].filter(Boolean).join(', ');
      html += `
        <div class="search-item" data-id="${loc.id}">
          <div class="search-item-main">
            <span class="search-item-name">${loc.name}</span>
            <span class="search-item-region">${region}</span>
          </div>
          <span class="search-item-coords">${loc.latitude.toFixed(2)}°, ${loc.longitude.toFixed(2)}°</span>
        </div>
      `;
    });

    dropdown.innerHTML = html;
    dropdown.style.display = 'block';

    dropdown.querySelectorAll('.search-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const selected = results.find(r => r.id === id);
        if (selected && onSelect) {
          dropdown.style.display = 'none';
          onSelect(selected);
        }
      });
    });
  }

  /**
   * Toggle Skeleton Loading Placeholders
   */
  function setLoadingState(isLoading) {
    const dashboard = document.getElementById('dashboardContent');
    const skeleton = document.getElementById('skeletonPlaceholder');
    if (dashboard && skeleton) {
      if (isLoading) {
        dashboard.style.opacity = '0.4';
        skeleton.style.display = 'block';
      } else {
        dashboard.style.opacity = '1';
        skeleton.style.display = 'none';
      }
    }
  }

  /**
   * Toast notification display
   */
  function showToast(message, type = 'info') {
    const toast = document.getElementById('appToast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `app-toast show toast-${type}`;
    setTimeout(() => {
      toast.className = 'app-toast';
    }, 3500);
  }

  return {
    renderHero,
    renderMetrics,
    renderEphemeris,
    renderDailyForecast,
    renderLifestyle,
    renderFavoritesTray,
    renderSearchResults,
    setLoadingState,
    showToast
  };
})();
