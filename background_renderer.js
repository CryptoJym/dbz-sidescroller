// ============================================================================
// ENHANCED BACKGROUND RENDERER - Multi-layer parallax with weather effects
// ============================================================================

class BackgroundRenderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    // Particle systems
    this.particles = {
      dust: [],
      debris: [],
      stars: [],
      energy: [],
      birds: []
    };

    // Animation timers
    this.time = 0;
    this.cloudOffset = 0;
    this.grassSway = 0;
    this.sunsAngle = 0;

    // Floating rocks for Namek
    this.floatingRocks = [];
    this.initFloatingRocks();

    // Torch flicker data
    this.torches = [];
    this.initTorches();

    // Crowd animation
    this.crowdWaveOffset = 0;

    this.initParticles();
  }

  initParticles() {
    // Initialize dust particles
    for (let i = 0; i < 30; i++) {
      this.particles.dust.push({
        x: Math.random() * this.canvas.width * 2,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    // Initialize debris particles
    for (let i = 0; i < 15; i++) {
      this.particles.debris.push({
        x: Math.random() * this.canvas.width * 2,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.4 + 0.2
      });
    }

    // Initialize shooting stars for Namek
    for (let i = 0; i < 3; i++) {
      this.particles.stars.push({
        x: Math.random() * this.canvas.width * 3,
        y: Math.random() * this.canvas.height * 0.3,
        speed: Math.random() * 4 + 3,
        length: Math.random() * 30 + 20,
        opacity: 0,
        active: false,
        cooldown: Math.random() * 300 + 200
      });
    }

    // Initialize energy crackles
    for (let i = 0; i < 20; i++) {
      this.particles.energy.push({
        x: Math.random() * this.canvas.width * 2,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1,
        life: Math.random() * 60 + 30,
        maxLife: 60,
        color: Math.random() > 0.5 ? '#ffff00' : '#00ffff'
      });
    }

    // Initialize birds for Tournament
    for (let i = 0; i < 5; i++) {
      this.particles.birds.push({
        x: Math.random() * this.canvas.width * 2 - this.canvas.width,
        y: Math.random() * this.canvas.height * 0.4 + 50,
        speed: Math.random() * 1.5 + 1,
        wingPhase: Math.random() * Math.PI * 2,
        height: Math.random() * 20 + 10
      });
    }
  }

  initFloatingRocks() {
    for (let i = 0; i < 8; i++) {
      this.floatingRocks.push({
        x: Math.random() * this.canvas.width * 2,
        y: Math.random() * this.canvas.height * 0.6 + this.canvas.height * 0.2,
        size: Math.random() * 40 + 20,
        floatSpeed: Math.random() * 0.3 + 0.2,
        floatOffset: Math.random() * Math.PI * 2,
        parallax: 0.4
      });
    }
  }

  initTorches() {
    const positions = [200, 400, 600, 800, 1000, 1200, 1400];
    positions.forEach(x => {
      this.torches.push({
        x: x,
        y: this.canvas.height - 150,
        flicker: Math.random(),
        phase: Math.random() * Math.PI * 2
      });
    });
  }

  draw(camX, levelData) {
    this.time++;
    this.cloudOffset += 0.2;
    this.grassSway = Math.sin(this.time * 0.02) * 2;
    this.sunsAngle += 0.0002;
    this.crowdWaveOffset += 0.05;

    const level = levelData.theme || 'namek';

    // Layer 1: Sky gradient
    this.drawSkyGradient(level);

    // Layer 2: Celestial objects
    this.drawCelestialObjects(camX, level);

    // Layer 3: Far mountains/structures
    this.drawFarMountains(camX, level);

    // Layer 4: Mid-ground elements
    this.drawMidGround(camX, level);

    // Layer 5: Near environmental details
    this.drawNearEnvironment(camX, level);

    // Weather and atmospheric effects
    this.drawAtmosphericEffects(camX, level, levelData.bossActive);

    // Layer 6: Ground
    this.drawGround(camX, level);
  }

  drawSkyGradient(level) {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);

    if (level === 'namek') {
      gradient.addColorStop(0, '#7EC850');
      gradient.addColorStop(0.5, '#A8D884');
      gradient.addColorStop(1, '#C8E8A8');
    } else if (level === 'cellGames') {
      gradient.addColorStop(0, '#FF6B35');
      gradient.addColorStop(0.4, '#F7931E');
      gradient.addColorStop(0.7, '#FDC830');
      gradient.addColorStop(1, '#F37335');
    } else { // tournament
      gradient.addColorStop(0, '#4A90E2');
      gradient.addColorStop(0.6, '#87CEEB');
      gradient.addColorStop(1, '#B0E0E6');
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCelestialObjects(camX, level) {
    if (level === 'namek') {
      // Three suns of Namek
      const sunPositions = [
        { x: 150, y: 80, size: 40, color: '#FFEB3B' },
        { x: 350, y: 120, size: 35, color: '#FFF176' },
        { x: 520, y: 90, size: 38, color: '#FFD54F' }
      ];

      sunPositions.forEach((sun, i) => {
        const offset = Math.sin(this.sunsAngle + i * Math.PI / 3) * 10;
        const x = sun.x - camX * 0.05 + offset;
        const y = sun.y + Math.cos(this.sunsAngle + i * Math.PI / 3) * 5;

        // Sun glow
        const glow = this.ctx.createRadialGradient(x, y, 0, x, y, sun.size * 1.5);
        glow.addColorStop(0, sun.color);
        glow.addColorStop(0.5, `${sun.color}80`);
        glow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glow;
        this.ctx.fillRect(x - sun.size * 1.5, y - sun.size * 1.5, sun.size * 3, sun.size * 3);

        // Sun core
        this.ctx.fillStyle = sun.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, sun.size, 0, Math.PI * 2);
        this.ctx.fill();
      });

      // Distant planet
      this.ctx.fillStyle = '#6B8E9D';
      this.ctx.globalAlpha = 0.6;
      this.ctx.beginPath();
      this.ctx.arc(600 - camX * 0.03, 150, 60, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1;

      // Shooting stars
      this.updateShootingStars(camX);

    } else if (level === 'cellGames') {
      // Dramatic clouds
      this.drawClouds(camX, 0.08, '#FFA07A', 0.4);
      this.drawClouds(camX + 100, 0.12, '#FF7F50', 0.3);

      // Birds in distance
      this.updateBirds(camX);

    } else { // tournament
      // Stadium lights in distance
      for (let i = 0; i < 4; i++) {
        const x = 200 + i * 300 - camX * 0.1;
        this.ctx.fillStyle = '#FFE082';
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillRect(x - 10, 50, 20, 80);
        this.ctx.globalAlpha = 1;

        // Light glow
        const glow = this.ctx.createRadialGradient(x, 60, 0, x, 60, 40);
        glow.addColorStop(0, '#FFEB3B');
        glow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glow;
        this.ctx.fillRect(x - 40, 20, 80, 80);
      }

      // Fluffy clouds
      this.drawClouds(camX, 0.1, '#FFFFFF', 0.7);
      this.drawClouds(camX + 150, 0.15, '#F0F0F0', 0.5);
    }
  }

  drawClouds(camX, parallax, color, alpha) {
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = alpha;

    for (let i = 0; i < 6; i++) {
      const x = (i * 250 + this.cloudOffset - camX * parallax) % (this.canvas.width + 200) - 100;
      const y = 80 + Math.sin(i * 2) * 40;

      this.ctx.beginPath();
      this.ctx.arc(x, y, 40, 0, Math.PI * 2);
      this.ctx.arc(x + 30, y - 10, 35, 0, Math.PI * 2);
      this.ctx.arc(x + 60, y, 40, 0, Math.PI * 2);
      this.ctx.arc(x + 30, y + 10, 30, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  drawFarMountains(camX, level) {
    if (level === 'namek') {
      // Namekian mountains with green tint
      this.ctx.fillStyle = '#5A9E3F';
      this.ctx.globalAlpha = 0.4;

      for (let i = 0; i < 8; i++) {
        const x = i * 200 - camX * 0.15;
        const height = 150 + Math.sin(i * 0.5) * 50;
        this.drawMountainPeak(x, this.canvas.height - height, 120, height);
      }
      this.ctx.globalAlpha = 1;

    } else if (level === 'cellGames') {
      // Jagged destroyed mountains
      this.ctx.fillStyle = '#8B4513';
      this.ctx.globalAlpha = 0.5;

      for (let i = 0; i < 7; i++) {
        const x = i * 220 - camX * 0.2;
        const height = 180 + Math.sin(i * 0.7) * 60;
        this.drawJaggedMountain(x, this.canvas.height - height, 140, height);
      }
      this.ctx.globalAlpha = 1;

    } else { // tournament
      // Stadium structure silhouette
      this.ctx.fillStyle = '#9E9E9E';
      this.ctx.globalAlpha = 0.3;
      this.ctx.fillRect(-camX * 0.15, this.canvas.height - 200, this.canvas.width + 400, 50);

      // Arches
      for (let i = 0; i < 6; i++) {
        const x = i * 180 - camX * 0.15;
        this.ctx.beginPath();
        this.ctx.arc(x + 90, this.canvas.height - 150, 60, Math.PI, 0);
        this.ctx.fill();
      }
      this.ctx.globalAlpha = 1;
    }
  }

  drawMountainPeak(x, y, width, height) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + height);
    this.ctx.lineTo(x + width / 2, y);
    this.ctx.lineTo(x + width, y + height);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawJaggedMountain(x, y, width, height) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + height);

    const segments = 8;
    for (let i = 0; i <= segments; i++) {
      const px = x + (width / segments) * i;
      const py = y + height - (height * Math.abs(Math.sin((i / segments) * Math.PI))) - Math.random() * 20;
      this.ctx.lineTo(px, py);
    }

    this.ctx.lineTo(x + width, y + height);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawMidGround(camX, level) {
    if (level === 'namek') {
      // Namekian houses
      this.ctx.fillStyle = '#8FBC8F';
      for (let i = 0; i < 5; i++) {
        const x = 300 + i * 400 - camX * 0.3;
        const y = this.canvas.height - 220;

        // House base
        this.ctx.globalAlpha = 0.6;
        this.ctx.fillRect(x, y, 60, 80);

        // Dome roof
        this.ctx.beginPath();
        this.ctx.arc(x + 30, y, 35, Math.PI, 0);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }

      // Dragon Balls glowing in background
      const dragonBallPos = [
        { x: 500, y: this.canvas.height - 180 },
        { x: 1200, y: this.canvas.height - 200 },
        { x: 1800, y: this.canvas.height - 190 }
      ];

      dragonBallPos.forEach((pos, i) => {
        const x = pos.x - camX * 0.35;
        const glow = this.ctx.createRadialGradient(x, pos.y, 0, x, pos.y, 20);
        glow.addColorStop(0, '#FFA500');
        glow.addColorStop(0.5, '#FF8C00' + Math.floor(128 + Math.sin(this.time * 0.05 + i) * 127).toString(16).padStart(2, '0'));
        glow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glow;
        this.ctx.fillRect(x - 20, pos.y - 20, 40, 40);
      });

    } else if (level === 'cellGames') {
      // Destroyed terrain and craters
      this.ctx.fillStyle = '#654321';
      this.ctx.globalAlpha = 0.5;

      for (let i = 0; i < 6; i++) {
        const x = i * 350 - camX * 0.4;
        const y = this.canvas.height - 150;

        // Crater
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 80, 30, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Broken rocks
        for (let j = 0; j < 3; j++) {
          const rx = x + (Math.random() - 0.5) * 100;
          const ry = y - Math.random() * 40;
          const size = Math.random() * 20 + 10;
          this.ctx.fillRect(rx, ry, size, size * 1.5);
        }
      }
      this.ctx.globalAlpha = 1;

    } else { // tournament
      // Crowd silhouettes
      this.ctx.fillStyle = '#424242';

      for (let row = 0; row < 3; row++) {
        const y = this.canvas.height - 250 + row * 30;
        this.ctx.globalAlpha = 0.3 + row * 0.15;

        for (let i = 0; i < 30; i++) {
          const x = i * 30 - camX * (0.25 + row * 0.1) + Math.sin(this.crowdWaveOffset + i * 0.3) * 2;

          // Head
          this.ctx.beginPath();
          this.ctx.arc(x, y, 8, 0, Math.PI * 2);
          this.ctx.fill();

          // Body
          this.ctx.fillRect(x - 6, y + 8, 12, 20);
        }
      }
      this.ctx.globalAlpha = 1;

      // Banners/flags
      for (let i = 0; i < 6; i++) {
        const x = 200 + i * 250 - camX * 0.35;
        const y = this.canvas.height - 280;
        const wave = Math.sin(this.time * 0.1 + i);

        this.ctx.strokeStyle = '#795548';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y + 60);
        this.ctx.stroke();

        this.ctx.fillStyle = ['#FF5722', '#2196F3', '#4CAF50'][i % 3];
        this.ctx.globalAlpha = 0.7;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 40 + wave * 5, y + 10);
        this.ctx.lineTo(x + wave * 3, y + 30);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }
    }
  }

  drawNearEnvironment(camX, level) {
    if (level === 'namek') {
      // Floating rocks
      this.floatingRocks.forEach(rock => {
        const x = rock.x - camX * rock.parallax;
        const y = rock.y + Math.sin(this.time * 0.01 * rock.floatSpeed + rock.floatOffset) * 15;

        this.ctx.fillStyle = '#6B8E23';
        this.ctx.globalAlpha = 0.7;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(Math.sin(this.time * 0.005 + rock.floatOffset) * 0.1);
        this.ctx.fillRect(-rock.size / 2, -rock.size / 2, rock.size, rock.size);
        this.ctx.restore();
        this.ctx.globalAlpha = 1;
      });

      // Namekian trees
      this.ctx.fillStyle = '#2E7D32';
      for (let i = 0; i < 10; i++) {
        const x = i * 180 - camX * 0.6;
        const y = this.canvas.height - 100;

        // Trunk
        this.ctx.fillRect(x, y, 10, 40);

        // Foliage
        this.ctx.beginPath();
        this.ctx.arc(x + 5, y - 10, 25, 0, Math.PI * 2);
        this.ctx.fill();
      }

    } else if (level === 'cellGames') {
      // Debris and broken structures
      this.ctx.fillStyle = '#8B7355';
      for (let i = 0; i < 12; i++) {
        const x = i * 150 - camX * 0.65;
        const y = this.canvas.height - 90;
        const size = 15 + Math.sin(i) * 10;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(i * 0.5);
        this.ctx.fillRect(-size / 2, -size / 2, size, size * 1.8);
        this.ctx.restore();
      }

      // Smoke/dust columns
      this.ctx.fillStyle = '#696969';
      this.ctx.globalAlpha = 0.2;
      for (let i = 0; i < 4; i++) {
        const x = 300 + i * 500 - camX * 0.5;
        const y = this.canvas.height - 120;

        for (let j = 0; j < 5; j++) {
          const offset = Math.sin(this.time * 0.02 + j) * 10;
          this.ctx.beginPath();
          this.ctx.arc(x + offset, y - j * 20, 20 + j * 5, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
      this.ctx.globalAlpha = 1;

    } else { // tournament
      // Torches with animated flames
      this.torches.forEach(torch => {
        const x = torch.x - camX * 0.7;
        const y = torch.y;

        // Torch pole
        this.ctx.fillStyle = '#8D6E63';
        this.ctx.fillRect(x - 5, y, 10, 60);

        // Flame
        torch.flicker = Math.sin(this.time * 0.1 + torch.phase) * 0.3 + 0.7;
        const flameGlow = this.ctx.createRadialGradient(x, y - 10, 0, x, y - 10, 25 * torch.flicker);
        flameGlow.addColorStop(0, '#FFF700');
        flameGlow.addColorStop(0.4, '#FF9800');
        flameGlow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = flameGlow;
        this.ctx.fillRect(x - 25, y - 35, 50, 50);

        this.ctx.fillStyle = '#FF5722';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 30 * torch.flicker);
        this.ctx.lineTo(x - 10, y);
        this.ctx.lineTo(x + 10, y);
        this.ctx.closePath();
        this.ctx.fill();
      });

      // Decorative plants
      this.ctx.strokeStyle = '#388E3C';
      this.ctx.lineWidth = 2;
      for (let i = 0; i < 15; i++) {
        const x = i * 120 - camX * 0.75;
        const y = this.canvas.height - 60;

        for (let j = 0; j < 3; j++) {
          this.ctx.beginPath();
          this.ctx.moveTo(x + j * 8, y);
          this.ctx.quadraticCurveTo(
            x + j * 8 + this.grassSway,
            y - 15,
            x + j * 8 + 5,
            y - 25
          );
          this.ctx.stroke();
        }
      }
    }
  }

  drawAtmosphericEffects(camX, level, bossActive) {
    // Dust particles
    this.particles.dust.forEach(p => {
      p.x -= p.speed + camX * 0.001;
      if (p.x < -camX * 0.5 - 50) p.x = this.canvas.width - camX * 0.5 + 50;

      this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x - camX * 0.5, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Debris particles
    this.particles.debris.forEach(p => {
      p.x -= p.speed;
      p.y += Math.sin(this.time * 0.02 + p.x) * 0.5;
      p.rotation += p.rotationSpeed;

      if (p.x < -camX * 0.6 - 50) {
        p.x = this.canvas.width - camX * 0.6 + 50;
        p.y = Math.random() * this.canvas.height;
      }

      this.ctx.save();
      this.ctx.translate(p.x - camX * 0.6, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = `rgba(139, 115, 85, ${p.opacity})`;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
    });

    // Energy crackles during boss fight
    if (bossActive) {
      this.particles.energy.forEach(p => {
        p.life--;
        if (p.life <= 0) {
          p.x = Math.random() * this.canvas.width * 2;
          p.y = Math.random() * this.canvas.height;
          p.life = p.maxLife;
        }

        const opacity = p.life / p.maxLife;
        this.ctx.fillStyle = p.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x - camX * 0.7, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Lightning bolt effect
        if (Math.random() > 0.95) {
          this.ctx.strokeStyle = p.color + '80';
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x - camX * 0.7, p.y);
          const segments = 3;
          for (let i = 0; i < segments; i++) {
            this.ctx.lineTo(
              p.x - camX * 0.7 + (Math.random() - 0.5) * 30,
              p.y + (i + 1) * 20
            );
          }
          this.ctx.stroke();
        }
      });
    }

    // God rays effect
    if (level === 'cellGames' || (level === 'tournament' && Math.sin(this.time * 0.01) > 0.5)) {
      this.ctx.globalAlpha = 0.1;
      const rayCount = 5;
      for (let i = 0; i < rayCount; i++) {
        const x = (i / rayCount) * this.canvas.width + Math.sin(this.time * 0.005 + i) * 50;
        const gradient = this.ctx.createLinearGradient(x, 0, x + 100, this.canvas.height);
        gradient.addColorStop(0, '#FFEB3B');
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, 0, 50, this.canvas.height * 0.6);
      }
      this.ctx.globalAlpha = 1;
    }
  }

  drawGround(camX, level) {
    const groundY = this.canvas.height - 50;

    if (level === 'namek') {
      // Green Namekian ground with grass
      const gradient = this.ctx.createLinearGradient(0, groundY, 0, this.canvas.height);
      gradient.addColorStop(0, '#7CB342');
      gradient.addColorStop(1, '#558B2F');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, groundY, this.canvas.width, 50);

      // Grass blades
      this.ctx.strokeStyle = '#9CCC65';
      this.ctx.lineWidth = 1;
      for (let i = 0; i < 200; i++) {
        const x = (i * 10 - camX) % this.canvas.width;
        const height = 8 + Math.sin(i) * 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.lineTo(x + this.grassSway, groundY - height);
        this.ctx.stroke();
      }

    } else if (level === 'cellGames') {
      // Cracked, destroyed earth
      this.ctx.fillStyle = '#5D4037';
      this.ctx.fillRect(0, groundY, this.canvas.width, 50);

      // Cracks
      this.ctx.strokeStyle = '#3E2723';
      this.ctx.lineWidth = 2;
      for (let i = 0; i < 20; i++) {
        const x = (i * 70 - camX * 0.9) % this.canvas.width;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        let crackX = x;
        let crackY = groundY;
        for (let j = 0; j < 5; j++) {
          crackX += (Math.random() - 0.5) * 20;
          crackY += 10;
          this.ctx.lineTo(crackX, crackY);
        }
        this.ctx.stroke();
      }

      // Rubble texture
      this.ctx.fillStyle = '#4E342E';
      for (let i = 0; i < 50; i++) {
        const x = (i * 30 - camX * 0.95) % this.canvas.width;
        const y = groundY + Math.random() * 40;
        this.ctx.fillRect(x, y, 5, 3);
      }

    } else { // tournament
      // Polished arena floor
      const tileGradient = this.ctx.createLinearGradient(0, groundY, 0, this.canvas.height);
      tileGradient.addColorStop(0, '#D7CCC8');
      tileGradient.addColorStop(1, '#A1887F');
      this.ctx.fillStyle = tileGradient;
      this.ctx.fillRect(0, groundY, this.canvas.width, 50);

      // Tile grid
      this.ctx.strokeStyle = '#8D6E63';
      this.ctx.lineWidth = 1;
      for (let i = 0; i < 50; i++) {
        const x = (i * 40 - camX * 0.98) % this.canvas.width;
        this.ctx.beginPath();
        this.ctx.moveTo(x, groundY);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
      }

      // Shine effect
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 10; i++) {
        const x = (i * 120 - camX * 0.99 + this.time) % this.canvas.width;
        this.ctx.fillRect(x, groundY, 3, 50);
      }
    }
  }

  updateShootingStars(camX) {
    this.particles.stars.forEach(star => {
      if (!star.active) {
        star.cooldown--;
        if (star.cooldown <= 0) {
          star.active = true;
          star.x = this.canvas.width + Math.random() * 200;
          star.y = Math.random() * this.canvas.height * 0.3;
          star.opacity = 1;
        }
      } else {
        star.x -= star.speed;
        star.y += star.speed * 0.3;
        star.opacity -= 0.02;

        if (star.opacity <= 0) {
          star.active = false;
          star.cooldown = Math.random() * 300 + 200;
        }

        // Draw shooting star
        const gradient = this.ctx.createLinearGradient(
          star.x - camX * 0.05,
          star.y,
          star.x - camX * 0.05 + star.length,
          star.y + star.length * 0.3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'transparent');

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(star.x - camX * 0.05, star.y);
        this.ctx.lineTo(star.x - camX * 0.05 + star.length, star.y + star.length * 0.3);
        this.ctx.stroke();
      }
    });
  }

  updateBirds(camX) {
    this.particles.birds.forEach(bird => {
      bird.x += bird.speed;
      bird.wingPhase += 0.2;

      if (bird.x - camX * 0.1 > this.canvas.width + 50) {
        bird.x = -100 + camX * 0.1;
        bird.y = Math.random() * this.canvas.height * 0.4 + 50;
      }

      const x = bird.x - camX * 0.1;
      const y = bird.y + Math.sin(bird.wingPhase) * 3;
      const wingSpan = 10 + Math.abs(Math.sin(bird.wingPhase)) * 5;

      // Bird silhouette
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round';

      // Left wing
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.quadraticCurveTo(x - wingSpan, y - 5, x - wingSpan - 5, y - 2);
      this.ctx.stroke();

      // Right wing
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.quadraticCurveTo(x + wingSpan, y - 5, x + wingSpan + 5, y - 2);
      this.ctx.stroke();
    });
  }
}

// Export for use in game
if (typeof module !== 'undefined') {
    module.exports = { BackgroundRenderer };
}
