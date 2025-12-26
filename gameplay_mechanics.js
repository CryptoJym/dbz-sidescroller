// ============================================================================
// NEW GAMEPLAY MECHANICS FOR PLAYER CLASS
// Add these properties and methods to the Player class
// ============================================================================

// ==================== WALL JUMP SYSTEM ====================

const WallJumpMixin = {
    wallJumpCount: 0,
    maxWallJumps: 3,
    isAgainstWall: false,
    wallJumpForce: -12,
    wallJumpHorizontalBoost: 8,
    wallSlideSpeed: 2,

    checkWallCollision(levelLength) {
        const touchingLeftWall = this.x <= 0;
        const touchingRightWall = this.x + this.w >= levelLength;

        this.isAgainstWall = (touchingLeftWall || touchingRightWall) && !this.ground;
        this.wallSide = touchingLeftWall ? 'left' : 'right';
        return this.isAgainstWall;
    },

    wallSlide() {
        if (this.isAgainstWall && this.vy > 0) {
            this.vy = Math.min(this.vy, this.wallSlideSpeed);
            this.pose = 'wallSlide';
        }
    },

    performWallJump() {
        if (this.isAgainstWall && this.wallJumpCount < this.maxWallJumps) {
            this.vy = this.wallJumpForce;
            this.vx = this.wallSide === 'left' ? this.wallJumpHorizontalBoost : -this.wallJumpHorizontalBoost;
            this.wallJumpCount++;
            this.right = this.wallSide === 'left';
            return true;
        }
        return false;
    },

    resetWallJumps() {
        if (this.ground) {
            this.wallJumpCount = 0;
        }
    }
};

// ==================== INSTANT TRANSMISSION ====================

const InstantTransmissionMixin = {
    instantTransmissionCooldown: 0,
    instantTransmissionCooldownMax: 20,
    instantTransmissionDistance: 100,
    instantTransmissionKiCost: 15,
    teleportInvincible: false,
    teleportInvincibilityFrames: 0,
    afterimages: [],

    performInstantTransmission(direction) {
        if (this.instantTransmissionCooldown > 0 || this.ki < this.instantTransmissionKiCost) {
            return null;
        }

        // Create afterimage at current position
        this.afterimages.push({
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            opacity: 0.7,
            lifetime: 15,
            right: this.right,
            pose: this.pose,
            frame: this.frame
        });

        // Calculate teleport destination
        let teleportX = 0, teleportY = 0;
        if (direction === 'left') teleportX = -this.instantTransmissionDistance;
        else if (direction === 'right') teleportX = this.instantTransmissionDistance;
        else if (direction === 'up') teleportY = -this.instantTransmissionDistance;
        else if (direction === 'down') teleportY = this.instantTransmissionDistance;

        const oldX = this.x, oldY = this.y;
        this.x += teleportX;
        this.y += teleportY;

        // Set invincibility and cooldown
        this.teleportInvincible = true;
        this.teleportInvincibilityFrames = 10;
        this.instantTransmissionCooldown = this.instantTransmissionCooldownMax;
        this.ki -= this.instantTransmissionKiCost;

        // Return particle trail info
        return {
            startX: oldX + this.w/2,
            startY: oldY + this.h/2,
            endX: this.x + this.w/2,
            endY: this.y + this.h/2
        };
    },

    updateAfterimages() {
        this.afterimages = this.afterimages.filter(afterimage => {
            afterimage.lifetime--;
            afterimage.opacity = afterimage.lifetime / 15 * 0.7;
            return afterimage.lifetime > 0;
        });
    },

    updateInstantTransmissionCooldown() {
        if (this.instantTransmissionCooldown > 0) this.instantTransmissionCooldown--;
        if (this.teleportInvincibilityFrames > 0) {
            this.teleportInvincibilityFrames--;
            if (this.teleportInvincibilityFrames === 0) {
                this.teleportInvincible = false;
            }
        }
    },

    drawAfterimages(camX) {
        this.afterimages.forEach(afterimage => {
            ctx.save();
            ctx.globalAlpha = afterimage.opacity;
            ctx.fillStyle = '#00ffff';
            ctx.fillRect(afterimage.x - camX, afterimage.y, afterimage.w, afterimage.h);
            ctx.restore();
        });
    }
};

// ==================== COMBO FINISHER SYSTEM ====================

const ComboFinisherMixin = {
    comboMeleeCount: 0,
    comboMeleeTimer: 0,
    comboMeleeTimerMax: 60,
    canPerformFinisher: false,
    finisherDamageMultiplier: 3,
    finisherKnockback: 20,
    finisherActive: false,
    finisherFrames: 0,

    registerComboMeleeHit() {
        this.comboMeleeCount++;
        this.comboMeleeTimer = this.comboMeleeTimerMax;

        if (this.comboMeleeCount >= 4) {
            this.canPerformFinisher = true;
        }
    },

    performComboFinisher() {
        if (!this.canPerformFinisher) return null;

        this.finisherActive = true;
        this.finisherFrames = 30;
        this.pose = 'finisher';

        const result = {
            x: this.x + (this.right ? this.w - 15 : -60),
            y: this.y + 10,
            w: 75,
            h: this.h - 20,
            dmg: this.atk * this.finisherDamageMultiplier * (this.ssj ? 2 : 1) * (this.powerBoost > 0 ? 1.5 : 1),
            knockback: this.finisherKnockback,
            isFinisher: true
        };

        // Reset combo
        this.comboMeleeCount = 0;
        this.canPerformFinisher = false;

        return result;
    },

    updateComboFinisherSystem() {
        if (this.comboMeleeTimer > 0) {
            this.comboMeleeTimer--;
            if (this.comboMeleeTimer === 0) {
                this.comboMeleeCount = 0;
                this.canPerformFinisher = false;
            }
        }

        if (this.finisherFrames > 0) {
            this.finisherFrames--;
            if (this.finisherFrames === 0) {
                this.finisherActive = false;
            }
        }
    }
};

// ==================== RAGE MODE ====================

const RageModeMixin = {
    rageMode: false,
    rageModeThreshold: 0.25,
    rageDamageMultiplier: 1.5,
    rageKiRegenBonus: 0.3,

    checkRageMode() {
        const hpPercent = this.hp / this.maxHp;

        if (hpPercent <= this.rageModeThreshold && !this.rageMode) {
            this.rageMode = true;
            return 'activated';
        } else if (hpPercent > this.rageModeThreshold && this.rageMode) {
            this.rageMode = false;
            return 'deactivated';
        }
        return null;
    },

    getRageDamageMultiplier() {
        return this.rageMode ? this.rageDamageMultiplier : 1;
    },

    getRageKiRegen() {
        return this.rageMode ? this.rageKiRegenBonus : 0;
    }
};

// ==================== PARRY SYSTEM ====================

const ParryMixin = {
    parryActive: false,
    parryWindow: 8,
    parryWindowFrames: 0,
    parrySuccessful: false,
    parryKiRestore: 20,
    parryStunDuration: 40,

    activateParry() {
        if (this.parryWindowFrames > 0 || this.meleeCD > 0) return false;

        this.parryActive = true;
        this.parryWindowFrames = this.parryWindow;
        this.pose = 'parry';
        this.meleeCD = 25;

        return true;
    },

    checkParrySuccess(attackerX, attackerY) {
        if (this.parryActive && this.parryWindowFrames > 0) {
            this.parrySuccessful = true;
            this.ki = Math.min(this.maxKi, this.ki + this.parryKiRestore);

            return {
                success: true,
                stunDuration: this.parryStunDuration,
                clashX: (this.x + this.w/2 + attackerX) / 2,
                clashY: (this.y + this.h/2 + attackerY) / 2
            };
        }
        return { success: false };
    },

    updateParrySystem() {
        if (this.parryWindowFrames > 0) {
            this.parryWindowFrames--;
            if (this.parryWindowFrames === 0) {
                this.parryActive = false;
            }
        }

        if (this.parrySuccessful) {
            this.parrySuccessful = false;
        }
    }
};

// ==================== INTEGRATION HELPER ====================

function applyNewMechanicsToPlayer(player) {
    // Apply all mixins to player
    Object.assign(player, WallJumpMixin);
    Object.assign(player, InstantTransmissionMixin);
    Object.assign(player, ComboFinisherMixin);
    Object.assign(player, RageModeMixin);
    Object.assign(player, ParryMixin);

    // Initialize arrays
    player.afterimages = [];
}

// Update method to call in main player update
function updateNewMechanics(player, levelLength) {
    player.checkWallCollision(levelLength);
    if (!player.ground) player.wallSlide();
    player.resetWallJumps();

    player.updateInstantTransmissionCooldown();
    player.updateAfterimages();
    player.updateComboFinisherSystem();
    player.checkRageMode();
    player.updateParrySystem();
}

// Export for use
if (typeof module !== 'undefined') {
    module.exports = {
        WallJumpMixin,
        InstantTransmissionMixin,
        ComboFinisherMixin,
        RageModeMixin,
        ParryMixin,
        applyNewMechanicsToPlayer,
        updateNewMechanics
    };
}
