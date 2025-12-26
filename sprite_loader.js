// ============================================================================
// SPRITE LOADER - Loads AI-generated sprites into the game
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
            // Characters
            'goku_base': { path: 'sprites/goku_base.png' },
            'goku_ssj': { path: 'sprites/goku_ssj.png' },
            'vegeta_base': { path: 'sprites/vegeta_base.png' },
            'vegeta_ssj': { path: 'sprites/vegeta_ssj.png' },
            'piccolo': { path: 'sprites/piccolo.png' },
            'gohan_ssj2': { path: 'sprites/gohan_ssj2.png' },
            'trunks': { path: 'sprites/trunks.png' },

            // Enemies
            'frieza_soldier': { path: 'sprites/frieza_soldier.png' },
            'saibaman': { path: 'sprites/saibaman.png' },
            'cell_jr': { path: 'sprites/cell_jr.png' },

            // Bosses
            'frieza_boss': { path: 'sprites/frieza_boss.png' },
            'cell_boss': { path: 'sprites/cell_boss.png' },
            'buu_boss': { path: 'sprites/buu_boss.png' }
        };

        this.totalSprites = Object.keys(spriteList).length;
        const promises = [];

        for (const [name, config] of Object.entries(spriteList)) {
            promises.push(this.loadSprite(name, config));
        }

        await Promise.all(promises);
        this.loaded = true;
        console.log(`✅ Loaded ${this.loadCount}/${this.totalSprites} sprites with background removal`);
        return this.loaded;
    }

    loadSprite(name, config) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Process image to remove background
                const processedImage = this.removeBackground(img);
                this.sprites[name] = {
                    image: processedImage,
                    originalImage: img
                };
                this.loadCount++;
                console.log(`  Loaded: ${name}`);
                resolve(true);
            };
            img.onerror = () => {
                console.warn(`  Failed to load: ${name}`);
                resolve(false);
            };
            img.src = config.path;
        });
    }

    // Smart background removal - detects corner colors and removes them
    removeBackground(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const h = canvas.height;

        // Sample corners to find background color
        const corners = [
            this.getPixel(data, 0, 0, w),           // top-left
            this.getPixel(data, w-1, 0, w),         // top-right
            this.getPixel(data, 0, h-1, w),         // bottom-left
            this.getPixel(data, w-1, h-1, w),       // bottom-right
            this.getPixel(data, 5, 5, w),           // near top-left
            this.getPixel(data, w-6, 5, w),         // near top-right
        ];

        // Find most common corner color (likely background)
        const bgColor = this.findMostCommon(corners);

        // Process each pixel
        const tolerance = 50; // Color tolerance for background removal
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Check if pixel matches background color (with tolerance)
            if (this.colorDistance(r, g, b, bgColor.r, bgColor.g, bgColor.b) < tolerance) {
                data[i + 3] = 0; // Make transparent
            }
            // Also remove pure magenta
            else if (r > 200 && g < 80 && b > 200) {
                data[i + 3] = 0;
            }
            // Remove near-white
            else if (r > 245 && g > 245 && b > 245) {
                data[i + 3] = 0;
            }
        }

        // Put processed data back
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    getPixel(data, x, y, width) {
        const i = (y * width + x) * 4;
        return { r: data[i], g: data[i+1], b: data[i+2] };
    }

    colorDistance(r1, g1, b1, r2, g2, b2) {
        return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
    }

    findMostCommon(colors) {
        // Group similar colors and find most common
        const groups = [];
        for (const c of colors) {
            let found = false;
            for (const g of groups) {
                if (this.colorDistance(c.r, c.g, c.b, g.color.r, g.color.g, g.color.b) < 30) {
                    g.count++;
                    found = true;
                    break;
                }
            }
            if (!found) {
                groups.push({ color: c, count: 1 });
            }
        }
        groups.sort((a, b) => b.count - a.count);
        return groups[0]?.color || { r: 255, g: 0, b: 255 };
    }

    // Get a sprite for drawing
    getSprite(name) {
        return this.sprites[name] || null;
    }

    // Get character sprite name based on character and SSJ state
    getCharacterSpriteName(character, ssj = false) {
        const charLower = character.toLowerCase();

        if (charLower === 'goku') return ssj ? 'goku_ssj' : 'goku_base';
        if (charLower === 'vegeta') return ssj ? 'vegeta_ssj' : 'vegeta_base';
        if (charLower === 'piccolo') return 'piccolo';
        if (charLower === 'gohan') return 'gohan_ssj2';
        if (charLower === 'trunks') return 'trunks';

        return 'goku_base';
    }

    // Get enemy sprite name
    getEnemySpriteName(enemyType) {
        const typeMap = {
            'soldier': 'frieza_soldier',
            'saibaman': 'saibaman',
            'celljr': 'cell_jr',
            'cell_jr': 'cell_jr'
        };
        return typeMap[enemyType.toLowerCase()] || 'frieza_soldier';
    }

    // Get boss sprite name
    getBossSpriteName(bossType) {
        const typeMap = {
            'frieza': 'frieza_boss',
            'cell': 'cell_boss',
            'buu': 'buu_boss'
        };
        return typeMap[bossType.toLowerCase()] || 'frieza_boss';
    }
}

// Global sprite loader instance
const spriteLoader = new SpriteLoader();

console.log('Sprite Loader ready - call spriteLoader.loadAll() to load sprites');
