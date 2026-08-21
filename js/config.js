/**
 * Aetheris Weather Hub - API & Engine Configuration
 *
 * NOTE: DO NOT COMMIT REAL API KEYS TO REPOSITORIES!
 * You can configure optional API keys here or paste them directly
 * inside the in-app "Settings / Cài đặt" modal (persisted in your browser localStorage).
 */

const CONFIG = {
  // Default resilient provider (Open-Meteo requires 0 API keys)
  DEFAULT_PROVIDER: 'open-meteo', // 'open-meteo' | 'weatherapi' | 'openweathermap' | 'tomorrow'

  // Optional External API Keys (Leave empty to use Open-Meteo free engine)
  API_KEYS: {
    WEATHERAPI: '',      // https://www.weatherapi.com/signup.aspx (Free 1M calls/mo)
    OPENWEATHERMAP: '',  // https://openweathermap.org/api (Free 1K calls/day)
    TOMORROW_IO: '',     // https://www.tomorrow.io/weather-api/ (Free 500 calls/day)
    WAQI: ''             // https://aqicn.org/data-platform/token/ (Free AQI token)
  }
};
