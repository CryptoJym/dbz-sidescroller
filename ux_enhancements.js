// ============================================================================
// UX ENHANCEMENTS - Making the Game Feel Polished and Professional
// ============================================================================

// ============================================================================
// ANIMATED TITLE SCREEN
// ============================================================================

class AnimatedTitle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.time = 0;

        // Title animation
        this.titleY = -100;
        this.titleTargetY = 80;
        this.titleScale = 0;

        // Subtitle
        this.subtitleAlpha = 0;

        // Energy particles in background
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: -1 - Math.random() * 2,
                size: 2 + Math.random() * 4,
                color: this.randomAuraColor(),
                life: 100 + Math.random() * 100
            });
        }

        // Menu items
        this.menuItems = ['START GAME', 'CHARACTER SELECT', 'OPTIONS', 'CONTROLS'];
        this.selectedItem = 0;
        this.menuAlpha = 0;

        // Dragon Ball stars floating
        this.dragonBalls = [];
        for (let i = 0; i < 7; i++) {
            this.dragonBalls.push({
                x: 100 + i * 110,
                y: canvas.height - 100,
                stars: i + 1,
                bobOffset: Math.random() * Math.PI * 2,
                glowPhase: Math.random() * Math.PI * 2
            });
        }
    }

    randomAuraColor() {
        const colors = ['#FFD700', '#FFA500', '#FF6600', '#00BFFF', '#FF00FF', '#00FF00'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.time++;

        // Animate title entrance
        if (this.time < 60) {
            this.titleY += (this.titleTargetY - this.titleY) * 0.1;
            this.titleScale = Math.min(1, this.titleScale + 0.05);
        }

        // Fade in subtitle
        if (this.time > 30 && this.subtitleAlpha < 1) {
            this.subtitleAlpha += 0.02;
        }

        // Fade in menu
        if (this.time > 60 && this.menuAlpha < 1) {
            this.menuAlpha += 0.03;
        }

        // Update particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;

            // Wrap around
            if (p.y < -10) p.y = this.canvas.height + 10;
            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;

            // Respawn dead particles
            if (p.life <= 0) {
                p.y = this.canvas.height + 10;
                p.life = 100 + Math.random() * 100;
                p.color = this.randomAuraColor();
            }
        });
    }

    draw() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, '#0a0a2a');
        bgGrad.addColorStop(0.5, '#1a0a3a');
        bgGrad.addColorStop(1, '#0a1a2a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Draw particles
        this.particles.forEach(p => {
            ctx.globalAlpha = Math.min(1, p.life / 50);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Draw Dragon Balls
        this.dragonBalls.forEach(db => {
            const bob = Math.sin(this.time * 0.05 + db.bobOffset) * 10;
            const glow = 0.5 + Math.sin(this.time * 0.1 + db.glowPhase) * 0.3;

            // Glow
            ctx.beginPath();
            ctx.arc(db.x, db.y + bob, 30, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 150, 0, ${glow * 0.3})`;
            ctx.fill();

            // Ball
            const ballGrad = ctx.createRadialGradient(db.x - 5, db.y + bob - 5, 0, db.x, db.y + bob, 25);
            ballGrad.addColorStop(0, '#FFE4B5');
            ballGrad.addColorStop(0.5, '#FFA500');
            ballGrad.addColorStop(1, '#CC6600');
            ctx.beginPath();
            ctx.arc(db.x, db.y + bob, 25, 0, Math.PI * 2);
            ctx.fillStyle = ballGrad;
            ctx.fill();

            // Stars
            ctx.fillStyle = '#CC0000';
            const starPositions = this.getStarPositions(db.stars);
            starPositions.forEach(pos => {
                ctx.beginPath();
                ctx.arc(db.x + pos.x * 12, db.y + bob + pos.y * 12, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        });

        // Title
        ctx.save();
        ctx.translate(W / 2, this.titleY);
        ctx.scale(this.titleScale, this.titleScale);

        // Title glow
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 30;
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Title outline
        ctx.strokeStyle = '#FF6600';
        ctx.lineWidth = 6;
        ctx.strokeText('DRAGON BALL Z', 0, 0);

        // Title fill with gradient
        const titleGrad = ctx.createLinearGradient(0, -30, 0, 30);
        titleGrad.addColorStop(0, '#FFD700');
        titleGrad.addColorStop(0.5, '#FFA500');
        titleGrad.addColorStop(1, '#FF6600');
        ctx.fillStyle = titleGrad;
        ctx.fillText('DRAGON BALL Z', 0, 0);

        ctx.restore();

        // Subtitle
        ctx.globalAlpha = this.subtitleAlpha;
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00BFFF';
        ctx.shadowColor = '#00BFFF';
        ctx.shadowBlur = 15;
        ctx.fillText('SAIYAN ASSAULT', W / 2, 140);

        // Edition badge
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.fillText('~ LEGENDARY EDITION ~', W / 2, 175);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Menu
        if (this.menuAlpha > 0) {
            ctx.globalAlpha = this.menuAlpha;
            this.menuItems.forEach((item, i) => {
                const y = 280 + i * 50;
                const isSelected = i === this.selectedItem;

                if (isSelected) {
                    // Selection indicator
                    const pulse = Math.sin(this.time * 0.15) * 5;
                    ctx.fillStyle = '#FFD700';
                    ctx.font = 'bold 28px Arial';

                    // Arrow indicators
                    ctx.fillText('>', W / 2 - 120 - pulse, y);
                    ctx.fillText('<', W / 2 + 120 + pulse, y);

                    // Glowing text
                    ctx.shadowColor = '#FFD700';
                    ctx.shadowBlur = 20;
                } else {
                    ctx.fillStyle = '#888888';
                    ctx.font = '24px Arial';
                    ctx.shadowBlur = 0;
                }

                ctx.textAlign = 'center';
                ctx.fillText(item, W / 2, y);
            });
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }

        // Press start prompt
        if (this.time > 90) {
            const blink = Math.sin(this.time * 0.1) > 0;
            if (blink) {
                ctx.font = '18px Arial';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText('Press ENTER to select', W / 2, H - 50);
                ctx.fillText('Use UP/DOWN to navigate', W / 2, H - 30);
            }
        }
    }

    getStarPositions(count) {
        const positions = [
            [{ x: 0, y: 0 }],
            [{ x: -0.3, y: 0 }, { x: 0.3, y: 0 }],
            [{ x: 0, y: -0.4 }, { x: -0.3, y: 0.3 }, { x: 0.3, y: 0.3 }],
            [{ x: -0.3, y: -0.3 }, { x: 0.3, y: -0.3 }, { x: -0.3, y: 0.3 }, { x: 0.3, y: 0.3 }],
            [{ x: 0, y: -0.4 }, { x: -0.4, y: 0 }, { x: 0.4, y: 0 }, { x: -0.2, y: 0.4 }, { x: 0.2, y: 0.4 }],
            [{ x: -0.3, y: -0.4 }, { x: 0.3, y: -0.4 }, { x: -0.4, y: 0.1 }, { x: 0.4, y: 0.1 }, { x: -0.2, y: 0.4 }, { x: 0.2, y: 0.4 }],
            [{ x: 0, y: -0.5 }, { x: -0.4, y: -0.2 }, { x: 0.4, y: -0.2 }, { x: -0.3, y: 0.2 }, { x: 0.3, y: 0.2 }, { x: -0.15, y: 0.5 }, { x: 0.15, y: 0.5 }]
        ];
        return positions[count - 1] || [];
    }

    navigate(direction) {
        if (direction === 'up') {
            this.selectedItem = (this.selectedItem - 1 + this.menuItems.length) % this.menuItems.length;
        } else if (direction === 'down') {
            this.selectedItem = (this.selectedItem + 1) % this.menuItems.length;
        }
    }

    select() {
        return this.menuItems[this.selectedItem];
    }
}

// ============================================================================
// CONTROLS TUTORIAL OVERLAY
// ============================================================================

class ControlsTutorial {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.active = false;
        this.page = 0;
        this.pages = [
            {
                title: 'MOVEMENT',
                controls: [
                    { key: '← →', action: 'Move Left/Right', icon: 'arrows' },
                    { key: '↑', action: 'Jump (tap again for Double Jump)', icon: 'up' },
                    { key: '↓', action: 'Crouch / Fast Fall', icon: 'down' },
                    { key: 'SPACE', action: 'Dash / Instant Transmission', icon: 'space' }
                ]
            },
            {
                title: 'COMBAT',
                controls: [
                    { key: 'Z', action: 'Ki Blast (rapid fire)', icon: 'z' },
                    { key: 'X', action: 'Melee Attack / Parry', icon: 'x' },
                    { key: 'C (hold)', action: 'Charge Special Attack', icon: 'c' },
                    { key: 'V', action: 'Ultimate Attack (full ki)', icon: 'v' }
                ]
            },
            {
                title: 'ADVANCED',
                controls: [
                    { key: 'SHIFT', action: 'Transform to Super Saiyan (Lv3+)', icon: 'shift' },
                    { key: 'W', action: 'Wall Jump (against walls)', icon: 'w' },
                    { key: 'X (timed)', action: 'Parry enemy attacks', icon: 'x' },
                    { key: 'ESC', action: 'Pause Game', icon: 'esc' }
                ]
            },
            {
                title: 'TIPS',
                controls: [
                    { key: 'COMBO', action: 'Chain hits for damage bonus!', icon: 'star' },
                    { key: 'ZENKAI', action: 'Survive low HP for power boost', icon: 'heart' },
                    { key: 'TRANSFORM', action: 'SSJ = 50% more power!', icon: 'lightning' },
                    { key: 'PARRY', action: 'Perfect timing = counter attack', icon: 'shield' }
                ]
            }
        ];
    }

    show() {
        this.active = true;
        this.page = 0;
    }

    hide() {
        this.active = false;
    }

    nextPage() {
        this.page = (this.page + 1) % this.pages.length;
    }

    prevPage() {
        this.page = (this.page - 1 + this.pages.length) % this.pages.length;
    }

    update() {
        // Animation updates if needed
    }

    draw() {
        if (!this.active) return;

        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        // Overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, W, H);

        // Box
        const boxW = 600;
        const boxH = 400;
        const boxX = (W - boxW) / 2;
        const boxY = (H - boxH) / 2;

        // Box background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(boxX, boxY, boxW, boxH);

        // Box border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Page content
        const pageData = this.pages[this.page];

        // Title
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.fillText(pageData.title, W / 2, boxY + 50);

        // Controls list
        pageData.controls.forEach((ctrl, i) => {
            const y = boxY + 110 + i * 70;

            // Key box
            ctx.fillStyle = '#333';
            ctx.fillRect(boxX + 50, y - 20, 100, 40);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.strokeRect(boxX + 50, y - 20, 100, 40);

            // Key text
            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText(ctrl.key, boxX + 100, y + 6);

            // Action text
            ctx.font = '20px Arial';
            ctx.fillStyle = '#ccc';
            ctx.textAlign = 'left';
            ctx.fillText(ctrl.action, boxX + 170, y + 6);
        });

        // Page indicator
        ctx.font = '16px Arial';
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.fillText(`Page ${this.page + 1} / ${this.pages.length}`, W / 2, boxY + boxH - 60);

        // Navigation hints
        ctx.fillText('← → to navigate pages | ENTER to close', W / 2, boxY + boxH - 30);
    }

    isActive() {
        return this.active;
    }
}

// ============================================================================
// VISUAL FEEDBACK SYSTEM
// ============================================================================

class VisualFeedback {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // Damage numbers
        this.damageNumbers = [];

        // Status messages
        this.statusMessages = [];

        // Level up effect
        this.levelUpEffect = null;

        // Achievement popups
        this.achievements = [];
    }

    addDamageNumber(x, y, damage, isCrit = false, isHeal = false) {
        this.damageNumbers.push({
            x: x,
            y: y,
            damage: damage,
            isCrit: isCrit,
            isHeal: isHeal,
            vy: -3,
            life: 60,
            scale: isCrit ? 1.5 : 1
        });
    }

    addStatusMessage(message, color = '#ffffff') {
        this.statusMessages.push({
            message: message,
            color: color,
            y: this.canvas.height / 2 - 100,
            alpha: 1,
            scale: 0,
            life: 120
        });
    }

    triggerLevelUp(newLevel) {
        this.levelUpEffect = {
            level: newLevel,
            time: 0,
            duration: 180,
            particles: []
        };

        // Create level up particles
        for (let i = 0; i < 30; i++) {
            this.levelUpEffect.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                size: 3 + Math.random() * 5,
                color: Math.random() > 0.5 ? '#FFD700' : '#FFA500'
            });
        }
    }

    addAchievement(title, description, icon = 'star') {
        this.achievements.push({
            title: title,
            description: description,
            icon: icon,
            x: this.canvas.width + 300,
            targetX: this.canvas.width - 280,
            life: 300
        });
    }

    update() {
        // Update damage numbers
        this.damageNumbers.forEach(dn => {
            dn.y += dn.vy;
            dn.vy += 0.1;
            dn.life--;
        });
        this.damageNumbers = this.damageNumbers.filter(dn => dn.life > 0);

        // Update status messages
        this.statusMessages.forEach(sm => {
            sm.life--;
            if (sm.life > 100) {
                sm.scale = Math.min(1, sm.scale + 0.1);
            } else if (sm.life < 30) {
                sm.alpha = sm.life / 30;
            }
            sm.y -= 0.5;
        });
        this.statusMessages = this.statusMessages.filter(sm => sm.life > 0);

        // Update level up effect
        if (this.levelUpEffect) {
            this.levelUpEffect.time++;
            this.levelUpEffect.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.95;
                p.vy *= 0.95;
            });
            if (this.levelUpEffect.time >= this.levelUpEffect.duration) {
                this.levelUpEffect = null;
            }
        }

        // Update achievements
        this.achievements.forEach(a => {
            a.x += (a.targetX - a.x) * 0.1;
            a.life--;
            if (a.life < 60) {
                a.targetX = this.canvas.width + 300;
            }
        });
        this.achievements = this.achievements.filter(a => a.life > 0);
    }

    draw(camX = 0) {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        // Draw damage numbers
        this.damageNumbers.forEach(dn => {
            const alpha = Math.min(1, dn.life / 30);
            ctx.globalAlpha = alpha;

            ctx.font = `bold ${Math.floor(24 * dn.scale)}px Arial`;
            ctx.textAlign = 'center';

            if (dn.isHeal) {
                ctx.fillStyle = '#00ff00';
                ctx.fillText(`+${dn.damage}`, dn.x - camX, dn.y);
            } else if (dn.isCrit) {
                ctx.fillStyle = '#ff0000';
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 10;
                ctx.fillText(`${dn.damage}!`, dn.x - camX, dn.y);
                ctx.shadowBlur = 0;
            } else {
                ctx.fillStyle = '#ffffff';
                ctx.fillText(dn.damage, dn.x - camX, dn.y);
            }
        });
        ctx.globalAlpha = 1;

        // Draw status messages
        this.statusMessages.forEach(sm => {
            ctx.globalAlpha = sm.alpha;
            ctx.save();
            ctx.translate(W / 2, sm.y);
            ctx.scale(sm.scale, sm.scale);

            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = sm.color;
            ctx.shadowColor = sm.color;
            ctx.shadowBlur = 15;
            ctx.fillText(sm.message, 0, 0);

            ctx.restore();
        });
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Draw level up effect
        if (this.levelUpEffect) {
            const le = this.levelUpEffect;
            const progress = le.time / le.duration;

            // Particles
            le.particles.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 1 - progress;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * (1 - progress), 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            // Text
            if (le.time < 120) {
                const scale = Math.min(1.5, le.time / 20);
                const alpha = le.time < 90 ? 1 : (120 - le.time) / 30;

                ctx.globalAlpha = alpha;
                ctx.save();
                ctx.translate(W / 2, H / 2);
                ctx.scale(scale, scale);

                ctx.font = 'bold 48px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#FFD700';
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 30;
                ctx.fillText('LEVEL UP!', 0, -30);

                ctx.font = 'bold 72px Arial';
                ctx.fillText(`LV ${le.level}`, 0, 40);

                ctx.restore();
            }
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }

        // Draw achievements
        this.achievements.forEach(a => {
            const alpha = Math.min(1, a.life / 60);
            ctx.globalAlpha = alpha;

            // Background
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(a.x, 50, 270, 80);

            // Border
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.strokeRect(a.x, 50, 270, 80);

            // Icon
            ctx.font = '32px Arial';
            ctx.fillStyle = '#FFD700';
            ctx.fillText('★', a.x + 25, 100);

            // Title
            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = '#FFD700';
            ctx.textAlign = 'left';
            ctx.fillText(a.title, a.x + 60, 80);

            // Description
            ctx.font = '14px Arial';
            ctx.fillStyle = '#aaa';
            ctx.fillText(a.description, a.x + 60, 105);
        });
        ctx.globalAlpha = 1;
    }
}

// ============================================================================
// PAUSE MENU
// ============================================================================

class PauseMenu {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.active = false;
        this.selectedItem = 0;
        this.items = ['RESUME', 'CONTROLS', 'RESTART LEVEL', 'QUIT TO TITLE'];
        this.time = 0;
    }

    show() {
        this.active = true;
        this.selectedItem = 0;
        this.time = 0;
    }

    hide() {
        this.active = false;
    }

    toggle() {
        if (this.active) this.hide();
        else this.show();
    }

    navigate(direction) {
        if (direction === 'up') {
            this.selectedItem = (this.selectedItem - 1 + this.items.length) % this.items.length;
        } else if (direction === 'down') {
            this.selectedItem = (this.selectedItem + 1) % this.items.length;
        }
    }

    select() {
        return this.items[this.selectedItem];
    }

    update() {
        if (!this.active) return;
        this.time++;
    }

    draw() {
        if (!this.active) return;

        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, W, H);

        // Pause text
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.fillText('PAUSED', W / 2, 120);
        ctx.shadowBlur = 0;

        // Menu items
        this.items.forEach((item, i) => {
            const y = 220 + i * 60;
            const isSelected = i === this.selectedItem;

            if (isSelected) {
                const pulse = Math.sin(this.time * 0.15) * 5;
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 28px Arial';
                ctx.fillText('>', W / 2 - 100 - pulse, y);
                ctx.fillText('<', W / 2 + 100 + pulse, y);
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 15;
            } else {
                ctx.fillStyle = '#666';
                ctx.font = '24px Arial';
                ctx.shadowBlur = 0;
            }

            ctx.fillText(item, W / 2, y);
        });
        ctx.shadowBlur = 0;
    }

    isActive() {
        return this.active;
    }
}

// ============================================================================
// HIT STOP / FREEZE FRAME EFFECT
// ============================================================================

class HitStop {
    constructor() {
        this.active = false;
        this.duration = 0;
        this.maxDuration = 0;
    }

    trigger(frames) {
        this.active = true;
        this.duration = frames;
        this.maxDuration = frames;
    }

    update() {
        if (this.active) {
            this.duration--;
            if (this.duration <= 0) {
                this.active = false;
            }
        }
    }

    shouldPause() {
        return this.active;
    }
}

// ============================================================================
// GLOBAL INSTANCES
// ============================================================================

let animatedTitle = null;
let controlsTutorial = null;
let visualFeedback = null;
let pauseMenu = null;
let hitStop = null;

function initUXEnhancements(canvas, ctx) {
    animatedTitle = new AnimatedTitle(canvas, ctx);
    controlsTutorial = new ControlsTutorial(canvas, ctx);
    visualFeedback = new VisualFeedback(canvas, ctx);
    pauseMenu = new PauseMenu(canvas, ctx);
    hitStop = new HitStop();

    console.log('UX Enhancements initialized!');
    console.log('- Animated Title Screen');
    console.log('- Controls Tutorial');
    console.log('- Visual Feedback System');
    console.log('- Pause Menu');
    console.log('- Hit Stop Effect');
}

function updateUXSystems() {
    if (animatedTitle) animatedTitle.update();
    if (controlsTutorial) controlsTutorial.update();
    if (visualFeedback) visualFeedback.update();
    if (pauseMenu) pauseMenu.update();
    if (hitStop) hitStop.update();
}

function drawUXOverlays(camX = 0) {
    if (visualFeedback) visualFeedback.draw(camX);
    if (pauseMenu) pauseMenu.draw();
    if (controlsTutorial) controlsTutorial.draw();
}

// Helper functions
function showDamage(x, y, damage, isCrit = false) {
    if (visualFeedback) visualFeedback.addDamageNumber(x, y, damage, isCrit);
}

function showHeal(x, y, amount) {
    if (visualFeedback) visualFeedback.addDamageNumber(x, y, amount, false, true);
}

function showStatus(message, color = '#ffffff') {
    if (visualFeedback) visualFeedback.addStatusMessage(message, color);
}

function triggerLevelUp(level) {
    if (visualFeedback) visualFeedback.triggerLevelUp(level);
}

function showAchievement(title, description) {
    if (visualFeedback) visualFeedback.addAchievement(title, description);
}

function triggerHitStop(frames = 5) {
    if (hitStop) hitStop.trigger(frames);
}

function isHitStopped() {
    return hitStop && hitStop.shouldPause();
}

console.log('UX Enhancements module loaded!');
