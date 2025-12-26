// ============================================================================
// ENHANCED PARTICLE SYSTEM - Combat effects, auras, and special attacks
// ============================================================================

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 5000;
  }

  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.life -= deltaTime;

      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;

      // Apply gravity if exists
      if (particle.gravity) {
        particle.vy += particle.gravity * deltaTime;
      }

      // Apply acceleration
      if (particle.ax) particle.vx += particle.ax * deltaTime;
      if (particle.ay) particle.vy += particle.ay * deltaTime;

      // Update size
      if (particle.sizeDecay) {
        particle.size *= particle.sizeDecay;
      }

      // Update alpha
      particle.alpha = particle.life / particle.maxLife;
      if (particle.fadeType === 'fast') {
        particle.alpha = Math.pow(particle.alpha, 2);
      } else if (particle.fadeType === 'slow') {
        particle.alpha = Math.sqrt(particle.alpha);
      }

      // Update rotation
      if (particle.rotationSpeed) {
        particle.rotation += particle.rotationSpeed * deltaTime;
      }
    }
  }

  draw() {
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.translate(particle.x, particle.y);

      if (particle.rotation) {
        this.ctx.rotate(particle.rotation);
      }

      if (particle.type === 'circle') {
        this.drawCircle(particle);
      } else if (particle.type === 'star') {
        this.drawStar(particle);
      } else if (particle.type === 'line') {
        this.drawLine(particle);
      } else if (particle.type === 'lightning') {
        this.drawLightning(particle);
      } else if (particle.type === 'rect') {
        this.drawRect(particle);
      } else if (particle.type === 'triangle') {
        this.drawTriangle(particle);
      } else if (particle.type === 'glow') {
        this.drawGlow(particle);
      }

      this.ctx.restore();
    });
  }

  drawCircle(particle) {
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, particle.color.replace(/[\d.]+\)$/, '0)'));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawStar(particle) {
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = Math.cos(angle) * particle.size;
      const y = Math.sin(angle) * particle.size;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawLine(particle) {
    this.ctx.strokeStyle = particle.color;
    this.ctx.lineWidth = particle.size;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(particle.length * Math.cos(particle.angle),
                    particle.length * Math.sin(particle.angle));
    this.ctx.stroke();
  }

  drawLightning(particle) {
    this.ctx.strokeStyle = particle.color;
    this.ctx.lineWidth = particle.size;
    this.ctx.lineCap = 'round';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = particle.color;

    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);

    const segments = particle.segments || 5;
    const length = particle.length;
    const angle = particle.angle;

    for (let i = 1; i <= segments; i++) {
      const x = (length / segments) * i * Math.cos(angle) + (Math.random() - 0.5) * 20;
      const y = (length / segments) * i * Math.sin(angle) + (Math.random() - 0.5) * 20;
      this.ctx.lineTo(x, y);
    }

    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  drawRect(particle) {
    this.ctx.fillStyle = particle.color;
    this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
  }

  drawTriangle(particle) {
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -particle.size);
    this.ctx.lineTo(particle.size, particle.size);
    this.ctx.lineTo(-particle.size, particle.size);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawGlow(particle) {
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(0.5, particle.color.replace(/[\d.]+\)$/, '0.5)'));
    gradient.addColorStop(1, particle.color.replace(/[\d.]+\)$/, '0)'));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  addParticle(config) {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }

    const particle = {
      x: config.x || 0,
      y: config.y || 0,
      vx: config.vx || 0,
      vy: config.vy || 0,
      ax: config.ax || 0,
      ay: config.ay || 0,
      size: config.size || 5,
      color: config.color || 'rgba(255, 255, 255, 1)',
      life: config.life || 1,
      maxLife: config.life || 1,
      alpha: 1,
      type: config.type || 'circle',
      gravity: config.gravity || 0,
      rotation: config.rotation || 0,
      rotationSpeed: config.rotationSpeed || 0,
      sizeDecay: config.sizeDecay || 1,
      fadeType: config.fadeType || 'linear',
      length: config.length || 0,
      angle: config.angle || 0,
      segments: config.segments || 5
    };

    this.particles.push(particle);
  }

  // ===== AURA EFFECTS =====

  createBaseAura(x, y, intensity = 1) {
    const particleCount = Math.floor(5 * intensity);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 20;
      const speed = 50 + Math.random() * 50;

      this.addParticle({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * 20,
        vy: -speed,
        size: 3 + Math.random() * 5,
        color: `rgba(255, ${150 + Math.random() * 105}, ${Math.random() * 100}, 1)`,
        life: 0.3 + Math.random() * 0.4,
        type: 'glow',
        fadeType: 'fast'
      });
    }
  }

  createSSJAura(x, y, intensity = 1) {
    const particleCount = Math.floor(8 * intensity);

    // Golden flame particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 25 + Math.random() * 25;
      const speed = 80 + Math.random() * 80;

      this.addParticle({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * 30,
        vy: -speed,
        size: 4 + Math.random() * 6,
        color: `rgba(255, ${200 + Math.random() * 55}, 0, 1)`,
        life: 0.4 + Math.random() * 0.5,
        type: 'glow',
        fadeType: 'fast'
      });
    }

    // Electric sparks
    if (Math.random() > 0.7) {
      const sparkCount = Math.floor(3 * intensity);
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 30 + Math.random() * 20;

        this.addParticle({
          x: x + Math.cos(angle) * radius,
          y: y + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 100,
          vy: (Math.random() - 0.5) * 100,
          size: 2,
          color: 'rgba(255, 255, 200, 1)',
          life: 0.1 + Math.random() * 0.15,
          type: 'star',
          rotationSpeed: Math.random() * 10
        });
      }
    }
  }

  createSSJ2Aura(x, y, intensity = 1) {
    // Base SSJ aura
    this.createSSJAura(x, y, intensity);

    // Lightning bolts
    if (Math.random() > 0.5) {
      const boltCount = Math.floor(2 * intensity);
      for (let i = 0; i < boltCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const startRadius = 20 + Math.random() * 10;

        this.addParticle({
          x: x + Math.cos(angle) * startRadius,
          y: y + Math.sin(angle) * startRadius,
          vx: 0,
          vy: 0,
          size: 2 + Math.random() * 2,
          color: 'rgba(150, 200, 255, 1)',
          life: 0.1 + Math.random() * 0.1,
          type: 'lightning',
          length: 40 + Math.random() * 40,
          angle: angle,
          segments: 4 + Math.floor(Math.random() * 4)
        });
      }
    }
  }

  createRageAura(x, y, intensity = 1) {
    const particleCount = Math.floor(10 * intensity);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 30;
      const speed = 60 + Math.random() * 100;

      this.addParticle({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * 50,
        vy: -speed,
        size: 5 + Math.random() * 8,
        color: `rgba(255, ${Math.random() * 100}, 0, 1)`,
        life: 0.3 + Math.random() * 0.4,
        type: 'glow',
        fadeType: 'fast'
      });
    }

    // Aggressive outward bursts
    if (Math.random() > 0.8) {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        this.addParticle({
          x: x,
          y: y,
          vx: Math.cos(angle) * 200,
          vy: Math.sin(angle) * 200,
          size: 3,
          color: 'rgba(255, 50, 0, 1)',
          life: 0.2,
          type: 'line',
          length: 20,
          angle: angle
        });
      }
    }
  }

  createChargingAura(x, y, chargeLevel = 0, intensity = 1) {
    const particleCount = Math.floor(6 * intensity * (1 + chargeLevel));

    // Swirling particles gathering inward
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 60;
      const toCenter = Math.atan2(y - (y + Math.sin(angle) * radius),
                                   x - (x + Math.cos(angle) * radius));
      const speed = 100 + chargeLevel * 100;

      this.addParticle({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        vx: Math.cos(toCenter) * speed,
        vy: Math.sin(toCenter) * speed,
        size: 3 + Math.random() * 4 + chargeLevel * 2,
        color: `rgba(${100 + chargeLevel * 100}, ${150 + chargeLevel * 100}, 255, 1)`,
        life: 0.5 + Math.random() * 0.5,
        type: 'glow',
        fadeType: 'slow'
      });
    }

    // Energy distortion rings
    if (Math.random() > 0.7) {
      const ringRadius = 40 + chargeLevel * 20;
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16;
        this.addParticle({
          x: x + Math.cos(angle) * ringRadius,
          y: y + Math.sin(angle) * ringRadius,
          vx: 0,
          vy: 0,
          size: 2 + chargeLevel,
          color: `rgba(255, 255, ${200 + chargeLevel * 55}, 1)`,
          life: 0.2,
          type: 'circle'
        });
      }
    }
  }

  // ===== COMBAT EFFECTS =====

  createMeleeHit(x, y, direction = 1) {
    // Star burst
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      this.addParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * 150,
        vy: Math.sin(angle) * 150,
        size: 8,
        color: 'rgba(255, 255, 255, 1)',
        life: 0.3,
        type: 'star',
        rotationSpeed: 10,
        sizeDecay: 0.95
      });
    }

    // Speed lines
    for (let i = 0; i < 6; i++) {
      const angle = (direction > 0 ? 0 : Math.PI) + (Math.random() - 0.5) * 0.5;
      this.addParticle({
        x: x,
        y: y + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * 300 * direction,
        vy: (Math.random() - 0.5) * 50,
        size: 3,
        color: 'rgba(255, 200, 100, 1)',
        life: 0.2,
        type: 'line',
        length: 30 + Math.random() * 30,
        angle: angle
      });
    }
  }

  createKiBlastImpact(x, y) {
    // Circular explosion
    for (let i = 0; i < 32; i++) {
      const angle = (Math.PI * 2 * i) / 32;
      const speed = 100 + Math.random() * 100;

      this.addParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 5,
        color: `rgba(100, ${150 + Math.random() * 105}, 255, 1)`,
        life: 0.4 + Math.random() * 0.3,
        type: 'glow',
        fadeType: 'fast',
        gravity: 200
      });
    }

    // Debris
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 150 + Math.random() * 150;

      this.addParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        size: 3 + Math.random() * 4,
        color: `rgba(${150 + Math.random() * 105}, ${100 + Math.random() * 100}, 50, 1)`,
        life: 0.5 + Math.random() * 0.5,
        type: 'rect',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 400
      });
    }

    // Flash
    this.addParticle({
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      size: 60,
      color: 'rgba(255, 255, 255, 1)',
      life: 0.1,
      type: 'glow',
      fadeType: 'fast'
    });
  }

  createBeamCollision(x, y) {
    // Massive energy dispersion
    for (let i = 0; i < 64; i++) {
      const angle = (Math.PI * 2 * i) / 64;
      const speed = 200 + Math.random() * 200;

      this.addParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 8 + Math.random() * 8,
        color: `rgba(${150 + Math.random() * 105}, ${150 + Math.random() * 105}, 255, 1)`,
        life: 0.6 + Math.random() * 0.4,
        type: 'glow',
        fadeType: 'slow'
      });
    }

    // Lightning bolts
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      this.addParticle({
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        size: 3,
        color: 'rgba(255, 255, 255, 1)',
        life: 0.2,
        type: 'lightning',
        length: 60 + Math.random() * 60,
        angle: angle,
        segments: 6
      });
    }

    // Central flash
    this.addParticle({
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      size: 100,
      color: 'rgba(255, 255, 255, 1)',
      life: 0.15,
      type: 'glow',
      fadeType: 'fast'
    });
  }

  createCriticalHit(x, y) {
    // Screen-wide flash (handled separately in game)
    this.addParticle({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      vx: 0,
      vy: 0,
      size: Math.max(this.canvas.width, this.canvas.height),
      color: 'rgba(255, 255, 255, 1)',
      life: 0.1,
      type: 'glow',
      fadeType: 'fast'
    });

    // Multiple star bursts
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16;
        const speed = 200 + j * 100;

        this.addParticle({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 10 + j * 3,
          color: `rgba(255, ${200 - j * 50}, ${100 - j * 50}, 1)`,
          life: 0.4 + j * 0.1,
          type: 'star',
          rotationSpeed: 15 - j * 3,
          sizeDecay: 0.96
        });
      }
    }
  }

  createComboHit(x, y, comboCount) {
    const intensity = Math.min(comboCount / 10, 3);

    // Escalating particles
    const particleCount = Math.floor(8 * intensity);
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 100 + intensity * 50;

      this.addParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + intensity * 2,
        color: `rgba(255, ${255 - intensity * 50}, ${100 + intensity * 50}, 1)`,
        life: 0.3 + intensity * 0.1,
        type: 'star',
        rotationSpeed: 5 + intensity * 5
      });
    }

    // Energy rings
    if (comboCount % 5 === 0) {
      for (let i = 0; i < 24; i++) {
        const angle = (Math.PI * 2 * i) / 24;
        const radius = 30 + comboCount * 2;

        this.addParticle({
          x: x + Math.cos(angle) * radius,
          y: y + Math.sin(angle) * radius,
          vx: Math.cos(angle) * 50,
          vy: Math.sin(angle) * 50,
          size: 3 + intensity,
          color: 'rgba(255, 150, 255, 1)',
          life: 0.4,
          type: 'circle'
        });
      }
    }
  }

  // ===== SPECIAL ATTACK EFFECTS =====

  createKamehameha(x, y, targetX, targetY, intensity = 1) {
    const angle = Math.atan2(targetY - y, targetX - x);
    const distance = Math.sqrt((targetX - x) ** 2 + (targetY - y) ** 2);

    // Blue energy stream
    const particleCount = Math.floor(20 * intensity);
    for (let i = 0; i < particleCount; i++) {
      const progress = Math.random();
      const px = x + Math.cos(angle) * distance * progress;
      const py = y + Math.sin(angle) * distance * progress;
      const perpAngle = angle + Math.PI / 2;
      const offset = (Math.random() - 0.5) * 40 * intensity;

      this.addParticle({
        x: px + Math.cos(perpAngle) * offset,
        y: py + Math.sin(perpAngle) * offset,
        vx: Math.cos(angle) * 100 + (Math.random() - 0.5) * 50,
        vy: Math.sin(angle) * 100 + (Math.random() - 0.5) * 50,
        size: 6 + Math.random() * 6,
        color: `rgba(${100 + Math.random() * 50}, ${150 + Math.random() * 50}, 255, 1)`,
        life: 0.3 + Math.random() * 0.3,
        type: 'glow',
        fadeType: 'fast'
      });
    }

    // White core particles
    for (let i = 0; i < 10; i++) {
      const progress = Math.random();
      const px = x + Math.cos(angle) * distance * progress;
      const py = y + Math.sin(angle) * distance * progress;

      this.addParticle({
        x: px,
        y: py,
        vx: Math.cos(angle) * 150,
        vy: Math.sin(angle) * 150,
        size: 4 + Math.random() * 4,
        color: 'rgba(255, 255, 255, 1)',
        life: 0.2 + Math.random() * 0.2,
        type: 'glow',
        fadeType: 'fast'
      });
    }

    // Trailing particles at origin
    for (let i = 0; i < 5; i++) {
      const perpAngle = angle + Math.PI / 2;
      const offset = (Math.random() - 0.5) * 30;

      this.addParticle({
        x: x + Math.cos(perpAngle) * offset,
        y: y + Math.sin(perpAngle) * offset,
        vx: -Math.cos(angle) * 50,
        vy: -Math.sin(angle) * 50,
        size: 4 + Math.random() * 4,
        color: 'rgba(150, 200, 255, 1)',
        life: 0.4,
        type: 'glow'
      });
    }
  }

  createFinalFlash(x, y, targetX, targetY, isCharging = false) {
    const angle = Math.atan2(targetY - y, targetX - x);

    if (isCharging) {
      // Charging sphere
      for (let i = 0; i < 12; i++) {
        const particleAngle = Math.random() * Math.PI * 2;
        const radius = 20 + Math.random() * 20;

        this.addParticle({
          x: x + Math.cos(particleAngle) * radius,
          y: y + Math.sin(particleAngle) * radius,
          vx: -Math.cos(particleAngle) * 50,
          vy: -Math.sin(particleAngle) * 50,
          size: 5 + Math.random() * 5,
          color: 'rgba(255, 255, 100, 1)',
          life: 0.3,
          type: 'glow'
        });
      }
    } else {
      // Yellow beam
      const distance = Math.sqrt((targetX - x) ** 2 + (targetY - y) ** 2);

      for (let i = 0; i < 30; i++) {
        const progress = Math.random();
        const px = x + Math.cos(angle) * distance * progress;
        const py = y + Math.sin(angle) * distance * progress;
        const perpAngle = angle + Math.PI / 2;
        const offset = (Math.random() - 0.5) * 50;

        this.addParticle({
          x: px + Math.cos(perpAngle) * offset,
          y: py + Math.sin(perpAngle) * offset,
          vx: Math.cos(angle) * 120,
          vy: Math.sin(angle) * 120,
          size: 7 + Math.random() * 7,
          color: `rgba(255, ${200 + Math.random() * 55}, ${Math.random() * 100}, 1)`,
          life: 0.3 + Math.random() * 0.3,
          type: 'glow',
          fadeType: 'fast'
        });
      }
    }
  }

  createSpiritBomb(x, y, radius, isGathering = true) {
    if (isGathering) {
      // Energy streams from edges
      const edgePoints = [
        { x: 0, y: this.canvas.height / 2 },
        { x: this.canvas.width, y: this.canvas.height / 2 },
        { x: this.canvas.width / 2, y: 0 },
        { x: this.canvas.width / 2, y: this.canvas.height }
      ];

      edgePoints.forEach(point => {
        for (let i = 0; i < 3; i++) {
          const angle = Math.atan2(y - point.y, x - point.x);
          const speed = 100 + Math.random() * 100;

          this.addParticle({
            x: point.x + (Math.random() - 0.5) * 100,
            y: point.y + (Math.random() - 0.5) * 100,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 4 + Math.random() * 4,
            color: 'rgba(150, 200, 255, 1)',
            life: 1 + Math.random(),
            type: 'glow',
            fadeType: 'slow'
          });
        }
      });
    }

    // Massive sphere particles
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24;
      const r = radius + (Math.random() - 0.5) * 20;

      this.addParticle({
        x: x + Math.cos(angle) * r,
        y: y + Math.sin(angle) * r,
        vx: Math.cos(angle) * 20,
        vy: Math.sin(angle) * 20,
        size: 8 + Math.random() * 8,
        color: `rgba(${100 + Math.random() * 155}, ${150 + Math.random() * 105}, 255, 1)`,
        life: 0.5 + Math.random() * 0.5,
        type: 'glow'
      });
    }
  }

  createHellzoneGrenade(positions) {
    positions.forEach(pos => {
      // Orbiting ki balls
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const radius = 15;

        this.addParticle({
          x: pos.x + Math.cos(angle) * radius,
          y: pos.y + Math.sin(angle) * radius,
          vx: Math.cos(angle) * 30,
          vy: Math.sin(angle) * 30,
          size: 4 + Math.random() * 4,
          color: 'rgba(255, 150, 255, 1)',
          life: 0.3,
          type: 'glow'
        });
      }

      // Core glow
      this.addParticle({
        x: pos.x,
        y: pos.y,
        vx: 0,
        vy: 0,
        size: 20,
        color: 'rgba(255, 100, 255, 1)',
        life: 0.2,
        type: 'glow',
        fadeType: 'fast'
      });
    });
  }

  // ===== ENVIRONMENTAL PARTICLES =====

  createGroundCrack(x, y) {
    // Ground impact
    for (let i = 0; i < 20; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
      const speed = 100 + Math.random() * 100;

      this.addParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 6,
        color: `rgba(${100 + Math.random() * 100}, ${80 + Math.random() * 80}, 50, 1)`,
        life: 0.5 + Math.random() * 0.5,
        type: 'rect',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 500
      });
    }

    // Dust cloud
    for (let i = 0; i < 15; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 2;
      const speed = 50 + Math.random() * 50;

      this.addParticle({
        x: x + (Math.random() - 0.5) * 40,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 10 + Math.random() * 10,
        color: `rgba(150, 130, 100, 0.6)`,
        life: 0.6 + Math.random() * 0.6,
        type: 'circle',
        fadeType: 'slow'
      });
    }
  }

  createDustCloud(x, y, direction = 1) {
    for (let i = 0; i < 8; i++) {
      this.addParticle({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: -direction * (30 + Math.random() * 30),
        vy: -20 - Math.random() * 30,
        size: 8 + Math.random() * 8,
        color: `rgba(${120 + Math.random() * 60}, ${110 + Math.random() * 50}, 80, 0.5)`,
        life: 0.4 + Math.random() * 0.4,
        type: 'circle',
        fadeType: 'slow'
      });
    }
  }

  createEnergyDistortion(x, y, radius) {
    for (let i = 0; i < 32; i++) {
      const angle = (Math.PI * 2 * i) / 32;

      this.addParticle({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * 50,
        vy: Math.sin(angle) * 50,
        size: 3,
        color: 'rgba(200, 200, 255, 0.8)',
        life: 0.3,
        type: 'circle'
      });
    }
  }

  createDebris(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 150;

      this.addParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        size: 3 + Math.random() * 5,
        color: `rgba(${100 + Math.random() * 100}, ${80 + Math.random() * 80}, 50, 1)`,
        life: 0.8 + Math.random() * 0.8,
        type: Math.random() > 0.5 ? 'rect' : 'triangle',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 15,
        gravity: 600
      });
    }
  }

  createAfterimageTrail(x, y, width, height, color = 'rgba(255, 255, 255, 0.5)') {
    this.addParticle({
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      size: Math.max(width, height) / 2,
      color: color,
      life: 0.15,
      type: 'glow',
      fadeType: 'fast'
    });
  }

  // ===== DEATH/EXPLOSION EFFECTS =====

  createEnemyDeath(x, y) {
    // Expanding ring
    for (let i = 0; i < 48; i++) {
      const angle = (Math.PI * 2 * i) / 48;
      const speed = 150 + Math.random() * 100;

      this.addParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 6 + Math.random() * 6,
        color: `rgba(255, ${100 + Math.random() * 155}, 0, 1)`,
        life: 0.6 + Math.random() * 0.4,
        type: 'glow',
        fadeType: 'slow',
        gravity: 100
      });
    }

    // Particle burst
    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 200 + Math.random() * 200;

      this.addParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 6,
        color: `rgba(255, ${Math.random() * 150}, 0, 1)`,
        life: 0.5 + Math.random() * 0.5,
        type: 'star',
        rotationSpeed: (Math.random() - 0.5) * 20,
        gravity: 300
      });
    }

    // Central flash
    this.addParticle({
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      size: 80,
      color: 'rgba(255, 255, 255, 1)',
      life: 0.2,
      type: 'glow',
      fadeType: 'fast'
    });
  }

  createBossDeath(x, y, stage = 1) {
    // Multi-stage explosion
    const maxStage = 5;
    const radius = 50 + stage * 30;
    const particleCount = 20 + stage * 10;

    // Expanding explosion waves
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 100 + stage * 50 + Math.random() * 100;

      this.addParticle({
        x: x + (Math.random() - 0.5) * radius,
        y: y + (Math.random() - 0.5) * radius,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 8 + Math.random() * 10,
        color: `rgba(255, ${150 - stage * 20}, ${stage * 30}, 1)`,
        life: 0.5 + Math.random() * 0.5,
        type: 'glow',
        fadeType: 'slow'
      });
    }

    // Debris
    if (stage < maxStage) {
      this.createDebris(x, y, 15 + stage * 5);
    }

    // Lightning
    if (stage % 2 === 0) {
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        this.addParticle({
          x: x,
          y: y,
          vx: 0,
          vy: 0,
          size: 3,
          color: 'rgba(255, 255, 255, 1)',
          life: 0.15,
          type: 'lightning',
          length: 80 + stage * 20,
          angle: angle,
          segments: 6
        });
      }
    }

    // Final stage massive flash
    if (stage === maxStage) {
      this.addParticle({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        vx: 0,
        vy: 0,
        size: Math.max(this.canvas.width, this.canvas.height) * 1.5,
        color: 'rgba(255, 255, 255, 1)',
        life: 0.3,
        type: 'glow',
        fadeType: 'fast'
      });
    }
  }

  createScreenCrack(x, y) {
    // Crack lines radiating from impact point
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
      const segments = 8 + Math.floor(Math.random() * 6);

      let currentX = x;
      let currentY = y;

      for (let j = 0; j < segments; j++) {
        const length = 30 + Math.random() * 40;
        const newAngle = angle + (Math.random() - 0.5) * 0.5;
        const endX = currentX + Math.cos(newAngle) * length;
        const endY = currentY + Math.sin(newAngle) * length;

        this.addParticle({
          x: currentX,
          y: currentY,
          vx: 0,
          vy: 0,
          size: 2 - j * 0.2,
          color: 'rgba(255, 255, 255, 0.8)',
          life: 0.5 + j * 0.1,
          type: 'line',
          length: length,
          angle: newAngle
        });

        currentX = endX;
        currentY = endY;
      }
    }

    // Impact flash
    this.addParticle({
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      size: 100,
      color: 'rgba(255, 255, 255, 1)',
      life: 0.15,
      type: 'glow',
      fadeType: 'fast'
    });
  }

  clear() {
    this.particles = [];
  }
}

// Export for use in game
if (typeof module !== 'undefined') {
    module.exports = { ParticleSystem };
}
