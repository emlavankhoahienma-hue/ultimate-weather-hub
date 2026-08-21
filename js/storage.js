/**
 * Aetheris Weather Hub - LocalStorage Persistence Service
 * Manages user preferences, favorite locations, unit system, and last viewed city.
 */

const StorageManager = (() => {
  const KEYS = {
    FAVORITES: 'aetheris_favorites_v1',
    UNIT: 'aetheris_unit_v1',
    LAST_LOCATION: 'aetheris_last_loc_v1'
  };

  const DEFAULT_FAVORITES = [
    {
      id: '21.0285_105.8542',
      name: 'Hanoi',
      admin1: 'Hanoi',
      country: 'Vietnam',
      countryCode: 'VN',
      latitude: 21.0285,
      longitude: 105.8542,
      timezone: 'Asia/Bangkok'
    },
    {
      id: '10.8231_106.6297',
      name: 'Ho Chi Minh City',
      admin1: 'Ho Chi Minh',
      country: 'Vietnam',
      countryCode: 'VN',
      latitude: 10.8231,
      longitude: 106.6297,
      timezone: 'Asia/Bangkok'
    },
    {
      id: '35.6895_139.6917',
      name: 'Tokyo',
      admin1: 'Tokyo',
      country: 'Japan',
      countryCode: 'JP',
      latitude: 35.6895,
      longitude: 139.6917,
      timezone: 'Asia/Tokyo'
    },
    {
      id: '51.5074_-0.1278',
      name: 'London',
      admin1: 'England',
      country: 'United Kingdom',
      countryCode: 'GB',
      latitude: 51.5074,
      longitude: -0.1278,
      timezone: 'Europe/London'
    },
    {
      id: '40.7128_-74.0060',
      name: 'New York',
      admin1: 'New York',
      country: 'United States',
      countryCode: 'US',
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York'
    }
  ];

  /**
   * Get list of favorite locations
   */
  function getFavorites() {
    try {
      const stored = localStorage.getItem(KEYS.FAVORITES);
      if (!stored) {
        setFavorites(DEFAULT_FAVORITES);
        return DEFAULT_FAVORITES;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.warn('[StorageManager] Error reading favorites:', e);
      return DEFAULT_FAVORITES;
    }
  }

  /**
   * Save list of favorite locations
   */
  function setFavorites(favorites) {
    try {
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error('[StorageManager] Error writing favorites:', e);
    }
  }

  /**
   * Add a location to favorites
   */
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

  /**
   * Remove a location from favorites
   */
  function removeFavorite(locId) {
    const list = getFavorites().filter(item => item.id !== locId);
    setFavorites(list);
    return list;
  }

  /**
   * Check if location is favorited
   */
  function isFavorite(latitude, longitude) {
    const list = getFavorites();
    return list.some(item => 
      Math.abs(item.latitude - latitude) < 0.05 && 
      Math.abs(item.longitude - longitude) < 0.05
    );
  }

  /**
   * Get active unit system ('metric' | 'imperial')
   */
  function getUnit() {
    try {
      return localStorage.getItem(KEYS.UNIT) || 'metric';
    } catch (e) {
      return 'metric';
    }
  }

  /**
   * Set active unit system
   */
  function setUnit(unit) {
    try {
      localStorage.setItem(KEYS.UNIT, unit);
    } catch (e) {}
  }

  /**
   * Get last viewed location
   */
  function getLastLocation() {
    try {
      const stored = localStorage.getItem(KEYS.LAST_LOCATION);
      return stored ? JSON.parse(stored) : DEFAULT_FAVORITES[0];
    } catch (e) {
      return DEFAULT_FAVORITES[0];
    }
  }

  /**
   * Set last viewed location
   */
  function setLastLocation(loc) {
    try {
      localStorage.setItem(KEYS.LAST_LOCATION, JSON.stringify(loc));
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
    setLastLocation
  };
})();
