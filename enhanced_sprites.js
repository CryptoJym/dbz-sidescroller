// ============================================================================
// ENHANCED SPRITES - Larger, more detailed procedural pixel art
// Character sprites at 32x40, Boss sprites at 48x60
// ============================================================================

class EnhancedSprites {
  constructor() {
    this.cache = {};
  }

  createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  drawPixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  // Get character sprite
  getCharacterSprite(character, state, frame, ssj = false) {
    switch(character.toLowerCase()) {
      case 'goku': return this.createGoku(state, frame, ssj);
      case 'vegeta': return this.createVegeta(state, frame, ssj);
      case 'piccolo': return this.createPiccolo(state, frame);
      case 'gohan': return this.createGohan(state, frame, ssj);
      case 'trunks': return this.createTrunks(state, frame, ssj);
      default: return this.createGoku(state, frame, ssj);
    }
  }

  getEnemySprite(enemyType, state, frame) {
    switch(enemyType.toLowerCase()) {
      case 'soldier': return this.createFriezaSoldier(state, frame);
      case 'saibaman': return this.createSaibaman(state, frame);
      case 'celljr': return this.createCellJr(state, frame);
      default: return this.createFriezaSoldier(state, frame);
    }
  }

  getBossSprite(bossType, state, frame) {
    switch(bossType.toLowerCase()) {
      case 'frieza': return this.createFrieza(state, frame);
      case 'cell': return this.createCell(state, frame);
      case 'buu': return this.createBuu(state, frame);
      default: return this.createFrieza(state, frame);
    }
  }

  // ===== CHARACTER SPRITES (32x40) =====

  createGoku(state = 'idle', frame = 0, ssj = false) {
    const key = `goku_${state}_${frame}_${ssj}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(32, 40);
    const ctx = canvas.getContext('2d');

    const skinColor = '#fdbcb4';
    const hairColor = ssj ? '#f4d03f' : '#000000';
    const giColor = '#ff6b35';
    const beltColor = '#3a86ff';
    const bootsColor = '#ffd23f';

    // Draw SSJ aura if active
    if (ssj) {
      ctx.fillStyle = 'rgba(244, 208, 63, 0.4)';
      for (let i = 0; i < 3; i++) {
        const offset = frame % 2 === 0 ? i : -i;
        ctx.fillRect(2 + offset, 5 + i * 8, 28 - i * 2, 30);
      }
    }

    // Spiky hair
    for (let i = 0; i < 7; i++) {
      const spikeX = 11 + i;
      const spikeHeight = state === 'jump' ? [4, 3, 4, 3, 4, 3, 3][i] : [3, 2, 3, 2, 3, 2, 2][i];
      for (let j = 0; j < spikeHeight; j++) {
        this.drawPixel(ctx, spikeX, 4 - j, hairColor);
      }
    }
    this.drawPixel(ctx, 10, 3, hairColor);
    this.drawPixel(ctx, 19, 3, hairColor);

    // Face
    for (let y = 5; y < 10; y++) {
      for (let x = 12; x < 19; x++) {
        this.drawPixel(ctx, x, y, skinColor);
      }
    }

    // Eyes
    this.drawPixel(ctx, 13, 7, '#000');
    this.drawPixel(ctx, 14, 7, '#fff');
    this.drawPixel(ctx, 16, 7, '#000');
    this.drawPixel(ctx, 17, 7, '#fff');

    // Neck
    for (let x = 13; x < 18; x++) {
      this.drawPixel(ctx, x, 10, skinColor);
      this.drawPixel(ctx, x, 11, skinColor);
    }

    // Orange Gi torso
    for (let y = 12; y < 22; y++) {
      for (let x = 10; x < 21; x++) {
        if (y < 14 && (x < 12 || x > 18)) continue;
        this.drawPixel(ctx, x, y, giColor);
      }
    }

    // Blue undershirt
    for (let x = 13; x < 18; x++) {
      this.drawPixel(ctx, x, 13, beltColor);
      this.drawPixel(ctx, x, 14, beltColor);
    }

    // Belt
    for (let x = 10; x < 21; x++) {
      this.drawPixel(ctx, x, 21, beltColor);
    }
    this.drawPixel(ctx, 15, 21, '#ffd23f');

    // Arms
    const armOffset = frame % 2 === 0 ? 0 : 1;
    for (let y = 14; y < 22; y++) {
      for (let x = 8; x < 10; x++) {
        this.drawPixel(ctx, x, y + armOffset, y < 16 ? giColor : skinColor);
      }
      for (let x = 21; x < 23; x++) {
        this.drawPixel(ctx, x, y - armOffset, y < 16 ? giColor : skinColor);
      }
    }

    // Legs
    const legAnim = state === 'run' ? frame % 4 : 0;
    for (let y = 22; y < 32; y++) {
      if (legAnim < 2) {
        for (let x = 11; x < 15; x++) this.drawPixel(ctx, x, y, giColor);
        for (let x = 16; x < 20; x++) this.drawPixel(ctx, x, y, giColor);
      } else {
        for (let x = 9; x < 13; x++) this.drawPixel(ctx, x, y, giColor);
        for (let x = 18; x < 22; x++) this.drawPixel(ctx, x, y, giColor);
      }
    }

    // Boots
    for (let y = 32; y < 38; y++) {
      for (let x = 10; x < 15; x++) this.drawPixel(ctx, x, y, bootsColor);
      for (let x = 16; x < 21; x++) this.drawPixel(ctx, x, y, bootsColor);
    }
    for (let x = 10; x < 15; x++) {
      this.drawPixel(ctx, x, 38, '#8b4513');
      this.drawPixel(ctx, x, 39, '#8b4513');
    }
    for (let x = 16; x < 21; x++) {
      this.drawPixel(ctx, x, 38, '#8b4513');
      this.drawPixel(ctx, x, 39, '#8b4513');
    }

    this.cache[key] = canvas;
    return canvas;
  }

  createVegeta(state = 'idle', frame = 0, ssj = false) {
    const key = `vegeta_${state}_${frame}_${ssj}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(32, 40);
    const ctx = canvas.getContext('2d');

    const skinColor = '#fdbcb4';
    const hairColor = ssj ? '#f4d03f' : '#000000';
    const armorColor = '#3a5ba0';
    const armorAccent = '#fff';

    // Widow's peak hair
    for (let y = 0; y < 4; y++) this.drawPixel(ctx, 15, y, hairColor);
    for (let i = 0; i < 6; i++) {
      const height = [2, 3, 3, 3, 2, 1][i];
      for (let j = 0; j < height; j++) this.drawPixel(ctx, 11 + i, 3 - j, hairColor);
    }
    this.drawPixel(ctx, 13, 4, hairColor);
    this.drawPixel(ctx, 17, 4, hairColor);

    // Face with scowl
    for (let y = 5; y < 10; y++) {
      for (let x = 12; x < 19; x++) this.drawPixel(ctx, x, y, skinColor);
    }
    this.drawPixel(ctx, 13, 7, '#000');
    this.drawPixel(ctx, 14, 6, '#000');
    this.drawPixel(ctx, 16, 7, '#000');
    this.drawPixel(ctx, 17, 6, '#000');

    // Neck
    for (let x = 13; x < 18; x++) {
      this.drawPixel(ctx, x, 10, skinColor);
      this.drawPixel(ctx, x, 11, skinColor);
    }

    // Blue armor
    for (let y = 12; y < 22; y++) {
      for (let x = 9; x < 22; x++) {
        if (y < 15 && (x < 11 || x > 19)) continue;
        this.drawPixel(ctx, x, y, armorColor);
      }
    }

    // White accents
    for (let x = 10; x < 21; x++) this.drawPixel(ctx, x, 12, armorAccent);
    for (let y = 13; y < 22; y++) {
      this.drawPixel(ctx, 10, y, armorAccent);
      this.drawPixel(ctx, 20, y, armorAccent);
    }

    // Shoulders
    for (let y = 12; y < 15; y++) {
      for (let x = 7; x < 10; x++) this.drawPixel(ctx, x, y, armorAccent);
      for (let x = 21; x < 24; x++) this.drawPixel(ctx, x, y, armorAccent);
    }

    // Arms
    for (let y = 15; y < 22; y++) {
      for (let x = 7; x < 9; x++) this.drawPixel(ctx, x, y, skinColor);
      for (let x = 22; x < 24; x++) this.drawPixel(ctx, x, y, skinColor);
    }

    // Black pants
    for (let y = 22; y < 32; y++) {
      for (let x = 11; x < 15; x++) this.drawPixel(ctx, x, y, '#1a1a2e');
      for (let x = 16; x < 20; x++) this.drawPixel(ctx, x, y, '#1a1a2e');
    }

    // White boots
    for (let y = 32; y < 39; y++) {
      for (let x = 10; x < 15; x++) this.drawPixel(ctx, x, y, '#fff');
      for (let x = 16; x < 21; x++) this.drawPixel(ctx, x, y, '#fff');
    }
    for (let x = 10; x < 15; x++) this.drawPixel(ctx, x, 38, armorColor);
    for (let x = 16; x < 21; x++) this.drawPixel(ctx, x, 38, armorColor);

    this.cache[key] = canvas;
    return canvas;
  }

  createPiccolo(state = 'idle', frame = 0) {
    const key = `piccolo_${state}_${frame}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(32, 40);
    const ctx = canvas.getContext('2d');

    const skinColor = '#7cb342';
    const darkGreen = '#558b2f';
    const turbanColor = '#fff';
    const giColor = '#5e35b1';

    // Antennae
    this.drawPixel(ctx, 12, 0, darkGreen);
    this.drawPixel(ctx, 18, 0, darkGreen);
    this.drawPixel(ctx, 12, 1, darkGreen);
    this.drawPixel(ctx, 18, 1, darkGreen);

    // Turban
    for (let y = 2; y < 5; y++) {
      for (let x = 11; x < 20; x++) this.drawPixel(ctx, x, y, turbanColor);
    }

    // Head
    for (let y = 5; y < 11; y++) {
      for (let x = 12; x < 19; x++) this.drawPixel(ctx, x, y, skinColor);
    }
    for (let x = 12; x < 19; x++) this.drawPixel(ctx, x, 6, darkGreen);
    this.drawPixel(ctx, 13, 8, '#000');
    this.drawPixel(ctx, 14, 8, '#000');
    this.drawPixel(ctx, 16, 8, '#000');
    this.drawPixel(ctx, 17, 8, '#000');

    // Neck
    for (let x = 13; x < 18; x++) {
      this.drawPixel(ctx, x, 11, skinColor);
      this.drawPixel(ctx, x, 12, skinColor);
    }

    // Cape shoulders
    for (let y = 12; y < 23; y++) {
      for (let x = 6; x < 10; x++) this.drawPixel(ctx, x, y, '#fff');
      for (let x = 21; x < 25; x++) this.drawPixel(ctx, x, y, '#fff');
    }

    // Purple gi
    for (let y = 13; y < 22; y++) {
      for (let x = 10; x < 21; x++) this.drawPixel(ctx, x, y, giColor);
    }

    // Belt
    for (let x = 10; x < 21; x++) {
      this.drawPixel(ctx, x, 21, '#d32f2f');
      this.drawPixel(ctx, x, 22, '#d32f2f');
    }

    // Arms
    for (let y = 15; y < 23; y++) {
      for (let x = 8; x < 10; x++) this.drawPixel(ctx, x, y, skinColor);
      for (let x = 21; x < 23; x++) this.drawPixel(ctx, x, y, skinColor);
    }

    // Legs
    for (let y = 23; y < 33; y++) {
      for (let x = 11; x < 15; x++) this.drawPixel(ctx, x, y, giColor);
      for (let x = 16; x < 20; x++) this.drawPixel(ctx, x, y, giColor);
    }

    // Boots
    for (let y = 33; y < 39; y++) {
      for (let x = 10; x < 15; x++) this.drawPixel(ctx, x, y, '#8b4513');
      for (let x = 16; x < 21; x++) this.drawPixel(ctx, x, y, '#8b4513');
    }

    this.cache[key] = canvas;
    return canvas;
  }

  createGohan(state = 'idle', frame = 0, ssj = false) {
    const key = `gohan_${state}_${frame}_${ssj}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(32, 40);
    const ctx = canvas.getContext('2d');

    const skinColor = '#fdbcb4';
    const hairColor = ssj ? '#f4d03f' : '#000000';
    const giColor = '#7b1fa2';

    // Messy hair
    for (let i = 0; i < 8; i++) {
      const heights = [3, 2, 3, 4, 3, 2, 3, 2];
      for (let j = 0; j < heights[i]; j++) this.drawPixel(ctx, 10 + i, 3 - j, hairColor);
    }
    this.drawPixel(ctx, 13, 4, hairColor);
    this.drawPixel(ctx, 14, 5, hairColor);
    this.drawPixel(ctx, 16, 5, hairColor);
    this.drawPixel(ctx, 17, 4, hairColor);

    // Face
    for (let y = 6; y < 11; y++) {
      for (let x = 12; x < 19; x++) this.drawPixel(ctx, x, y, skinColor);
    }
    this.drawPixel(ctx, 13, 8, '#000');
    this.drawPixel(ctx, 14, 8, '#fff');
    this.drawPixel(ctx, 16, 8, '#000');
    this.drawPixel(ctx, 17, 8, '#fff');

    // Purple gi
    for (let y = 13; y < 22; y++) {
      for (let x = 10; x < 21; x++) this.drawPixel(ctx, x, y, giColor);
    }

    // White belt
    for (let x = 10; x < 21; x++) this.drawPixel(ctx, x, 21, '#fff');

    // Arms
    for (let y = 15; y < 22; y++) {
      for (let x = 8; x < 10; x++) this.drawPixel(ctx, x, y, skinColor);
      for (let x = 21; x < 23; x++) this.drawPixel(ctx, x, y, skinColor);
    }

    // Legs
    for (let y = 22; y < 32; y++) {
      for (let x = 11; x < 15; x++) this.drawPixel(ctx, x, y, giColor);
      for (let x = 16; x < 20; x++) this.drawPixel(ctx, x, y, giColor);
    }

    // Boots
    for (let y = 32; y < 39; y++) {
      for (let x = 10; x < 15; x++) this.drawPixel(ctx, x, y, '#1a237e');
      for (let x = 16; x < 21; x++) this.drawPixel(ctx, x, y, '#1a237e');
    }

    this.cache[key] = canvas;
    return canvas;
  }

  createTrunks(state = 'idle', frame = 0, ssj = false) {
    const key = `trunks_${state}_${frame}_${ssj}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(32, 40);
    const ctx = canvas.getContext('2d');

    const skinColor = '#fdbcb4';
    const hairColor = ssj ? '#f4d03f' : '#9575cd';
    const jacketColor = '#1565c0';

    // Lavender/gold hair
    for (let i = 0; i < 7; i++) {
      const heights = [3, 4, 3, 4, 3, 3, 2];
      for (let j = 0; j < heights[i]; j++) this.drawPixel(ctx, 11 + i, 3 - j, hairColor);
    }

    // Face
    for (let y = 5; y < 10; y++) {
      for (let x = 12; x < 19; x++) this.drawPixel(ctx, x, y, skinColor);
    }
    this.drawPixel(ctx, 13, 7, '#0091ea');
    this.drawPixel(ctx, 16, 7, '#0091ea');

    // Jacket
    for (let y = 12; y < 23; y++) {
      for (let x = 9; x < 22; x++) this.drawPixel(ctx, x, y, jacketColor);
    }
    for (let x = 12; x < 19; x++) this.drawPixel(ctx, x, 12, '#fff');

    // Sword on back
    for (let y = 13; y < 20; y++) this.drawPixel(ctx, 8, y, '#c0c0c0');
    this.drawPixel(ctx, 8, 12, '#ffd700');

    // Arms
    for (let y = 15; y < 23; y++) {
      for (let x = 7; x < 9; x++) this.drawPixel(ctx, x, y, jacketColor);
      for (let x = 22; x < 24; x++) this.drawPixel(ctx, x, y, jacketColor);
    }
    for (let y = 20; y < 23; y++) {
      this.drawPixel(ctx, 7, y, skinColor);
      this.drawPixel(ctx, 23, y, skinColor);
    }

    // Pants
    for (let y = 23; y < 33; y++) {
      for (let x = 11; x < 15; x++) this.drawPixel(ctx, x, y, '#424242');
      for (let x = 16; x < 20; x++) this.drawPixel(ctx, x, y, '#424242');
    }

    // Boots
    for (let y = 33; y < 39; y++) {
      for (let x = 10; x < 15; x++) this.drawPixel(ctx, x, y, '#000');
      for (let x = 16; x < 21; x++) this.drawPixel(ctx, x, y, '#000');
    }

    this.cache[key] = canvas;
    return canvas;
  }

  // ===== ENEMY SPRITES =====

  createFriezaSoldier(state = 'idle', frame = 0) {
    const key = `frieza_soldier_${state}_${frame}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(28, 36);
    const ctx = canvas.getContext('2d');

    const skinColor = '#8e44ad';
    const armorColor = '#9b59b6';

    // Head
    for (let y = 3; y < 9; y++) {
      for (let x = 10; x < 18; x++) this.drawPixel(ctx, x, y, skinColor);
    }
    for (let x = 10; x < 14; x++) this.drawPixel(ctx, x, 5, '#ff0000'); // Scouter
    this.drawPixel(ctx, 15, 6, '#000');
    this.drawPixel(ctx, 16, 6, '#000');

    // Armor
    for (let y = 10; y < 20; y++) {
      for (let x = 8; x < 20; x++) this.drawPixel(ctx, x, y, armorColor);
    }
    for (let x = 9; x < 19; x++) this.drawPixel(ctx, x, 11, '#6a1b9a');

    // Arms
    for (let y = 12; y < 20; y++) {
      for (let x = 6; x < 8; x++) this.drawPixel(ctx, x, y, skinColor);
      for (let x = 20; x < 22; x++) this.drawPixel(ctx, x, y, skinColor);
    }

    // Legs
    for (let y = 20; y < 30; y++) {
      for (let x = 10; x < 13; x++) this.drawPixel(ctx, x, y, skinColor);
      for (let x = 15; x < 18; x++) this.drawPixel(ctx, x, y, skinColor);
    }

    // Boots
    for (let y = 30; y < 35; y++) {
      for (let x = 9; x < 14; x++) this.drawPixel(ctx, x, y, '#fff');
      for (let x = 14; x < 19; x++) this.drawPixel(ctx, x, y, '#fff');
    }

    this.cache[key] = canvas;
    return canvas;
  }

  createSaibaman(state = 'idle', frame = 0) {
    const key = `saibaman_${state}_${frame}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(24, 32);
    const ctx = canvas.getContext('2d');

    const bodyColor = '#4caf50';
    const darkGreen = '#2e7d32';

    // Head
    for (let y = 2; y < 8; y++) {
      for (let x = 8; x < 16; x++) this.drawPixel(ctx, x, y, bodyColor);
    }
    this.drawPixel(ctx, 10, 3, darkGreen);
    this.drawPixel(ctx, 13, 4, darkGreen);
    this.drawPixel(ctx, 10, 5, '#ff0000');
    this.drawPixel(ctx, 13, 5, '#ff0000');

    // Body
    for (let y = 8; y < 20; y++) {
      for (let x = 7; x < 17; x++) this.drawPixel(ctx, x, y, bodyColor);
    }
    this.drawPixel(ctx, 9, 10, darkGreen);
    this.drawPixel(ctx, 14, 12, darkGreen);
    this.drawPixel(ctx, 10, 15, darkGreen);

    // Arms with claws
    for (let y = 10; y < 16; y++) {
      this.drawPixel(ctx, 5, y, bodyColor);
      this.drawPixel(ctx, 6, y, bodyColor);
      this.drawPixel(ctx, 17, y, bodyColor);
      this.drawPixel(ctx, 18, y, bodyColor);
    }
    for (let i = 0; i < 3; i++) {
      this.drawPixel(ctx, 4 + i, 16 + i, '#1b5e20');
      this.drawPixel(ctx, 19 - i, 16 + i, '#1b5e20');
    }

    // Legs
    for (let y = 20; y < 28; y++) {
      for (let x = 8; x < 11; x++) this.drawPixel(ctx, x, y, bodyColor);
      for (let x = 13; x < 16; x++) this.drawPixel(ctx, x, y, bodyColor);
    }

    // Feet
    for (let y = 28; y < 31; y++) {
      for (let x = 7; x < 12; x++) this.drawPixel(ctx, x, y, darkGreen);
      for (let x = 12; x < 17; x++) this.drawPixel(ctx, x, y, darkGreen);
    }

    this.cache[key] = canvas;
    return canvas;
  }

  createCellJr(state = 'idle', frame = 0) {
    const key = `cell_jr_${state}_${frame}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(26, 34);
    const ctx = canvas.getContext('2d');

    const bodyColor = '#7cb342';
    const spotColor = '#558b2f';
    const wingColor = '#33691e';

    // Crown
    for (let i = 0; i < 5; i++) {
      const heights = [2, 3, 4, 3, 2];
      for (let j = 0; j < heights[i]; j++) this.drawPixel(ctx, 10 + i, 2 - j, spotColor);
    }

    // Head
    for (let y = 3; y < 9; y++) {
      for (let x = 9; x < 17; x++) this.drawPixel(ctx, x, y, bodyColor);
    }
    this.drawPixel(ctx, 11, 5, spotColor);
    this.drawPixel(ctx, 14, 6, spotColor);
    this.drawPixel(ctx, 11, 6, '#ff0000');
    this.drawPixel(ctx, 14, 6, '#ff0000');

    // Wings
    for (let y = 10; y < 16; y++) {
      this.drawPixel(ctx, 6, y, wingColor);
      this.drawPixel(ctx, 7, y, wingColor);
      this.drawPixel(ctx, 18, y, wingColor);
      this.drawPixel(ctx, 19, y, wingColor);
    }

    // Body
    for (let y = 9; y < 22; y++) {
      for (let x = 8; x < 18; x++) this.drawPixel(ctx, x, y, bodyColor);
    }
    this.drawPixel(ctx, 10, 11, spotColor);
    this.drawPixel(ctx, 15, 13, spotColor);
    this.drawPixel(ctx, 11, 16, spotColor);
    this.drawPixel(ctx, 14, 18, spotColor);

    // Legs
    for (let y = 22; y < 31; y++) {
      for (let x = 9; x < 12; x++) this.drawPixel(ctx, x, y, bodyColor);
      for (let x = 14; x < 17; x++) this.drawPixel(ctx, x, y, bodyColor);
    }

    // Feet
    for (let y = 31; y < 33; y++) {
      for (let x = 8; x < 13; x++) this.drawPixel(ctx, x, y, spotColor);
      for (let x = 13; x < 18; x++) this.drawPixel(ctx, x, y, spotColor);
    }

    this.cache[key] = canvas;
    return canvas;
  }

  // ===== BOSS SPRITES (48x60) =====

  createFrieza(state = 'idle', frame = 0) {
    const key = `frieza_${state}_${frame}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(48, 60);
    const ctx = canvas.getContext('2d');

    const bodyColor = '#fff';
    const purpleColor = '#9c27b0';

    // Horns
    for (let i = 0; i < 4; i++) {
      this.drawPixel(ctx, 18 + i, 5 - i, purpleColor);
      this.drawPixel(ctx, 29 - i, 5 - i, purpleColor);
    }

    // Head
    for (let y = 6; y < 14; y++) {
      for (let x = 18; x < 30; x++) this.drawPixel(ctx, x, y, bodyColor);
    }
    for (let x = 19; x < 29; x++) {
      this.drawPixel(ctx, x, 7, purpleColor);
      this.drawPixel(ctx, x, 8, purpleColor);
    }
    for (let x = 20; x < 22; x++) this.drawPixel(ctx, x, 10, '#ff0000');
    for (let x = 26; x < 28; x++) this.drawPixel(ctx, x, 10, '#ff0000');
    for (let x = 21; x < 27; x++) this.drawPixel(ctx, x, 13, '#000');

    // Neck
    for (let x = 21; x < 27; x++) {
      this.drawPixel(ctx, x, 14, bodyColor);
      this.drawPixel(ctx, x, 15, bodyColor);
    }

    // Torso
    for (let y = 16; y < 32; y++) {
      for (let x = 16; x < 32; x++) {
        if (y < 20 && (x < 19 || x > 28)) continue;
        this.drawPixel(ctx, x, y, purpleColor);
      }
    }
    for (let y = 18; y < 30; y++) {
      for (let x = 20; x < 28; x++) this.drawPixel(ctx, x, y, bodyColor);
    }

    // Arms
    for (let y = 18; y < 30; y++) {
      for (let x = 12; x < 16; x++) this.drawPixel(ctx, x, y, bodyColor);
      for (let x = 32; x < 36; x++) this.drawPixel(ctx, x, y, bodyColor);
    }
    for (let x = 12; x < 16; x++) this.drawPixel(ctx, x, 22, purpleColor);
    for (let x = 32; x < 36; x++) this.drawPixel(ctx, x, 22, purpleColor);

    // Legs
    for (let y = 32; y < 48; y++) {
      for (let x = 18; x < 22; x++) this.drawPixel(ctx, x, y, bodyColor);
      for (let x = 26; x < 30; x++) this.drawPixel(ctx, x, y, bodyColor);
    }

    // Tail
    const tailWave = frame % 2 === 0 ? 0 : 2;
    for (let i = 0; i < 8; i++) {
      this.drawPixel(ctx, 30 + i, 45 - i + tailWave, bodyColor);
      if (i > 5) this.drawPixel(ctx, 30 + i, 44 - i + tailWave, purpleColor);
    }

    // Feet
    for (let y = 48; y < 56; y++) {
      for (let x = 17; x < 23; x++) this.drawPixel(ctx, x, y, purpleColor);
      for (let x = 25; x < 31; x++) this.drawPixel(ctx, x, y, purpleColor);
    }

    this.cache[key] = canvas;
    return canvas;
  }

  createCell(state = 'idle', frame = 0) {
    const key = `cell_${state}_${frame}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(48, 60);
    const ctx = canvas.getContext('2d');

    const bodyColor = '#7cb342';
    const spotColor = '#33691e';
    const wingColor = '#1b5e20';

    // Crown
    for (let i = 0; i < 7; i++) {
      const heights = [3, 4, 5, 6, 5, 4, 3];
      for (let j = 0; j < heights[i]; j++) this.drawPixel(ctx, 18 + i, 4 - j, '#000');
    }

    // Head
    for (let y = 5; y < 14; y++) {
      for (let x = 17; x < 31; x++) this.drawPixel(ctx, x, y, bodyColor);
    }
    for (let i = 0; i < 4; i++) this.drawPixel(ctx, 19 + i * 3, 7 + i, spotColor);
    for (let x = 20; x < 23; x++) this.drawPixel(ctx, x, 9, '#ff0000');
    for (let x = 24; x < 27; x++) this.drawPixel(ctx, x, 9, '#ff0000');
    for (let x = 22; x < 26; x++) {
      this.drawPixel(ctx, x, 12, '#000');
      this.drawPixel(ctx, x, 13, '#000');
    }

    // Neck
    for (let y = 14; y < 18; y++) {
      for (let x = 20; x < 28; x++) this.drawPixel(ctx, x, y, bodyColor);
    }

    // Wings
    for (let y = 18; y < 36; y++) {
      const wingWidth = Math.floor((36 - y) / 3);
      for (let x = 0; x < wingWidth; x++) {
        this.drawPixel(ctx, 14 - x, y, wingColor);
        this.drawPixel(ctx, 33 + x, y, wingColor);
      }
    }

    // Torso
    for (let y = 18; y < 38; y++) {
      for (let x = 16; x < 32; x++) this.drawPixel(ctx, x, y, bodyColor);
    }
    for (let i = 0; i < 8; i++) {
      const spotX = 18 + (i % 3) * 4;
      const spotY = 20 + Math.floor(i / 3) * 5;
      this.drawPixel(ctx, spotX, spotY, spotColor);
      this.drawPixel(ctx, spotX + 1, spotY, spotColor);
    }

    // Arms
    for (let y = 20; y < 34; y++) {
      for (let x = 11; x < 16; x++) this.drawPixel(ctx, x, y, bodyColor);
      for (let x = 32; x < 37; x++) this.drawPixel(ctx, x, y, bodyColor);
    }

    // Legs
    for (let y = 38; y < 52; y++) {
      for (let x = 18; x < 23; x++) this.drawPixel(ctx, x, y, bodyColor);
      for (let x = 25; x < 30; x++) this.drawPixel(ctx, x, y, bodyColor);
    }
    this.drawPixel(ctx, 19, 42, spotColor);
    this.drawPixel(ctx, 26, 45, spotColor);

    // Feet
    for (let y = 52; y < 58; y++) {
      for (let x = 17; x < 24; x++) this.drawPixel(ctx, x, y, spotColor);
      for (let x = 24; x < 31; x++) this.drawPixel(ctx, x, y, spotColor);
    }

    this.cache[key] = canvas;
    return canvas;
  }

  createBuu(state = 'idle', frame = 0) {
    const key = `buu_${state}_${frame}`;
    if (this.cache[key]) return this.cache[key];

    const canvas = this.createCanvas(48, 60);
    const ctx = canvas.getContext('2d');

    const bodyColor = '#ff69b4';

    // Antenna with wobble
    const wobble = frame % 2 === 0 ? 0 : 1;
    for (let i = 0; i < 6; i++) this.drawPixel(ctx, 23 + wobble, 2 + i, bodyColor);
    for (let x = 22; x < 26; x++) {
      for (let y = 0; y < 3; y++) this.drawPixel(ctx, x + wobble, y, bodyColor);
    }

    // Round head
    for (let y = 8; y < 18; y++) {
      const width = Math.abs(13 - y) > 5 ? 10 : 12;
      const startX = 24 - width / 2;
      for (let x = 0; x < width; x++) this.drawPixel(ctx, startX + x, y, bodyColor);
    }
    this.drawPixel(ctx, 20, 12, '#000');
    this.drawPixel(ctx, 21, 12, '#000');
    this.drawPixel(ctx, 26, 12, '#000');
    this.drawPixel(ctx, 27, 12, '#000');
    this.drawPixel(ctx, 20, 10, '#000');
    this.drawPixel(ctx, 27, 10, '#000');
    for (let x = 20; x < 28; x++) this.drawPixel(ctx, x, 15, '#000');
    this.drawPixel(ctx, 21, 16, '#000');
    this.drawPixel(ctx, 26, 16, '#000');

    // Cape
    for (let y = 18; y < 38; y++) {
      for (let x = 0; x < 8; x++) {
        this.drawPixel(ctx, 14 - x, y, '#fff');
        this.drawPixel(ctx, 33 + x, y, '#fff');
      }
    }

    // Round body
    for (let y = 18; y < 38; y++) {
      const width = 16 - Math.abs(28 - y) / 3;
      const startX = 24 - width / 2;
      for (let x = 0; x < width; x++) this.drawPixel(ctx, Math.floor(startX + x), y, bodyColor);
    }

    // Belt
    for (let x = 16; x < 32; x++) {
      this.drawPixel(ctx, x, 30, '#000');
      this.drawPixel(ctx, x, 31, '#000');
    }
    for (let x = 22; x < 26; x++) this.drawPixel(ctx, x, 30, '#ffd700');

    // White pants
    for (let y = 32; y < 50; y++) {
      const width = 14 - Math.abs(41 - y) / 4;
      const startX = 24 - width / 2;
      for (let x = 0; x < width; x++) this.drawPixel(ctx, Math.floor(startX + x), y, '#fff');
    }

    // Arms
    for (let y = 22; y < 34; y++) {
      for (let x = 10; x < 16; x++) this.drawPixel(ctx, x, y, bodyColor);
      for (let x = 32; x < 38; x++) this.drawPixel(ctx, x, y, bodyColor);
    }

    // Feet
    for (let y = 50; y < 56; y++) {
      for (let x = 18; x < 22; x++) this.drawPixel(ctx, x, y, bodyColor);
      for (let x = 26; x < 30; x++) this.drawPixel(ctx, x, y, bodyColor);
    }

    this.cache[key] = canvas;
    return canvas;
  }
}

// Export for use
if (typeof module !== 'undefined') {
    module.exports = { EnhancedSprites };
}
