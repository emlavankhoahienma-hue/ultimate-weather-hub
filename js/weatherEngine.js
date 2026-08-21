/**
 * Aetheris Weather Hub - Weather Intelligence Engine
 * Comprehensive WMO Mapping, Astronomical Calculations,
 * Air Quality Classifications, and Multilingual Lifestyle Indices.
 */

const WeatherEngine = (() => {
  const WMO_CATEGORIES = {
    0: { category: 'clear', icon: 'sun' },
    1: { category: 'clear', icon: 'sun-cloud' },
    2: { category: 'cloudy', icon: 'cloud-sun' },
    3: { category: 'cloudy', icon: 'cloud' },
    45: { category: 'fog', icon: 'fog' },
    48: { category: 'fog', icon: 'fog' },
    51: { category: 'rain', icon: 'drizzle' },
    53: { category: 'rain', icon: 'drizzle' },
    55: { category: 'rain', icon: 'drizzle' },
    56: { category: 'snow', icon: 'sleet' },
    57: { category: 'snow', icon: 'sleet' },
    61: { category: 'rain', icon: 'rain-light' },
    63: { category: 'rain', icon: 'rain-medium' },
    65: { category: 'rain', icon: 'rain-heavy' },
    66: { category: 'snow', icon: 'sleet' },
    67: { category: 'snow', icon: 'sleet' },
    71: { category: 'snow', icon: 'snow-light' },
    73: { category: 'snow', icon: 'snow-medium' },
    75: { category: 'snow', icon: 'snow-heavy' },
    77: { category: 'snow', icon: 'snow-light' },
    80: { category: 'rain', icon: 'rain-shower' },
    81: { category: 'rain', icon: 'rain-shower' },
    82: { category: 'rain', icon: 'rain-heavy' },
    85: { category: 'snow', icon: 'snow-shower' },
    86: { category: 'snow', icon: 'snow-heavy' },
    95: { category: 'storm', icon: 'thunderstorm' },
    96: { category: 'storm', icon: 'thunder-hail' },
    99: { category: 'storm', icon: 'thunder-hail' }
  };

  function getWeatherInfo(code, isDay = 1) {
    const entry = WMO_CATEGORIES[code] || { category: 'cloudy', icon: 'cloud' };
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

    const localizedLabel = typeof I18n !== 'undefined' ? I18n.getWmoText(code) : 'Clear Sky';

    return {
      code,
      label: localizedLabel,
      category: entry.category,
      themeCategory,
      icon,
      isDay: isDay === 1
    };
  }

  function celsiusToFahrenheit(c) {
    return (c * 9) / 5 + 32;
  }

  function kmhToMph(kmh) {
    return kmh * 0.621371;
  }

  function formatTemp(tempC, unit = 'metric', showUnit = true) {
    if (tempC === null || tempC === undefined) return '--';
    const val = unit === 'imperial' ? celsiusToFahrenheit(tempC) : tempC;
    const rounded = Math.round(val);
    return showUnit ? `${rounded}°${unit === 'imperial' ? 'F' : 'C'}` : `${rounded}°`;
  }

  function formatWindSpeed(kmh, unit = 'metric') {
    if (kmh === null || kmh === undefined) return '--';
    if (unit === 'imperial') {
      return `${Math.round(kmhToMph(kmh))} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  }

  function getWindDirection(degrees) {
    if (degrees === null || degrees === undefined) return 'N/A';
    const directions = ['B', 'B-ĐB', 'ĐB', 'Đ-ĐB', 'Đ', 'Đ-ĐN', 'ĐN', 'N-ĐN', 'N', 'N-TN', 'TN', 'T-TN', 'T', 'T-TB', 'TB', 'B-TB'];
    const directionsEn = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((degrees % 360) / 22.5) % 16;
    const isVi = typeof I18n !== 'undefined' && I18n.getLang() === 'vi';
    return isVi ? directions[index] : directionsEn[index];
  }

  function getUVRating(uv) {
    const isVi = typeof I18n !== 'undefined' && I18n.getLang() === 'vi';
    if (uv === null || uv === undefined) return { level: 'N/A', color: '#94a3b8', advice: '--' };

    if (uv <= 2.4) {
      return {
        level: isVi ? 'Thấp' : 'Low',
        color: '#10b981',
        advice: isVi ? 'An toàn cho da. Không cần che chắn khi ra ngoài.' : 'No protection required. Safe for outdoors.'
      };
    }
    if (uv <= 5.4) {
      return {
        level: isVi ? 'Trung bình' : 'Moderate',
        color: '#f59e0b',
        advice: isVi ? 'Nên đội mũ, đeo kính râm và thoa kem chống nắng.' : 'Wear sunglasses, hat, and apply SPF 30+.'
      };
    }
    if (uv <= 7.4) {
      return {
        level: isVi ? 'Cao' : 'High',
        color: '#f97316',
        advice: isVi ? 'Hạn chế tiếp xúc trực tiếp ánh nắng từ 10h - 16h.' : 'Reduce direct sun exposure from 10 AM - 4 PM.'
      };
    }
    if (uv <= 10.4) {
      return {
        level: isVi ? 'Rất cao' : 'Very High',
        color: '#ef4444',
        advice: isVi ? 'Bức xạ nguy hiểm. Cần che chắn tối đa và tìm bóng râm.' : 'Extra protection required. Seek shade.'
      };
    }
    return {
      level: isVi ? 'Cực độ' : 'Extreme',
      color: '#8b5cf6',
      advice: isVi ? 'Nguy cơ bỏng da dưới 10 phút. Tránh ra ngoài trời nắng.' : 'Avoid outdoor sun. Burn time < 10 mins.'
    };
  }

  function getAirQualityRating(usAqi) {
    const isVi = typeof I18n !== 'undefined' && I18n.getLang() === 'vi';
    if (usAqi === null || usAqi === undefined) {
      return { score: 0, status: isVi ? 'Tốt' : 'Good', color: '#10b981', message: isVi ? 'Không khí trong lành.' : 'Air quality is good.' };
    }
    const val = Math.round(usAqi);
    if (val <= 50) return { score: val, status: isVi ? 'Tốt' : 'Good', color: '#10b981', message: isVi ? 'Chất lượng không khí lý tưởng, rất trong lành.' : 'Air quality is satisfactory and poses little risk.' };
    if (val <= 100) return { score: val, status: isVi ? 'Trung bình' : 'Moderate', color: '#eab308', message: isVi ? 'Không khí chấp nhận được; nhóm nhạy cảm cần lưu ý.' : 'Acceptable air quality; sensitive groups monitor.' };
    if (val <= 150) return { score: val, status: isVi ? 'Kém (Nhạy cảm)' : 'Unhealthy (Sensitive)', color: '#f97316', message: isVi ? 'Nhóm nhạy cảm nên giảm vận động mạnh ngoài trời.' : 'Sensitive groups may experience health effects.' };
    if (val <= 200) return { score: val, status: isVi ? 'Xấu' : 'Unhealthy', color: '#ef4444', message: isVi ? 'Có hại cho sức khỏe. Người dân nên đeo khẩu trang.' : 'Everyone may experience health effects.' };
    if (val <= 300) return { score: val, status: isVi ? 'Rất xấu' : 'Very Unhealthy', color: '#a855f7', message: isVi ? 'Cảnh báo khẩn cấp. Hạn chế tối đa ra ngoài trời.' : 'Health alert: serious risk for everyone.' };
    return { score: val, status: isVi ? 'Nguy hại' : 'Hazardous', color: '#7e22ce', message: isVi ? 'Ô nhiễm nghiêm trọng. Tránh hoàn toàn hoạt động ngoài trời.' : 'Emergency conditions; stay indoors.' };
  }

  function calculateSolarPosition(sunriseIso, sunsetIso, currentIsoTime = null) {
    if (!sunriseIso || !sunsetIso) {
      return { progress: 0.5, isDaytime: true, daylightMinutes: 720, daylightHours: '12.0', sunriseFormatted: '--', sunsetFormatted: '--', goldenHourEvening: '--' };
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

    const ghEvening = new Date(sunset - 60 * 60 * 1000);
    const formatTimeShort = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return {
      progress: Math.min(Math.max(progress, 0), 1),
      isDaytime,
      daylightMinutes,
      daylightHours: (daylightMinutes / 60).toFixed(1),
      sunriseFormatted: formatTimeShort(new Date(sunrise)),
      sunsetFormatted: formatTimeShort(new Date(sunset)),
      goldenHourEvening: `${formatTimeShort(ghEvening)} - ${formatTimeShort(new Date(sunset))}`
    };
  }

  function getMoonPhase(date = new Date()) {
    const isVi = typeof I18n !== 'undefined' && I18n.getLang() === 'vi';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let c = 0;
    let e = 0;
    let jd = 0;
    let b = 0;

    const a = Math.floor(year / 100);
    b = 2 - a + Math.floor(a / 4);
    jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
    
    const daysSinceNew = jd - 2451549.5;
    const cycle = 29.53058867;
    const newMoons = daysSinceNew / cycle;
    const phaseRatio = newMoons - Math.floor(newMoons);
    const ageDays = (phaseRatio * cycle).toFixed(1);
    const illumination = Math.round((0.5 * (1 - Math.cos(2 * Math.PI * phaseRatio))) * 100);

    let phaseName = isVi ? 'Trăng non' : 'New Moon';

    if (phaseRatio < 0.03 || phaseRatio > 0.97) {
      phaseName = isVi ? 'Trăng non (Sóc)' : 'New Moon';
    } else if (phaseRatio < 0.22) {
      phaseName = isVi ? 'Trăng lưỡi liềm đầu tháng' : 'Waxing Crescent';
    } else if (phaseRatio < 0.28) {
      phaseName = isVi ? 'Trăng bán nguyệt đầu tháng' : 'First Quarter';
    } else if (phaseRatio < 0.47) {
      phaseName = isVi ? 'Trăng trương đầu tháng' : 'Waxing Gibbous';
    } else if (phaseRatio < 0.53) {
      phaseName = isVi ? 'Trăng tròn (Vọng)' : 'Full Moon';
    } else if (phaseRatio < 0.72) {
      phaseName = isVi ? 'Trăng trương cuối tháng' : 'Waning Gibbous';
    } else if (phaseRatio < 0.78) {
      phaseName = isVi ? 'Trăng bán nguyệt cuối tháng' : 'Last Quarter';
    } else {
      phaseName = isVi ? 'Trăng lưỡi liềm cuối tháng' : 'Waning Crescent';
    }

    return {
      phaseName,
      illumination,
      ageDays
    };
  }

  function computeLifestyleIndex(weatherData, aqiData) {
    const current = weatherData.current;
    if (!current) return {};

    const isVi = typeof I18n !== 'undefined' && I18n.getLang() === 'vi';
    const temp = current.temperature_2m;
    const feelsLike = current.apparent_temperature;
    const humidity = current.relative_humidity_2m;
    const wind = current.wind_speed_10m;
    const rain = current.precipitation;
    const code = current.weather_code;
    const aqi = aqiData && aqiData.current ? (aqiData.current.us_aqi || 40) : 40;

    // 1. Running & Fitness Score
    let runScore = 100;
    if (temp < 5) runScore -= (5 - temp) * 4;
    if (temp > 26) runScore -= (temp - 26) * 5;
    if (humidity > 80) runScore -= (humidity - 80) * 1.2;
    if (wind > 25) runScore -= (wind - 25) * 2;
    if (rain > 0.2) runScore -= rain * 25;
    if (aqi > 100) runScore -= (aqi - 100) * 0.5;
    runScore = Math.max(0, Math.min(100, Math.round(runScore)));

    let runLevel = isVi ? 'Lý tưởng' : 'Ideal';
    if (runScore < 40) runLevel = isVi ? 'Kém' : 'Poor';
    else if (runScore < 65) runLevel = isVi ? 'Trung bình' : 'Moderate';
    else if (runScore < 85) runLevel = isVi ? 'Tốt' : 'Good';

    // 2. Laundry Drying
    let laundryRating = isVi ? 'Khô nhanh' : 'Fast';
    let laundryHours = isVi ? '2 - 3 giờ' : '2 - 3 hrs';
    if (rain > 0 || code >= 50) {
      laundryRating = isVi ? 'Nên phơi trong nhà' : 'Indoor Only';
      laundryHours = isVi ? 'Có mưa' : 'Rain expected';
    } else if (humidity > 75 || temp < 12) {
      laundryRating = isVi ? 'Khô chậm' : 'Slow';
      laundryHours = isVi ? '6 - 8 giờ' : '6 - 8 hrs';
    } else if (humidity > 55 || temp < 20) {
      laundryRating = isVi ? 'Trung bình' : 'Moderate';
      laundryHours = isVi ? '4 - 5 giờ' : '4 - 5 hrs';
    }

    // 3. Clothing Advisor
    let clothing = isVi ? 'Áo phông & Quần cộc' : 'T-Shirt & Shorts';
    let clothingDetail = isVi ? 'Trang phục nhẹ nhàng, thoáng mát' : 'Lightweight breathable attire';
    if (feelsLike < 0) {
      clothing = isVi ? 'Áo phao dày & Găng tay' : 'Thermal Parka & Gloves';
      clothingDetail = isVi ? 'Cần giữ ấm tuyệt đối' : 'Heavy insulation required';
    } else if (feelsLike < 14) {
      clothing = isVi ? 'Áo khoác ấm / Áo len' : 'Warm Jacket or Coat';
      clothingDetail = isVi ? 'Nên mặc nhiều lớp chắn gió' : 'Windproof layers recommended';
    } else if (feelsLike < 22) {
      clothing = isVi ? 'Áo khoác mỏng nhẹ' : 'Sweater / Light Jacket';
      clothingDetail = isVi ? 'Thời tiết mát mẻ dễ chịu' : 'Comfortable mild outerwear';
    } else if (feelsLike > 32) {
      clothing = isVi ? 'Đồ siêu nhẹ & Bù nước' : 'Ultra Light & Hydration';
      clothingDetail = isVi ? 'Đội mũ, kính râm, uống nhiều nước' : 'Sunhat, sunglasses, stay hydrated';
    }

    const umbrellaRequired = rain > 0.1 || [51,53,55,61,63,65,80,81,82,95,96,99].includes(code);

    // 4. Warnings
    const warnings = [];
    if (wind > 45) {
      warnings.push({
        title: isVi ? 'Cảnh báo Gió mạnh' : 'High Wind Advisory',
        desc: isVi ? `Gió giật lên tới ${Math.round(current.wind_gusts_10m || wind)} km/h.` : `Gusts up to ${Math.round(current.wind_gusts_10m || wind)} km/h.`
      });
    }
    if (temp > 37 || feelsLike > 40) {
      warnings.push({
        title: isVi ? 'Cảnh báo Nắng nóng cực độ' : 'Extreme Heat Warning',
        desc: isVi ? 'Nguy cơ sốc nhiệt cao khi ở ngoài trời lâu.' : 'Prolonged exposure increases heat stroke risk.'
      });
    }
    if ([95, 96, 99].includes(code)) {
      warnings.push({
        title: isVi ? 'Cảnh báo Dông bão Sét' : 'Active Thunderstorm Watch',
        desc: isVi ? 'Hiện tượng sấm sét và mưa giông nguy hiểm trong khu vực.' : 'Severe electrical storm activity in sector.'
      });
    }

    return {
      runScore,
      runLevel,
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
