# Aetheris // Ultimate Weather & Atmospheric Intelligence Hub

A multi-source atmospheric intelligence workstation and meteorological visualizer built with modern ES6+ and CSS3 Glassmorphic architecture. Supports seamless switching between the Open-Meteo API suite (Default, 100% Free, Zero API Keys Required), WeatherAPI, OpenWeatherMap, and the World Air Quality Index (WAQI).

---

## Technical Architecture (Kiến trúc Kỹ thuật)

### English
Aetheris implements a decoupled, multi-provider meteorological pipeline. The client-side state machine queries the designated provider, normalizes disparate payload schemas into a unified Aetheris Data Model, and executes hardware-accelerated 60-120 FPS Canvas shaders to visually simulate local precipitation, electrical storms, convective snowfall, and celestial ephemeris in real time.

### Tiếng Việt
Aetheris triển khai kiến trúc đường ống dữ liệu đa nguồn (Multi-Provider Pipeline). Tầng dịch vụ chuẩn hóa dữ liệu từ các nhà cung cấp khác nhau thành một cấu trúc chuẩn chung, điều khiển bộ kết xuất đồ họa Canvas 60-120 FPS mô phỏng trực quan lượng mưa, bão sét, tuyết rơi và vòng cung thiên văn mặt trời / mặt trăng theo thời gian thực.

```
ultimate-weather-hub/
├── index.html                  # Semantic Glassmorphic document architecture
├── css/
│   ├── style.css               # Design system tokens, auto-responsive grids, modal styles
│   └── weather-effects.css     # Hardware-accelerated gradients & ambient lighting
├── js/
│   ├── config.js               # Safe configuration template (Zero hardcoded secrets)
│   ├── i18n.js                 # Complete bilingual (Vietnamese / English) localization
│   ├── storage.js              # LocalStorage manager (favorites, units, custom keys)
│   ├── weatherEngine.js        # WMO code processor, astronomy math, lifestyle heuristics
│   ├── api.js                  # Multi-provider REST client (Open-Meteo, WeatherAPI, OWM, WAQI)
│   ├── canvasEffects.js        # 120 FPS GPU-accelerated atmospheric particle engine
│   ├── chartManager.js         # Interactive SVG Bezier curve & RAF scrubber engine
│   ├── ui.js                   # Reactive DOM component renderer & modal controller
│   └── app.js                  # Application state orchestrator and event dispatcher
├── server.js                   # Zero-dependency local development server
├── assets/
│   └── favicon.svg             # Vector glyph
├── .gitignore                  # VCS exclusion rules
├── LICENSE                     # MIT License
└── README.md                   # Technical documentation & API guide
```

---

## Data Providers & API Key Guide (Hướng dẫn Lấy & Cài đặt API Key)

Aetheris is engineered to run **out of the box with zero configuration** using the Open-Meteo suite. If you require specialized ground radar or commercial sensor data, you can optionally configure personal API keys.

**Security Policy:** Never commit private API keys to GitHub or public repositories. Keys should be entered directly through the in-app **API Settings Modal (Cài đặt API)** where they are stored locally and encrypted within your browser `localStorage`.

---

### 1. Open-Meteo Suite (Default / Mặc định)
* **Status:** Built-in. 100% Free. No API key required.
* **Coverage:** Global high-resolution numerical weather prediction models (ECMWF IFS, NOAA GFS, DWD ICON).
* **Endpoints:** Forecast API, Geocoding API, Air Quality API.

---

### 2. WeatherAPI.com (Optional / Tùy chọn)
* **Plan:** Free Tier (1,000,000 calls / month).
* **How to acquire:**
  1. Register an account at [https://www.weatherapi.com/signup.aspx](https://www.weatherapi.com/signup.aspx).
  2. Confirm your email and navigate to your API Dashboard.
  3. Copy your API Key.
* **How to configure:**
  - Click the **API Settings (Cài đặt API)** gear icon in the app header.
  - Select `WeatherAPI.com` as the primary provider and paste your key.
  - Click **Save Config (Lưu cấu hình)**.

---

### 3. OpenWeatherMap (Optional / Tùy chọn)
* **Plan:** Free Tier (1,000 API calls / day).
* **How to acquire:**
  1. Register an account at [https://home.openweathermap.org/users/sign_up](https://home.openweathermap.org/users/sign_up).
  2. Navigate to the **API keys** tab in your profile.
  3. Generate or copy your Default API key.
* **How to configure:**
  - Open **API Settings** in the app header.
  - Select `OpenWeatherMap` and paste your key into the designated field.
  - Click **Save Config**.

---

### 4. World Air Quality Index - WAQI (Optional / Tùy chọn)
* **Plan:** Free non-commercial token.
* **How to acquire:**
  1. Request an API token at [https://aqicn.org/data-platform/token/](https://aqicn.org/data-platform/token/).
  2. Enter your name and email to receive the token instantly.
* **How to configure:**
  - Open **API Settings** in the app.
  - Paste your token into the **WAQI Ground Station Token** input.
  - Click **Save Config**.

---

## Core Capabilities (Tính năng Nổi bật)

| Feature (English) | Tính năng (Tiếng Việt) | Technical Specification |
| :--- | :--- | :--- |
| **Bilingual Localization** | **Đa ngôn ngữ Anh - Việt** | Full runtime switching for all 30+ WMO codes, lifestyle advice, astronomy, and UI labels. |
| **Multi-Provider Engine** | **Động cơ Đa nguồn API** | Unified normalizer supporting Open-Meteo, WeatherAPI, and OpenWeatherMap with automatic fallback. |
| **Auto-Responsive Layout** | **Tự động Căn chỉnh Màn hình** | Adaptive CSS grid scaling across Ultrawide, Desktop, Tablet, and Mobile without horizontal overflow. |
| **120 FPS Canvas Engine** | **Mô phỏng Hạt Khí quyển 120 FPS** | GPU-accelerated 2D canvas with background throttling (`document.hidden`) and capped particle density. |
| **Interactive Bezier Chart** | **Biểu đồ Động 24 Giờ** | Smooth SVG Cubic Bezier interpolation with RAF-throttled hover scrubbing for Temp, Rain, and Wind. |
| **7-Day Synoptic Forecast** | **Dự báo 7 Ngày Chuyên sâu** | Min/Max daily range sliders normalized against weekly absolute extremes. |
| **8 Deep Atmospheric Metrics** | **8 Chỉ số Khí tượng Nâng cao** | UV index, rotating wind vector, humidity, dew point, US AQI, PM2.5/PM10, pressure, and visibility. |
| **Celestial Ephemeris** | **Vòng cung Mặt trời & Mặt trăng** | Real-time solar trajectory angle calculation, Golden Hour tracking, and lunar phase illumination. |
| **Lifestyle & Safety Index** | **Chỉ số Phong cách sống & Cảnh báo** | Automated ratings for running/fitness, outdoor laundry drying, outfit suggestions, and storm warnings. |

---

## Keyboard Shortcuts (Phím tắt Điều khiển)

* `/` : Focus and select search bar (Kích hoạt thanh tìm kiếm)
* `L` : Detect HTML5 GPS coordinates (Định vị tọa độ hiện tại)
* `U` : Toggle unit system Metric / Imperial (Chuyển đổi °C / °F)
* `F` : Toggle favorite location state (Thêm / Bỏ ghim địa điểm)
* `Esc` : Dismiss dropdowns and modal dialogs (Đóng cửa sổ tìm kiếm / cài đặt)

---

## Local Development (Khởi chạy Cục bộ)

Aetheris has zero build dependencies and runs directly in any modern browser.

```bash
# Using the built-in zero-dependency static server
node server.js

# Or using Python
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## License (Giấy phép)

Distributed under the open-source MIT License. See [LICENSE](LICENSE) for details.
