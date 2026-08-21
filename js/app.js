/**
 * Aetheris Weather Hub - Main Application Orchestrator
 * Connects Multi-Provider API, Localization (i18n), State, Chart Engine, and Settings Modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    location: null,
    weatherData: null,
    aqiData: null,
    unit: StorageManager.getUnit(),
    searchDebounceTimer: null,
    clockInterval: null,
    refreshInterval: null
  };

  // DOM Elements
  const canvasBg = document.getElementById('weatherCanvas');
  const searchInput = document.getElementById('citySearchInput');
  const searchDropdown = document.getElementById('searchResultsDropdown');
  const geoBtn = document.getElementById('geoLocateBtn');
  const unitToggleBtn = document.getElementById('unitToggleBtn');
  const langToggleBtn = document.getElementById('langToggleBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const heroFavBtn = document.getElementById('heroFavBtn');
  const chartContainer = document.getElementById('hourlyChartContainer');
  const chartTabs = document.querySelectorAll('.chart-tab-btn');
  const refreshBtn = document.getElementById('refreshBtn');

  // Settings Modal Elements
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const providerSelect = document.getElementById('providerSelect');
  const weatherApiKeyInput = document.getElementById('weatherApiKeyInput');
  const openWeatherKeyInput = document.getElementById('openWeatherKeyInput');
  const waqiTokenInput = document.getElementById('waqiTokenInput');

  function initApp() {
    // 1. Initialize Canvas Engine
    if (canvasBg) {
      CanvasEffects.init(canvasBg);
    }

    // 2. Initialize Chart Engine
    if (chartContainer) {
      ChartManager.init(chartContainer);
    }

    // 3. Update Static Localization Labels
    UIManager.updateStaticLabels();
    updateUnitButton();

    // 4. Attach Event Listeners
    setupEventListeners();

    // 5. Render Favorites
    renderFavorites();

    // 6. Load Initial Location
    const initialLocation = StorageManager.getLastLocation();
    loadLocation(initialLocation);

    // 7. Auto refresh weather every 10 mins
    state.refreshInterval = setInterval(() => {
      if (state.location) {
        loadLocation(state.location, false);
      }
    }, 10 * 60 * 1000);

    // 8. Live Clock
    state.clockInterval = setInterval(updateLiveClock, 1000);
  }

  async function loadLocation(location, showLoading = true) {
    if (!location || !location.latitude || !location.longitude) return;

    if (showLoading) {
      UIManager.setLoadingState(true);
    }

    try {
      state.location = location;
      StorageManager.setLastLocation(location);

      const [weatherData, aqiData] = await Promise.all([
        ApiService.fetchWeatherData(location.latitude, location.longitude, location.timezone),
        ApiService.fetchAirQuality(location.latitude, location.longitude, location.timezone)
      ]);

      state.weatherData = weatherData;
      state.aqiData = aqiData;

      const current = weatherData.current;
      const weatherInfo = WeatherEngine.getWeatherInfo(current.weather_code, current.is_day);
      applyTheme(weatherInfo.themeCategory);

      renderAllComponents();

      if (showLoading) {
        UIManager.setLoadingState(false);
      }
    } catch (error) {
      console.error('[App] Failed to load location data:', error);
      UIManager.setLoadingState(false);
      UIManager.showToast(I18n.getLang() === 'vi' ? 'Không thể tải dữ liệu thời tiết. Vui lòng thử lại.' : 'Failed to fetch weather data.', 'error');
    }
  }

  function renderAllComponents() {
    if (!state.location || !state.weatherData) return;
    UIManager.updateStaticLabels();
    UIManager.renderHero(state.location, state.weatherData, state.unit);
    UIManager.renderMetrics(state.weatherData, state.aqiData, state.unit);
    UIManager.renderEphemeris(state.weatherData);
    UIManager.renderDailyForecast(state.weatherData, state.unit);
    UIManager.renderLifestyle(state.weatherData, state.aqiData);

    if (state.weatherData.hourly) {
      ChartManager.update(state.weatherData.hourly, state.unit);
    }
  }

  function applyTheme(themeCategory) {
    document.body.className = `theme-${themeCategory}`;
    CanvasEffects.setTheme(themeCategory);
  }

  function updateLiveClock() {
    const heroClock = document.getElementById('heroClock');
    if (!heroClock || !state.location) return;

    try {
      const timeStr = new Date().toLocaleTimeString(I18n.getLang() === 'vi' ? 'vi-VN' : 'en-US', {
        timeZone: state.location.timezone !== 'auto' ? state.location.timezone : undefined,
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

  function updateUnitButton() {
    if (!unitToggleBtn) return;
    unitToggleBtn.textContent = state.unit === 'metric' ? '°C / km/h' : '°F / mph';
  }

  function toggleUnits() {
    state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
    StorageManager.setUnit(state.unit);
    updateUnitButton();
    renderAllComponents();
    UIManager.showToast(I18n.getLang() === 'vi' ? `Đã chuyển sang hệ ${state.unit.toUpperCase()}` : `Switched units to ${state.unit.toUpperCase()}`, 'info');
  }

  function toggleLanguage() {
    const newLang = I18n.toggleLang();
    renderAllComponents();
    renderFavorites();
    UIManager.showToast(newLang === 'vi' ? 'Đã đổi sang Tiếng Việt' : 'Switched to English', 'success');
  }

  function renderFavorites() {
    UIManager.renderFavoritesTray(
      (selectedLoc) => {
        loadLocation(selectedLoc);
      },
      (locId) => {
        StorageManager.removeFavorite(locId);
        renderFavorites();
        if (state.location) {
          const isFav = StorageManager.isFavorite(state.location.latitude, state.location.longitude);
          if (heroFavBtn) heroFavBtn.classList.toggle('active', isFav);
        }
        UIManager.showToast(I18n.getLang() === 'vi' ? 'Đã xóa khỏi yêu thích' : 'Removed from favorites', 'info');
      }
    );
  }

  function toggleCurrentFavorite() {
    if (!state.location) return;
    const isFav = StorageManager.isFavorite(state.location.latitude, state.location.longitude);

    if (isFav) {
      StorageManager.removeFavorite(state.location.id);
      if (heroFavBtn) heroFavBtn.classList.remove('active');
      UIManager.showToast(I18n.getLang() === 'vi' ? `Đã bỏ lưu ${state.location.name}` : `Removed ${state.location.name}`, 'info');
    } else {
      StorageManager.addFavorite(state.location);
      if (heroFavBtn) heroFavBtn.classList.add('active');
      UIManager.showToast(I18n.getLang() === 'vi' ? `Đã ghim ${state.location.name} vào yêu thích` : `Saved ${state.location.name} to favorites`, 'success');
    }
    renderFavorites();
  }

  function detectCurrentLocation() {
    if (!navigator.geolocation) {
      UIManager.showToast(I18n.getLang() === 'vi' ? 'Trình duyệt không hỗ trợ định vị GPS.' : 'Geolocation not supported.', 'error');
      return;
    }

    UIManager.showToast(I18n.getLang() === 'vi' ? 'Đang định vị tọa độ của bạn...' : 'Locating coordinates...', 'info');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locDetails = await ApiService.reverseGeocode(latitude, longitude);
          loadLocation(locDetails);
          UIManager.showToast(I18n.getLang() === 'vi' ? `Vị trí: ${locDetails.name}` : `Located: ${locDetails.name}`, 'success');
        } catch (e) {
          loadLocation({
            id: `${latitude.toFixed(4)}_${longitude.toFixed(4)}`,
            name: I18n.getLang() === 'vi' ? 'Vị trí hiện tại' : 'My Location',
            admin1: '',
            country: '',
            latitude,
            longitude,
            timezone: 'auto'
          });
        }
      },
      (err) => {
        console.warn('[App] Geolocation error:', err);
        UIManager.showToast(I18n.getLang() === 'vi' ? 'Không thể lấy quyền định vị GPS.' : 'Location permission denied.', 'error');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }

  function handleSearchInput(e) {
    const query = e.target.value.trim();
    clearTimeout(state.searchDebounceTimer);

    if (query.length < 2) {
      if (searchDropdown) searchDropdown.style.display = 'none';
      return;
    }

    state.searchDebounceTimer = setTimeout(async () => {
      const results = await ApiService.searchLocations(query, 8);
      UIManager.renderSearchResults(results, (selectedLoc) => {
        searchInput.value = '';
        if (searchDropdown) searchDropdown.style.display = 'none';
        loadLocation(selectedLoc);
      });
    }, 300);
  }

  // Open Settings Modal
  function openSettings() {
    if (!settingsModal) return;
    const provider = StorageManager.getProvider();
    const keys = StorageManager.getApiKeys();

    if (providerSelect) providerSelect.value = provider;
    if (weatherApiKeyInput) weatherApiKeyInput.value = keys.weatherapi || '';
    if (openWeatherKeyInput) openWeatherKeyInput.value = keys.openweathermap || '';
    if (waqiTokenInput) waqiTokenInput.value = keys.waqi || '';

    settingsModal.style.display = 'flex';
  }

  function closeSettings() {
    if (settingsModal) settingsModal.style.display = 'none';
  }

  function saveSettings() {
    const provider = providerSelect.value;
    const keys = {
      weatherapi: (weatherApiKeyInput.value || '').trim(),
      openweathermap: (openWeatherKeyInput.value || '').trim(),
      waqi: (waqiTokenInput.value || '').trim()
    };

    StorageManager.setProvider(provider);
    StorageManager.setApiKeys(keys);
    ApiService.clearCache();

    closeSettings();
    UIManager.showToast(I18n.t('keySavedToast'), 'success');

    if (state.location) {
      loadLocation(state.location, true);
    }
  }

  function setupEventListeners() {
    // 1. Search Bar
    if (searchInput) {
      searchInput.addEventListener('input', handleSearchInput);
      searchInput.addEventListener('focus', (e) => {
        if (e.target.value.trim().length >= 2) {
          handleSearchInput(e);
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (searchDropdown && !searchDropdown.contains(e.target) && e.target !== searchInput) {
        searchDropdown.style.display = 'none';
      }
    });

    // 2. Action Buttons
    if (geoBtn) geoBtn.addEventListener('click', detectCurrentLocation);
    if (unitToggleBtn) unitToggleBtn.addEventListener('click', toggleUnits);
    if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLanguage);
    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);

    if (heroFavBtn) heroFavBtn.addEventListener('click', toggleCurrentFavorite);

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        if (state.location) {
          ApiService.clearCache();
          loadLocation(state.location, true);
          UIManager.showToast(I18n.getLang() === 'vi' ? 'Đã làm mới dữ liệu' : 'Refreshed weather data', 'info');
        }
      });
    }

    // 3. Chart Metric Tabs
    chartTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        chartTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const metric = tab.dataset.metric;
        ChartManager.setMetric(metric);
      });
    });

    // 4. Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === 'Escape') {
          if (searchDropdown) searchDropdown.style.display = 'none';
          if (settingsModal) closeSettings();
          if (searchInput) searchInput.blur();
        }
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      } else if (e.key.toLowerCase() === 'l') {
        detectCurrentLocation();
      } else if (e.key.toLowerCase() === 'u') {
        toggleUnits();
      } else if (e.key.toLowerCase() === 'f') {
        toggleCurrentFavorite();
      }
    });
  }

  initApp();
});
