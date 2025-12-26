// ============================================================================
// ULTRA SPRITES - High-detail procedural pixel art with advanced rendering
// Character sprites: 64x80 pixels, Boss sprites: 96x120 pixels
// Features: Shading, highlights, animation frames, SSJ aura effects
// ============================================================================

class UltraSprites {
  constructor() {
    this.cache = {};
    this.animationFrame = 0;
  }

  createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  // Enhanced pixel drawing with shading
  drawPixelShaded(ctx, x, y, baseColor, lightLevel = 0) {
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return;
    
    const factor = 1 + (lightLevel * 0.15);
    const r = Math.min(255, Math.floor(rgb.r * factor));
    const g = Math.min(255, Math.floor(rgb.g * factor));
    const b = Math.min(255, Math.floor(rgb.b * factor));
    
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y, 1, 1);
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  drawRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  drawCircle(ctx, cx, cy, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw with outline for definition
  drawPixelOutlined(ctx, x, y, color, outlineColor = '#000') {
    ctx.fillStyle = outlineColor;
    ctx.fillRect(x - 1, y, 3, 1);
    ctx.fillRect(x, y - 1, 1, 3);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  // ===== GOKU - ULTRA DETAIL (64x80) =====
  createGoku(state = 'idle', frame = 0, ssj = false) {
    const key = `goku_ultra_${state}_${frame}_${ssj}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(64, 80);
    const ctx = canvas.getContext('2d');

    const colors = {
      skin: '#fdbcb4',
      skinDark: '#e8a99a',
      skinLight: '#ffd5cf',
      hair: ssj ? '#f4d03f' : '#1a1a1a',
      hairHighlight: ssj ? '#fff6a6' : '#3a3a3a',
      hairDark: ssj ? '#c9a526' : '#000000',
      gi: '#ff6b35',
      giDark: '#cc5229',
      giLight: '#ff8f66',
      belt: '#3a86ff',
      boots: ssj ? '#f4d03f' : '#2d5aa8',
      aura: 'rgba(244, 208, 63, 0.4)'
    };

    // Draw SSJ aura if active
    if (ssj) {
      ctx.save();
      const gradient = ctx.createRadialGradient(32, 40, 5, 32, 40, 45);
      gradient.addColorStop(0, 'rgba(255, 255, 200, 0.6)');
      gradient.addColorStop(0.5, 'rgba(244, 208, 63, 0.3)');
      gradient.addColorStop(1, 'rgba(244, 208, 63, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 80);
      
      // Electric sparks
      ctx.strokeStyle = '#87CEEB';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const sparkX = 20 + Math.sin(frame + i) * 15;
        const sparkY = 10 + i * 20;
        ctx.beginPath();
        ctx.moveTo(sparkX, sparkY);
        ctx.lineTo(sparkX + 5, sparkY + 8);
        ctx.lineTo(sparkX - 2, sparkY + 12);
        ctx.stroke();
      }
      ctx.restore();
    }

    // HAIR - Iconic spiky style
    const hairOffset = state === 'jump' ? -2 : 0;
    
    // Main hair mass
    for (let i = 0; i < 9; i++) {
      const spikeHeights = [8, 10, 14, 12, 16, 12, 14, 10, 8];
      const spikeX = 22 + i * 2;
      for (let j = 0; j < spikeHeights[i]; j++) {
        const shade = j < 3 ? 1 : (j < spikeHeights[i] - 2 ? 0 : -1);
        this.drawPixelShaded(ctx, spikeX, 8 - j + hairOffset, colors.hair, shade);
        this.drawPixelShaded(ctx, spikeX + 1, 8 - j + hairOffset, colors.hair, shade);
      }
    }
    
    // Hair bangs
    this.drawRect(ctx, 20, 9 + hairOffset, 4, 4, colors.hair);
    this.drawRect(ctx, 40, 9 + hairOffset, 4, 4, colors.hair);

    // FACE
    // Face shape - more detailed
    for (let y = 12; y < 24; y++) {
      const width = y < 16 ? 16 : (y < 22 ? 18 : 14);
      const startX = 32 - width / 2;
      for (let x = 0; x < width; x++) {
        const shade = x < 3 ? -1 : (x > width - 3 ? 1 : 0);
        this.drawPixelShaded(ctx, startX + x, y, colors.skin, shade);
      }
    }

    // Eyes with detail
    // Left eye
    this.drawRect(ctx, 26, 16, 4, 3, '#fff');
    this.drawRect(ctx, 27, 17, 2, 2, ssj ? '#00aa77' : '#222');
    this.drawRect(ctx, 28, 17, 1, 1, '#fff'); // Highlight
    
    // Right eye
    this.drawRect(ctx, 34, 16, 4, 3, '#fff');
    this.drawRect(ctx, 35, 17, 2, 2, ssj ? '#00aa77' : '#222');
    this.drawRect(ctx, 36, 17, 1, 1, '#fff');

    // Eyebrows
    this.drawRect(ctx, 25, 14, 6, 1, colors.hair);
    this.drawRect(ctx, 33, 14, 6, 1, colors.hair);

    // Nose and mouth
    this.drawRect(ctx, 31, 19, 2, 2, colors.skinDark);
    this.drawRect(ctx, 29, 22, 6, 1, colors.skinDark);

    // NECK
    for (let y = 24; y < 28; y++) {
      for (let x = 28; x < 36; x++) {
        this.drawPixelShaded(ctx, x, y, colors.skin, x < 30 ? -1 : 0);
      }
    }

    // TORSO - Orange Gi
    for (let y = 28; y < 48; y++) {
      for (let x = 18; x < 46; x++) {
        if (y < 32 && (x < 22 || x > 42)) continue;
        const shade = (x < 22 || x > 42) ? -1 : ((x > 28 && x < 36) ? 1 : 0);
        this.drawPixelShaded(ctx, x, y, colors.gi, shade);
      }
    }

    // Blue undershirt visible at collar
    this.drawRect(ctx, 28, 28, 8, 4, colors.belt);

    // Gi folds/creases
    ctx.strokeStyle = colors.giDark;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(26, 32);
    ctx.lineTo(28, 45);
    ctx.moveTo(38, 32);
    ctx.lineTo(36, 45);
    ctx.stroke();

    // BELT
    this.drawRect(ctx, 18, 46, 28, 4, colors.belt);
    // Belt buckle
    this.drawRect(ctx, 30, 47, 4, 2, '#ffd700');

    // ARMS
    const armSwing = state === 'run' ? Math.sin(frame * 0.5) * 3 : 0;
    
    // Left arm (gi sleeve then skin)
    for (let y = 30; y < 50; y++) {
      for (let x = 12; x < 18; x++) {
        const color = y < 38 ? colors.gi : colors.skin;
        const shade = x < 14 ? -1 : 0;
        this.drawPixelShaded(ctx, x, y + armSwing, color, shade);
      }
    }
    // Wristband
    this.drawRect(ctx, 12, 45 + armSwing, 6, 2, colors.belt);

    // Right arm
    for (let y = 30; y < 50; y++) {
      for (let x = 46; x < 52; x++) {
        const color = y < 38 ? colors.gi : colors.skin;
        this.drawPixelShaded(ctx, x, y - armSwing, color, x > 50 ? 1 : 0);
      }
    }
    this.drawRect(ctx, 46, 45 - armSwing, 6, 2, colors.belt);

    // LEGS
    const legAnim = state === 'run' ? frame % 4 : 0;
    const leftLegOffset = legAnim === 1 || legAnim === 2 ? -4 : 0;
    const rightLegOffset = legAnim === 0 || legAnim === 3 ? -4 : 0;

    // Left leg
    for (let y = 50; y < 68; y++) {
      for (let x = 20 + leftLegOffset; x < 30 + leftLegOffset; x++) {
        this.drawPixelShaded(ctx, x, y, colors.gi, x < 23 ? -1 : 0);
      }
    }

    // Right leg  
    for (let y = 50; y < 68; y++) {
      for (let x = 34 + rightLegOffset; x < 44 + rightLegOffset; x++) {
        this.drawPixelShaded(ctx, x, y, colors.gi, x > 42 ? 1 : 0);
      }
    }

    // BOOTS
    // Left boot
    for (let y = 68; y < 78; y++) {
      for (let x = 18 + leftLegOffset; x < 32 + leftLegOffset; x++) {
        this.drawPixelShaded(ctx, x, y, colors.boots, y > 75 ? -1 : 0);
      }
    }
    // Boot toe highlight
    this.drawRect(ctx, 18 + leftLegOffset, 74, 4, 2, colors.skinLight);

    // Right boot
    for (let y = 68; y < 78; y++) {
      for (let x = 32 + rightLegOffset; x < 46 + rightLegOffset; x++) {
        this.drawPixelShaded(ctx, x, y, colors.boots, y > 75 ? -1 : 0);
      }
    }
    this.drawRect(ctx, 32 + rightLegOffset, 74, 4, 2, colors.skinLight);

    // Boot soles
    this.drawRect(ctx, 18 + leftLegOffset, 78, 14, 2, '#5c3d2e');
    this.drawRect(ctx, 32 + rightLegOffset, 78, 14, 2, '#5c3d2e');

    this.cache[key] = canvas;
    return canvas;
  }

  // ===== VEGETA - ULTRA DETAIL =====
  createVegeta(state = 'idle', frame = 0, ssj = false) {
    const key = `vegeta_ultra_${state}_${frame}_${ssj}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(64, 80);
    const ctx = canvas.getContext('2d');

    const colors = {
      skin: '#fdbcb4',
      skinDark: '#e8a99a',
      hair: ssj ? '#f4d03f' : '#1a1a1a',
      hairDark: ssj ? '#c9a526' : '#000000',
      armor: '#2d5aa8',
      armorLight: '#5a8ad4',
      armorDark: '#1a3d6e',
      gold: '#ffd700',
      white: '#ffffff',
      pants: '#1a1a2e'
    };

    // SSJ Aura
    if (ssj) {
      const gradient = ctx.createRadialGradient(32, 40, 5, 32, 40, 40);
      gradient.addColorStop(0, 'rgba(255, 255, 200, 0.5)');
      gradient.addColorStop(1, 'rgba(244, 208, 63, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 80);
    }

    // HAIR - Flame shape, pointing UP
    for (let i = 0; i < 7; i++) {
      const spikeHeights = [10, 14, 18, 20, 18, 14, 10];
      const spikeX = 24 + i * 2;
      for (let j = 0; j < spikeHeights[i]; j++) {
        const shade = j < 4 ? 1 : -1;
        this.drawPixelShaded(ctx, spikeX, 12 - j, colors.hair, shade);
        this.drawPixelShaded(ctx, spikeX + 1, 12 - j, colors.hair, shade);
      }
    }

    // Widow's peak
    this.drawRect(ctx, 30, 10, 4, 4, colors.hair);

    // FACE - Scowling expression
    for (let y = 14; y < 26; y++) {
      const width = y < 18 ? 14 : 16;
      for (let x = 0; x < width; x++) {
        this.drawPixelShaded(ctx, 25 + x, y, colors.skin, x < 3 ? -1 : 0);
      }
    }

    // Angry eyebrows
    ctx.fillStyle = colors.hair;
    ctx.beginPath();
    ctx.moveTo(26, 16);
    ctx.lineTo(32, 18);
    ctx.lineTo(26, 18);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(38, 16);
    ctx.lineTo(32, 18);
    ctx.lineTo(38, 18);
    ctx.fill();

    // Eyes
    this.drawRect(ctx, 27, 18, 4, 3, '#fff');
    this.drawRect(ctx, 28, 19, 2, 2, ssj ? '#00aa77' : '#222');
    this.drawRect(ctx, 33, 18, 4, 3, '#fff');
    this.drawRect(ctx, 34, 19, 2, 2, ssj ? '#00aa77' : '#222');

    // Nose, mouth (stern)
    this.drawRect(ctx, 31, 21, 2, 2, colors.skinDark);
    this.drawRect(ctx, 29, 24, 6, 1, '#000');

    // NECK
    this.drawRect(ctx, 28, 26, 8, 4, colors.skin);

    // SAIYAN ARMOR
    // Main body
    for (let y = 30; y < 48; y++) {
      for (let x = 16; x < 48; x++) {
        if (y < 34 && (x < 20 || x > 44)) continue;
        const shade = (x < 24) ? -1 : ((x > 36 && x < 44) ? 1 : 0);
        this.drawPixelShaded(ctx, x, y, colors.armor, shade);
      }
    }

    // White chest plate
    this.drawRect(ctx, 22, 32, 20, 12, colors.white);
    // Golden trim
    this.drawRect(ctx, 22, 32, 20, 2, colors.gold);
    this.drawRect(ctx, 22, 42, 20, 2, colors.gold);

    // Shoulder pads
    for (let y = 28; y < 36; y++) {
      for (let x = 10; x < 18; x++) {
        this.drawPixelShaded(ctx, x, y, colors.white, -1);
      }
      for (let x = 46; x < 54; x++) {
        this.drawPixelShaded(ctx, x, y, colors.white, 1);
      }
    }
    // Gold trim on shoulders
    this.drawRect(ctx, 10, 28, 8, 2, colors.gold);
    this.drawRect(ctx, 46, 28, 8, 2, colors.gold);

    // ARMS
    for (let y = 36; y < 50; y++) {
      for (let x = 10; x < 16; x++) {
        this.drawPixelShaded(ctx, x, y, colors.skin, -1);
      }
      for (let x = 48; x < 54; x++) {
        this.drawPixelShaded(ctx, x, y, colors.skin, 1);
      }
    }

    // White gloves
    this.drawRect(ctx, 8, 46, 10, 6, colors.white);
    this.drawRect(ctx, 46, 46, 10, 6, colors.white);

    // PANTS - Dark blue/black
    for (let y = 48; y < 68; y++) {
      for (let x = 22; x < 32; x++) {
        this.drawPixelShaded(ctx, x, y, colors.pants, x < 24 ? -1 : 0);
      }
      for (let x = 32; x < 42; x++) {
        this.drawPixelShaded(ctx, x, y, colors.pants, x > 40 ? 1 : 0);
      }
    }

    // WHITE BOOTS
    for (let y = 68; y < 78; y++) {
      this.drawRect(ctx, 20, y, 12, 1, colors.white);
      this.drawRect(ctx, 32, y, 12, 1, colors.white);
    }
    // Gold boot trim
    this.drawRect(ctx, 20, 68, 12, 2, colors.gold);
    this.drawRect(ctx, 32, 68, 12, 2, colors.gold);
    // Boot soles
    this.drawRect(ctx, 18, 78, 14, 2, colors.armorDark);
    this.drawRect(ctx, 32, 78, 14, 2, colors.armorDark);

    this.cache[key] = canvas;
    return canvas;
  }

  // ===== PICCOLO - ULTRA DETAIL =====
  createPiccolo(state = 'idle', frame = 0) {
    const key = `piccolo_ultra_${state}_${frame}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(64, 80);
    const ctx = canvas.getContext('2d');

    const colors = {
      skin: '#7cb342',
      skinDark: '#558b2f',
      skinLight: '#9ccc65',
      gi: '#6a1b9a',
      giDark: '#4a148c',
      cape: '#ffffff',
      capeShadow: '#e0e0e0',
      turban: '#ffffff'
    };

    // ANTENNAE
    for (let i = 0; i < 6; i++) {
      this.drawRect(ctx, 26, i, 2, 1, colors.skinDark);
      this.drawRect(ctx, 36, i, 2, 1, colors.skinDark);
    }

    // TURBAN
    for (let y = 6; y < 14; y++) {
      const width = 20 - Math.abs(10 - y);
      for (let x = 0; x < width; x++) {
        this.drawPixelShaded(ctx, 22 + x, y, colors.turban, x < 4 ? -1 : (x > width - 4 ? 1 : 0));
      }
    }

    // HEAD
    for (let y = 14; y < 28; y++) {
      const width = y < 20 ? 18 : 16;
      for (let x = 0; x < width; x++) {
        this.drawPixelShaded(ctx, 23 + x, y, colors.skin, x < 3 ? -1 : 0);
      }
    }

    // Pink patches on head
    this.drawRect(ctx, 25, 15, 4, 3, '#e91e63');
    this.drawRect(ctx, 35, 15, 4, 3, '#e91e63');

    // Eyes (stern)
    this.drawRect(ctx, 27, 20, 4, 3, '#000');
    this.drawRect(ctx, 33, 20, 4, 3, '#000');
    this.drawRect(ctx, 28, 21, 1, 1, '#fff');
    this.drawRect(ctx, 34, 21, 1, 1, '#fff');

    // NECK
    this.drawRect(ctx, 28, 28, 8, 4, colors.skin);

    // WEIGHTED CAPE
    for (let y = 32; y < 60; y++) {
      // Left cape
      for (let x = 6; x < 22; x++) {
        const shade = x < 10 ? -1 : (x > 18 ? 1 : 0);
        this.drawPixelShaded(ctx, x, y, colors.cape, shade);
      }
      // Right cape
      for (let x = 42; x < 58; x++) {
        this.drawPixelShaded(ctx, x, y, colors.cape, x > 54 ? 1 : 0);
      }
    }

    // PURPLE GI
    for (let y = 32; y < 50; y++) {
      for (let x = 22; x < 42; x++) {
        const shade = x < 26 ? -1 : (x > 38 ? 1 : 0);
        this.drawPixelShaded(ctx, x, y, colors.gi, shade);
      }
    }

    // Red belt/sash
    this.drawRect(ctx, 22, 48, 20, 4, '#d32f2f');

    // ARMS (under cape)
    for (let y = 36; y < 52; y++) {
      this.drawRect(ctx, 16, y, 6, 1, colors.skin);
      this.drawRect(ctx, 42, y, 6, 1, colors.skin);
    }

    // LEGS
    for (let y = 52; y < 70; y++) {
      this.drawRect(ctx, 24, y, 8, 1, colors.gi);
      this.drawRect(ctx, 32, y, 8, 1, colors.gi);
    }

    // BROWN BOOTS
    for (let y = 70; y < 78; y++) {
      this.drawRect(ctx, 22, y, 10, 1, '#5d4037');
      this.drawRect(ctx, 32, y, 10, 1, '#5d4037');
    }
    this.drawRect(ctx, 20, 78, 12, 2, '#3e2723');
    this.drawRect(ctx, 32, 78, 12, 2, '#3e2723');

    this.cache[key] = canvas;
    return canvas;
  }

  // ===== FRIEZA BOSS - ULTRA DETAIL (96x120) =====
  createFrieza(state = 'idle', frame = 0) {
    const key = `frieza_ultra_${state}_${frame}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(96, 120);
    const ctx = canvas.getContext('2d');

    const colors = {
      body: '#ffffff',
      purple: '#9c27b0',
      purpleDark: '#6a1b9a',
      pink: '#f48fb1',
      red: '#ff1744'
    };

    // HORNS
    for (let i = 0; i < 12; i++) {
      this.drawRect(ctx, 30 + i, 8 - i, 3, 3, colors.purple);
      this.drawRect(ctx, 63 - i, 8 - i, 3, 3, colors.purple);
    }

    // HEAD - Dome shape
    for (let y = 12; y < 30; y++) {
      const width = 30 - Math.abs(21 - y);
      for (let x = 0; x < width; x++) {
        this.drawPixelShaded(ctx, 33 + x, y, colors.body, x < 5 ? -1 : (x > width - 5 ? 1 : 0));
      }
    }

    // Purple dome on head
    for (let y = 14; y < 22; y++) {
      const width = 20 - Math.abs(18 - y) * 2;
      for (let x = 0; x < width; x++) {
        this.drawPixelShaded(ctx, 38 + x, y, colors.purple, 0);
      }
    }

    // RED EYES
    this.drawRect(ctx, 40, 24, 6, 4, colors.red);
    this.drawRect(ctx, 50, 24, 6, 4, colors.red);
    this.drawRect(ctx, 42, 25, 2, 2, '#000');
    this.drawRect(ctx, 52, 25, 2, 2, '#000');

    // Menacing smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(48, 30, 8, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // NECK
    for (let y = 30; y < 38; y++) {
      for (let x = 40; x < 56; x++) {
        this.drawPixelShaded(ctx, x, y, colors.body, 0);
      }
    }

    // TORSO
    for (let y = 38; y < 70; y++) {
      for (let x = 28; x < 68; x++) {
        if (y < 45 && (x < 34 || x > 62)) continue;
        this.drawPixelShaded(ctx, x, y, colors.purple, x < 36 ? -1 : (x > 60 ? 1 : 0));
      }
    }

    // White chest area
    for (let y = 42; y < 65; y++) {
      for (let x = 36; x < 60; x++) {
        this.drawPixelShaded(ctx, x, y, colors.body, 0);
      }
    }
    // Pink bio-gem
    this.drawCircle(ctx, 48, 52, 6, colors.pink);

    // ARMS
    for (let y = 42; y < 70; y++) {
      for (let x = 18; x < 28; x++) {
        this.drawPixelShaded(ctx, x, y, colors.body, -1);
      }
      for (let x = 68; x < 78; x++) {
        this.drawPixelShaded(ctx, x, y, colors.body, 1);
      }
    }
    // Purple segments on arms
    this.drawRect(ctx, 18, 52, 10, 4, colors.purple);
    this.drawRect(ctx, 68, 52, 10, 4, colors.purple);

    // LEGS
    for (let y = 70; y < 100; y++) {
      for (let x = 36; x < 46; x++) {
        this.drawPixelShaded(ctx, x, y, colors.body, -1);
      }
      for (let x = 50; x < 60; x++) {
        this.drawPixelShaded(ctx, x, y, colors.body, 1);
      }
    }

    // TAIL - sinuous
    const tailWave = Math.sin(frame * 0.3) * 4;
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(60, 85);
    ctx.bezierCurveTo(75, 85 + tailWave, 85, 75 + tailWave, 90, 60);
    ctx.stroke();
    // Tail tip
    ctx.strokeStyle = colors.purple;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(88, 62);
    ctx.lineTo(92, 55);
    ctx.stroke();

    // FEET
    for (let y = 100; y < 115; y++) {
      this.drawRect(ctx, 32, y, 16, 1, colors.purple);
      this.drawRect(ctx, 48, y, 16, 1, colors.purple);
    }

    this.cache[key] = canvas;
    return canvas;
  }

  // ===== CELL BOSS - ULTRA DETAIL =====
  createCell(state = 'idle', frame = 0) {
    const key = `cell_ultra_${state}_${frame}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(96, 120);
    const ctx = canvas.getContext('2d');

    const colors = {
      body: '#7cb342',
      bodyDark: '#558b2f',
      spots: '#1b5e20',
      purple: '#7b1fa2',
      wings: '#33691e',
      crown: '#1a1a1a'
    };

    // CROWN - Black spikes
    for (let i = 0; i < 9; i++) {
      const heights = [8, 12, 16, 20, 24, 20, 16, 12, 8];
      for (let j = 0; j < heights[i]; j++) {
        this.drawRect(ctx, 36 + i * 3, 10 - j, 2, 1, colors.crown);
      }
    }

    // HEAD
    for (let y = 12; y < 32; y++) {
      const width = 28 - Math.abs(22 - y);
      for (let x = 0; x < width; x++) {
        this.drawPixelShaded(ctx, 34 + x, y, colors.body, x < 5 ? -1 : 0);
      }
    }

    // Purple face markings
    this.drawRect(ctx, 38, 16, 4, 8, colors.purple);
    this.drawRect(ctx, 54, 16, 4, 8, colors.purple);

    // Orange eyes
    this.drawRect(ctx, 40, 22, 6, 4, '#ff9800');
    this.drawRect(ctx, 50, 22, 6, 4, '#ff9800');
    this.drawRect(ctx, 42, 23, 2, 2, '#000');
    this.drawRect(ctx, 52, 23, 2, 2, '#000');

    // Smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(48, 28, 6, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // NECK
    this.drawRect(ctx, 40, 32, 16, 8, colors.body);

    // WINGS
    for (let y = 38; y < 75; y++) {
      const wingWidth = Math.max(0, 20 - (y - 38) / 2);
      for (let x = 0; x < wingWidth; x++) {
        this.drawPixelShaded(ctx, 20 - x, y, colors.wings, -1);
        this.drawPixelShaded(ctx, 76 + x, y, colors.wings, 1);
      }
    }

    // TORSO
    for (let y = 40; y < 75; y++) {
      for (let x = 30; x < 66; x++) {
        this.drawPixelShaded(ctx, x, y, colors.body, x < 36 ? -1 : (x > 60 ? 1 : 0));
      }
    }

    // Black spots
    const spotPositions = [[38, 45], [54, 48], [42, 58], [50, 62], [46, 52]];
    for (const [sx, sy] of spotPositions) {
      this.drawCircle(ctx, sx, sy, 4, colors.spots);
    }

    // ARMS
    for (let y = 44; y < 72; y++) {
      for (let x = 16; x < 30; x++) {
        this.drawPixelShaded(ctx, x, y, colors.body, -1);
      }
      for (let x = 66; x < 80; x++) {
        this.drawPixelShaded(ctx, x, y, colors.body, 1);
      }
    }

    // LEGS
    for (let y = 75; y < 105; y++) {
      for (let x = 36; x < 48; x++) {
        this.drawPixelShaded(ctx, x, y, colors.body, -1);
      }
      for (let x = 48; x < 60; x++) {
        this.drawPixelShaded(ctx, x, y, colors.body, 1);
      }
    }
    // Leg spots
    this.drawCircle(ctx, 42, 85, 3, colors.spots);
    this.drawCircle(ctx, 54, 90, 3, colors.spots);

    // FEET
    for (let y = 105; y < 118; y++) {
      this.drawRect(ctx, 32, y, 18, 1, colors.spots);
      this.drawRect(ctx, 46, y, 18, 1, colors.spots);
    }

    this.cache[key] = canvas;
    return canvas;
  }

  // ===== BUU BOSS - ULTRA DETAIL =====
  createBuu(state = 'idle', frame = 0) {
    const key = `buu_ultra_${state}_${frame}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(96, 120);
    const ctx = canvas.getContext('2d');

    const colors = {
      body: '#ff69b4',
      bodyDark: '#e91e63',
      bodyLight: '#f8bbd9',
      pants: '#ffffff',
      pantsShadow: '#e0e0e0'
    };

    // HEAD TENTACLE (antenna)
    const wobble = Math.sin(frame * 0.2) * 3;
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(48, 20);
    ctx.bezierCurveTo(48 + wobble, 0, 55 + wobble, -10, 60, 5);
    ctx.stroke();

    // ROUND HEAD
    for (let y = 18; y < 42; y++) {
      const radius = 16 - Math.abs(30 - y) * 0.5;
      for (let x = 0; x < radius * 2; x++) {
        const xPos = 48 - radius + x;
        this.drawPixelShaded(ctx, xPos, y, colors.body, x < 5 ? -1 : (x > radius * 2 - 5 ? 1 : 0));
      }
    }

    // Steam vents
    this.drawRect(ctx, 36, 20, 4, 4, colors.bodyDark);
    this.drawRect(ctx, 56, 20, 4, 4, colors.bodyDark);
    // Steam puffs
    if (frame % 4 < 2) {
      this.drawCircle(ctx, 38, 16, 3, 'rgba(255,255,255,0.5)');
      this.drawCircle(ctx, 58, 16, 3, 'rgba(255,255,255,0.5)');
    }

    // Evil eyes
    this.drawRect(ctx, 38, 28, 8, 6, '#000');
    this.drawRect(ctx, 50, 28, 8, 6, '#000');
    this.drawRect(ctx, 40, 30, 4, 3, '#fff');
    this.drawRect(ctx, 52, 30, 4, 3, '#fff');
    this.drawRect(ctx, 41, 31, 2, 2, '#ff0000');
    this.drawRect(ctx, 53, 31, 2, 2, '#ff0000');

    // Evil grin
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(48, 36, 10, 0, Math.PI);
    ctx.stroke();
    // Teeth
    for (let i = 0; i < 5; i++) {
      this.drawRect(ctx, 40 + i * 4, 36, 3, 4, '#fff');
    }

    // MUSCULAR TORSO
    for (let y = 42; y < 75; y++) {
      const width = 40 - Math.abs(58 - y) * 0.3;
      for (let x = 0; x < width; x++) {
        this.drawPixelShaded(ctx, 48 - width / 2 + x, y, colors.body, x < 8 ? -1 : (x > width - 8 ? 1 : 0));
      }
    }

    // Chest muscles definition
    ctx.strokeStyle = colors.bodyDark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, 45);
    ctx.lineTo(48, 60);
    ctx.moveTo(38, 50);
    ctx.lineTo(42, 55);
    ctx.moveTo(58, 50);
    ctx.lineTo(54, 55);
    ctx.stroke();

    // BELT
    this.drawRect(ctx, 28, 72, 40, 6, '#000');
    // Golden M buckle
    this.drawRect(ctx, 42, 73, 12, 4, '#ffd700');

    // ARMS - Muscular
    for (let y = 48; y < 75; y++) {
      // Left arm
      const armWidth = 10 - Math.abs(62 - y) * 0.2;
      for (let x = 0; x < armWidth; x++) {
        this.drawPixelShaded(ctx, 22 - armWidth / 2 + x, y, colors.body, -1);
      }
      // Right arm
      for (let x = 0; x < armWidth; x++) {
        this.drawPixelShaded(ctx, 74 - armWidth / 2 + x, y, colors.body, 1);
      }
    }

    // WHITE PANTS
    for (let y = 78; y < 110; y++) {
      const width = 36 - Math.abs(94 - y) * 0.4;
      for (let x = 0; x < width; x++) {
        const shade = x < 6 ? -1 : (x > width - 6 ? 1 : 0);
        this.drawPixelShaded(ctx, 48 - width / 2 + x, y, colors.pants, shade);
      }
    }

    // FEET
    for (let y = 110; y < 118; y++) {
      this.drawRect(ctx, 32, y, 14, 1, colors.body);
      this.drawRect(ctx, 50, y, 14, 1, colors.body);
    }

    this.cache[key] = canvas;
    return canvas;
  }

  // Get character sprite
  getCharacterSprite(character, state, frame, ssj = false) {
    switch (character.toLowerCase()) {
      case 'goku': return this.createGoku(state, frame, ssj);
      case 'vegeta': return this.createVegeta(state, frame, ssj);
      case 'piccolo': return this.createPiccolo(state, frame);
      default: return this.createGoku(state, frame, ssj);
    }
  }

  getBossSprite(bossType, state, frame) {
    switch (bossType.toLowerCase()) {
      case 'frieza': return this.createFrieza(state, frame);
      case 'cell': return this.createCell(state, frame);
      case 'buu': return this.createBuu(state, frame);
      default: return this.createFrieza(state, frame);
    }
  }
}

// Global instance
const ultraSprites = new UltraSprites();

console.log('Ultra Sprites system loaded! High-detail 64x80 and 96x120 sprites available.');
