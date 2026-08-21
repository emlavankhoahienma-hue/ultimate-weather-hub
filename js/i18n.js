/**
 * Aetheris Weather Hub - Internationalization (i18n) Engine
 * Comprehensive English & Vietnamese localization dictionaries for all
 * meteorological conditions, WMO codes, lifestyle advice, astronomy, and UI strings.
 */

const I18n = (() => {
  let currentLang = localStorage.getItem('aetheris_lang_v1') || 'vi'; // Default to Vietnamese

  const DICTIONARY = {
    vi: {
      // Header & Navigation
      brandTitle: 'AETHERIS',
      brandSubtitle: 'TRUNG TÂM KHÍ TƯỢNG THÔNG MINH',
      searchPlaceholder: 'Tìm kiếm thành phố hoặc tọa độ...',
      btnLocate: 'Định vị',
      btnRefresh: 'Làm mới',
      btnSettings: 'Cài đặt API',
      langToggle: 'VI',
      noFavorites: 'Chưa có địa điểm yêu thích. Bấm biểu tượng ngôi sao để ghim.',

      // Hero Card
      feelsLike: 'Cảm giác như',
      high: 'Cao',
      low: 'Thấp',
      localTime: 'Giờ địa phương',
      favAdd: 'Lưu vào yêu thích',
      favRemove: 'Xóa khỏi yêu thích',

      // 7-Day Forecast
      sevenDayForecast: 'Dự báo 7 ngày tới',
      today: 'Hôm nay',
      days: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],

      // 24h Hourly Chart
      hourlyDynamics: 'Biến thiên 24 giờ',
      tabTemp: 'Nhiệt độ',
      tabPrecip: 'Xác suất mưa',
      tabWind: 'Gió & Giật',
      rainChance: 'Xác suất mưa',
      rainVolume: 'Lượng mưa',
      gusts: 'Gió giật',

      // 8 Deep Metrics
      metricUv: 'Bức xạ UV',
      metricWind: 'Động lực gió',
      metricHumidity: 'Độ ẩm & Điểm sương',
      metricAqi: 'Chất lượng không khí (AQI)',
      metricPressure: 'Áp suất khí quyển',
      metricVisibility: 'Tầm nhìn xa',
      metricCloud: 'Độ che phủ mây',
      metricPrecip: 'Lượng mưa dự kiến',

      // UV Levels & Advice
      uvLow: 'Thấp',
      uvLowAdvice: 'An toàn khi hoạt động ngoài trời. Không cần che chắn.',
      uvMod: 'Trung bình',
      uvModAdvice: 'Nên đeo kính râm, đội mũ và thoa kem chống nắng SPF 30+.',
      uvHigh: 'Cao',
      uvHighAdvice: 'Hạn chế tiếp xúc trực tiếp với ánh nắng từ 10h - 16h.',
      uvVeryHigh: 'Rất cao',
      uvVeryHighAdvice: 'Bức xạ mạnh. Cần che chắn tối đa và tìm bóng râm.',
      uvExtreme: 'Cực độ',
      uvExtremeAdvice: 'Nguy cơ bỏng da trong 10 phút. Tránh ra ngoài trời nắng.',

      // AQI Levels & Advice
      aqiGood: 'Tốt',
      aqiGoodMsg: 'Chất lượng không khí lý tưởng, trong lành.',
      aqiMod: 'Trung bình',
      aqiModMsg: 'Không khí chấp nhận được; nhóm nhạy cảm nên lưu ý.',
      aqiSens: 'Kém (Nhạy cảm)',
      aqiSensMsg: 'Người có bệnh hô hấp nên giảm hoạt động mạnh ngoài trời.',
      aqiUnhealthy: 'Xấu',
      aqiUnhealthyMsg: 'Gây hại cho sức khỏe. Người dân nên đeo khẩu trang.',
      aqiVeryUnhealthy: 'Rất xấu',
      aqiVeryUnhealthyMsg: 'Cảnh báo khẩn cấp. Hạn chế tối đa ra ngoài trời.',
      aqiHazardous: 'Nguy hại',
      aqiHazardousMsg: 'Ô nhiễm nghiêm trọng. Tránh hoàn toàn mọi hoạt động ngoài trời.',

      // Ephemeris
      ephemerisTitle: 'Vòng cung Thiên văn & Mặt trời',
      solarPath: 'Quỹ đạo Mặt trời & Ánh sáng',
      sunrise: 'Bình minh',
      sunset: 'Hoàng hôn',
      daylight: 'Thời lượng ngày',
      goldenHour: 'Giờ Vàng nhiếp ảnh',
      lunarEphemeris: 'Tuần trăng & Chiêm tinh',
      illumination: 'Độ sáng mặt trăng',
      lunarAge: 'Ngày tuổi trăng',

      // Moon Phases
      moonNew: 'Trăng non (Sóc)',
      moonWaxingCrescent: 'Trăng lưỡi liềm đầu tháng',
      moonFirstQuarter: 'Trăng bán nguyệt đầu tháng',
      moonWaxingGibbous: 'Trăng trương đầu tháng',
      moonFull: 'Trăng tròn (Vọng)',
      moonWaningGibbous: 'Trăng trương cuối tháng',
      moonLastQuarter: 'Trăng bán nguyệt cuối tháng',
      moonWaningCrescent: 'Trăng lưỡi liềm cuối tháng',

      // Lifestyle & Safety
      lifestyleTitle: 'Khuyến nghị Phong cách sống & Sức khỏe',
      runTitle: 'Chạy bộ & Thể thao',
      runIdeal: 'Lý tưởng',
      runGood: 'Tốt',
      runMod: 'Trung bình',
      runPoor: 'Kém',
      runDescIdeal: 'Điều kiện thời tiết hoàn hảo cho luyện tập thể thao ngoài trời.',
      runDescMod: 'Nhiệt độ hoặc độ ẩm hơi cao; chú ý bù nước đầy đủ.',
      laundryTitle: 'Giặt phơi ngoài trời',
      laundryFast: 'Khô nhanh',
      laundryMod: 'Trung bình',
      laundrySlow: 'Khô chậm',
      laundryIndoor: 'Nên phơi trong nhà',
      outfitTitle: 'Gợi ý Trang phục',
      packUmbrella: 'Mang theo ô / áo mưa',

      // Weather Conditions (WMO Codes)
      wmo0: 'Trời quang đãng',
      wmo1: 'Trời hầu như quang',
      wmo2: 'Mây rải rác',
      wmo3: 'Trời u ám',
      wmo45: 'Sương mù',
      wmo48: 'Sương mù đọng băng',
      wmo51: 'Mưa phùn nhẹ',
      wmo53: 'Mưa phùn vừa',
      wmo55: 'Mưa phùn dày hạt',
      wmo56: 'Mưa phùn buốt nhẹ',
      wmo57: 'Mưa phùn buốt dày hạt',
      wmo61: 'Mưa nhỏ rải rác',
      wmo63: 'Mưa vừa',
      wmo65: 'Mưa to nặng hạt',
      wmo66: 'Mưa băng giá nhẹ',
      wmo67: 'Mưa băng giá dữ dội',
      wmo71: 'Tuyết rơi nhẹ',
      wmo73: 'Tuyết rơi vừa',
      wmo75: 'Tuyết rơi dày',
      wmo77: 'Hạt tuyết nhỏ',
      wmo80: 'Mưa rào nhẹ',
      wmo81: 'Mưa rào vừa',
      wmo82: 'Mưa rào xối xả',
      wmo85: 'Mưa tuyết rào nhẹ',
      wmo86: 'Mưa tuyết rào dày đặc',
      wmo95: 'Giông bão sấm sét',
      wmo96: 'Giông bão kèm mưa đá nhỏ',
      wmo99: 'Giông bão kèm mưa đá lớn',

      // Settings Modal
      modalTitle: 'Cài đặt Nguồn Dữ liệu & API Key',
      modalDesc: 'Aetheris mặc định sử dụng Open-Meteo API (100% Miễn phí, Không cần Key). Bạn có thể chọn nhà cung cấp khác và dán API Key cá nhân của mình vào đây (Lưu an toàn trong trình duyệt của bạn).',
      providerSelect: 'Nguồn Dữ liệu Khí tượng chính:',
      keySavedToast: 'Đã lưu cấu hình API thành công!',
      btnSave: 'Lưu cấu hình',
      btnClose: 'Đóng'
    },

    en: {
      // Header & Navigation
      brandTitle: 'AETHERIS',
      brandSubtitle: 'ATMOSPHERIC INTELLIGENCE HUB',
      searchPlaceholder: 'Search city or coordinates...',
      btnLocate: 'Locate',
      btnRefresh: 'Refresh',
      btnSettings: 'API Settings',
      langToggle: 'EN',
      noFavorites: 'No favorite cities saved. Click the star icon to pin.',

      // Hero Card
      feelsLike: 'Feels like',
      high: 'High',
      low: 'Low',
      localTime: 'Local Time',
      favAdd: 'Add to favorites',
      favRemove: 'Remove from favorites',

      // 7-Day Forecast
      sevenDayForecast: '7-Day Synoptic Forecast',
      today: 'Today',
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

      // 24h Hourly Chart
      hourlyDynamics: '24-Hour Precision Dynamics',
      tabTemp: 'Temperature',
      tabPrecip: 'Precipitation',
      tabWind: 'Wind Dynamics',
      rainChance: 'Rain Chance',
      rainVolume: 'Precipitation',
      gusts: 'Wind Gusts',

      // 8 Deep Metrics
      metricUv: 'UV Radiation',
      metricWind: 'Wind Dynamics',
      metricHumidity: 'Humidity & Dew',
      metricAqi: 'Air Quality (US AQI)',
      metricPressure: 'Barometric Pressure',
      metricVisibility: 'Visibility Range',
      metricCloud: 'Cloud Cover',
      metricPrecip: 'Precipitation',

      // UV Levels & Advice
      uvLow: 'Low',
      uvLowAdvice: 'No protection required. Safe for outdoor activities.',
      uvMod: 'Moderate',
      uvModAdvice: 'Wear sunglasses, hat, and apply SPF 30+ sunscreen.',
      uvHigh: 'High',
      uvHighAdvice: 'Reduce direct sun exposure between 10 AM - 4 PM.',
      uvVeryHigh: 'Very High',
      uvVeryHighAdvice: 'High radiation risk. Seek shade and cover up.',
      uvExtreme: 'Extreme',
      uvExtremeAdvice: 'Skin burn risk under 10 mins. Avoid midday outdoor sun.',

      // AQI Levels & Advice
      aqiGood: 'Good',
      aqiGoodMsg: 'Air quality is satisfactory and poses little or no risk.',
      aqiMod: 'Moderate',
      aqiModMsg: 'Acceptable; sensitive individuals should monitor symptoms.',
      aqiSens: 'Unhealthy (Sensitive)',
      aqiSensMsg: 'Sensitive groups should reduce heavy outdoor exertion.',
      aqiUnhealthy: 'Unhealthy',
      aqiUnhealthyMsg: 'General public may experience health effects. Wear a mask.',
      aqiVeryUnhealthy: 'Very Unhealthy',
      aqiVeryUnhealthyMsg: 'Health alert: serious risk for the entire population.',
      aqiHazardous: 'Hazardous',
      aqiHazardousMsg: 'Health warning of emergency conditions. Stay indoors.',

      // Ephemeris
      ephemerisTitle: 'Celestial & Solar Ephemeris',
      solarPath: 'Solar Path & Daylight',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      daylight: 'Daylight',
      goldenHour: 'Golden Hour Window',
      lunarEphemeris: 'Lunar Ephemeris',
      illumination: 'Illumination',
      lunarAge: 'Lunar Age',

      // Moon Phases
      moonNew: 'New Moon',
      moonWaxingCrescent: 'Waxing Crescent',
      moonFirstQuarter: 'First Quarter',
      moonWaxingGibbous: 'Waxing Gibbous',
      moonFull: 'Full Moon',
      moonWaningGibbous: 'Waning Gibbous',
      moonLastQuarter: 'Last Quarter',
      moonWaningCrescent: 'Waning Crescent',

      // Lifestyle & Safety
      lifestyleTitle: 'Atmospheric Lifestyle & Safety Advisory',
      runTitle: 'Running & Fitness',
      runIdeal: 'Ideal',
      runGood: 'Good',
      runMod: 'Moderate',
      runPoor: 'Poor',
      runDescIdeal: 'Optimal thermal & breathable conditions for outdoor training.',
      runDescMod: 'Elevated temperature or moisture; ensure proper hydration.',
      laundryTitle: 'Outdoor Laundry',
      laundryFast: 'Fast Drying',
      laundryMod: 'Moderate',
      laundrySlow: 'Slow Drying',
      laundryIndoor: 'Indoor Only',
      outfitTitle: 'Outfit Advisor',
      packUmbrella: 'Pack an umbrella',

      // Weather Conditions (WMO Codes)
      wmo0: 'Clear Sky',
      wmo1: 'Mainly Clear',
      wmo2: 'Partly Cloudy',
      wmo3: 'Overcast',
      wmo45: 'Foggy',
      wmo48: 'Depositing Rime Fog',
      wmo51: 'Light Drizzle',
      wmo53: 'Moderate Drizzle',
      wmo55: 'Dense Drizzle',
      wmo56: 'Light Freezing Drizzle',
      wmo57: 'Dense Freezing Drizzle',
      wmo61: 'Slight Rain',
      wmo63: 'Moderate Rain',
      wmo65: 'Heavy Rain',
      wmo66: 'Light Freezing Rain',
      wmo67: 'Heavy Freezing Rain',
      wmo71: 'Slight Snow Fall',
      wmo73: 'Moderate Snow Fall',
      wmo75: 'Heavy Snow Fall',
      wmo77: 'Snow Grains',
      wmo80: 'Slight Rain Showers',
      wmo81: 'Moderate Rain Showers',
      wmo82: 'Violent Rain Showers',
      wmo85: 'Slight Snow Showers',
      wmo86: 'Heavy Snow Showers',
      wmo95: 'Thunderstorm',
      wmo96: 'Thunderstorm with Slight Hail',
      wmo99: 'Thunderstorm with Heavy Hail',

      // Settings Modal
      modalTitle: 'API Data Sources & Custom Keys',
      modalDesc: 'Aetheris uses Open-Meteo API by default (100% Free, Zero API Keys required). You can optionally switch to other providers and paste your personal API keys here (persisted securely in your browser).',
      providerSelect: 'Primary Weather Provider:',
      keySavedToast: 'API configuration saved successfully!',
      btnSave: 'Save Config',
      btnClose: 'Close'
    }
  };

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    if (lang !== 'vi' && lang !== 'en') lang = 'vi';
    currentLang = lang;
    localStorage.setItem('aetheris_lang_v1', lang);
  }

  function toggleLang() {
    currentLang = currentLang === 'vi' ? 'en' : 'vi';
    localStorage.setItem('aetheris_lang_v1', currentLang);
    return currentLang;
  }

  function t(key) {
    const dict = DICTIONARY[currentLang] || DICTIONARY['vi'];
    return dict[key] !== undefined ? dict[key] : key;
  }

  function getWmoText(code) {
    const key = `wmo${code}`;
    return t(key);
  }

  return {
    getLang,
    setLang,
    toggleLang,
    t,
    getWmoText
  };
})();
