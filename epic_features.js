// ============================================================================
// EPIC FEATURES - The Fun Stuff That Makes It Feel Like DBZ
// ============================================================================

// ============================================================================
// DRAMATIC FINISH SYSTEM
// When you land a killing blow with a special/ultimate, time slows and
// the screen does that iconic DBZ freeze-frame with speed lines
// ============================================================================

class DramaticFinish {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.active = false;
        this.timer = 0;
        this.duration = 180; // 3 seconds at 60fps
        this.phase = 'none'; // 'freeze', 'impact', 'explosion', 'text'

        this.targetX = 0;
        this.targetY = 0;
        this.attackerX = 0;
        this.attackerY = 0;
        this.finishType = 'special'; // 'special', 'ultimate', 'kamehameha'
        this.bossName = '';

        // Speed lines
        this.speedLines = [];

        // Impact flash
        this.flashIntensity = 0;

        // Dramatic text
        this.showText = false;
        this.textScale = 0;
    }

    trigger(attackerX, attackerY, targetX, targetY, finishType, bossName) {
        this.active = true;
        this.timer = 0;
        this.phase = 'freeze';
        this.attackerX = attackerX;
        this.attackerY = attackerY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.finishType = finishType;
        this.bossName = bossName;
        this.flashIntensity = 0;
        this.showText = false;
        this.textScale = 0;

        // Generate speed lines
        this.speedLines = [];
        for (let i = 0; i < 50; i++) {
            this.speedLines.push({
                angle: Math.random() * Math.PI * 2,
                length: 100 + Math.random() * 300,
                speed: 5 + Math.random() * 10,
                offset: Math.random() * 100,
                width: 1 + Math.random() * 3
            });
        }

        console.log(`DRAMATIC FINISH: ${bossName} defeated with ${finishType}!`);
    }

    update() {
        if (!this.active) return false;

        this.timer++;

        // Phase transitions
        if (this.timer < 30) {
            this.phase = 'freeze';
        } else if (this.timer < 60) {
            this.phase = 'impact';
            this.flashIntensity = Math.min(1, (this.timer - 30) / 15);
        } else if (this.timer < 120) {
            this.phase = 'explosion';
            this.flashIntensity = Math.max(0, 1 - (this.timer - 60) / 30);
        } else if (this.timer < this.duration) {
            this.phase = 'text';
            this.showText = true;
            this.textScale = Math.min(1, (this.timer - 120) / 20);
        } else {
            this.active = false;
            this.phase = 'none';
            return true; // Finished
        }

        return false;
    }

    draw(camX) {
        if (!this.active) return;

        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        // Darken background during dramatic finish
        ctx.fillStyle = `rgba(0, 0, 0, ${0.3 + this.timer * 0.002})`;
        ctx.fillRect(0, 0, W, H);

        // Speed lines (emanating from impact point)
        if (this.phase === 'freeze' || this.phase === 'impact') {
            const centerX = this.targetX - camX;
            const centerY = this.targetY;

            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;

            this.speedLines.forEach(line => {
                const progress = (this.timer + line.offset) * line.speed * 0.01;
                const startDist = 50 + progress * 100;
                const endDist = startDist + line.length;

                const startX = centerX + Math.cos(line.angle) * startDist;
                const startY = centerY + Math.sin(line.angle) * startDist;
                const endX = centerX + Math.cos(line.angle) * endDist;
                const endY = centerY + Math.sin(line.angle) * endDist;

                ctx.globalAlpha = Math.max(0, 1 - progress * 0.5);
                ctx.lineWidth = line.width;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            });
            ctx.globalAlpha = 1;
        }

        // Impact flash
        if (this.flashIntensity > 0) {
            const gradient = ctx.createRadialGradient(
                this.targetX - camX, this.targetY, 0,
                this.targetX - camX, this.targetY, 400
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.flashIntensity})`);
            gradient.addColorStop(0.5, `rgba(255, 200, 100, ${this.flashIntensity * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, W, H);
        }

        // "DRAMATIC FINISH" text
        if (this.showText) {
            ctx.save();
            ctx.translate(W / 2, H / 2 - 50);
            ctx.scale(this.textScale, this.textScale);

            // Main text with glow
            ctx.font = 'bold 64px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Glow
            ctx.shadowColor = '#ff6600';
            ctx.shadowBlur = 30;
            ctx.fillStyle = '#FFD700';
            ctx.fillText('DRAMATIC', 0, -40);
            ctx.fillText('FINISH!', 0, 40);

            // Boss name
            ctx.font = 'bold 32px Arial';
            ctx.fillStyle = '#ff4444';
            ctx.shadowColor = '#ff0000';
            ctx.fillText(`${this.bossName} DEFEATED`, 0, 120);

            ctx.restore();
        }
    }

    isActive() {
        return this.active;
    }

    shouldPauseGame() {
        return this.active && this.timer < 150;
    }
}

// ============================================================================
// IT'S OVER 9000! - The legendary meme, triggered at key moments
// ============================================================================

class Over9000 {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.active = false;
        this.timer = 0;
        this.duration = 180;
        this.triggered = false; // Only trigger once per game

        // The scouter crack effect
        this.cracks = [];
        this.explosionParticles = [];
    }

    checkTrigger(damage, combo, powerLevel) {
        // Trigger when dealing massive damage or hitting big combos
        if (this.triggered) return false;

        if (damage > 9000 || combo >= 90 || powerLevel > 9000) {
            this.trigger();
            return true;
        }
        return false;
    }

    trigger() {
        this.active = true;
        this.triggered = true;
        this.timer = 0;

        // Generate cracks
        this.cracks = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            this.cracks.push({
                x: centerX,
                y: centerY,
                angle: angle,
                length: 0,
                maxLength: 100 + Math.random() * 200,
                branches: []
            });
        }

        // Explosion particles
        this.explosionParticles = [];
        for (let i = 0; i < 100; i++) {
            this.explosionParticles.push({
                x: centerX,
                y: centerY,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                size: 2 + Math.random() * 6,
                color: Math.random() > 0.5 ? '#00ff00' : '#88ff88',
                life: 60 + Math.random() * 60
            });
        }

        console.log("IT'S OVER 9000!!!!");
    }

    update() {
        if (!this.active) return;

        this.timer++;

        // Grow cracks
        this.cracks.forEach(crack => {
            if (crack.length < crack.maxLength) {
                crack.length += 15;
            }
        });

        // Update particles
        this.explosionParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.life--;
        });
        this.explosionParticles = this.explosionParticles.filter(p => p.life > 0);

        if (this.timer >= this.duration) {
            this.active = false;
        }
    }

    draw() {
        if (!this.active) return;

        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        // Screen tint
        if (this.timer < 30) {
            ctx.fillStyle = `rgba(0, 255, 0, ${0.3 * (1 - this.timer / 30)})`;
            ctx.fillRect(0, 0, W, H);
        }

        // Draw cracks (scouter breaking effect)
        if (this.timer < 60) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 10;

            this.cracks.forEach(crack => {
                ctx.beginPath();
                ctx.moveTo(crack.x, crack.y);
                ctx.lineTo(
                    crack.x + Math.cos(crack.angle) * crack.length,
                    crack.y + Math.sin(crack.angle) * crack.length
                );
                ctx.stroke();
            });
            ctx.shadowBlur = 0;
        }

        // Draw particles
        this.explosionParticles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 120;
            ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        });
        ctx.globalAlpha = 1;

        // THE TEXT
        if (this.timer > 20 && this.timer < 150) {
            const scale = Math.min(1, (this.timer - 20) / 10);
            const shake = this.timer < 60 ? (Math.random() - 0.5) * 10 : 0;

            ctx.save();
            ctx.translate(W / 2 + shake, H / 2 + shake);
            ctx.scale(scale, scale);

            // Vegeta's iconic line
            ctx.font = 'bold 72px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Green glow (scouter color)
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 30;
            ctx.strokeStyle = '#003300';
            ctx.lineWidth = 8;
            ctx.strokeText("IT'S OVER", 0, -50);
            ctx.strokeText("9000!!!!", 0, 50);

            ctx.fillStyle = '#00ff00';
            ctx.fillText("IT'S OVER", 0, -50);
            ctx.fillText("9000!!!!", 0, 50);

            ctx.restore();
        }
    }

    isActive() {
        return this.active;
    }
}

// ============================================================================
// ZENKAI BOOST - Get stronger when near death (true to Saiyan biology!)
// ============================================================================

const ZenkaiBoost = {
    // Apply Zenkai system to player
    applyToPlayer(player) {
        player.zenkaiLevel = 0;
        player.zenkaiActive = false;
        player.zenkaiTimer = 0;
        player.zenkaiThreshold = 0.2; // 20% HP
        player.zenkaiMultiplier = 1;
        player.nearDeathCount = 0; // Track how many times near death

        player.checkZenkai = function() {
            const hpPercent = this.hp / this.maxHp;

            // Near death?
            if (hpPercent <= this.zenkaiThreshold && !this.zenkaiActive) {
                this.activateZenkai();
            }

            // Recovered from near death - permanent stat boost!
            if (this.zenkaiActive && hpPercent > 0.5) {
                this.completeZenkai();
            }
        };

        player.activateZenkai = function() {
            this.zenkaiActive = true;
            this.zenkaiTimer = 0;

            // Temporary boost while in danger
            this.zenkaiMultiplier = 1.5 + (this.nearDeathCount * 0.1);

            console.log(`ZENKAI BOOST ACTIVATED! Multiplier: ${this.zenkaiMultiplier}x`);

            // Visual feedback
            if (typeof screenFlash !== 'undefined') {
                screenFlash = 15;
                flashColor = '#ff0000';
            }
        };

        player.completeZenkai = function() {
            // Permanent stat increase for surviving near-death!
            this.nearDeathCount++;
            const bonus = 1 + (this.nearDeathCount * 0.05); // 5% per near-death survival

            this.maxHp = Math.floor(this.maxHp * bonus);
            this.atk = Math.floor(this.atk * bonus);
            this.hp = Math.min(this.hp, this.maxHp);

            this.zenkaiActive = false;
            this.zenkaiMultiplier = 1;
            this.zenkaiLevel++;

            console.log(`ZENKAI COMPLETE! Permanent boost applied. Level: ${this.zenkaiLevel}`);
        };

        player.getZenkaiDamageMultiplier = function() {
            return this.zenkaiActive ? this.zenkaiMultiplier : 1;
        };
    }
};

// ============================================================================
// COMBO ANNOUNCER - Hype up those combos!
// ============================================================================

class ComboAnnouncer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.currentAnnouncement = null;
        this.timer = 0;
        this.lastCombo = 0;

        // Announcement thresholds and texts
        this.announcements = [
            { threshold: 5, text: 'NICE!', color: '#88ff88' },
            { threshold: 10, text: 'COOL!', color: '#88ffff' },
            { threshold: 15, text: 'GREAT!', color: '#ffff88' },
            { threshold: 20, text: 'AWESOME!', color: '#ffaa00' },
            { threshold: 30, text: 'AMAZING!', color: '#ff8800' },
            { threshold: 40, text: 'INCREDIBLE!', color: '#ff4400' },
            { threshold: 50, text: 'UNBELIEVABLE!', color: '#ff00ff' },
            { threshold: 75, text: 'LEGENDARY!', color: '#FFD700' },
            { threshold: 100, text: 'GODLIKE!!!', color: '#ffffff', rainbow: true }
        ];
    }

    checkCombo(combo) {
        if (combo <= this.lastCombo) {
            this.lastCombo = combo;
            return;
        }

        // Find the highest threshold reached
        let announcement = null;
        for (let i = this.announcements.length - 1; i >= 0; i--) {
            if (combo >= this.announcements[i].threshold &&
                this.lastCombo < this.announcements[i].threshold) {
                announcement = this.announcements[i];
                break;
            }
        }

        if (announcement) {
            this.announce(announcement, combo);
        }

        this.lastCombo = combo;
    }

    announce(announcement, combo) {
        this.currentAnnouncement = {
            ...announcement,
            combo: combo,
            scale: 0,
            alpha: 1,
            y: this.canvas.height / 3
        };
        this.timer = 0;

        console.log(`COMBO: ${combo} - ${announcement.text}`);
    }

    update() {
        if (!this.currentAnnouncement) return;

        this.timer++;
        const a = this.currentAnnouncement;

        // Scale up quickly, then hold, then fade
        if (this.timer < 10) {
            a.scale = this.timer / 10;
            a.y -= 2;
        } else if (this.timer < 60) {
            a.scale = 1 + Math.sin(this.timer * 0.3) * 0.1;
        } else {
            a.alpha = Math.max(0, 1 - (this.timer - 60) / 30);
        }

        if (this.timer > 90) {
            this.currentAnnouncement = null;
        }
    }

    draw() {
        if (!this.currentAnnouncement) return;

        const ctx = this.ctx;
        const a = this.currentAnnouncement;
        const W = this.canvas.width;

        ctx.save();
        ctx.globalAlpha = a.alpha;
        ctx.translate(W / 2, a.y);
        ctx.scale(a.scale, a.scale);

        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Rainbow effect for GODLIKE
        if (a.rainbow) {
            const hue = (this.timer * 10) % 360;
            ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
            ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
        } else {
            ctx.fillStyle = a.color;
            ctx.shadowColor = a.color;
        }
        ctx.shadowBlur = 20;

        ctx.fillText(a.text, 0, 0);

        // Combo count
        ctx.font = 'bold 32px Arial';
        ctx.fillText(`${a.combo} HIT COMBO!`, 0, 50);

        ctx.restore();
    }

    reset() {
        this.lastCombo = 0;
        this.currentAnnouncement = null;
    }
}

// ============================================================================
// SCOUTER UI - Power level display with that iconic green tint
// ============================================================================

class ScouterUI {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.enabled = true;
        this.scanTarget = null;
        this.scanProgress = 0;
        this.displayedPowerLevel = 0;
        this.targetPowerLevel = 0;
        this.glitching = false;
        this.glitchTimer = 0;
        this.broken = false;
        this.breakTimer = 0;
    }

    scan(target) {
        if (this.broken) return;

        this.scanTarget = target;
        this.scanProgress = 0;
        this.targetPowerLevel = this.calculatePowerLevel(target);
        this.displayedPowerLevel = 0;

        // If power level is too high, scouter will malfunction!
        if (this.targetPowerLevel > 9000) {
            this.glitching = true;
            this.glitchTimer = 60;
        }
    }

    calculatePowerLevel(entity) {
        if (!entity) return 0;

        // Calculate based on stats
        let base = (entity.hp || 0) + (entity.atk || 0) * 10 + (entity.maxKi || 0) * 5;

        // Multipliers
        if (entity.ssj) base *= 50;
        if (entity.zenkaiActive) base *= entity.zenkaiMultiplier || 1.5;
        if (entity.rageMode) base *= 2;

        // Boss multiplier
        if (entity.isBoss) base *= 10;

        return Math.floor(base);
    }

    breakScouter() {
        this.broken = true;
        this.breakTimer = 120;
        console.log('SCOUTER EXPLODED!');
    }

    update() {
        // Scan progress
        if (this.scanTarget && this.scanProgress < 100) {
            this.scanProgress += 5;
            this.displayedPowerLevel = Math.floor((this.scanProgress / 100) * this.targetPowerLevel);
        }

        // Glitch effect
        if (this.glitching) {
            this.glitchTimer--;
            if (this.glitchTimer <= 0) {
                this.glitching = false;
            }
        }

        // Break animation
        if (this.broken && this.breakTimer > 0) {
            this.breakTimer--;
        }
    }

    draw(player, enemies, boss) {
        if (!this.enabled) return;

        const ctx = this.ctx;
        const W = this.canvas.width;

        // Scouter overlay (top-right corner)
        ctx.save();

        // Green tinted box
        ctx.fillStyle = 'rgba(0, 50, 0, 0.7)';
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;

        const boxX = W - 200;
        const boxY = 10;
        const boxW = 190;
        const boxH = 100;

        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Scouter scan lines
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(boxX, boxY + i * 10);
            ctx.lineTo(boxX + boxW, boxY + i * 10);
            ctx.stroke();
        }

        // If broken, show static
        if (this.broken) {
            if (this.breakTimer > 60) {
                // Explosion effect
                ctx.fillStyle = '#ff0000';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('ERROR!', boxX + boxW/2, boxY + boxH/2);
            } else {
                // Static
                for (let i = 0; i < 50; i++) {
                    ctx.fillStyle = Math.random() > 0.5 ? '#00ff00' : '#003300';
                    ctx.fillRect(
                        boxX + Math.random() * boxW,
                        boxY + Math.random() * boxH,
                        2 + Math.random() * 4,
                        2 + Math.random() * 4
                    );
                }
            }
            ctx.restore();
            return;
        }

        // Glitch effect
        if (this.glitching && Math.random() > 0.5) {
            ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        }

        ctx.fillStyle = '#00ff00';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';

        // Player power level
        const playerPL = this.calculatePowerLevel(player);
        ctx.fillText(`YOU: ${playerPL.toLocaleString()}`, boxX + 10, boxY + 25);

        // Nearby enemy/boss
        if (boss && boss.active) {
            const bossPL = this.calculatePowerLevel(boss);
            ctx.fillStyle = bossPL > 9000 ? '#ff0000' : '#00ff00';
            ctx.fillText(`BOSS: ${bossPL > 9000 ? '???,???' : bossPL.toLocaleString()}`, boxX + 10, boxY + 45);

            if (bossPL > 9000) {
                ctx.fillStyle = '#ff0000';
                ctx.font = 'bold 14px monospace';
                ctx.fillText('WARNING: OVERFLOW', boxX + 10, boxY + 65);
            }
        } else if (enemies && enemies.length > 0) {
            const nearestEnemy = enemies.find(e => e.active);
            if (nearestEnemy) {
                const enemyPL = this.calculatePowerLevel(nearestEnemy);
                ctx.fillText(`ENEMY: ${enemyPL.toLocaleString()}`, boxX + 10, boxY + 45);
            }
        }

        // Zenkai indicator
        if (player && player.zenkaiLevel > 0) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText(`ZENKAI LV: ${player.zenkaiLevel}`, boxX + 10, boxY + 85);
        }

        ctx.restore();
    }
}

// ============================================================================
// BEAM STRUGGLE - Epic clash when beams meet!
// ============================================================================

class BeamStruggle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.active = false;
        this.timer = 0;
        this.maxTime = 300; // 5 seconds max

        this.playerPower = 50;
        this.enemyPower = 50;
        this.mashCount = 0;
        this.lastMashTime = 0;

        this.playerBeamX = 0;
        this.playerBeamY = 0;
        this.enemyBeamX = 0;
        this.enemyBeamY = 0;

        this.collisionX = 0;
        this.particles = [];
    }

    start(playerX, playerY, enemyX, enemyY, playerStrength, enemyStrength) {
        this.active = true;
        this.timer = 0;
        this.playerPower = 50;
        this.enemyPower = 50;
        this.mashCount = 0;

        this.playerBeamX = playerX;
        this.playerBeamY = playerY;
        this.enemyBeamX = enemyX;
        this.enemyBeamY = enemyY;

        this.collisionX = (playerX + enemyX) / 2;
        this.particles = [];

        console.log('BEAM STRUGGLE INITIATED!');
    }

    mash() {
        if (!this.active) return;

        const now = Date.now();
        if (now - this.lastMashTime > 50) { // Prevent too fast mashing
            this.mashCount++;
            this.playerPower = Math.min(100, this.playerPower + 3);
            this.lastMashTime = now;

            // Spawn particles at collision point
            for (let i = 0; i < 5; i++) {
                this.particles.push({
                    x: this.collisionX,
                    y: this.playerBeamY,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 30,
                    color: '#ffff00'
                });
            }
        }
    }

    update() {
        if (!this.active) return null;

        this.timer++;

        // Enemy pushes back over time
        this.enemyPower = Math.min(100, this.enemyPower + 0.5);

        // Player power decays slightly
        this.playerPower = Math.max(0, this.playerPower - 0.3);

        // Update collision point based on power balance
        const powerRatio = this.playerPower / (this.playerPower + this.enemyPower);
        const targetCollision = this.playerBeamX + (this.enemyBeamX - this.playerBeamX) * (1 - powerRatio);
        this.collisionX = this.collisionX + (targetCollision - this.collisionX) * 0.1;

        // Update particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
        });
        this.particles = this.particles.filter(p => p.life > 0);

        // Spawn ongoing collision particles
        if (this.timer % 3 === 0) {
            this.particles.push({
                x: this.collisionX,
                y: this.playerBeamY + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 20,
                color: Math.random() > 0.5 ? '#00aaff' : '#ff6600'
            });
        }

        // Check for winner
        if (this.collisionX <= this.playerBeamX + 50) {
            this.active = false;
            return 'enemy'; // Enemy wins
        }
        if (this.collisionX >= this.enemyBeamX - 50) {
            this.active = false;
            return 'player'; // Player wins!
        }
        if (this.timer >= this.maxTime) {
            this.active = false;
            return this.playerPower > this.enemyPower ? 'player' : 'enemy';
        }

        return null; // Still going
    }

    draw(camX) {
        if (!this.active) return;

        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        // Player beam (blue/yellow)
        const gradient1 = ctx.createLinearGradient(
            this.playerBeamX - camX, 0,
            this.collisionX - camX, 0
        );
        gradient1.addColorStop(0, '#0088ff');
        gradient1.addColorStop(0.5, '#00aaff');
        gradient1.addColorStop(1, '#ffffff');

        ctx.fillStyle = gradient1;
        ctx.fillRect(
            this.playerBeamX - camX,
            this.playerBeamY - 15,
            this.collisionX - this.playerBeamX,
            30
        );

        // Enemy beam (red/orange)
        const gradient2 = ctx.createLinearGradient(
            this.collisionX - camX, 0,
            this.enemyBeamX - camX, 0
        );
        gradient2.addColorStop(0, '#ffffff');
        gradient2.addColorStop(0.5, '#ff6600');
        gradient2.addColorStop(1, '#ff0000');

        ctx.fillStyle = gradient2;
        ctx.fillRect(
            this.collisionX - camX,
            this.playerBeamY - 15,
            this.enemyBeamX - this.collisionX,
            30
        );

        // Collision explosion
        ctx.beginPath();
        ctx.arc(this.collisionX - camX, this.playerBeamY, 40 + Math.sin(this.timer * 0.5) * 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        // Particles
        this.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 30;
            ctx.beginPath();
            ctx.arc(p.x - camX, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // MASH prompt
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('MASH Z TO WIN!', W / 2, H - 100);

        // Power meters
        ctx.fillStyle = '#0088ff';
        ctx.fillRect(50, H - 60, (this.playerPower / 100) * 200, 20);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(50, H - 60, 200, 20);

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(W - 250, H - 60, (this.enemyPower / 100) * 200, 20);
        ctx.strokeRect(W - 250, H - 60, 200, 20);
    }

    isActive() {
        return this.active;
    }
}

// ============================================================================
// ENVIRONMENT DESTRUCTION - Power affects the world!
// ============================================================================

class EnvironmentDestruction {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // Floating rocks when power is high
        this.floatingRocks = [];

        // Ground cracks
        this.cracks = [];

        // Lightning during transformations
        this.lightning = [];

        // Dust/debris
        this.debris = [];

        this.powerLevel = 0;
    }

    setPowerLevel(level) {
        this.powerLevel = level;

        // Spawn floating rocks when power is high
        if (level > 5000 && this.floatingRocks.length < 20 && Math.random() > 0.95) {
            this.spawnFloatingRock();
        }
    }

    spawnFloatingRock() {
        this.floatingRocks.push({
            x: Math.random() * this.canvas.width,
            y: this.canvas.height - 50,
            targetY: 100 + Math.random() * 200,
            size: 10 + Math.random() * 30,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            wobble: Math.random() * Math.PI * 2
        });
    }

    addCrack(x, y) {
        this.cracks.push({
            x: x,
            y: y,
            branches: this.generateCrackBranches(x, y),
            age: 0
        });
    }

    generateCrackBranches(x, y) {
        const branches = [];
        const numBranches = 3 + Math.floor(Math.random() * 4);

        for (let i = 0; i < numBranches; i++) {
            const angle = -Math.PI/2 + (Math.random() - 0.5) * Math.PI * 0.8;
            const length = 20 + Math.random() * 60;
            branches.push({
                startX: x,
                startY: y,
                angle: angle,
                length: length,
                segments: this.generateCrackSegments(x, y, angle, length)
            });
        }
        return branches;
    }

    generateCrackSegments(x, y, angle, length) {
        const segments = [];
        let currentX = x;
        let currentY = y;
        let remainingLength = length;
        let currentAngle = angle;

        while (remainingLength > 0) {
            const segLength = Math.min(remainingLength, 5 + Math.random() * 10);
            const newX = currentX + Math.cos(currentAngle) * segLength;
            const newY = currentY + Math.sin(currentAngle) * segLength;

            segments.push({ x1: currentX, y1: currentY, x2: newX, y2: newY });

            currentX = newX;
            currentY = newY;
            remainingLength -= segLength;
            currentAngle += (Math.random() - 0.5) * 0.5;
        }
        return segments;
    }

    addLightning(x, y) {
        this.lightning.push({
            x: x,
            y: 0,
            targetY: y,
            segments: this.generateLightningPath(x, 0, x, y),
            life: 10,
            brightness: 1
        });
    }

    generateLightningPath(x1, y1, x2, y2) {
        const segments = [];
        let currentX = x1;
        let currentY = y1;
        const steps = 10;
        const dy = (y2 - y1) / steps;

        for (let i = 0; i < steps; i++) {
            const newX = currentX + (Math.random() - 0.5) * 100;
            const newY = currentY + dy;
            segments.push({ x1: currentX, y1: currentY, x2: newX, y2: newY });
            currentX = newX;
            currentY = newY;
        }
        segments.push({ x1: currentX, y1: currentY, x2: x2, y2: y2 });
        return segments;
    }

    addDebris(x, y, intensity) {
        for (let i = 0; i < intensity; i++) {
            this.debris.push({
                x: x + (Math.random() - 0.5) * 50,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: -5 - Math.random() * 10,
                size: 2 + Math.random() * 6,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                life: 60 + Math.random() * 60
            });
        }
    }

    update() {
        // Update floating rocks
        this.floatingRocks.forEach(rock => {
            rock.y += (rock.targetY - rock.y) * 0.02;
            rock.rotation += rock.rotationSpeed;
            rock.wobble += 0.05;
            rock.x += Math.sin(rock.wobble) * 0.5;
        });

        // Update cracks
        this.cracks.forEach(crack => crack.age++);
        this.cracks = this.cracks.filter(c => c.age < 600); // 10 seconds

        // Update lightning
        this.lightning.forEach(l => {
            l.life--;
            l.brightness = l.life / 10;
        });
        this.lightning = this.lightning.filter(l => l.life > 0);

        // Update debris
        this.debris.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            d.vy += 0.5; // Gravity
            d.rotation += d.rotationSpeed;
            d.life--;
        });
        this.debris = this.debris.filter(d => d.life > 0 && d.y < this.canvas.height);

        // Remove rocks when power drops
        if (this.powerLevel < 3000 && this.floatingRocks.length > 0) {
            // Rocks fall back down
            this.floatingRocks.forEach(rock => {
                rock.targetY = this.canvas.height + 100;
            });
            this.floatingRocks = this.floatingRocks.filter(r => r.y < this.canvas.height);
        }
    }

    draw(camX) {
        const ctx = this.ctx;

        // Draw ground cracks
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        this.cracks.forEach(crack => {
            const alpha = Math.max(0, 1 - crack.age / 600);
            ctx.globalAlpha = alpha;
            crack.branches.forEach(branch => {
                branch.segments.forEach(seg => {
                    ctx.beginPath();
                    ctx.moveTo(seg.x1 - camX, seg.y1);
                    ctx.lineTo(seg.x2 - camX, seg.y2);
                    ctx.stroke();
                });
            });
        });
        ctx.globalAlpha = 1;

        // Draw floating rocks
        this.floatingRocks.forEach(rock => {
            ctx.save();
            ctx.translate(rock.x - camX, rock.y);
            ctx.rotate(rock.rotation);

            ctx.fillStyle = '#666';
            ctx.beginPath();
            ctx.moveTo(-rock.size/2, rock.size/3);
            ctx.lineTo(0, -rock.size/2);
            ctx.lineTo(rock.size/2, rock.size/4);
            ctx.lineTo(rock.size/3, rock.size/2);
            ctx.lineTo(-rock.size/3, rock.size/2);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        });

        // Draw lightning
        this.lightning.forEach(l => {
            ctx.strokeStyle = `rgba(255, 255, 100, ${l.brightness})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 20;

            l.segments.forEach(seg => {
                ctx.beginPath();
                ctx.moveTo(seg.x1 - camX, seg.y1);
                ctx.lineTo(seg.x2 - camX, seg.y2);
                ctx.stroke();
            });
            ctx.shadowBlur = 0;
        });

        // Draw debris
        this.debris.forEach(d => {
            ctx.save();
            ctx.translate(d.x - camX, d.y);
            ctx.rotate(d.rotation);
            ctx.fillStyle = '#8a7a6a';
            ctx.fillRect(-d.size/2, -d.size/2, d.size, d.size);
            ctx.restore();
        });
    }
}

// ============================================================================
// GLOBAL INSTANCES
// ============================================================================

let dramaticFinish = null;
let over9000 = null;
let comboAnnouncer = null;
let scouterUI = null;
let beamStruggle = null;
let envDestruction = null;

function initEpicFeatures(canvas, ctx) {
    dramaticFinish = new DramaticFinish(canvas, ctx);
    over9000 = new Over9000(canvas, ctx);
    comboAnnouncer = new ComboAnnouncer(canvas, ctx);
    scouterUI = new ScouterUI(canvas, ctx);
    beamStruggle = new BeamStruggle(canvas, ctx);
    envDestruction = new EnvironmentDestruction(canvas, ctx);

    console.log('EPIC FEATURES INITIALIZED!');
    console.log('- Dramatic Finish System');
    console.log('- IT\'S OVER 9000! Easter Egg');
    console.log('- Zenkai Boost System');
    console.log('- Combo Announcer');
    console.log('- Scouter UI');
    console.log('- Beam Struggle Mini-game');
    console.log('- Environment Destruction');
}

function updateEpicFeatures(player, enemies, boss) {
    if (dramaticFinish) dramaticFinish.update();
    if (over9000) over9000.update();
    if (comboAnnouncer) comboAnnouncer.update();
    if (scouterUI) scouterUI.update();
    if (beamStruggle) beamStruggle.update();
    if (envDestruction) {
        if (player) {
            const pl = scouterUI ? scouterUI.calculatePowerLevel(player) : 0;
            envDestruction.setPowerLevel(pl);
        }
        envDestruction.update();
    }

    // Check for combos
    if (player && comboAnnouncer) {
        comboAnnouncer.checkCombo(player.hitCombo || 0);
    }

    // Check Zenkai
    if (player && typeof player.checkZenkai === 'function') {
        player.checkZenkai();
    }
}

function drawEpicFeatures(camX, player, enemies, boss) {
    if (envDestruction) envDestruction.draw(camX);
    if (beamStruggle) beamStruggle.draw(camX);
    if (comboAnnouncer) comboAnnouncer.draw();
    if (scouterUI) scouterUI.draw(player, enemies, boss);
    if (over9000) over9000.draw();
    if (dramaticFinish) dramaticFinish.draw(camX);
}

// Apply Zenkai to a player
function applyEpicFeaturesToPlayer(player) {
    ZenkaiBoost.applyToPlayer(player);
}

// Trigger dramatic finish
function triggerDramaticFinish(attackerX, attackerY, targetX, targetY, finishType, bossName) {
    if (dramaticFinish) {
        dramaticFinish.trigger(attackerX, attackerY, targetX, targetY, finishType, bossName);
        return true;
    }
    return false;
}

// Check if dramatic finish is active (pause game during it)
function isDramaticFinishActive() {
    return dramaticFinish && dramaticFinish.shouldPauseGame();
}

// Start beam struggle
function startBeamStruggle(playerX, playerY, enemyX, enemyY) {
    if (beamStruggle) {
        beamStruggle.start(playerX, playerY, enemyX, enemyY, 50, 50);
        return true;
    }
    return false;
}

// Mash during beam struggle
function mashBeamStruggle() {
    if (beamStruggle && beamStruggle.isActive()) {
        beamStruggle.mash();
    }
}

// Check if beam struggle is active
function isBeamStruggleActive() {
    return beamStruggle && beamStruggle.isActive();
}

// Add environmental effects
function addGroundCrack(x, y) {
    if (envDestruction) envDestruction.addCrack(x, y);
}

function addLightningStrike(x, y) {
    if (envDestruction) envDestruction.addLightning(x, y);
}

function addDebrisExplosion(x, y, intensity = 10) {
    if (envDestruction) envDestruction.addDebris(x, y, intensity);
}

console.log('Epic Features module loaded! Get ready for some DBZ action!');
