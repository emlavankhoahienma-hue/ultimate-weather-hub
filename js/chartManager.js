/**
 * Aetheris Weather Hub - High-Performance Interactive Chart Engine
 * 120 FPS Bezier Curves, Precipitation Bars, and RAF-throttled hover scrubber.
 */

const ChartManager = (() => {
  let container = null;
  let currentHourlyData = null;
  let currentUnit = 'metric';
  let activeMetric = 'temp'; // 'temp' | 'precip' | 'wind'

  function init(containerElement) {
    container = containerElement;
  }

  function setMetric(metric) {
    if (activeMetric === metric) return;
    activeMetric = metric;
    render();
  }

  function update(hourlyData, unit = 'metric') {
    currentHourlyData = hourlyData;
    currentUnit = unit;
    render();
  }

  function render() {
    if (!container || !currentHourlyData) return;

    // Extract next 24 hours
    const times = currentHourlyData.time.slice(0, 24);
    const temps = currentHourlyData.temperature_2m.slice(0, 24);
    const feelsLike = currentHourlyData.apparent_temperature.slice(0, 24);
    const precips = currentHourlyData.precipitation_probability.slice(0, 24);
    const rainAmounts = (currentHourlyData.precipitation || []).slice(0, 24);
    const winds = currentHourlyData.wind_speed_10m.slice(0, 24);
    const gusts = currentHourlyData.wind_gusts_10m ? currentHourlyData.wind_gusts_10m.slice(0, 24) : winds;
    const codes = currentHourlyData.weather_code.slice(0, 24);
    const isDays = currentHourlyData.is_day.slice(0, 24);

    const width = container.clientWidth || 700;
    const height = 190;
    const padding = { top: 25, right: 15, bottom: 35, left: 25 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    let displayValues = [];
    let secondaryValues = [];
    let unitLabel = '°C';
    let minY = 0;
    let maxY = 100;

    if (activeMetric === 'temp') {
      displayValues = temps.map(t => currentUnit === 'imperial' ? (t * 9) / 5 + 32 : t);
      secondaryValues = feelsLike.map(t => currentUnit === 'imperial' ? (t * 9) / 5 + 32 : t);
      unitLabel = currentUnit === 'imperial' ? '°F' : '°C';
      minY = Math.min(...displayValues, ...secondaryValues) - 2;
      maxY = Math.max(...displayValues, ...secondaryValues) + 2;
    } else if (activeMetric === 'precip') {
      displayValues = precips;
      secondaryValues = rainAmounts;
      unitLabel = '%';
      minY = 0;
      maxY = 100;
    } else if (activeMetric === 'wind') {
      displayValues = winds.map(w => currentUnit === 'imperial' ? w * 0.621371 : w);
      secondaryValues = gusts.map(g => currentUnit === 'imperial' ? g * 0.621371 : g);
      unitLabel = currentUnit === 'imperial' ? 'mph' : 'km/h';
      minY = 0;
      maxY = Math.max(20, ...secondaryValues) + 5;
    }

    const yRange = Math.max(maxY - minY, 1);
    const stepX = chartW / (displayValues.length - 1);

    const points = displayValues.map((val, i) => ({
      x: padding.left + i * stepX,
      y: padding.top + chartH - ((val - minY) / yRange) * chartH,
      val: Math.round(val),
      time: times[i],
      secVal: secondaryValues[i] !== undefined ? Math.round(secondaryValues[i]) : null,
      code: codes[i],
      isDay: isDays[i],
      precip: precips[i]
    }));

    function createSmoothPath(pts) {
      if (pts.length < 2) return '';
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? i : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      return d;
    }

    const linePath = createSmoothPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

    let strokeColor = '#38bdf8';
    let gradColorStart = 'rgba(56, 189, 248, 0.35)';
    let gradColorEnd = 'rgba(56, 189, 248, 0.0)';

    if (activeMetric === 'precip') {
      strokeColor = '#06b6d4';
      gradColorStart = 'rgba(6, 182, 212, 0.35)';
      gradColorEnd = 'rgba(6, 182, 212, 0.0)';
    } else if (activeMetric === 'wind') {
      strokeColor = '#a855f7';
      gradColorStart = 'rgba(168, 85, 247, 0.35)';
      gradColorEnd = 'rgba(168, 85, 247, 0.0)';
    }

    let svgHtml = `
      <svg class="weather-chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width: 100%; height: ${height}px; display: block;">
        <defs>
          <linearGradient id="chartFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${gradColorStart}"/>
            <stop offset="100%" stop-color="${gradColorEnd}"/>
          </linearGradient>
        </defs>

        <!-- Horizontal Guide Lines -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3"/>
        <line x1="${padding.left}" y1="${padding.top + chartH / 2}" x2="${width - padding.right}" y2="${padding.top + chartH / 2}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3"/>
        <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="rgba(255,255,255,0.12)"/>

        <!-- Area Fill -->
        <path d="${areaPath}" fill="url(#chartFillGrad)"/>

        <!-- Main Curve -->
        <path d="${linePath}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round"/>
    `;

    points.forEach((p, idx) => {
      const timeObj = new Date(p.time);
      const hourStr = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const showLabel = idx % 3 === 0 || idx === 0 || idx === points.length - 1;

      if (showLabel) {
        svgHtml += `
          <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${strokeColor}" stroke="#0f172a" stroke-width="1.5"/>
          <text x="${p.x}" y="${p.y - 8}" text-anchor="middle" fill="#f8fafc" font-size="10" font-weight="600">${p.val}${unitLabel}</text>
          <text x="${p.x}" y="${height - 12}" text-anchor="middle" fill="#94a3b8" font-size="10">${hourStr}</text>
        `;
      }
    });

    svgHtml += `
        <line id="scrubLine" x1="0" y1="${padding.top}" x2="0" y2="${height - padding.bottom}" stroke="rgba(255,255,255,0.3)" stroke-dasharray="2" style="display: none;"/>
        <circle id="scrubPoint" cx="0" cy="0" r="5" fill="#38bdf8" stroke="#ffffff" stroke-width="2" style="display: none;"/>
      </svg>
      <div id="chartTooltip" class="chart-tooltip" style="display: none;"></div>
    `;

    container.innerHTML = svgHtml;
    attachScrubberEvents(points, width, height, padding, unitLabel);
  }

  function attachScrubberEvents(points, width, height, padding, unitLabel) {
    const svg = container.querySelector('.weather-chart-svg');
    const scrubLine = container.querySelector('#scrubLine');
    const scrubPoint = container.querySelector('#scrubPoint');
    const tooltip = container.querySelector('#chartTooltip');

    if (!svg || !scrubLine || !scrubPoint || !tooltip) return;

    let rafId = null;

    function handleScrub(clientX) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = svg.getBoundingClientRect();
        const scaleX = width / rect.width;
        const svgX = (clientX - rect.left) * scaleX;

        let closest = points[0];
        let minDistance = Infinity;

        for (let i = 0; i < points.length; i++) {
          const dist = Math.abs(points[i].x - svgX);
          if (dist < minDistance) {
            minDistance = dist;
            closest = points[i];
          }
        }

        if (!closest) return;

        scrubLine.setAttribute('x1', closest.x);
        scrubLine.setAttribute('x2', closest.x);
        scrubLine.style.display = 'block';

        scrubPoint.setAttribute('cx', closest.x);
        scrubPoint.setAttribute('cy', closest.y);
        scrubPoint.style.display = 'block';

        const timeObj = new Date(closest.time);
        const timeFormatted = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const weatherInfo = WeatherEngine.getWeatherInfo(closest.code, closest.isDay);

        let tooltipDetails = '';
        if (activeMetric === 'temp') {
          tooltipDetails = `
            <div class="tooltip-main">${closest.val}${unitLabel}</div>
            <div class="tooltip-sub">Feels like: ${closest.secVal}${unitLabel}</div>
            <div class="tooltip-sub">Rain: ${closest.precip}%</div>
          `;
        } else if (activeMetric === 'precip') {
          tooltipDetails = `
            <div class="tooltip-main">${closest.val}% Rain</div>
            <div class="tooltip-sub">Precip: ${closest.secVal} mm</div>
          `;
        } else if (activeMetric === 'wind') {
          tooltipDetails = `
            <div class="tooltip-main">${closest.val} ${unitLabel}</div>
            <div class="tooltip-sub">Gusts: ${closest.secVal} ${unitLabel}</div>
          `;
        }

        tooltip.innerHTML = `
          <div class="tooltip-header">
            <span>${timeFormatted}</span>
            <span class="tooltip-cond">${weatherInfo.label}</span>
          </div>
          ${tooltipDetails}
        `;

        const screenX = (closest.x / width) * rect.width;
        const screenY = (closest.y / height) * rect.height;

        tooltip.style.display = 'block';
        let left = screenX - tooltip.offsetWidth / 2;
        left = Math.max(6, Math.min(rect.width - tooltip.offsetWidth - 6, left));
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${Math.max(6, screenY - tooltip.offsetHeight - 10)}px`;
      });
    }

    svg.addEventListener('mousemove', (e) => handleScrub(e.clientX), { passive: true });
    svg.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleScrub(e.touches[0].clientX);
      }
    }, { passive: true });

    const hideScrubber = () => {
      if (rafId) cancelAnimationFrame(rafId);
      scrubLine.style.display = 'none';
      scrubPoint.style.display = 'none';
      tooltip.style.display = 'none';
    };

    svg.addEventListener('mouseleave', hideScrubber);
    svg.addEventListener('touchend', hideScrubber);
  }

  return {
    init,
    update,
    setMetric
  };
})();
