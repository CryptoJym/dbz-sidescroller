// ============================================================================
// LEGENDARY EDITION INTEGRATION - Connects all enhanced systems
// ============================================================================

// Global instances of enhanced systems
let enhancedSprites = null;
let enhancedParticles = null;
let enhancedBackgrounds = null;
let enhancedMusic = null;
let bossIntroSystem = null;

// Initialize all enhanced systems
function initLegendarySystems(canvas, ctx) {
    console.log('Initializing Legendary Edition systems...');

    // Enhanced Sprites (larger, more detailed)
    if (typeof EnhancedSprites !== 'undefined') {
        enhancedSprites = new EnhancedSprites(ctx);
        console.log('Enhanced Sprites: LOADED');
    }

    // Enhanced Particle System
    if (typeof ParticleSystem !== 'undefined') {
        enhancedParticles = new ParticleSystem(canvas);
        console.log('Particle System: LOADED');
    }

    // Enhanced Background Renderer
    if (typeof BackgroundRenderer !== 'undefined') {
        enhancedBackgrounds = new BackgroundRenderer(canvas, ctx);
        console.log('Background Renderer: LOADED');
    }

    // Enhanced Music System (supports Suno tracks)
    if (typeof EnhancedMusicSystem !== 'undefined') {
        enhancedMusic = new EnhancedMusicSystem();
        console.log('Enhanced Music System: LOADED');
    }

    // Boss Intro System
    if (typeof BossIntro !== 'undefined') {
        bossIntroSystem = new BossIntro(canvas, ctx);
        console.log('Boss Intro System: LOADED');
    }

    console.log('Legendary Edition systems initialized!');
}

// Apply new mechanics to player
function applyLegendaryMechanics(player) {
    if (typeof applyNewMechanicsToPlayer !== 'undefined') {
        applyNewMechanicsToPlayer(player);
        console.log('New mechanics applied to player');
    }
}

// Update legendary systems each frame
function updateLegendarySystems(deltaTime, player, levelLength, bossActive) {
    // Update particle system
    if (enhancedParticles) {
        enhancedParticles.update(deltaTime * 0.016); // Convert to seconds-ish
    }

    // Update player mechanics
    if (player && typeof updateNewMechanics !== 'undefined') {
        updateNewMechanics(player, levelLength);

        // Create aura particles based on state
        if (enhancedParticles) {
            const playerCenterX = player.x + player.w / 2;
            const playerCenterY = player.y + player.h / 2;

            if (player.ssj) {
                enhancedParticles.createSSJAura(playerCenterX, playerCenterY, 0.5);
            } else if (player.rageMode) {
                enhancedParticles.createRageAura(playerCenterX, playerCenterY, 0.3);
            } else if (player.powerBoost > 0) {
                enhancedParticles.createBaseAura(playerCenterX, playerCenterY, 0.3);
            }

            if (player.chargeLevel > 0) {
                enhancedParticles.createChargingAura(playerCenterX, playerCenterY, player.chargeLevel, 0.5);
            }
        }
    }

    // Update boss intro
    if (bossIntroSystem && bossIntroSystem.isActive()) {
        bossIntroSystem.update(deltaTime);
    }
}

// Draw legendary background (before game entities)
function drawLegendaryBackground(camX, levelData) {
    if (enhancedBackgrounds) {
        enhancedBackgrounds.draw(camX, levelData);
    }
}

// Draw legendary particles (after game entities)
function drawLegendaryParticles() {
    if (enhancedParticles) {
        enhancedParticles.draw();
    }
}

// Draw boss intro overlay (on top of everything)
function drawBossIntro(camX) {
    if (bossIntroSystem && bossIntroSystem.isActive()) {
        bossIntroSystem.draw(camX);
    }
}

// Start boss intro sequence
function startBossIntro(bossType, bossX, bossY) {
    if (bossIntroSystem) {
        bossIntroSystem.start(bossType, bossX, bossY);
        return true;
    }
    return false;
}

// Check if boss intro is complete
function isBossIntroComplete() {
    return bossIntroSystem ? bossIntroSystem.isComplete() : true;
}

// Check if boss intro is active
function isBossIntroActive() {
    return bossIntroSystem ? bossIntroSystem.isActive() : false;
}

// Create combat particle effects
function createCombatEffect(type, x, y, options = {}) {
    if (!enhancedParticles) return;

    switch (type) {
        case 'meleeHit':
            enhancedParticles.createMeleeHit(x, y, options.direction || 1);
            break;
        case 'kiBlastImpact':
            enhancedParticles.createKiBlastImpact(x, y);
            break;
        case 'beamCollision':
            enhancedParticles.createBeamCollision(x, y);
            break;
        case 'criticalHit':
            enhancedParticles.createCriticalHit(x, y);
            break;
        case 'comboHit':
            enhancedParticles.createComboHit(x, y, options.comboCount || 1);
            break;
        case 'enemyDeath':
            enhancedParticles.createEnemyDeath(x, y);
            break;
        case 'bossDeath':
            enhancedParticles.createBossDeath(x, y, options.stage || 1);
            break;
        case 'groundCrack':
            enhancedParticles.createGroundCrack(x, y);
            break;
        case 'dustCloud':
            enhancedParticles.createDustCloud(x, y, options.direction || 1);
            break;
        case 'afterimage':
            enhancedParticles.createAfterimageTrail(x, y, options.width || 32, options.height || 40, options.color);
            break;
    }
}

// Create special attack particle effects
function createSpecialEffect(type, x, y, targetX, targetY, options = {}) {
    if (!enhancedParticles) return;

    switch (type) {
        case 'kamehameha':
            enhancedParticles.createKamehameha(x, y, targetX, targetY, options.intensity || 1);
            break;
        case 'finalFlash':
            enhancedParticles.createFinalFlash(x, y, targetX, targetY, options.isCharging || false);
            break;
        case 'spiritBomb':
            enhancedParticles.createSpiritBomb(x, y, options.radius || 50, options.isGathering || true);
            break;
        case 'hellzoneGrenade':
            enhancedParticles.createHellzoneGrenade(options.positions || [{x, y}]);
            break;
    }
}

// Get enhanced sprite for character
function getEnhancedCharSprite(charName, pose, frame, ssj = false) {
    if (!enhancedSprites) return null;

    const methodName = `create${charName}`;
    if (typeof enhancedSprites[methodName] === 'function') {
        return enhancedSprites[methodName](pose, frame, ssj);
    }
    return null;
}

// Get enhanced sprite for enemy
function getEnhancedEnemySprite(enemyType, frame) {
    if (!enhancedSprites) return null;

    const methodMap = {
        'soldier': 'createFriezaSoldier',
        'saibaman': 'createSaibaman',
        'celljr': 'createCellJr'
    };

    const methodName = methodMap[enemyType];
    if (methodName && typeof enhancedSprites[methodName] === 'function') {
        return enhancedSprites[methodName](frame);
    }
    return null;
}

// Get enhanced sprite for boss
function getEnhancedBossSprite(bossType, frame) {
    if (!enhancedSprites) return null;

    const methodMap = {
        'frieza': 'createFrieza',
        'cell': 'createCell',
        'buu': 'createBuu'
    };

    const methodName = methodMap[bossType];
    if (methodName && typeof enhancedSprites[methodName] === 'function') {
        return enhancedSprites[methodName](frame);
    }
    return null;
}

// Play music using enhanced system
function playLegendaryMusic(trackName, loop = true) {
    if (enhancedMusic) {
        enhancedMusic.play(trackName, loop);
    }
}

// Load Suno-generated track
async function loadSunoTrack(trackName, source) {
    if (enhancedMusic) {
        return await enhancedMusic.loadTrack(trackName, source);
    }
    return false;
}

// Get level theme name for background renderer
function getLevelTheme(levelIndex) {
    const themes = ['namek', 'cellGames', 'tournament'];
    return themes[levelIndex] || 'namek';
}

// Clear all particles (for level transitions, etc.)
function clearAllParticles() {
    if (enhancedParticles) {
        enhancedParticles.clear();
    }
}

// Check if legendary systems are available
function hasLegendarySystems() {
    return !!(enhancedSprites || enhancedParticles || enhancedBackgrounds || bossIntroSystem);
}

console.log('Legendary Integration module loaded!');
