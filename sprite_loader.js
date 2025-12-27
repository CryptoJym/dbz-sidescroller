// ============================================================================
// SPRITE LOADER - Loads AI-generated sprite sheets into the game
// ============================================================================

class SpriteLoader {
    constructor() {
        this.sprites = {};
        this.loaded = false;
        this.loadCount = 0;
        this.totalSprites = 0;
    }

    async loadAll() {
        const spriteList = {
            // Characters - frame size estimated from sprite sheets
            'goku_base': { path: 'sprites/goku_base.png', cols: 8, rows: 3 },
            'goku_ssj': { path: 'sprites/goku_ssj.png', cols: 8, rows: 3 },
            'vegeta_base': { path: 'sprites/vegeta_base.png', cols: 8, rows: 3 },
            'vegeta_ssj': { path: 'sprites/vegeta_ssj.png', cols: 8, rows: 2 },
            'piccolo': { path: 'sprites/piccolo.png', cols: 8, rows: 3 },
            'gohan_ssj2': { path: 'sprites/gohan_ssj2.png', cols: 8, rows: 2 },
            'trunks': { path: 'sprites/trunks.png', cols: 8, rows: 3 },

            // Enemies
            'frieza_soldier': { path: 'sprites/frieza_soldier.png', cols: 6, rows: 3 },
            'saibaman': { path: 'sprites/saibaman.png', cols: 6, rows: 3 },
            'cell_jr': { path: 'sprites/cell_jr.png', cols: 6, rows: 4 },

            // Bosses
            'frieza_boss': { path: 'sprites/frieza_boss.png', cols: 6, rows: 4 },
            'cell_boss': { path: 'sprites/cell_boss.png', cols: 6, rows: 4 },
            'buu_boss': { path: 'sprites/buu_boss.png', cols: 6, rows: 3 }
        };

        this.totalSprites = Object.keys(spriteList).length;
        const promises = [];

        for (const [name, config] of Object.entries(spriteList)) {
            promises.push(this.loadSprite(name, config));
        }

        await Promise.all(promises);
        this.loaded = true;
        console.log(`✅ Loaded ${this.loadCount}/${this.totalSprites} sprite sheets`);
        return this.loaded;
    }

    loadSprite(name, config) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Calculate frame dimensions
                const frameWidth = Math.floor(img.width / config.cols);
                const frameHeight = Math.floor(img.height / config.rows);

                // Process to remove magenta background
                const processedCanvas = this.removeBackground(img);

                this.sprites[name] = {
                    image: processedCanvas,
                    originalImage: img,
                    frameWidth: frameWidth,
                    frameHeight: frameHeight,
                    cols: config.cols,
                    rows: config.rows,
                    totalFrames: config.cols * config.rows
                };
                this.loadCount++;
                console.log(`  Loaded: ${name} (${frameWidth}x${frameHeight} frames, ${config.cols}x${config.rows} grid)`);
                resolve(true);
            };
            img.onerror = () => {
                console.warn(`  Failed to load: ${name}`);
                resolve(false);
            };
            img.src = config.path;
        });
    }

    // Remove magenta background
    removeBackground(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Remove magenta (R:255, G:0, B:255) with tolerance
            if (r > 200 && g < 100 && b > 200) {
                data[i + 3] = 0;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    // Draw a specific frame from the sprite sheet
    drawFrame(ctx, name, frameIndex, x, y, width, height) {
        const sprite = this.sprites[name];
        if (!sprite) return false;

        // Calculate source position in sprite sheet
        const col = frameIndex % sprite.cols;
        const row = Math.floor(frameIndex / sprite.cols) % sprite.rows;
        const srcX = col * sprite.frameWidth;
        const srcY = row * sprite.frameHeight;

        ctx.drawImage(
            sprite.image,
            srcX, srcY, sprite.frameWidth, sprite.frameHeight,
            x, y, width, height
        );
        return true;
    }

    getSprite(name) {
        return this.sprites[name] || null;
    }

    getCharacterSpriteName(character, ssj = false) {
        const charLower = character.toLowerCase();
        if (charLower === 'goku') return ssj ? 'goku_ssj' : 'goku_base';
        if (charLower === 'vegeta') return ssj ? 'vegeta_ssj' : 'vegeta_base';
        if (charLower === 'piccolo') return 'piccolo';
        if (charLower === 'gohan') return 'gohan_ssj2';
        if (charLower === 'trunks') return 'trunks';
        return 'goku_base';
    }

    getEnemySpriteName(enemyType) {
        const typeMap = {
            'soldier': 'frieza_soldier',
            'saibaman': 'saibaman',
            'celljr': 'cell_jr',
            'cell_jr': 'cell_jr'
        };
        return typeMap[enemyType.toLowerCase()] || 'frieza_soldier';
    }

    getBossSpriteName(bossType) {
        const typeMap = {
            'frieza': 'frieza_boss',
            'cell': 'cell_boss',
            'buu': 'buu_boss'
        };
        return typeMap[bossType.toLowerCase()] || 'frieza_boss';
    }

    // Map pose to frame index
    getFrameForPose(pose, animFrame) {
        // Frame layout assumption:
        // Row 0: idle variations
        // Row 1: walk/run cycle
        // Row 2: actions (jump, attack, hurt)
        const frameMap = {
            'idle': 0,
            'run': 8 + (animFrame % 4),      // Row 1, animated
            'walk': 8 + (animFrame % 4),
            'jump': 16,                       // Row 2
            'attack': 17,
            'punch': 17,
            'kick': 18,
            'charge': 19,
            'special': 20,
            'hurt': 21,
            'damaged': 21
        };
        return frameMap[pose] || 0;
    }
}

const spriteLoader = new SpriteLoader();
console.log('Sprite Loader ready - call spriteLoader.loadAll() to load sprites');
