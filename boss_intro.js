// ============================================================================
// CINEMATIC BOSS INTRO SEQUENCES
// ============================================================================

class BossIntro {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.active = false;
        this.complete = false;
        this.timer = 0;
        this.phase = 0;
        this.bossType = null;
        this.bossX = 0;
        this.bossY = 0;

        // Letterbox
        this.letterboxHeight = 0;
        this.targetLetterboxHeight = 80;

        // Camera
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraShake = 0;

        // Dialogue
        this.dialogueIndex = 0;
        this.dialogueText = "";
        this.fullDialogue = "";
        this.dialogueTimer = 0;
        this.dialogueLines = {
            frieza: [
                "You dare challenge Lord Frieza?",
                "I'll show you the terror of the universe's strongest!"
            ],
            cell: [
                "Welcome to the Cell Games!",
                "Let me test if you're worthy of my perfection."
            ],
            buu: [
                "Buu want to play!",
                "Buu turn you into candy!"
            ]
        };

        // Boss animation
        this.bossAnimY = -200;
        this.bossRotation = 0;
        this.bossScale = 1;
        this.auraRadius = 0;
        this.auraAlpha = 0;

        // Effects
        this.groundCracks = [];
        this.lightningFlashes = [];
        this.energyBurst = 0;

        // Health bar
        this.healthBarX = -400;
        this.bossNameAlpha = 0;
        this.fightTextAlpha = 0;
        this.fightTextScale = 3;
    }

    start(bossType, bossX, bossY) {
        this.active = true;
        this.complete = false;
        this.timer = 0;
        this.phase = 0;
        this.bossType = bossType;
        this.bossX = bossX;
        this.bossY = bossY;

        // Reset values
        this.letterboxHeight = 0;
        this.dialogueIndex = 0;
        this.dialogueText = "";
        this.dialogueTimer = 0;
        this.bossAnimY = -200;
        this.bossRotation = 0;
        this.bossScale = this.bossType === 'cell' ? 0.5 : 1;
        this.auraRadius = 0;
        this.auraAlpha = 0;
        this.groundCracks = [];
        this.lightningFlashes = [];
        this.energyBurst = 0;
        this.healthBarX = -400;
        this.bossNameAlpha = 0;
        this.fightTextAlpha = 0;
        this.fightTextScale = 3;
        this.cameraShake = 0;
    }

    update(deltaTime = 1) {
        if (!this.active) return;

        this.timer += deltaTime;

        // Phase 0: Letterbox in + Camera pan (0-60 frames)
        if (this.phase === 0) {
            this.letterboxHeight = Math.min(this.letterboxHeight + 3, this.targetLetterboxHeight);
            if (this.timer > 60) {
                this.phase = 1;
                this.timer = 0;
            }
        }

        // Phase 1: Boss entrance animation (60-180 frames)
        else if (this.phase === 1) {
            this.updateBossEntrance(deltaTime);

            if (this.timer > 120) {
                this.phase = 2;
                this.timer = 0;
                this.createGroundCracks();
                this.cameraShake = 20;
                this.energyBurst = 100;
            }
        }

        // Phase 2: Impact effects (180-240 frames)
        else if (this.phase === 2) {
            this.cameraShake *= 0.9;
            this.energyBurst *= 0.95;
            this.auraRadius += 5;
            this.auraAlpha = Math.min(this.auraAlpha + 0.05, 0.8);

            if (Math.random() < 0.1) {
                this.lightningFlashes.push({
                    x: this.bossX + (Math.random() - 0.5) * 200,
                    y: this.bossY + (Math.random() - 0.5) * 200,
                    life: 10
                });
            }

            this.updateLightning();

            if (this.timer > 60) {
                this.phase = 3;
                this.timer = 0;
                this.fullDialogue = this.dialogueLines[this.bossType][0];
            }
        }

        // Phase 3: First dialogue
        else if (this.phase === 3) {
            this.updateDialogue(deltaTime);

            if (this.timer > 120 && this.dialogueText === this.fullDialogue) {
                this.phase = 4;
                this.timer = 0;
                this.dialogueIndex = 1;
                this.dialogueText = "";
                this.fullDialogue = this.dialogueLines[this.bossType][1];
            }
        }

        // Phase 4: Second dialogue
        else if (this.phase === 4) {
            this.updateDialogue(deltaTime);

            if (this.timer > 120 && this.dialogueText === this.fullDialogue) {
                this.phase = 5;
                this.timer = 0;
            }
        }

        // Phase 5: Health bar reveal + name
        else if (this.phase === 5) {
            this.healthBarX += (this.canvas.width - 350 - this.healthBarX) * 0.1;
            this.bossNameAlpha = Math.min(this.bossNameAlpha + 0.05, 1);
            this.auraRadius += 3;
            this.updateLightning();

            if (this.timer > 60) {
                this.phase = 6;
                this.timer = 0;
            }
        }

        // Phase 6: "FIGHT!" text
        else if (this.phase === 6) {
            this.fightTextAlpha = Math.min(this.fightTextAlpha + 0.08, 1);
            this.fightTextScale = Math.max(this.fightTextScale * 0.92, 1);

            if (this.timer > 60) {
                this.phase = 7;
                this.timer = 0;
            }
        }

        // Phase 7: Letterbox out + complete
        else if (this.phase === 7) {
            this.letterboxHeight = Math.max(this.letterboxHeight - 5, 0);
            this.fightTextAlpha *= 0.9;

            if (this.letterboxHeight === 0) {
                this.active = false;
                this.complete = true;
            }
        }
    }

    updateBossEntrance(deltaTime) {
        if (this.bossType === 'frieza') {
            this.bossAnimY += (this.bossY - this.bossAnimY) * 0.05;
            this.bossRotation = Math.sin(this.timer * 0.1) * 0.1;
        } else if (this.bossType === 'cell') {
            this.bossScale += (1 - this.bossScale) * 0.05;
            this.bossRotation = 0;
        } else if (this.bossType === 'buu') {
            this.bossAnimY += (this.bossY - this.bossAnimY) * 0.08;
            const bounceOffset = Math.abs(Math.sin(this.timer * 0.2)) * 30;
            this.bossAnimY -= bounceOffset;
        }
    }

    updateDialogue(deltaTime) {
        this.dialogueTimer += deltaTime;
        if (this.dialogueTimer % 3 === 0 && this.dialogueText.length < this.fullDialogue.length) {
            this.dialogueText += this.fullDialogue[this.dialogueText.length];
        }
        this.updateLightning();
    }

    updateLightning() {
        this.lightningFlashes = this.lightningFlashes.filter(flash => {
            flash.life--;
            return flash.life > 0;
        });
    }

    createGroundCracks() {
        const numCracks = 8;
        for (let i = 0; i < numCracks; i++) {
            const angle = (Math.PI * 2 * i) / numCracks;
            this.groundCracks.push({
                startX: this.bossX,
                startY: this.bossY + 50,
                endX: this.bossX + Math.cos(angle) * 150,
                endY: this.bossY + 50 + Math.sin(angle) * 100
            });
        }
    }

    draw(camX = 0) {
        if (!this.active) return;

        const ctx = this.ctx;
        const shake = this.cameraShake;
        const shakeX = (Math.random() - 0.5) * shake;
        const shakeY = (Math.random() - 0.5) * shake;

        ctx.save();
        ctx.translate(shakeX, shakeY);

        // Ground cracks
        if (this.groundCracks.length > 0) {
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 3;
            this.groundCracks.forEach(crack => {
                ctx.beginPath();
                ctx.moveTo(crack.startX - camX, crack.startY);
                ctx.lineTo(crack.endX - camX, crack.endY);
                ctx.stroke();
            });
        }

        // Energy aura burst
        if (this.energyBurst > 0) {
            ctx.fillStyle = `rgba(255, 200, 0, ${this.energyBurst / 200})`;
            ctx.beginPath();
            ctx.arc(this.bossX - camX, this.bossY, this.energyBurst * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Boss aura
        if (this.auraRadius > 0) {
            const gradient = ctx.createRadialGradient(
                this.bossX - camX, this.bossY, 0,
                this.bossX - camX, this.bossY, this.auraRadius
            );
            const auraColor = this.bossType === 'frieza' ? '150, 0, 150' :
                             this.bossType === 'cell' ? '0, 255, 0' : '255, 100, 200';
            gradient.addColorStop(0, `rgba(${auraColor}, ${this.auraAlpha})`);
            gradient.addColorStop(1, `rgba(${auraColor}, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.bossX - camX, this.bossY, this.auraRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Lightning flashes
        this.lightningFlashes.forEach(flash => {
            ctx.fillStyle = `rgba(255, 255, 255, ${flash.life / 10})`;
            ctx.beginPath();
            ctx.arc(flash.x - camX, flash.y, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(200, 200, 255, ${flash.life / 10})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(flash.x - camX, 0);
            let y = 0;
            while (y < flash.y) {
                y += 20;
                ctx.lineTo(flash.x - camX + (Math.random() - 0.5) * 30, y);
            }
            ctx.stroke();
        });

        ctx.restore();

        // Letterbox bars
        if (this.letterboxHeight > 0) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, this.canvas.width, this.letterboxHeight);
            ctx.fillRect(0, this.canvas.height - this.letterboxHeight, this.canvas.width, this.letterboxHeight);
        }

        // Dialogue box
        if (this.phase >= 3 && this.phase <= 4 && this.dialogueText) {
            const boxHeight = 120;
            const boxY = this.canvas.height - boxHeight - 20;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(50, boxY, this.canvas.width - 100, boxHeight);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.strokeRect(50, boxY, this.canvas.width - 100, boxHeight);

            // Portrait
            const portraitColor = this.bossType === 'frieza' ? '#9B59B6' :
                                 this.bossType === 'cell' ? '#2ECC71' : '#FF69B4';
            ctx.fillStyle = portraitColor;
            ctx.fillRect(70, boxY + 20, 80, 80);
            ctx.strokeRect(70, boxY + 20, 80, 80);

            // Boss name
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 18px "Courier New"';
            const bossName = this.bossType.toUpperCase();
            ctx.fillText(bossName, 170, boxY + 35);

            // Dialogue text
            ctx.fillStyle = '#FFF';
            ctx.font = '16px "Courier New"';
            ctx.fillText(this.dialogueText, 170, boxY + 65);
        }

        // Health bar reveal
        if (this.phase >= 5) {
            const barWidth = 300;
            const barHeight = 30;
            const barY = 80;

            ctx.fillStyle = `rgba(255, 215, 0, ${this.bossNameAlpha})`;
            ctx.font = 'bold 24px "Courier New"';
            ctx.textAlign = 'right';
            const bossTitle = this.bossType === 'frieza' ? 'LORD FRIEZA' :
                            this.bossType === 'cell' ? 'PERFECT CELL' : 'MAJIN BUU';
            ctx.fillText(bossTitle, this.healthBarX + barWidth, barY - 10);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(this.healthBarX, barY, barWidth, barHeight);

            const healthColor = this.bossType === 'frieza' ? '#9B59B6' :
                               this.bossType === 'cell' ? '#2ECC71' : '#FF69B4';
            ctx.fillStyle = healthColor;
            ctx.fillRect(this.healthBarX + 2, barY + 2, barWidth - 4, barHeight - 4);

            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.healthBarX, barY, barWidth, barHeight);
            ctx.textAlign = 'left';
        }

        // "FIGHT!" text
        if (this.phase >= 6 && this.fightTextAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = this.fightTextAlpha;
            ctx.fillStyle = '#FF0000';
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 6;
            ctx.font = `bold ${80 * this.fightTextScale}px "Courier New"`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.strokeText('FIGHT!', this.canvas.width / 2, this.canvas.height / 2);
            ctx.fillText('FIGHT!', this.canvas.width / 2, this.canvas.height / 2);

            ctx.restore();
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
        }
    }

    isComplete() { return this.complete; }
    isActive() { return this.active; }
}

if (typeof module !== 'undefined') {
    module.exports = { BossIntro };
}
