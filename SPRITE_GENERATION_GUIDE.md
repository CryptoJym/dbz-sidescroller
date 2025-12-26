# DBZ Side-Scroller Sprite Generation Guide

## Overview
Your Google API key has quota limits that need to be configured in Google Cloud Console. 
Here's how to generate sprites manually using Google AI Studio.

## Option 1: Google AI Studio (Recommended - Free!)

### Step 1: Access AI Studio
Go to: https://aistudio.google.com/

### Step 2: Select Gemini 2.5 Flash Image Model
1. Click "Create new prompt"
2. In the model selector, choose **"Gemini 2.5 Flash"** with image generation
3. Or look for **"Nano Banana"** in experimental models

### Step 3: Use These Prompts

Copy and paste each prompt into AI Studio to generate sprites:

---

#### GOKU (Base Form)
```
Create a 16-bit SNES-style pixel art sprite sheet of a martial artist warrior.
- Character in orange martial arts gi with blue belt and undershirt
- Spiky black hair (7-8 spikes pointing up and back)
- 64x64 pixels per frame
- Show 8 frames horizontally: idle stance, walk frame 1, walk frame 2, jumping, punching, kicking, energy blast pose (arms forward), taking damage
- Side view perspective
- Clean pixel art style like Dragon Ball Z Hyper Dimension for SNES
- Magenta (#FF00FF) background for easy transparency removal
```

#### GOKU (Super Saiyan)
```
Create a 16-bit SNES-style pixel art sprite sheet of a Super Saiyan warrior.
- Character in orange martial arts gi with blue belt
- Spiky GOLDEN YELLOW hair standing upward (glowing effect)
- Green/teal eyes
- Golden aura glow around character
- 64x64 pixels per frame
- Show 8 frames horizontally: idle, walk1, walk2, jump, punch, kick, Kamehameha pose, damaged
- Side view, clean pixel art, magenta background
```

#### VEGETA (Base Form)
```
Create a 16-bit pixel art sprite sheet of a Saiyan prince warrior.
- Blue bodysuit with white chest armor and shoulder pads
- Flame-shaped black hair pointing straight up
- White gloves and boots with gold trim
- Proud, stern expression
- 64x64 pixels per frame
- 8 frames: idle, walk1, walk2, jump, punch, kick, energy blast pose, damaged
- Side view, SNES pixel art style, magenta background
```

#### VEGETA (Super Saiyan)
```
Create a 16-bit pixel art sprite sheet of a Super Saiyan prince.
- Blue bodysuit with white Saiyan armor
- GOLDEN flame-shaped hair pointing up
- Green eyes, golden aura
- 64x64 pixels per frame
- 8 frames: idle, walk1, walk2, jump, punch, kick, Final Flash pose, damaged
- Side view, clean pixel art, magenta background
```

#### PICCOLO
```
Create a 16-bit pixel art sprite sheet of a Namekian warrior.
- Green skin with pointed ears and two antennae
- Purple martial arts gi
- White weighted cape and turban
- Tall, muscular build
- 64x64 pixels per frame
- 8 frames: idle, walk1, walk2, jump, punch, kick, Special Beam Cannon pose (fingers to forehead), damaged
- Side view, SNES style, magenta background
```

#### GOHAN (SSJ2)
```
Create a 16-bit pixel art sprite sheet of a young Super Saiyan 2 warrior.
- Purple martial arts gi (Cell Games outfit)
- Golden spiky hair with lightning sparks
- Intense green eyes
- Teen/young adult build
- 64x64 pixels per frame
- 8 frames: idle, walk1, walk2, jump, punch, kick, Kamehameha pose, damaged
- Side view, SNES style, magenta background
```

#### TRUNKS
```
Create a 16-bit pixel art sprite sheet of a sword-wielding warrior.
- Capsule Corp blue jacket over black tank top
- Lavender/purple hair (not SSJ)
- Sword strapped to back
- 64x64 pixels per frame
- 8 frames: idle, walk1, walk2, jump, sword slash, kick, Burning Attack pose, damaged
- Side view, SNES style, magenta background
```

---

### ENEMY SPRITES (48x48 pixels)

#### FRIEZA SOLDIER
```
16-bit pixel art sprite sheet of an alien soldier.
- Purple skin, Saiyan-style battle armor
- Helmet with red scouter visor
- Holding blaster weapon
- 48x48 pixels per frame
- 6 frames: idle, walk1, walk2, shooting, hit, death
- Side view, SNES style, magenta background
```

#### SAIBAMAN
```
16-bit pixel art sprite sheet of a plant creature monster.
- Small green plant-like creature
- Large brain-like bulbous head
- Sharp claws, hunched posture
- 48x48 pixels per frame
- 6 frames: idle, walk1, walk2, lunging attack, hit, exploding death
- Side view, clean pixel art, magenta background
```

#### CELL JR
```
16-bit pixel art sprite sheet of a small bio-android.
- Small blue creature with green spots
- Wings, insect-like features
- Mischievous grin
- 48x48 pixels per frame
- 6 frames: idle, flying1, flying2, attacking, hit, death poof
- Side view, SNES style, magenta background
```

---

### BOSS SPRITES (96x96 pixels)

#### FRIEZA (Final Form)
```
16-bit pixel art sprite sheet of the galactic tyrant Frieza.
- Sleek white and purple bio-armor body
- Purple dome head, red menacing eyes
- Long white tail with purple tip
- 96x96 pixels per frame (large boss)
- 6 frames: idle float, hovering, Death Beam (finger), Death Ball (energy sphere), hit, defeated
- Side view, imposing presence, magenta background
```

#### PERFECT CELL
```
16-bit pixel art sprite sheet of the perfect bio-android Cell.
- Green exoskeleton with black spotted pattern
- Black crown-like head structure
- Purple face markings, orange eyes
- Insect wings
- 96x96 pixels per frame (large boss)
- 6 frames: idle, walking, Solar Kamehameha pose, barrier shield, hit, defeated
- Side view, menacing boss, magenta background
```

#### SUPER BUU
```
16-bit pixel art sprite sheet of the Majin villain Buu.
- Pink muscular body
- Long head tentacle (antenna)
- Steam vents on head
- Baggy white pants, black belt with gold M buckle
- Evil grin with sharp teeth
- 96x96 pixels per frame (large boss)
- 6 frames: idle, floating, Vanishing Ball, candy beam, hit, dissolving to smoke
- Side view, intimidating boss, magenta background
```

---

## Step 4: Save Your Sprites

1. Download each generated image
2. Save to: `/Users/jamesbrady/dbz-sidescroller/sprites/`
3. Use these filenames:
   - `goku_base.png`
   - `goku_ssj.png`
   - `vegeta_base.png`
   - `vegeta_ssj.png`
   - `piccolo.png`
   - `gohan_ssj2.png`
   - `trunks.png`
   - `frieza_soldier.png`
   - `saibaman.png`
   - `cell_jr.png`
   - `frieza_boss.png`
   - `cell_boss.png`
   - `buu_boss.png`

## Step 5: Fix Your API Quota (Optional)

If you want to use the automated script:

1. Go to https://console.cloud.google.com/
2. Select your project (ID: 493704299998)
3. Navigate to: APIs & Services > Enable APIs
4. Enable: "Generative Language API"
5. Go to: APIs & Services > Quotas
6. Find "GenerateContent" and request quota increase
7. Ensure billing is enabled on your project

Then run: `python3 generate_sprites_v3.py`

---

## Option 2: Alternative AI Image Tools

If Google AI Studio doesn't work, try:

- **Midjourney** - Great for pixel art with "--style raw --ar 16:9"
- **Leonardo.ai** - Free tier available, good pixel art
- **Stable Diffusion** - Run locally with pixel art LoRA
- **DALL-E 3** - Decent pixel art with specific prompts

---

## Tips for Best Results

1. **Be specific** about pixel dimensions (64x64, 48x48, 96x96)
2. **Request magenta background** (#FF00FF) for easy transparency
3. **Ask for horizontal frame layout** (side by side)
4. **Reference SNES games** like DBZ Hyper Dimension
5. **Regenerate** if first result isn't perfect
6. **Edit in pixel art tool** if needed (Aseprite, Piskel, etc.)

---

## Current Game Status

The game currently works great with **programmatic sprites** generated in real-time:
- Characters: 64x80 pixels (Ultra quality)
- Bosses: 96x120 pixels (Ultra quality)
- Full animation states
- SSJ transformations with aura effects
- Shading and highlights

AI-generated sprites are optional enhancements!
