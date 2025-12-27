// ============================================================================
// SPRITE LOADER - AI sprite sheets for UI/portraits, programmatic for gameplay
// ============================================================================

class SpriteLoader {
    constructor() {
        this.sprites = {};
        this.loaded = false;
        this.loadCount = 0;
        this.totalSprites = 0;
        this.minDisplaySize = 100;  // Only use AI sprites when drawing larger than this
    }

    async loadAll() {
        // Sprite sheet configurations: cols x rows grid layout
        const spriteList = {
            // Characters - sprite sheets with multiple poses
            'goku_base': { path: 'sprites/goku_base.png', cols: 8, rows: 2 },
            'goku_ssj': { path: 'sprites/goku_ssj.png', cols: 8, rows: 2 },
            'vegeta_base': { path: 'sprites/vegeta_base.png', cols: 6, rows: 3 },
            'vegeta_ssj': { path: 'sprites/vegeta_ssj.png', cols: 6, rows: 3 },
            'piccolo': { path: 'sprites/piccolo.png', cols: 6, rows: 3 },
            'gohan_ssj2': { path: 'sprites/gohan_ssj2.png', cols: 6, rows: 3 },
            'trunks': { path: 'sprites/trunks.png', cols: 6, rows: 3 },

            // Enemies - smaller sheets
            'frieza_soldier': { path: 'sprites/frieza_soldier.png', cols: 4, rows: 2 },
            'saibaman': { path: 'sprites/saibaman.png', cols: 4, rows: 2 },
            'cell_jr': { path: 'sprites/cell_jr.png', cols: 4, rows: 2 },

            // Bosses - larger single or sparse layouts
            'frieza_boss': { path: 'sprites/frieza_boss.png', cols: 2, rows: 3 },
            'cell_boss': { path: 'sprites/cell_boss.png', cols: 2, rows: 3 },
            'buu_boss': { path: 'sprites/buu_boss.png', cols: 2, rows: 3 }
        };

        this.totalSprites = Object.keys(spriteList).length;
        const promises = [];

        for (const [name, config] of Object.entries(spriteList)) {
            promises.push(this.loadSprite(name, config));
        }

        await Promise.all(promises);
        this.loaded = true;
        console.log(`✅ Loaded ${this.loadCount}/${this.totalSprites} AI sprite sheets`);
        return this.loaded;
    }

    loadSprite(name, config) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Calculate frame dimensions from grid
                const frameWidth = Math.floor(img.width / config.cols);
                const frameHeight = Math.floor(img.height / config.rows);

                // Process to remove magenta/background
                const processedCanvas = this.removeBackground(img);

                this.sprites[name] = {
                    image: processedCanvas,
                    originalImage: img,
                    width: img.width,
                    height: img.height,
                    cols: config.cols,
                    rows: config.rows,
                    frameWidth: frameWidth,
                    frameHeight: frameHeight,
                    totalFrames: config.cols * config.rows
                };
                this.loadCount++;
                console.log(`  Loaded: ${name} (${config.cols}x${config.rows} grid, ${frameWidth}x${frameHeight} frames)`);
                resolve(true);
            };
            img.onerror = () => {
                console.warn(`  Failed to load: ${name}`);
                resolve(false);
            };
            img.src = config.path;
        });
    }

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

            // Remove magenta background - the sprite sheets use bright magenta (#FF00FF)
            // Check if pixel is "magenta-ish" (high red, low green, high blue)
            const isMagenta = (r > 150 && g < 150 && b > 150) &&
                              (r > g + 50) && (b > g + 50);

            // Pure magenta (255, 0, 255) with tolerance
            const isPureMagenta = (r > 200 && g < 50 && b > 200);

            // Hot pink / bright magenta variations
            const isHotPink = (r > 180 && g < 100 && b > 180);

            if (isMagenta || isPureMagenta || isHotPink) {
                data[i + 3] = 0;  // Make transparent
            }

            // Remove pure white backgrounds
            if (r > 250 && g > 250 && b > 250) {
                data[i + 3] = 0;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    // Draw a specific frame from the sprite sheet
    drawFrame(ctx, name, frameIndex, x, y, width, height) {
        // Don't use AI sprites for small gameplay sprites - they look bad scaled down
        if (width < this.minDisplaySize || height < this.minDisplaySize) {
            return false;  // Signal to use programmatic sprites instead
        }

        const sprite = this.sprites[name];
        if (!sprite) return false;

        // Calculate which frame to draw from the grid
        const frame = frameIndex % sprite.totalFrames;
        const col = frame % sprite.cols;
        const row = Math.floor(frame / sprite.cols);

        const srcX = col * sprite.frameWidth;
        const srcY = row * sprite.frameHeight;

        // Calculate destination size maintaining aspect ratio
        const srcAspect = sprite.frameWidth / sprite.frameHeight;
        const dstAspect = width / height;

        let drawWidth = width;
        let drawHeight = height;
        let drawX = x;
        let drawY = y;

        if (srcAspect > dstAspect) {
            // Source is wider - fit to width, adjust height
            drawHeight = width / srcAspect;
            drawY = y + (height - drawHeight);  // Align to bottom
        } else {
            // Source is taller - fit to height, adjust width
            drawWidth = height * srcAspect;
            drawX = x + (width - drawWidth) / 2;  // Center horizontally
        }

        ctx.drawImage(
            sprite.image,
            srcX, srcY, sprite.frameWidth, sprite.frameHeight,
            drawX, drawY, drawWidth, drawHeight
        );
        return true;
    }

    // For large portrait displays (character select, boss intro, etc.)
    drawPortrait(ctx, name, x, y, maxWidth, maxHeight, frameIndex = 0) {
        const sprite = this.sprites[name];
        if (!sprite) return false;

        // Get specific frame
        const frame = frameIndex % sprite.totalFrames;
        const col = frame % sprite.cols;
        const row = Math.floor(frame / sprite.cols);

        const srcX = col * sprite.frameWidth;
        const srcY = row * sprite.frameHeight;

        const scale = Math.min(maxWidth / sprite.frameWidth, maxHeight / sprite.frameHeight);
        const drawWidth = sprite.frameWidth * scale;
        const drawHeight = sprite.frameHeight * scale;
        const drawX = x + (maxWidth - drawWidth) / 2;
        const drawY = y + (maxHeight - drawHeight);

        ctx.drawImage(
            sprite.image,
            srcX, srcY, sprite.frameWidth, sprite.frameHeight,
            drawX, drawY, drawWidth, drawHeight
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

    // Map pose names to frame indices
    getFrameForPose(pose, animFrame) {
        // Frame 0 is typically idle/standing pose
        // Other frames can be mapped based on the sprite sheet layout
        const poseMap = {
            'idle': 0,
            'run': animFrame % 4,  // Cycle through first 4 frames for run
            'jump': 4,
            'attack': 5,
            'charge': 6,
            'hurt': 7
        };
        return poseMap[pose] || 0;
    }
}

const spriteLoader = new SpriteLoader();
console.log('Sprite Loader ready - AI sprite sheets for portraits/UI');
