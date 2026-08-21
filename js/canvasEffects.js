/**
 * Aetheris Weather Hub - Atmospheric Canvas Particle Engine
 * 60 FPS GPU-accelerated atmospheric visualizer:
 * Rain, Thunderstorm with lightning flashes, Snowdrift, Starfield, and Sunbeam motes.
 */

const CanvasEffects = (() => {
  let canvas = null;
  let ctx = null;
  let animId = null;
  let currentTheme = 'clear';
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Particle storage
  let particles = [];
  let stars = [];
  let shootingStars = [];
  let lightning = { active: false, opacity: 0, timer: 0 };
  let lastFrameTime = performance.now();

  /**
   * Initialize canvas and start animation loop
   */
  function init(canvasElement) {
    canvas = canvasElement;
    if (!canvas) return;
    ctx = canvas.getContext('2d', { alpha: true });
    handleResize();

    window.addEventListener('resize', handleResize);
    startLoop();
  }

  /**
   * Handle responsive resize with pixel ratio correction
   */
  function handleResize() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    rebuildParticles();
  }

  /**
   * Switch the current weather effect
   * @param {string} themeCategory e.g. 'clear', 'rain', 'storm', 'snow', 'fog', 'night-clear', 'night-cloudy'
   */
  function setTheme(themeCategory) {
    if (currentTheme === themeCategory) return;
    currentTheme = themeCategory;
    rebuildParticles();
  }

  /**
   * Recreate particle systems based on active theme
   */
  function rebuildParticles() {
    particles = [];
    stars = [];
    shootingStars = [];
    lightning.active = false;
    lightning.opacity = 0;

    const area = (width * height) / 10000;

    // 1. Night Clear / Night Cloudy: Starfield
    if (currentTheme.startsWith('night')) {
      const starCount = Math.floor(area * 3.5);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.4 + 0.3,
          baseAlpha: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.04 + 0.01,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    // 2. Rain / Drizzle / Storm
    if (currentTheme.includes('rain') || currentTheme.includes('storm')) {
      const dropCount = currentTheme.includes('storm') ? Math.floor(area * 6) : Math.floor(area * 3.5);
      for (let i = 0; i < dropCount; i++) {
        particles.push({
          x: Math.random() * (width + 200) - 100,
          y: Math.random() * height,
          length: Math.random() * 25 + 15,
          speedY: Math.random() * 14 + 18,
          speedX: Math.random() * -3 - 2,
          thickness: Math.random() * 1.5 + 0.8,
          alpha: Math.random() * 0.4 + 0.3
        });
      }
    }

    // 3. Snow
    else if (currentTheme.includes('snow')) {
      const flakeCount = Math.floor(area * 3);
      for (let i = 0; i < flakeCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3 + 1,
          speedY: Math.random() * 1.5 + 0.8,
          speedX: Math.random() * 0.8 - 0.4,
          wobbleSpeed: Math.random() * 0.03 + 0.01,
          wobblePhase: Math.random() * Math.PI * 2,
          alpha: Math.random() * 0.6 + 0.3
        });
      }
    }

    // 4. Fog / Mist
    else if (currentTheme.includes('fog')) {
      const fogCount = Math.floor(area * 0.8);
      for (let i = 0; i < fogCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 180 + 100,
          speedX: Math.random() * 0.3 + 0.1,
          alpha: Math.random() * 0.08 + 0.03
        });
      }
    }

    // 5. Clear Day: Sunlight Ambient Dust Motes
    else if (currentTheme === 'clear') {
      const moteCount = Math.floor(area * 1.2);
      for (let i = 0; i < moteCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 0.8,
          speedY: (Math.random() - 0.5) * 0.4,
          speedX: (Math.random() - 0.5) * 0.4,
          baseAlpha: Math.random() * 0.4 + 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
  }

  /**
   * Main Render Loop
   */
  function startLoop() {
    function frame(now) {
      const delta = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      render(delta);
      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);
  }

  function render(delta) {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Starfield
    if (stars.length > 0) {
      for (let star of stars) {
        star.phase += star.twinkleSpeed;
        const currentAlpha = star.baseAlpha + Math.sin(star.phase) * 0.25;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, currentAlpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Random Shooting Stars
      if (Math.random() < 0.008 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          len: Math.random() * 120 + 80,
          speed: Math.random() * 12 + 15,
          alpha: 1,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1)
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.025;

        if (s.alpha <= 0 || s.x > width || s.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.len;
        const tailY = s.y - Math.sin(s.angle) * s.len;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
    }

    // 2. Draw Rain / Storm
    if (currentTheme.includes('rain') || currentTheme.includes('storm')) {
      ctx.strokeStyle = currentTheme.includes('storm') ? 'rgba(186, 230, 253, 0.65)' : 'rgba(224, 242, 254, 0.45)';
      ctx.lineCap = 'round';

      for (let drop of particles) {
        drop.x += drop.speedX;
        drop.y += drop.speedY;

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * (width + 200) - 100;
        }

        ctx.lineWidth = drop.thickness;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.speedX * 1.5, drop.y + drop.length);
        ctx.stroke();
      }

      // Lightning Thunder Flash
      if (currentTheme.includes('storm')) {
        lightning.timer += delta;
        if (!lightning.active && Math.random() < 0.007 && lightning.timer > 3) {
          lightning.active = true;
          lightning.opacity = Math.random() * 0.5 + 0.35;
          lightning.timer = 0;
        }

        if (lightning.active) {
          ctx.fillStyle = `rgba(255, 255, 255, ${lightning.opacity})`;
          ctx.fillRect(0, 0, width, height);
          lightning.opacity -= 0.05;
          if (lightning.opacity <= 0) {
            lightning.active = false;
          }
        }
      }
    }

    // 3. Draw Snow
    else if (currentTheme.includes('snow')) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      for (let flake of particles) {
        flake.wobblePhase += flake.wobbleSpeed;
        flake.x += flake.speedX + Math.sin(flake.wobblePhase) * 0.8;
        flake.y += flake.speedY;

        if (flake.y > height) {
          flake.y = -flake.radius * 2;
          flake.x = Math.random() * width;
        }
        if (flake.x > width) flake.x = 0;
        if (flake.x < 0) flake.x = width;

        ctx.globalAlpha = flake.alpha;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    }

    // 4. Draw Fog / Mist
    else if (currentTheme.includes('fog')) {
      for (let fog of particles) {
        fog.x += fog.speedX;
        if (fog.x - fog.radius > width) {
          fog.x = -fog.radius;
        }

        const grad = ctx.createRadialGradient(fog.x, fog.y, 0, fog.x, fog.y, fog.radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${fog.alpha})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 5. Draw Clear Day Sun Motes
    else if (currentTheme === 'clear') {
      for (let mote of particles) {
        mote.phase += mote.twinkleSpeed;
        mote.x += mote.speedX;
        mote.y += mote.speedY;

        if (mote.x < 0) mote.x = width;
        if (mote.x > width) mote.x = 0;
        if (mote.y < 0) mote.y = height;
        if (mote.y > height) mote.y = 0;

        const alpha = mote.baseAlpha + Math.sin(mote.phase) * 0.15;
        ctx.fillStyle = `rgba(253, 224, 71, ${Math.max(0.05, alpha)})`;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  return {
    init,
    setTheme
  };
})();
