/**
 * Aetheris Weather Hub - UI Rendering & Component Engine
 * Bilingual (Vietnamese & English) localized widgets, Ephemeris Sun Arc,
 * AQI Gauges, 7-Day Forecast, Settings Modal, and Notifications.
 */

const UIManager = (() => {
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
    'thunderstorm': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M17.5 19H9a5 5 0 0 1-5-5c0-2.5 1.8-4.6 4.2-4.9A6 6 0 0 1 19 11.2a4 4 0 0 1-1.5 7.8z"/><path d="m13 12-3 5h4l-2 5"/></svg>`,
    'moon-stars': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>`,
    'moon-cloud': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-icon"><path d="M10.1 2.182a10 10 0 0 0 3.1 8.718A5.5 5.5 0 0 1 17 19H9a5 5 0 0 1-5-5c0-2.5 1.8-4.6 4.2-4.9A6 6 0 0 1 10.1 2.18z"/></svg>`
  };

  function getIconSvg(iconName) {
    return ICONS[iconName] || ICONS['cloud'];
  }

  /**
   * Update static UI text labels based on current language
   */
  function updateStaticLabels() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = I18n.t(key);
    });

    const searchInput = document.getElementById('citySearchInput');
    if (searchInput) searchInput.placeholder = I18n.t('searchPlaceholder');

    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) langBtn.textContent = I18n.getLang() === 'vi' ? 'Tiếng Việt' : 'English';
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
      tempRange.innerHTML = `<span>${I18n.t('high')}: ${maxT}</span> <span>${I18n.t('low')}: ${minT}</span> <span class="hero-feels">${I18n.t('feelsLike')} ${feelsLike}</span>`;
    }

    if (heroIcon) {
      heroIcon.innerHTML = getIconSvg(weatherInfo.icon);
    }

    if (heroFavBtn) {
      const isFav = StorageManager.isFavorite(location.latitude, location.longitude);
      heroFavBtn.classList.toggle('active', isFav);
      heroFavBtn.setAttribute('title', isFav ? I18n.t('favRemove') : I18n.t('favAdd'));
    }

    if (heroClock) {
      try {
        const timeStr = new Date().toLocaleTimeString(I18n.getLang() === 'vi' ? 'vi-VN' : 'en-US', {
          timeZone: location.timezone !== 'auto' ? location.timezone : undefined,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        heroClock.textContent = `${timeStr} (${I18n.t('localTime')})`;
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

    // 2. Wind Vector
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
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
          </div>
        </div>
        <div class="metric-badge">${I18n.getLang() === 'vi' ? 'Hướng' : 'Heading'}: ${windCompass} (${windDir}°)</div>
        <div class="metric-desc">${I18n.t('gusts')}: ${WeatherEngine.formatWindSpeed(windGusts, unit)}</div>
      `;
    }

    // 3. Humidity & Dew Point
    const humidity = current.relative_humidity_2m || 0;
    const dewPoint = weatherData.hourly && weatherData.hourly.dew_point_2m ? weatherData.hourly.dew_point_2m[0] : null;
    const humEl = document.getElementById('metricHumidity');
    if (humEl) {
      humEl.innerHTML = `
        <div class="metric-val">${humidity}%</div>
        <div class="metric-badge">${humidity > 70 ? (I18n.getLang() === 'vi' ? 'Độ ẩm cao' : 'High Moisture') : (I18n.getLang() === 'vi' ? 'Dễ chịu' : 'Comfortable')}</div>
        <div class="metric-desc">${dewPoint !== null ? `${I18n.getLang() === 'vi' ? 'Điểm sương' : 'Dew point'} ${WeatherEngine.formatTemp(dewPoint, unit)}` : ''}</div>
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
      pressEl.innerHTML = `
        <div class="metric-val">${pressFormatted}</div>
        <div class="metric-badge">${pressure > 1015 ? (I18n.getLang() === 'vi' ? 'Khí áp cao (Ổn định)' : 'High Pressure') : (I18n.getLang() === 'vi' ? 'Áp suất bình thường' : 'Normal Pressure')}</div>
        <div class="metric-desc">${I18n.getLang() === 'vi' ? 'Khí quyển ổn định' : 'Atmospheric stability'}</div>
      `;
    }

    // 6. Visibility
    const visibilityMeters = weatherData.hourly && weatherData.hourly.visibility ? weatherData.hourly.visibility[0] : 10000;
    const visKm = visibilityMeters / 1000;
    const visEl = document.getElementById('metricVisibility');
    if (visEl) {
      const visFormatted = unit === 'imperial' ? `${(visKm * 0.621371).toFixed(1)} mi` : `${visKm.toFixed(1)} km`;
      visEl.innerHTML = `
        <div class="metric-val">${visFormatted}</div>
        <div class="metric-badge">${visKm >= 10 ? (I18n.getLang() === 'vi' ? 'Rất trong' : 'Crystal Clear') : (I18n.getLang() === 'vi' ? 'Bình thường' : 'Good')}</div>
        <div class="metric-desc">${I18n.getLang() === 'vi' ? 'Tầm nhìn thông thoáng' : 'Optimal visibility'}</div>
      `;
    }

    // 7. Cloud Cover
    const cloudCover = current.cloud_cover !== undefined ? current.cloud_cover : 20;
    const cloudEl = document.getElementById('metricCloud');
    if (cloudEl) {
      cloudEl.innerHTML = `
        <div class="metric-val">${cloudCover}%</div>
        <div class="metric-badge">${cloudCover > 80 ? (I18n.getLang() === 'vi' ? 'Nhiều mây' : 'Heavy Cloud') : (I18n.getLang() === 'vi' ? 'Ít mây' : 'Clear')}</div>
        <div class="metric-desc">${I18n.getLang() === 'vi' ? 'Tỷ lệ che phủ bầu trời' : 'Sky saturation'}</div>
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
        <div class="metric-badge">${precipSum > 0 ? `${precipSum.toFixed(1)} mm` : (I18n.getLang() === 'vi' ? 'Không mưa' : 'Dry')}</div>
        <div class="metric-desc">${precipProb > 50 ? (I18n.getLang() === 'vi' ? 'Nên mang theo ô' : 'Umbrella suggested') : (I18n.getLang() === 'vi' ? 'Khô ráo' : 'Dry conditions')}</div>
        <div class="metric-bar-bg"><div class="metric-bar-fill" style="width: ${precipProb}%; background: linear-gradient(90deg, #06b6d4, #3b82f6);"></div></div>
      `;
    }
  }

  /**
   * Render Ephemeris
   */
  function renderEphemeris(weatherData) {
    const daily = weatherData.daily;
    if (!daily || !daily.sunrise || !daily.sunset) return;

    const solarInfo = WeatherEngine.calculateSolarPosition(daily.sunrise[0], daily.sunset[0]);
    const moonInfo = WeatherEngine.getMoonPhase(new Date());
    const ephemerisContainer = document.getElementById('ephemerisWidget');
    if (!ephemerisContainer) return;

    const angle = Math.PI - solarInfo.progress * Math.PI;
    const r = 110;
    const cx = 150;
    const cy = 100;
    const sunX = cx + r * Math.cos(angle);
    const sunY = cy - r * Math.sin(angle);

    ephemerisContainer.innerHTML = `
      <div class="ephemeris-grid">
        <div class="ephemeris-sun-card">
          <div class="widget-subtitle">${I18n.t('solarPath')}</div>
          <div class="sun-arc-svg-wrap">
            <svg viewBox="0 0 300 120" class="sun-arc-svg">
              <defs>
                <linearGradient id="sunArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#f59e0b"/>
                  <stop offset="50%" stop-color="#fde047"/>
                  <stop offset="100%" stop-color="#f97316"/>
                </linearGradient>
              </defs>
              <path d="M 40 100 A 110 70 0 0 1 260 100" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2.5" stroke-dasharray="4"/>
              <path d="M 40 100 A 110 70 0 0 1 ${sunX} ${sunY}" fill="none" stroke="url(#sunArcGrad)" stroke-width="3.5"/>
              <line x1="20" y1="100" x2="280" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <circle cx="${sunX}" cy="${sunY}" r="6" fill="#fbbf24" stroke="#ffffff" stroke-width="2"/>
            </svg>
          </div>
          <div class="sun-times-row">
            <div class="sun-time-block">
              <span class="st-label">${I18n.t('sunrise')}</span>
              <span class="st-val">${solarInfo.sunriseFormatted}</span>
            </div>
            <div class="sun-time-block center">
              <span class="st-label">${I18n.t('daylight')}</span>
              <span class="st-val">${solarInfo.daylightHours} ${I18n.getLang() === 'vi' ? 'giờ' : 'hrs'}</span>
            </div>
            <div class="sun-time-block">
              <span class="st-label">${I18n.t('sunset')}</span>
              <span class="st-val">${solarInfo.sunsetFormatted}</span>
            </div>
          </div>
          <div class="golden-hour-info">
            <span>${I18n.t('goldenHour')}: <b>${solarInfo.goldenHourEvening}</b></span>
          </div>
        </div>

        <div class="ephemeris-moon-card">
          <div class="widget-subtitle">${I18n.t('lunarEphemeris')}</div>
          <div class="moon-display">
            <svg viewBox="0 0 64 64" width="48" height="48">
              <circle cx="32" cy="32" r="26" fill="#1e293b" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
              <path d="M32 6 A 26 26 0 0 1 32 58 A ${26 * (1 - moonInfo.illumination / 50)} 26 0 0 ${moonInfo.illumination > 50 ? '1' : '0'} 32 6" fill="#e2e8f0"/>
            </svg>
            <div class="moon-info-text">
              <div class="moon-phase-name">${moonInfo.phaseName}</div>
              <div class="moon-illumination">${moonInfo.illumination}% ${I18n.t('illumination')}</div>
              <div class="moon-age">${I18n.t('lunarAge')}: ${moonInfo.ageDays}</div>
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
    const dayNames = I18n.t('days');

    for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
      const dateObj = new Date(daily.time[i]);
      const isToday = i === 0;
      const dayLabel = isToday ? I18n.t('today') : dayNames[dateObj.getDay()];
      const dateFormatted = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

      const code = daily.weather_code[i];
      const weatherInfo = WeatherEngine.getWeatherInfo(code, 1);
      const minTemp = daily.temperature_2m_min[i];
      const maxTemp = daily.temperature_2m_max[i];
      const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;

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
   * Render Lifestyle Advisory
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
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f59e0b" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div><b>${w.title}:</b> ${w.desc}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      ${warningsHtml}
      <div class="lifestyle-grid">
        <div class="lifestyle-item">
          <div class="ls-header">
            <span class="ls-title">${I18n.t('runTitle')}</span>
            <span class="ls-badge badge-${lifestyle.runScore >= 80 ? 'ideal' : lifestyle.runScore >= 60 ? 'good' : 'moderate'}">${lifestyle.runLevel} (${lifestyle.runScore}/100)</span>
          </div>
          <div class="ls-desc">${lifestyle.runScore > 75 ? I18n.t('runDescIdeal') : I18n.t('runDescMod')}</div>
        </div>

        <div class="lifestyle-item">
          <div class="ls-header">
            <span class="ls-title">${I18n.t('laundryTitle')}</span>
            <span class="ls-badge">${lifestyle.laundryRating}</span>
          </div>
          <div class="ls-desc">${lifestyle.laundryHours}</div>
        </div>

        <div class="lifestyle-item">
          <div class="ls-header">
            <span class="ls-title">${I18n.t('outfitTitle')}</span>
            <span class="ls-badge">${lifestyle.clothing}</span>
          </div>
          <div class="ls-desc">${lifestyle.clothingDetail} ${lifestyle.umbrellaRequired ? `• <b>${I18n.t('packUmbrella')}</b>` : ''}</div>
        </div>
      </div>
    `;
  }

  /**
   * Render Favorites Tray
   */
  function renderFavoritesTray(onSelect, onRemove) {
    const tray = document.getElementById('favoritesTray');
    if (!tray) return;

    const favorites = StorageManager.getFavorites();
    if (favorites.length === 0) {
      tray.innerHTML = `<div class="fav-empty">${I18n.t('noFavorites')}</div>`;
      return;
    }

    let html = '';
    favorites.forEach(fav => {
      html += `
        <div class="fav-chip" data-id="${fav.id}">
          <button class="fav-chip-btn" type="button" title="${fav.name}">
            <span class="fav-name">${fav.name}</span>
            <span class="fav-country">${fav.countryCode || ''}</span>
          </button>
          <button class="fav-chip-del" type="button" title="Xóa" data-del-id="${fav.id}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `;
    });

    tray.innerHTML = html;

    tray.querySelectorAll('.fav-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.fav-chip').dataset.id;
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
      dropdown.innerHTML = `<div class="search-empty">${I18n.getLang() === 'vi' ? 'Không tìm thấy địa điểm phù hợp.' : 'No locations found.'}</div>`;
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

  function showToast(message, type = 'info') {
    const toast = document.getElementById('appToast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `app-toast show toast-${type}`;
    setTimeout(() => {
      toast.className = 'app-toast';
    }, 3000);
  }

  return {
    updateStaticLabels,
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
