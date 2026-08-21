# Aetheris // Ultimate Weather & Atmospheric Intelligence Hub

A zero-dependency, high-performance meteorological intelligence dashboard and atmospheric visualizer built with modern ES6+ and CSS3 Glassmorphic architecture. Powered directly by the Open-Meteo API suite without requiring API keys.

---

## Technical Overview (Tổng quan Kỹ thuật)

### English
Aetheris is an enterprise-grade weather workstation designed for real-time atmospheric observation, predictive meteorological modeling, and environmental air quality analysis. The application features a dynamic 60 FPS Canvas particle engine that renders live weather phenomena (rain vectors, multi-phase thunderstorms, convective snowfall, atmospheric fog, and starry celestial vaults) synchronized with World Meteorological Organization (WMO) weather interpretation codes.

### Tiếng Việt
Aetheris là bảng điều khiển khí tượng thông minh thế hệ mới, phục vụ việc quan trắc khí quyển theo thời gian thực, dự báo thời tiết chuyên sâu và phân tích chất lượng không khí. Ứng dụng tích hợp công nghệ đồ họa Canvas 60 FPS mô phỏng trực quan các hiện tượng thời tiết (mưa rơi vật lý, sấm chớp giật thể tích, tuyết rơi đa lớp, sương mù và bầu trời sao ban đêm) đồng bộ hoàn toàn với mã thời tiết chuẩn WMO.

---

## Architectural Topology (Kiến trúc Hệ thống)

```
ultimate-weather-hub/
├── index.html                  # Semantic Glassmorphic single-page architecture
├── css/
│   ├── style.css               # Design system tokens, layout grids, typography, animations
│   └── weather-effects.css     # Atmospheric gradients, glass shaders, glow effects
├── js/
│   ├── app.js                  # Application controller, lifecycle, and event coordination
│   ├── api.js                  # Open-Meteo REST service (Forecast, Geocoding, Air Quality)
│   ├── weatherEngine.js        # WMO interpreter, astronomy math, lifestyle heuristics
│   ├── canvasEffects.js        # 60 FPS GPU-accelerated atmospheric particle engine
│   ├── chartManager.js         # Interactive SVG cubic Bezier curve & scrubber engine
│   ├── storage.js              # LocalStorage state persistence (favorites, units, history)
│   └── ui.js                   # Reactive DOM rendering, skeleton loaders, toast dispatcher
├── assets/
│   └── favicon.svg             # Vector brand glyph
├── .gitignore                  # Git VCS exclusions
├── LICENSE                     # MIT License
└── README.md                   # Technical documentation
```

---

## Data Pipeline & Open-Meteo Integration (Luồng Dữ liệu & Tích hợp API)

The system communicates asynchronously with three endpoints provided by Open-Meteo. No authentication tokens or rate-limiting registration keys are needed.

### 1. Weather Forecast API
* **Endpoint:** `https://api.open-meteo.com/v1/forecast`
* **Resolution:** Hourly (24 hours) and Daily (8 days) synoptic parameters.
* **Captured Variables:** Surface temperature ($2\text{m}$), apparent ("feels like") temperature, relative humidity, dew point, barometric pressure at mean sea level (MSL), wind speed ($10\text{m}$), wind gusts, wind vector angle, cloud cover fraction, UV index, and WMO classification codes.

### 2. Geocoding API
* **Endpoint:** `https://geocoding-api.open-meteo.com/v1/search`
* **Capabilities:** Real-time city search with 300ms debounced queries, returning localized administrative subdivisions, ISO country codes, geographic coordinates, and timezones.

### 3. Air Quality API
* **Endpoint:** `https://air-quality-api.open-meteo.com/v1/air-quality`
* **Pollutant Matrix:** US Air Quality Index (AQI), European AQI, particulate matter concentrations ($\text{PM}_{2.5}$ and $\text{PM}_{10}$), nitrogen dioxide ($\text{NO}_2$), sulfur dioxide ($\text{SO}_2$), carbon monoxide ($\text{CO}$), and tropospheric ozone ($\text{O}_3$).

---

## Core Capabilities (Tính năng Cốt lõi)

### English
* **Real-time Glassmorphism Dashboard:** Translucent frosted glass layers (`backdrop-filter: blur(20px)`), dynamic typography hierarchy, and reactive ambient lighting orbs.
* **Atmospheric Canvas Engine:** Hardware-accelerated 2D canvas simulation updating dynamically based on current solar elevation and WMO weather codes.
* **Interactive Dynamics Chart:** Custom SVG cubic Bezier curves with mouse and touch hover scrubbers providing real-time trajectory readings for Temperature, Rain Probability, and Wind Gusts.
* **7-Day Synoptic Progression:** Compact multi-day forecast with horizontal thermal distribution sliders calibrated to weekly extremes.
* **Deep Atmospheric Metrics:** 8 specialized telemetry cards covering UV exposure safety, rotating wind compass vector, moisture saturation, barometric stability, and air pollutant breakdown.
* **Solar & Lunar Ephemeris:** Dynamic solar trajectory arc calculating daylight duration, sunrise/sunset, Golden Hour windows, and lunar phase illumination cycles.
* **Lifestyle & Environmental Safety Advisory:** Automated calculations for running and cycling suitability, outdoor laundry drying speed, clothing layering advice, and severe weather warnings.
* **Dual Unit System:** Instant toggle between Metric (°C, km/h, mm, hPa) and Imperial (°F, mph, in, inHg) systems.
* **Local Persistence:** Client-side storage for favorite cities, default coordinates, and UI configurations.

### Tiếng Việt
* **Giao diện Kính mờ (Glassmorphism):** Phối hợp lớp phủ kính bán trong suốt với bộ lọc mờ nền, phân cấp font chữ chuẩn xác và hiệu ứng ánh sáng môi trường chuyển màu động.
* **Bộ mô phỏng Hạt Khí quyển (Canvas Engine):** Tái hiện chân thực hạt mưa rơi nghiêng, bão sét giật màn hình, bông tuyết trôi đa tầng, sương mờ và bầu trời đầy sao ban đêm.
* **Biểu đồ Đường cong Tương tác:** Sử dụng thuật toán đường cong Cubic Bezier mượt mà, hỗ trợ rê chuột hoặc cảm ứng để xem chi tiết theo từng mốc thời gian thực.
* **Dự báo 7 Ngày Chuyên sâu:** Thanh trượt nhiệt độ trực quan so sánh biên độ nhiệt ngày với khoảng nhiệt độ cực đại/cực tiểu của toàn tuần.
* **Hệ thống 8 Chỉ số Khí tượng Mở rộng:** Bức xạ UV, la bàn gió xoay hướng thực tế, độ ẩm và điểm sương, nồng độ bụi mịn PM2.5/PM10, áp suất khí quyển và tầm nhìn xa.
* **Vòng cung Thiên văn Mặt trời & Mặt trăng:** Theo dõi độ cao mặt trời theo giờ thực tế, xác định khoảng thời gian Giờ Vàng (Golden Hour) và chu kỳ trăng khuyết/tròn.
* **Chỉ số Phong cách sống & Cảnh báo An toàn:** Đánh giá điều kiện chạy bộ, thời gian khô quần áo ngoài trời, gợi ý trang phục phù hợp và cảnh báo hiện tượng thời tiết cực đoan.
* **Chuyển đổi Hệ đơn vị Linh hoạt:** Hỗ trợ chuẩn Metric (°C, km/h, mm, hPa) và Imperial (°F, mph, in, inHg).
* **Lưu trữ Cục bộ Thông minh:** Tự động ghi nhớ danh sách thành phố yêu thích và cài đặt hiển thị vào LocalStorage.

---

## Keyboard Shortcuts (Phím tắt Điều khiển)

| Key Binding | Function (English) | Chức năng (Tiếng Việt) |
| :--- | :--- | :--- |
| `/` | Focus search bar | Kích hoạt thanh tìm kiếm địa điểm |
| `L` | Detect GPS location | Xác định tọa độ vị trí hiện tại |
| `U` | Toggle unit system (Metric / Imperial) | Chuyển đổi hệ đơn vị (°C / °F) |
| `F` | Toggle favorite state for active city | Thêm / Xóa thành phố yêu thích |
| `Esc` | Close search dropdown | Đóng menu gợi ý tìm kiếm |

---

## Quickstart & Local Execution (Hướng dẫn Cài đặt & Khởi chạy)

Since Aetheris has zero external build dependencies or npm requirements, it can be launched immediately in any modern web browser or statically served.

### Direct Execution
Open `index.html` directly in Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.

### Local HTTP Server
For production-identical asset loading:
```bash
# Using Python 3
python -m http.server 8080

# Or using Node.js npx serve
npx serve .
```
Navigate to `http://localhost:8080` in your browser.

---

## License (Giấy phép)

Distributed under the open-source MIT License. See [LICENSE](LICENSE) for complete details.
