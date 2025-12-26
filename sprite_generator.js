// ============================================================================
// DBZ SPRITE GENERATOR - Using Google Gemini 2.5 Flash Image (Nano Banana)
// ============================================================================
// This module provides prompts and utilities for generating DBZ character
// sprite sheets using Google's Nano Banana AI image model.
//
// To use:
// 1. Get a Google AI API key from https://aistudio.google.com/
// 2. Use Google AI Studio or the Gemini API with model "gemini-2.5-flash-image-preview"
// 3. Use the prompts below to generate sprite sheets
// ============================================================================

const DBZ_SPRITE_PROMPTS = {
    // ========================================================================
    // CHARACTER SPRITE SHEET PROMPTS
    // ========================================================================

    goku: {
        base: `Create a 16-bit SNES-style pixel art sprite sheet for Goku from Dragon Ball Z.
Layout: 8 columns x 6 rows grid, 64x64 pixels per frame.
Transparent background.
Character design: Orange gi (fighting outfit), spiky black hair, muscular build, wristbands.

Row 1: Idle animation (4 frames) - slight breathing motion, then 4 frames facing left
Row 2: Running cycle (8 frames) - side view running animation
Row 3: Jump sequence (4 frames: crouch, jump, peak, fall) + double jump with aura (4 frames)
Row 4: Punch combo (4 frames) + Kick combo (4 frames)
Row 5: Ki blast charge (2 frames) + Ki blast fire (2 frames) + Kamehameha charge (4 frames)
Row 6: Taking damage (2 frames) + Death/KO (2 frames) + Victory pose (4 frames)

Style: Clean pixel art, 16-bit era aesthetics, bold outlines, limited color palette per frame.
Consistent proportions and baseline across all frames.`,

        ssj: `Create a 16-bit SNES-style pixel art sprite sheet for Super Saiyan Goku from Dragon Ball Z.
Layout: 8 columns x 6 rows grid, 64x64 pixels per frame.
Transparent background.
Character design: Orange gi, GOLDEN SPIKY HAIR standing up, intense expression, golden aura particles, muscular build.

Row 1: Idle animation (4 frames) with golden aura flicker, then 4 frames facing left
Row 2: Running cycle (8 frames) - faster, more intense than base form
Row 3: Flying/hovering (4 frames) + Instant Transmission (4 frames with afterimage effect)
Row 4: Punch combo (4 frames) + Kick combo (4 frames) - more powerful poses
Row 5: Ki blast (2 frames) + Super Kamehameha charge (3 frames) + firing (3 frames)
Row 6: Taking damage (2 frames) + Powering up/transforming (4 frames) + Victory (2 frames)

Style: Clean pixel art with golden glow effects, 16-bit era aesthetics. Hair must be distinctly golden/yellow.`
    },

    vegeta: {
        base: `Create a 16-bit SNES-style pixel art sprite sheet for Vegeta from Dragon Ball Z.
Layout: 8 columns x 6 rows grid, 64x64 pixels per frame.
Transparent background.
Character design: Blue bodysuit with white armor/gloves/boots, flame-shaped black hair pointing upward, proud stance, shorter and more compact than Goku.

Row 1: Idle animation (4 frames) - arms crossed arrogant pose, then 4 frames facing left
Row 2: Running cycle (8 frames) - determined sprint
Row 3: Jump (4 frames) + Flight hover (4 frames)
Row 4: Punch combo (4 frames) - aggressive style + Kick combo (4 frames)
Row 5: Ki blast (2 frames) + Big Bang Attack charge (3 frames) + fire (3 frames)
Row 6: Taking damage (2 frames) + Rage expression (2 frames) + Final Flash pose (4 frames)

Style: Clean pixel art, 16-bit era aesthetics, Vegeta should look proud and intense.`,

        ssj: `Create a 16-bit SNES-style pixel art sprite sheet for Super Saiyan Vegeta from Dragon Ball Z.
Layout: 8 columns x 6 rows grid, 64x64 pixels per frame.
Transparent background.
Character design: Blue bodysuit with white armor, GOLDEN flame-shaped hair pointing up (more spiky than base), intense scowl, golden aura.

Same row layout as base Vegeta but with:
- Golden hair and aura effects
- More intense expressions
- Bigger ki attacks
- Final Flash should have dramatic wind/energy effects

Style: Clean pixel art with golden glow, 16-bit aesthetics.`
    },

    piccolo: {
        base: `Create a 16-bit SNES-style pixel art sprite sheet for Piccolo from Dragon Ball Z.
Layout: 8 columns x 6 rows grid, 64x64 pixels per frame.
Transparent background.
Character design: Green skin, pointed ears, antennae, purple gi with white cape and turban (weighted training gear), tall and lean build.

Row 1: Idle with cape (4 frames) + Idle without cape - combat ready (4 frames)
Row 2: Running cycle (8 frames) - cape flowing
Row 3: Jump (4 frames) + Stretch arm attack (4 frames) - arm extending far
Row 4: Punch combo (4 frames) + Kick combo (4 frames)
Row 5: Ki blast (2 frames) + Special Beam Cannon charge (3 frames) + fire (3 frames)
Row 6: Taking damage (2 frames) + Regeneration pose (2 frames) + Meditation (4 frames)

Style: Clean pixel art, distinct green skin tone, flowing cape physics.`
    },

    gohan: {
        base: `Create a 16-bit SNES-style pixel art sprite sheet for Teen Gohan from Dragon Ball Z (Cell Saga).
Layout: 8 columns x 6 rows grid, 64x64 pixels per frame.
Transparent background.
Character design: Purple gi similar to Piccolo's, spiky black hair (messier than Goku's), younger/smaller build, determined expression.

Row 1: Idle animation (4 frames) + Idle facing left (4 frames)
Row 2: Running cycle (8 frames)
Row 3: Jump (4 frames) + Flying (4 frames)
Row 4: Punch combo (4 frames) + Kick combo (4 frames)
Row 5: Masenko charge (2 frames) + fire (2 frames) + Kamehameha (4 frames)
Row 6: Taking damage (2 frames) + Angry power up (4 frames) + Victory (2 frames)

Style: Clean pixel art, 16-bit aesthetics, youthful but powerful appearance.`,

        ssj2: `Create a 16-bit SNES-style pixel art sprite sheet for Super Saiyan 2 Gohan from Dragon Ball Z.
Layout: 8 columns x 6 rows grid, 64x64 pixels per frame.
Transparent background.
Character design: Purple gi (tattered), GOLDEN SPIKY HAIR with ONE BANG hanging down, lightning sparks around body, intense angry expression, electric aura.

Row 1: Idle with lightning crackling (4 frames) + facing left (4 frames)
Row 2: Running/dashing with afterimages (8 frames)
Row 3: Jump (2 frames) + Rage burst flying (6 frames)
Row 4: Rapid punch combo (4 frames) + Devastating kick (4 frames)
Row 5: Father-Son Kamehameha charge (4 frames) + fire with ghost Goku (4 frames)
Row 6: Taking damage (2 frames) + RAGE SCREAM power up (4 frames) + Standing over Cell (2 frames)

Style: Must include electric lightning sparks, intense golden aura, the iconic single bang of hair.`
    },

    trunks: {
        base: `Create a 16-bit SNES-style pixel art sprite sheet for Future Trunks from Dragon Ball Z.
Layout: 8 columns x 6 rows grid, 64x64 pixels per frame.
Transparent background.
Character design: Capsule Corp jacket (blue), black tank top, purple/lavender bowl-cut hair, sword on back, lean athletic build.

Row 1: Idle animation (4 frames) + Idle facing left (4 frames)
Row 2: Running cycle (8 frames)
Row 3: Jump (4 frames) + Sword draw & slash (4 frames)
Row 4: Sword combo (4 frames) + Punch/kick combo (4 frames)
Row 5: Burning Attack hand signs (4 frames) + Ki blast fire (4 frames)
Row 6: Taking damage (2 frames) + Sword sheathe (2 frames) + Victory pose (4 frames)

Style: Clean pixel art, detailed sword, flowing jacket.`,

        ssj: `Create a 16-bit SNES-style pixel art sprite sheet for Super Saiyan Future Trunks from Dragon Ball Z.
Layout: 8 columns x 6 rows grid, 64x64 pixels per frame.
Transparent background.
Character design: Capsule Corp jacket, GOLDEN SPIKY HAIR standing up, sword with golden aura, intense expression.

Same layout as base but with:
- Golden hair standing upright
- Golden aura on sword attacks
- Heat Dome Attack instead of Burning Attack
- More intense expressions

Style: Clean pixel art with golden effects, sword should glow during attacks.`
    },

    // ========================================================================
    // ENEMY SPRITE SHEET PROMPTS
    // ========================================================================

    friezaSoldier: `Create a 16-bit SNES-style pixel art sprite sheet for a Frieza Force Soldier from Dragon Ball Z.
Layout: 6 columns x 4 rows grid, 48x48 pixels per frame.
Transparent background.
Character design: Generic alien soldier, purple/blue armor, scouter on eye, blaster weapon, helmet.

Row 1: Idle (2 frames) + Walking (4 frames)
Row 2: Attack with blaster (3 frames) + Melee punch (3 frames)
Row 3: Taking damage (2 frames) + Death explosion (4 frames)
Row 4: Alert/spotted player (2 frames) + Retreating (4 frames)

Style: Simple but readable pixel art, cannon fodder enemy appearance.`,

    saibaman: `Create a 16-bit SNES-style pixel art sprite sheet for a Saibaman from Dragon Ball Z.
Layout: 6 columns x 4 rows grid, 48x48 pixels per frame.
Transparent background.
Character design: Small green plant creature, large head with red eyes, claws, hunched posture, vicious appearance.

Row 1: Idle crouching (2 frames) + Crawling movement (4 frames)
Row 2: Leaping attack (4 frames) + Claw slash (2 frames)
Row 3: Acid spit attack (3 frames) + Self-destruct grab (3 frames)
Row 4: Taking damage (2 frames) + Death/exploding (4 frames)

Style: Creepy, alien plant creature, should look dangerous despite small size.`,

    cellJr: `Create a 16-bit SNES-style pixel art sprite sheet for a Cell Jr from Dragon Ball Z.
Layout: 6 columns x 4 rows grid, 48x48 pixels per frame.
Transparent background.
Character design: Mini version of Cell - blue/spotted skin, wings, tail, black face markings, childlike but menacing.

Row 1: Floating idle (2 frames) + Flying movement (4 frames)
Row 2: Rapid punch combo (4 frames) + Tail whip (2 frames)
Row 3: Ki blast (3 frames) + Kamehameha (3 frames)
Row 4: Taking damage (2 frames) + Death dissolving (4 frames)

Style: Should look like a mischievous, dangerous mini-Cell.`,

    // ========================================================================
    // BOSS SPRITE SHEET PROMPTS
    // ========================================================================

    frieza: `Create a 16-bit SNES-style pixel art sprite sheet for Frieza (Final Form) from Dragon Ball Z.
Layout: 8 columns x 6 rows grid, 96x96 pixels per frame (larger boss sprite).
Transparent background.
Character design: White and purple sleek alien, no armor in final form, long tail, red eyes, lipstick marks, elegant but terrifying.

Row 1: Hovering idle (4 frames) + Facing player menacingly (4 frames)
Row 2: Dashing flight (4 frames) + Teleport appearance (4 frames)
Row 3: Tail whip (4 frames) + Death beam finger point (4 frames)
Row 4: Rapid ki blasts (4 frames) + Supernova charge (4 frames)
Row 5: Taking damage (4 frames) + Rage transformation flicker (4 frames)
Row 6: Death Ball throw (4 frames) + Defeat/death sequence (4 frames)

Style: Elegant, threatening, the iconic DBZ villain. Smooth animations.`,

    cell: `Create a 16-bit SNES-style pixel art sprite sheet for Perfect Cell from Dragon Ball Z.
Layout: 8 columns x 6 rows grid, 96x96 pixels per frame (larger boss sprite).
Transparent background.
Character design: Green spotted bio-android, perfect humanoid form, black wings, crown-like head, confident smirk, muscular.

Row 1: Standing confident pose (4 frames) + Arms crossed idle (4 frames)
Row 2: Walking (4 frames) + Instant Transmission (4 frames)
Row 3: Punch combo (4 frames) + Kick combo (4 frames)
Row 4: Solar Flare (2 frames) + Regeneration (2 frames) + Perfect Kamehameha charge (4 frames)
Row 5: Spawning Cell Jr (4 frames) + Absorbing energy (4 frames)
Row 6: Taking damage (4 frames) + Self-destruct bloat (2 frames) + Defeat explosion (2 frames)

Style: Arrogant, perfect being aesthetic, the crown and wings are iconic.`,

    buu: `Create a 16-bit SNES-style pixel art sprite sheet for Majin Buu (Fat/Innocent) from Dragon Ball Z.
Layout: 8 columns x 6 rows grid, 96x96 pixels per frame (larger boss sprite).
Transparent background.
Character design: Pink round blob creature, antenna on head, cape, white pants, childlike but dangerous, "M" on belt.

Row 1: Bouncy idle (4 frames) + Laughing/taunting (4 frames)
Row 2: Waddling walk (4 frames) + Rolling attack (4 frames)
Row 3: Belly bump (4 frames) + Antenna beam (4 frames)
Row 4: Turn to candy beam (4 frames) + Eating candy (4 frames)
Row 5: Regeneration from damage (4 frames) + Angry steam from head (4 frames)
Row 6: Taking damage/splitting (4 frames) + Defeat melting (4 frames)

Style: Goofy but threatening, round and bouncy movements, pink bubblegum appearance.`
};

// ============================================================================
// SPRITE SHEET SPECIFICATIONS FOR GAME INTEGRATION
// ============================================================================

const SPRITE_SPECS = {
    characters: {
        frameWidth: 64,
        frameHeight: 64,
        columns: 8,
        rows: 6,
        animations: {
            idle: { row: 0, frames: 4, fps: 8 },
            idleLeft: { row: 0, startFrame: 4, frames: 4, fps: 8 },
            run: { row: 1, frames: 8, fps: 12 },
            jump: { row: 2, frames: 4, fps: 10 },
            doubleJump: { row: 2, startFrame: 4, frames: 4, fps: 10 },
            punch: { row: 3, frames: 4, fps: 15 },
            kick: { row: 3, startFrame: 4, frames: 4, fps: 15 },
            kiCharge: { row: 4, frames: 2, fps: 6 },
            kiFire: { row: 4, startFrame: 2, frames: 2, fps: 10 },
            special: { row: 4, startFrame: 4, frames: 4, fps: 8 },
            hurt: { row: 5, frames: 2, fps: 8 },
            death: { row: 5, startFrame: 2, frames: 2, fps: 4 },
            victory: { row: 5, startFrame: 4, frames: 4, fps: 6 }
        }
    },
    enemies: {
        frameWidth: 48,
        frameHeight: 48,
        columns: 6,
        rows: 4,
        animations: {
            idle: { row: 0, frames: 2, fps: 6 },
            walk: { row: 0, startFrame: 2, frames: 4, fps: 8 },
            attack: { row: 1, frames: 3, fps: 10 },
            melee: { row: 1, startFrame: 3, frames: 3, fps: 10 },
            hurt: { row: 2, frames: 2, fps: 8 },
            death: { row: 2, startFrame: 2, frames: 4, fps: 8 }
        }
    },
    bosses: {
        frameWidth: 96,
        frameHeight: 96,
        columns: 8,
        rows: 6,
        animations: {
            idle: { row: 0, frames: 4, fps: 6 },
            taunt: { row: 0, startFrame: 4, frames: 4, fps: 6 },
            move: { row: 1, frames: 4, fps: 8 },
            teleport: { row: 1, startFrame: 4, frames: 4, fps: 12 },
            melee1: { row: 2, frames: 4, fps: 12 },
            melee2: { row: 2, startFrame: 4, frames: 4, fps: 12 },
            special1: { row: 3, frames: 4, fps: 8 },
            special2: { row: 3, startFrame: 4, frames: 4, fps: 8 },
            phase2_1: { row: 4, frames: 4, fps: 8 },
            phase2_2: { row: 4, startFrame: 4, frames: 4, fps: 8 },
            hurt: { row: 5, frames: 4, fps: 8 },
            death: { row: 5, startFrame: 4, frames: 4, fps: 6 }
        }
    }
};

// ============================================================================
// SPRITE LOADER - For loading generated sprite sheets
// ============================================================================

class SpriteSheetLoader {
    constructor() {
        this.sheets = {};
        this.loaded = {};
    }

    async loadSheet(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.sheets[name] = img;
                this.loaded[name] = true;
                console.log(`Sprite sheet loaded: ${name}`);
                resolve(img);
            };
            img.onerror = () => {
                console.error(`Failed to load sprite sheet: ${name} from ${path}`);
                reject(new Error(`Failed to load: ${path}`));
            };
            img.src = path;
        });
    }

    getSheet(name) {
        return this.sheets[name];
    }

    isLoaded(name) {
        return this.loaded[name] === true;
    }

    // Draw a specific frame from a sprite sheet
    drawFrame(ctx, sheetName, spec, animName, frameIndex, x, y, flipX = false) {
        const sheet = this.sheets[sheetName];
        if (!sheet) return;

        const anim = spec.animations[animName];
        if (!anim) return;

        const startFrame = anim.startFrame || 0;
        const frameCol = (startFrame + (frameIndex % anim.frames));
        const frameRow = anim.row;

        const sx = frameCol * spec.frameWidth;
        const sy = frameRow * spec.frameHeight;

        ctx.save();
        if (flipX) {
            ctx.translate(x + spec.frameWidth, y);
            ctx.scale(-1, 1);
            x = 0;
            y = 0;
        }

        ctx.drawImage(
            sheet,
            sx, sy, spec.frameWidth, spec.frameHeight,
            x, y, spec.frameWidth, spec.frameHeight
        );
        ctx.restore();
    }
}

// ============================================================================
// USAGE INSTRUCTIONS
// ============================================================================

const USAGE_INSTRUCTIONS = `
========================================
HOW TO GENERATE DBZ SPRITE SHEETS
========================================

1. GO TO GOOGLE AI STUDIO
   https://aistudio.google.com/

2. SELECT THE MODEL
   Choose "Gemini 2.5 Flash" with image generation enabled
   (Also known as "Nano Banana")

3. COPY A PROMPT FROM THIS FILE
   Use DBZ_SPRITE_PROMPTS.goku.base for example

4. GENERATE THE IMAGE
   The AI will create a sprite sheet PNG

5. DOWNLOAD AND SAVE
   Save to: /sprites/goku_base.png

6. UPDATE THE GAME
   The SpriteSheetLoader class can load your generated sheets

========================================
TIPS FOR BEST RESULTS
========================================

- Be specific about pixel dimensions (64x64, 48x48, 96x96)
- Always request transparent background
- Ask for "consistent baseline" to keep feet aligned
- Request "limited color palette" for authentic 16-bit look
- If results aren't perfect, ask for refinements like:
  "Align all frames on the same baseline"
  "Make the hair more spiky"
  "Add more contrast to the colors"

========================================
FILE NAMING CONVENTION
========================================

/sprites/
  goku_base.png
  goku_ssj.png
  vegeta_base.png
  vegeta_ssj.png
  piccolo_base.png
  gohan_base.png
  gohan_ssj2.png
  trunks_base.png
  trunks_ssj.png
  enemy_soldier.png
  enemy_saibaman.png
  enemy_celljr.png
  boss_frieza.png
  boss_cell.png
  boss_buu.png
`;

// Export for use
if (typeof module !== 'undefined') {
    module.exports = {
        DBZ_SPRITE_PROMPTS,
        SPRITE_SPECS,
        SpriteSheetLoader,
        USAGE_INSTRUCTIONS
    };
}

console.log('DBZ Sprite Generator module loaded!');
console.log('Use DBZ_SPRITE_PROMPTS to get AI prompts for generating sprite sheets.');
console.log('See USAGE_INSTRUCTIONS for how to use with Google AI Studio / Nano Banana.');
