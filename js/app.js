/**
 * Aetheris Weather Hub - Main Application Orchestrator
 * Connects API, State, Canvas Effects, Chart Engine, and UI Rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
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
  const heroFavBtn = document.getElementById('heroFavBtn');
  const chartContainer = document.getElementById('hourlyChartContainer');
  const chartTabs = document.querySelectorAll('.chart-tab-btn');
  const refreshBtn = document.getElementById('refreshBtn');

  /**
   * Initialize Core Modules
   */
  function initApp() {
    // 1. Initialize Canvas Particle Engine
    if (canvasBg) {
      CanvasEffects.init(canvasBg);
    }

    // 2. Initialize Chart Engine
    if (chartContainer) {
      ChartManager.init(chartContainer);
    }

    // 3. Update Unit toggle UI
    updateUnitButton();

    // 4. Attach Event Listeners
    setupEventListeners();

    // 5. Render Initial Favorites Tray
    renderFavorites();

    // 6. Load Initial Location (Saved last location or default Hanoi)
    const initialLocation = StorageManager.getLastLocation();
    loadLocation(initialLocation);

    // 7. Auto refresh weather every 10 minutes
    state.refreshInterval = setInterval(() => {
      if (state.location) {
        loadLocation(state.location, false);
      }
    }, 10 * 60 * 1000);

    // 8. Local Clock updates every second
    state.clockInterval = setInterval(updateLiveClock, 1000);
  }

  /**
   * Load weather and air quality data for a location
   */
  async function loadLocation(location, showLoading = true) {
    if (!location || !location.latitude || !location.longitude) return;

    if (showLoading) {
      UIManager.setLoadingState(true);
    }

    try {
      state.location = location;
      StorageManager.setLastLocation(location);

      // Fetch Weather and Air Quality concurrently
      const [weatherData, aqiData] = await Promise.all([
        ApiService.fetchWeatherData(location.latitude, location.longitude, location.timezone),
        ApiService.fetchAirQuality(location.latitude, location.longitude, location.timezone)
      ]);

      state.weatherData = weatherData;
      state.aqiData = aqiData;

      // Update Body Theme & Canvas Particle Engine
      const current = weatherData.current;
      const weatherInfo = WeatherEngine.getWeatherInfo(current.weather_code, current.is_day);
      applyTheme(weatherInfo.themeCategory);

      // Render all UI components
      UIManager.renderHero(location, weatherData, state.unit);
      UIManager.renderMetrics(weatherData, aqiData, state.unit);
      UIManager.renderEphemeris(weatherData);
      UIManager.renderDailyForecast(weatherData, state.unit);
      UIManager.renderLifestyle(weatherData, aqiData);

      // Render Chart
      if (weatherData.hourly) {
        ChartManager.update(weatherData.hourly, state.unit);
      }

      if (showLoading) {
        UIManager.setLoadingState(false);
      }
    } catch (error) {
      console.error('[App] Failed to load location data:', error);
      UIManager.setLoadingState(false);
      UIManager.showToast('Failed to fetch meteorological data. Please retry.', 'error');
    }
  }

  /**
   * Apply dynamic background theme & particle effect
   */
  function applyTheme(themeCategory) {
    document.body.className = `theme-${themeCategory}`;
    CanvasEffects.setTheme(themeCategory);
  }

  /**
   * Update Live Clock in Hero section
   */
  function updateLiveClock() {
    const heroClock = document.getElementById('heroClock');
    if (!heroClock || !state.location) return;

    try {
      const timeStr = new Date().toLocaleTimeString('en-US', {
        timeZone: state.location.timezone !== 'auto' ? state.location.timezone : undefined,
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

  /**
   * Update Unit Switcher Button State
   */
  function updateUnitButton() {
    if (!unitToggleBtn) return;
    unitToggleBtn.textContent = state.unit === 'metric' ? '°C / km/h' : '°F / mph';
  }

  /**
   * Toggle between Metric and Imperial
   */
  function toggleUnits() {
    state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
    StorageManager.setUnit(state.unit);
    updateUnitButton();

    if (state.weatherData && state.location) {
      UIManager.renderHero(state.location, state.weatherData, state.unit);
      UIManager.renderMetrics(state.weatherData, state.aqiData, state.unit);
      UIManager.renderDailyForecast(state.weatherData, state.unit);
      if (state.weatherData.hourly) {
        ChartManager.update(state.weatherData.hourly, state.unit);
      }
    }
    UIManager.showToast(`Switched units to ${state.unit.toUpperCase()}`, 'info');
  }

  /**
   * Render Favorites Tray with handlers
   */
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
        UIManager.showToast('Location removed from favorites', 'info');
      }
    );
  }

  /**
   * Toggle Favorite for currently viewed city
   */
  function toggleCurrentFavorite() {
    if (!state.location) return;
    const isFav = StorageManager.isFavorite(state.location.latitude, state.location.longitude);

    if (isFav) {
      StorageManager.removeFavorite(state.location.id);
      if (heroFavBtn) heroFavBtn.classList.remove('active');
      UIManager.showToast(`Removed ${state.location.name} from favorites`, 'info');
    } else {
      StorageManager.addFavorite(state.location);
      if (heroFavBtn) heroFavBtn.classList.add('active');
      UIManager.showToast(`Saved ${state.location.name} to favorites`, 'success');
    }
    renderFavorites();
  }

  /**
   * Detect Geolocation via browser
   */
  function detectCurrentLocation() {
    if (!navigator.geolocation) {
      UIManager.showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    UIManager.showToast('Locating coordinates...', 'info');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locDetails = await ApiService.reverseGeocode(latitude, longitude);
          loadLocation(locDetails);
          UIManager.showToast(`Detected location: ${locDetails.name}`, 'success');
        } catch (e) {
          loadLocation({
            id: `${latitude.toFixed(4)}_${longitude.toFixed(4)}`,
            name: 'My Location',
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
        UIManager.showToast('Location permission denied or unavailable.', 'error');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  /**
   * Handle Search Input with 300ms Debounce
   */
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

  /**
   * Setup Event Listeners
   */
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

    // Close search dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (searchDropdown && !searchDropdown.contains(e.target) && e.target !== searchInput) {
        searchDropdown.style.display = 'none';
      }
    });

    // 2. Geolocation Button
    if (geoBtn) {
      geoBtn.addEventListener('click', detectCurrentLocation);
    }

    // 3. Unit Switcher
    if (unitToggleBtn) {
      unitToggleBtn.addEventListener('click', toggleUnits);
    }

    // 4. Hero Favorite Button
    if (heroFavBtn) {
      heroFavBtn.addEventListener('click', toggleCurrentFavorite);
    }

    // 5. Refresh Button
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        if (state.location) {
          ApiService.clearCache();
          loadLocation(state.location, true);
          UIManager.showToast('Updated weather data', 'info');
        }
      });
    }

    // 6. Chart Metric Tabs
    chartTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        chartTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const metric = tab.dataset.metric;
        ChartManager.setMetric(metric);
      });
    });

    // 7. Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Ignore if user is actively typing inside an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        if (e.key === 'Escape' && searchDropdown) {
          searchDropdown.style.display = 'none';
          searchInput.blur();
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

  // Run initialization
  initApp();
});
