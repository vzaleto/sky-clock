

export class SkyRenderer {

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scene = {
      timePhase: 'night',
      weather: 'clear',
      terrain: 'plain',
      visibility: 10,
      wind: 5,
    };
    this.resize();
    this.clouds = [];
    this.drops = [];
    this.fog = [];
    this.stars = [];

   
    window.addEventListener('resize', () => this.resize());
    this.configureParticles();
    requestAnimationFrame(() => this.draw());
  }
  // ------ Перлин-шум ------

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth; // не трогать эту строчку
    this.height = window.innerHeight; // не трогать эту строчку
    this.canvas.style.width = window.innerWidth + "px"; // не трогать эту строчку
    this.canvas.style.height = window.innerHeight + "px"; // не трогать эту строчку
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
  
    this.ctx.scale(dpr, dpr);
  }
 
  setScene(partial) {
    this.scene = { ...this.scene, ...partial };
    this.configureParticles();
  }

  configureParticles() {
    const { weather, timePhase, wind } = this.scene;
    this.clouds = this.makeClouds(weather);
    this.drops = this.makeRain(weather);
    this.fog = this.makeFog(weather);
    this.stars = this.makeStars(timePhase);
    this.waveOffset = 0;
    this.windFactor = wind / 10;
  }

  makeClouds(weather) {
    const count = weather === 'clear' ? 3 : weather === 'overcast' ? 18 : 10;
    return Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * (this.height * 0.5),
      width: 120 + Math.random() * 220,
      height: 40 + Math.random() * 30,
      speed: 0.2 + Math.random() * 0.4,
      opacity: weather === 'overcast' ? 0.6 : 0.35 + Math.random() * 0.3,
    }));
  }

  makeRain(weather) {
    if (!['rain', 'drizzle', 'storm'].includes(weather)) return [];
    const intensity = weather === 'storm' ? 400 : weather === 'rain' ? 250 : 150;
    return Array.from({ length: intensity }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      length: 8 + Math.random() * 14,
      speed: 3 + Math.random() * 4,
    }));
  }

  makeFog(weather) {
    if (!['fog', 'overcast', 'drizzle'].includes(weather)) return [];
    const layers = 4;
    return Array.from({ length: layers }, (_, i) => ({
      y: this.height * (0.4 + i * 0.1),
      opacity: 0.05 + i * 0.08,
      drift: Math.random() * 0.3,
      offset: Math.random() * 200,
    }));
  }

  makeStars(phase) {
    if (phase === 'day') return [];
    const count = phase === 'night' ? 200 : 40;
    return Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * (this.height * 0.7),
      size: Math.random() * 1.5,
      twinkle: Math.random(),
    }));
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    this.paintBackground(ctx);
    this.paintTerrain(ctx);
    this.paintStars(ctx);
    this.paintSunOrMoon(ctx);
    this.paintRain(ctx);
    this.paintFog(ctx);
    this.waveOffset = (this.waveOffset + 0.005 + this.windFactor * 0.0005) % (Math.PI * 2);
    requestAnimationFrame(() => this.draw());
  }

  palette() {
    const { timePhase, weather } = this.scene;
    const base = {
      night: ['#040716', '#0b1a3d'],
      dawn: ['#2b2f59', '#ff8a6c'],
      day: ['#4e9adf', '#8fd3ff'],
      dusk: ['#1a1f3d', '#ff6f73'],
    };
    const fogOverlay = weather === 'fog' ? '#aeb8c9' : null;
    return { colors: base[timePhase] || base.day, fogOverlay };
  }

  paintBackground(ctx) {
    const { colors } = this.palette();
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  paintSunOrMoon(ctx) {
    const { timePhase } = this.scene;
    const isNight = timePhase === 'night';
    const y = this.height * (isNight ? 0.2 : 0.3);
    const x = this.width * 0.75;
    const radius = isNight ? 40 : 60;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, isNight ? '#f0f6ff' : '#ffe8a0');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }


  
  paintRain(ctx) {
    if (!this.drops.length) return;
    ctx.strokeStyle = 'rgba(173, 216, 255, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    this.drops.forEach((drop) => {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 2, drop.y + drop.length);
      ctx.stroke();
      drop.x += this.windFactor * 0.8;
      drop.y += drop.speed;
      if (drop.y > this.height) {
        drop.y = -10;
        drop.x = Math.random() * this.width;
      }
    });
  }

  paintFog(ctx) {
    if (!this.fog.length) return;
    this.fog.forEach((layer) => {
      ctx.fillStyle = `rgba(200, 220, 255, ${layer.opacity})`;
      ctx.beginPath();
      ctx.rect(-200 + layer.offset, layer.y, this.width + 400, this.height * 0.2);
      ctx.fill();
      layer.offset = (layer.offset + layer.drift + this.windFactor * 0.1) % 200;
    });
  }

  paintStars(ctx) {
    if (!this.stars.length) return;
    ctx.fillStyle = '#ffffff';
    this.stars.forEach((star) => {
      const twinkle = 0.3 + Math.sin(performance.now() * 0.001 + star.twinkle) * 0.3;
      ctx.globalAlpha = twinkle;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  paintTerrain(ctx) {
    const { terrain, timePhase } = this.scene;
    ctx.save();
    if (terrain === 'sea') {
      const gradient = ctx.createLinearGradient(0, this.height * 0.7, 0, this.height);
      gradient.addColorStop(0, '#1c3a6d');
      gradient.addColorStop(1, '#0b1e3f');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, this.height * 0.8);
      for (let x = 0; x <= this.width; x += 10) {
        const y = this.height * 0.82 + Math.sin(this.waveOffset + x * 0.01) * 6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(0, this.height);
      ctx.closePath();
      ctx.fill();
    } else if (terrain === 'mountain') {
      const colors = timePhase === 'night' ? ['#1a1c2c', '#0b0d18'] : ['#3c3f5a', '#1f2236'];
      const gradient = ctx.createLinearGradient(0, this.height * 0.4, 0, this.height);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, this.height);
      ctx.lineTo(this.width * 0.25, this.height * 0.55);
      ctx.lineTo(this.width * 0.5, this.height * 0.8);
      ctx.lineTo(this.width * 0.75, this.height * 0.45);
      ctx.lineTo(this.width, this.height);
      ctx.closePath();
      ctx.fill();
    } else {
      const gradient = ctx.createLinearGradient(0, this.height * 0.6, 0, this.height);
      gradient.addColorStop(0, '#1f402f');
      gradient.addColorStop(1, '#0f2016');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, this.height);
      ctx.quadraticCurveTo(this.width * 0.3, this.height * 0.65, this.width * 0.6, this.height * 0.85);
      ctx.lineTo(this.width, this.height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

