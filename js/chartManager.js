/**
 * Aetheris Weather Hub - Interactive Chart Engine
 * High-performance SVG & Canvas weather visualizer:
 * Smooth cubic Bezier temperature curves, precipitation bars, wind vectors,
 * and mouse/touch hover scrubbers with real-time tooltips.
 */

const ChartManager = (() => {
  let container = null;
  let currentHourlyData = null;
  let currentUnit = 'metric';
  let activeMetric = 'temp'; // 'temp' | 'precip' | 'wind'

  /**
   * Initialize Chart Manager
   */
  function init(containerElement) {
    container = containerElement;
  }

  /**
   * Set active metric mode
   */
  function setMetric(metric) {
    if (activeMetric === metric) return;
    activeMetric = metric;
    render();
  }

  /**
   * Update data and re-render
   */
  function update(hourlyData, unit = 'metric') {
    currentHourlyData = hourlyData;
    currentUnit = unit;
    render();
  }

  /**
   * Render Chart inside container
   */
  function render() {
    if (!container || !currentHourlyData) return;

    // Extract next 24 hours of data
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
    const height = 220;
    const padding = { top: 30, right: 20, bottom: 40, left: 30 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Convert values if imperial
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

    // Compute coordinate points
    const points = displayValues.map((val, i) => ({
      x: padding.left + i * stepX,
      y: padding.top + chartH - ((val - minY) / yRange) * chartH,
      val: Math.round(val),
      rawVal: val,
      time: times[i],
      secVal: secondaryValues[i] !== undefined ? Math.round(secondaryValues[i]) : null,
      code: codes[i],
      isDay: isDays[i],
      precip: precips[i]
    }));

    // Build Bezier Curve path
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

    // SVG Gradient and styling definitions
    let strokeColor = '#38bdf8';
    let gradColorStart = 'rgba(56, 189, 248, 0.4)';
    let gradColorEnd = 'rgba(56, 189, 248, 0.0)';

    if (activeMetric === 'precip') {
      strokeColor = '#06b6d4';
      gradColorStart = 'rgba(6, 182, 212, 0.4)';
      gradColorEnd = 'rgba(6, 182, 212, 0.0)';
    } else if (activeMetric === 'wind') {
      strokeColor = '#a855f7';
      gradColorStart = 'rgba(168, 85, 247, 0.4)';
      gradColorEnd = 'rgba(168, 85, 247, 0.0)';
    }

    // Build SVG Elements
    let svgHtml = `
      <svg class="weather-chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width: 100%; height: ${height}px; display: block;">
        <defs>
          <linearGradient id="chartFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${gradColorStart}"/>
            <stop offset="100%" stop-color="${gradColorEnd}"/>
          </linearGradient>
          <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Horizontal Guide Lines -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="4"/>
        <line x1="${padding.left}" y1="${padding.top + chartH / 2}" x2="${width - padding.right}" y2="${padding.top + chartH / 2}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="4"/>
        <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="rgba(255,255,255,0.15)"/>

        <!-- Area Fill -->
        <path d="${areaPath}" fill="url(#chartFillGrad)"/>

        <!-- Main Curve -->
        <path d="${linePath}" fill="none" stroke="${strokeColor}" stroke-width="3" filter="url(#chartGlow)" stroke-linecap="round"/>

        <!-- Data Points & Labels for Every 3 Hours -->
    `;

    points.forEach((p, idx) => {
      const timeObj = new Date(p.time);
      const hourStr = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const showLabel = idx % 3 === 0 || idx === 0 || idx === points.length - 1;

      if (showLabel) {
        svgHtml += `
          <circle cx="${p.x}" cy="${p.y}" r="4" fill="${strokeColor}" stroke="#0f172a" stroke-width="2"/>
          <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="600">${p.val}${unitLabel}</text>
          <text x="${p.x}" y="${height - 15}" text-anchor="middle" fill="#94a3b8" font-size="11">${hourStr}</text>
        `;
      }
    });

    // Interactive Scrubber Elements (Hidden by default, shown on mousemove)
    svgHtml += `
        <line id="scrubLine" x1="0" y1="${padding.top}" x2="0" y2="${height - padding.bottom}" stroke="rgba(255,255,255,0.4)" stroke-dasharray="3" style="display: none;"/>
        <circle id="scrubPoint" cx="0" cy="0" r="6" fill="#38bdf8" stroke="#ffffff" stroke-width="2.5" style="display: none;"/>
      </svg>
      <div id="chartTooltip" class="chart-tooltip" style="display: none;"></div>
    `;

    container.innerHTML = svgHtml;
    attachScrubberEvents(points, width, height, padding, unitLabel);
  }

  /**
   * Attach mouse/touch scrubber listeners
   */
  function attachScrubberEvents(points, width, height, padding, unitLabel) {
    const svg = container.querySelector('.weather-chart-svg');
    const scrubLine = container.querySelector('#scrubLine');
    const scrubPoint = container.querySelector('#scrubPoint');
    const tooltip = container.querySelector('#chartTooltip');

    if (!svg || !scrubLine || !scrubPoint || !tooltip) return;

    function handleScrub(clientX) {
      const rect = svg.getBoundingClientRect();
      const scaleX = width / rect.width;
      const svgX = (clientX - rect.left) * scaleX;

      // Find closest point
      let closest = points[0];
      let minDistance = Infinity;

      for (let p of points) {
        const dist = Math.abs(p.x - svgX);
        if (dist < minDistance) {
          minDistance = dist;
          closest = p;
        }
      }

      if (!closest) return;

      // Update scrub line and point
      scrubLine.setAttribute('x1', closest.x);
      scrubLine.setAttribute('x2', closest.x);
      scrubLine.style.display = 'block';

      scrubPoint.setAttribute('cx', closest.x);
      scrubPoint.setAttribute('cy', closest.y);
      scrubPoint.style.display = 'block';

      // Update tooltip
      const timeObj = new Date(closest.time);
      const timeFormatted = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const weatherInfo = WeatherEngine.getWeatherInfo(closest.code, closest.isDay);

      let tooltipDetails = '';
      if (activeMetric === 'temp') {
        tooltipDetails = `
          <div class="tooltip-main">${closest.val}${unitLabel}</div>
          <div class="tooltip-sub">Feels like: ${closest.secVal}${unitLabel}</div>
          <div class="tooltip-sub">Rain chance: ${closest.precip}%</div>
        `;
      } else if (activeMetric === 'precip') {
        tooltipDetails = `
          <div class="tooltip-main">${closest.val}% Rain Chance</div>
          <div class="tooltip-sub">Precipitation: ${closest.secVal} mm</div>
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

      // Position tooltip safely within bounds
      const screenX = (closest.x / width) * rect.width;
      const screenY = (closest.y / height) * rect.height;

      tooltip.style.display = 'block';
      let left = screenX - tooltip.offsetWidth / 2;
      left = Math.max(10, Math.min(rect.width - tooltip.offsetWidth - 10, left));
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${Math.max(10, screenY - tooltip.offsetHeight - 15)}px`;
    }

    svg.addEventListener('mousemove', (e) => handleScrub(e.clientX));
    svg.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleScrub(e.touches[0].clientX);
      }
    }, { passive: true });

    const hideScrubber = () => {
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
