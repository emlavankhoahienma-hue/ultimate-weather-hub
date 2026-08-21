/**
 * Aetheris Weather Hub - LocalStorage Persistence Service
 * Manages user preferences, favorite locations, custom API keys, and language state.
 */

const StorageManager = (() => {
  const KEYS = {
    FAVORITES: 'aetheris_favorites_v1',
    UNIT: 'aetheris_unit_v1',
    LAST_LOCATION: 'aetheris_last_loc_v1',
    PROVIDER: 'aetheris_provider_v1',
    API_KEYS: 'aetheris_custom_api_keys_v1'
  };

  const DEFAULT_FAVORITES = [
    {
      id: '21.0285_105.8542',
      name: 'Hà Nội',
      admin1: 'Hà Nội',
      country: 'Việt Nam',
      countryCode: 'VN',
      latitude: 21.0285,
      longitude: 105.8542,
      timezone: 'Asia/Bangkok'
    },
    {
      id: '10.8231_106.6297',
      name: 'TP. Hồ Chí Minh',
      admin1: 'Hồ Chí Minh',
      country: 'Việt Nam',
      countryCode: 'VN',
      latitude: 10.8231,
      longitude: 106.6297,
      timezone: 'Asia/Bangkok'
    },
    {
      id: '16.0544_108.2022',
      name: 'Đà Nẵng',
      admin1: 'Đà Nẵng',
      country: 'Việt Nam',
      countryCode: 'VN',
      latitude: 16.0544,
      longitude: 108.2022,
      timezone: 'Asia/Bangkok'
    },
    {
      id: '35.6895_139.6917',
      name: 'Tokyo',
      admin1: 'Tokyo',
      country: 'Nhật Bản',
      countryCode: 'JP',
      latitude: 35.6895,
      longitude: 139.6917,
      timezone: 'Asia/Tokyo'
    },
    {
      id: '51.5074_-0.1278',
      name: 'London',
      admin1: 'England',
      country: 'Vương quốc Anh',
      countryCode: 'GB',
      latitude: 51.5074,
      longitude: -0.1278,
      timezone: 'Europe/London'
    }
  ];

  function getFavorites() {
    try {
      const stored = localStorage.getItem(KEYS.FAVORITES);
      if (!stored) {
        setFavorites(DEFAULT_FAVORITES);
        return DEFAULT_FAVORITES;
      }
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_FAVORITES;
    }
  }

  function setFavorites(favorites) {
    try {
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {}
  }

  function addFavorite(loc) {
    const list = getFavorites();
    const exists = list.some(item => 
      Math.abs(item.latitude - loc.latitude) < 0.05 && 
      Math.abs(item.longitude - loc.longitude) < 0.05
    );
    if (!exists) {
      list.unshift(loc);
      setFavorites(list);
    }
    return getFavorites();
  }

  function removeFavorite(locId) {
    const list = getFavorites().filter(item => item.id !== locId);
    setFavorites(list);
    return list;
  }

  function isFavorite(latitude, longitude) {
    const list = getFavorites();
    return list.some(item => 
      Math.abs(item.latitude - latitude) < 0.05 && 
      Math.abs(item.longitude - longitude) < 0.05
    );
  }

  function getUnit() {
    try {
      return localStorage.getItem(KEYS.UNIT) || 'metric';
    } catch (e) {
      return 'metric';
    }
  }

  function setUnit(unit) {
    try {
      localStorage.setItem(KEYS.UNIT, unit);
    } catch (e) {}
  }

  function getLastLocation() {
    try {
      const stored = localStorage.getItem(KEYS.LAST_LOCATION);
      return stored ? JSON.parse(stored) : DEFAULT_FAVORITES[0];
    } catch (e) {
      return DEFAULT_FAVORITES[0];
    }
  }

  function setLastLocation(loc) {
    try {
      localStorage.setItem(KEYS.LAST_LOCATION, JSON.stringify(loc));
    } catch (e) {}
  }

  // Provider Settings
  function getProvider() {
    try {
      return localStorage.getItem(KEYS.PROVIDER) || 'open-meteo';
    } catch (e) {
      return 'open-meteo';
    }
  }

  function setProvider(provider) {
    try {
      localStorage.setItem(KEYS.PROVIDER, provider);
    } catch (e) {}
  }

  // Custom API Keys (Saved securely in client localStorage)
  function getApiKeys() {
    try {
      const stored = localStorage.getItem(KEYS.API_KEYS);
      return stored ? JSON.parse(stored) : { weatherapi: '', openweathermap: '', waqi: '' };
    } catch (e) {
      return { weatherapi: '', openweathermap: '', waqi: '' };
    }
  }

  function setApiKeys(keys) {
    try {
      localStorage.setItem(KEYS.API_KEYS, JSON.stringify(keys));
    } catch (e) {}
  }

  return {
    getFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getUnit,
    setUnit,
    getLastLocation,
    setLastLocation,
    getProvider,
    setProvider,
    getApiKeys,
    setApiKeys
  };
})();
