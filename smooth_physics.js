// ============================================================================
// SMOOTH PHYSICS SYSTEM - Industry Best Practices for Platformer Feel
// ============================================================================

const SmoothPhysics = {
    // ==================== CORE PHYSICS CONSTANTS ====================

    // Gravity & Falling
    GRAVITY_UP: 0.38,           // Gravity while rising (lighter for floaty jumps)
    GRAVITY_DOWN: 0.58,         // Gravity while falling (heavier for snappy landings)
    GRAVITY_FASTFALL: 0.85,     // Gravity when holding down
    MAX_FALL_SPEED: 14,         // Terminal velocity
    MAX_FASTFALL_SPEED: 20,     // Fast fall terminal velocity

    // Jumping
    JUMP_FORCE: -13.5,          // Initial jump velocity
    JUMP_CUT_MULTIPLIER: 0.4,   // Velocity multiplier when releasing jump early
    DOUBLE_JUMP_FORCE: -12,     // Slightly weaker double jump
    WALL_JUMP_FORCE_X: 9,       // Horizontal wall jump force
    WALL_JUMP_FORCE_Y: -12.5,   // Vertical wall jump force

    // Coyote Time & Jump Buffering (frames)
    COYOTE_TIME: 8,             // Frames to still jump after leaving ground
    JUMP_BUFFER: 10,            // Frames to queue jump before landing

    // Horizontal Movement
    GROUND_ACCEL: 0.85,         // Ground acceleration
    GROUND_DECEL: 0.78,         // Ground friction/deceleration
    AIR_ACCEL: 0.55,            // Air acceleration (less control)
    AIR_DECEL: 0.92,            // Air friction (more floaty)
    TURN_BOOST: 1.3,            // Acceleration multiplier when turning around

    // Speed Limits
    MAX_GROUND_SPEED: 5.5,      // Base max ground speed
    MAX_AIR_SPEED: 6.0,         // Max air speed (slightly higher)

    // Wall Mechanics
    WALL_SLIDE_SPEED: 2.5,      // Max wall slide speed
    WALL_SLIDE_ACCEL: 0.15,     // How fast you accelerate down wall
    WALL_STICK_TIME: 6,         // Frames stuck to wall after input away
    WALL_JUMP_LOCKOUT: 12,      // Frames before air control after wall jump

    // Dash
    DASH_SPEED: 18,             // Dash velocity
    DASH_DURATION: 8,           // Dash length in frames
    DASH_END_SPEED: 6,          // Speed retained after dash ends
    DASH_GRAVITY_MULT: 0.1,     // Reduced gravity during dash

    // Landing
    LANDING_RECOVERY: 3,        // Frames of landing lag
    HARD_LANDING_THRESHOLD: 12, // Fall speed that triggers hard landing
    HARD_LANDING_RECOVERY: 6,   // Frames of hard landing lag
    LANDING_SQUASH: 0.7,        // Visual squash on landing (scale Y)
    LANDING_STRETCH: 1.2,       // Visual stretch X on landing

    // Smoothing
    INPUT_SMOOTHING: 0.15,      // Input interpolation factor
    CAMERA_SMOOTHING: 0.08,     // Camera follow smoothing
    VISUAL_SMOOTHING: 0.2,      // Visual position smoothing
};

// ============================================================================
// PHYSICS STATE MANAGER
// ============================================================================

class PhysicsState {
    constructor() {
        this.reset();
    }

    reset() {
        // Coyote time & buffering
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
        this.wasGrounded = false;

        // Variable jump
        this.jumpHeld = false;
        this.jumpReleased = false;
        this.hasReleasedJump = true;

        // Wall state
        this.wallStickTimer = 0;
        this.wallJumpLockout = 0;
        this.lastWallSide = 0; // -1 left, 1 right, 0 none

        // Dash state
        this.dashTimer = 0;
        this.dashDirection = { x: 0, y: 0 };
        this.canDash = true;

        // Landing
        this.landingRecovery = 0;
        this.preLandingSpeed = 0;

        // Visual
        this.visualScaleX = 1;
        this.visualScaleY = 1;
        this.visualOffsetY = 0;

        // Velocity smoothing
        this.targetVX = 0;
        this.targetVY = 0;

        // Input buffering
        this.inputBuffer = {
            left: 0,
            right: 0,
            jump: 0,
            dash: 0
        };
    }
}

// ============================================================================
// SMOOTH PHYSICS MIXIN - Apply to Player
// ============================================================================

const SmoothPhysicsMixin = {
    // Initialize physics state
    initSmoothPhysics() {
        this.physics = new PhysicsState();
        this.smoothVX = 0;
        this.smoothVY = 0;
    },

    // Main physics update - call this instead of regular movement
    updateSmoothPhysics(levelData, inputState) {
        const P = SmoothPhysics;
        const ph = this.physics;

        // Update timers
        this.updatePhysicsTimers();

        // Handle landing recovery
        if (ph.landingRecovery > 0) {
            ph.landingRecovery--;
            // Reduced movement during landing
            this.vx *= 0.8;
        }

        // Store pre-update state
        const wasGrounded = this.ground;
        ph.preLandingSpeed = this.vy;

        // ==================== HORIZONTAL MOVEMENT ====================
        this.updateHorizontalMovement(inputState, levelData);

        // ==================== VERTICAL MOVEMENT / GRAVITY ====================
        this.updateVerticalMovement(inputState);

        // ==================== JUMPING ====================
        this.updateJumping(inputState);

        // ==================== WALL MECHANICS ====================
        this.updateWallMechanics(inputState, levelData);

        // ==================== DASHING ====================
        this.updateDashing(inputState);

        // ==================== APPLY MOVEMENT ====================
        this.applyMovement(levelData);

        // ==================== GROUND/PLATFORM CHECK ====================
        this.checkGroundCollision(levelData);

        // ==================== LANDING EFFECTS ====================
        if (this.ground && !wasGrounded) {
            this.handleLanding();
        }

        // ==================== VISUAL SMOOTHING ====================
        this.updateVisualEffects();

        // Update grounded state for coyote time
        ph.wasGrounded = this.ground;
    },

    updatePhysicsTimers() {
        const ph = this.physics;

        // Coyote time
        if (this.ground) {
            ph.coyoteTimer = SmoothPhysics.COYOTE_TIME;
        } else if (ph.coyoteTimer > 0) {
            ph.coyoteTimer--;
        }

        // Jump buffer
        if (ph.jumpBufferTimer > 0) {
            ph.jumpBufferTimer--;
        }

        // Wall stick
        if (ph.wallStickTimer > 0) {
            ph.wallStickTimer--;
        }

        // Wall jump lockout
        if (ph.wallJumpLockout > 0) {
            ph.wallJumpLockout--;
        }

        // Dash timer
        if (ph.dashTimer > 0) {
            ph.dashTimer--;
        }

        // Input buffers decay
        for (let key in ph.inputBuffer) {
            if (ph.inputBuffer[key] > 0) ph.inputBuffer[key]--;
        }
    },

    updateHorizontalMovement(inputState, levelData) {
        const P = SmoothPhysics;
        const ph = this.physics;

        // Skip during dash
        if (ph.dashTimer > 0) return;

        // Skip during wall jump lockout (partial control)
        let controlMult = 1;
        if (ph.wallJumpLockout > 0) {
            controlMult = 0.3;
        }

        // Get input direction
        let inputX = 0;
        if (inputState.left) inputX -= 1;
        if (inputState.right) inputX += 1;

        // Update facing direction
        if (inputX !== 0 && !this.charging) {
            this.right = inputX > 0;
        }

        // Calculate target speed
        let maxSpeed = P.MAX_GROUND_SPEED * (this.ssj ? 1.4 : 1) * (this.speedBoost > 0 ? 1.5 : 1);
        if (this.charging) maxSpeed *= 0.25;
        if (this.hurtTime > 0) maxSpeed *= 0.15;

        const targetSpeed = inputX * maxSpeed * controlMult;
        ph.targetVX = targetSpeed;

        // Choose acceleration based on state
        let accel, decel;
        if (this.ground) {
            accel = P.GROUND_ACCEL;
            decel = P.GROUND_DECEL;
        } else {
            accel = P.AIR_ACCEL;
            decel = P.AIR_DECEL;
        }

        // Turn boost - accelerate faster when changing direction
        if (inputX !== 0 && Math.sign(inputX) !== Math.sign(this.vx) && Math.abs(this.vx) > 0.5) {
            accel *= P.TURN_BOOST;
        }

        // Apply acceleration/deceleration
        if (inputX !== 0) {
            // Accelerating
            if (Math.abs(this.vx) < Math.abs(targetSpeed)) {
                this.vx = this.approach(this.vx, targetSpeed, accel);
            } else {
                // At or over max speed, apply slight decel
                this.vx = this.approach(this.vx, targetSpeed, accel * 0.5);
            }
        } else {
            // Decelerating (no input)
            this.vx *= decel;
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
        }
    },

    updateVerticalMovement(inputState) {
        const P = SmoothPhysics;
        const ph = this.physics;

        // Skip during dash
        if (ph.dashTimer > 0) {
            this.vy += P.GRAVITY_UP * P.DASH_GRAVITY_MULT;
            return;
        }

        if (!this.ground) {
            // Variable gravity based on state
            let gravity;

            if (this.vy < 0) {
                // Rising - lighter gravity
                gravity = P.GRAVITY_UP;

                // Jump cut - if released jump early, fall faster
                if (ph.jumpReleased && !ph.hasReleasedJump) {
                    this.vy *= P.JUMP_CUT_MULTIPLIER;
                    ph.hasReleasedJump = true;
                }
            } else {
                // Falling
                if (inputState.down) {
                    // Fast fall
                    gravity = P.GRAVITY_FASTFALL;
                } else {
                    gravity = P.GRAVITY_DOWN;
                }
            }

            this.vy += gravity;

            // Terminal velocity
            const maxFall = inputState.down ? P.MAX_FASTFALL_SPEED : P.MAX_FALL_SPEED;
            if (this.vy > maxFall) {
                this.vy = maxFall;
            }
        }
    },

    updateJumping(inputState) {
        const P = SmoothPhysics;
        const ph = this.physics;

        // Track jump button state for variable height
        if (inputState.jumpPressed) {
            ph.jumpHeld = true;
            ph.jumpReleased = false;
            ph.jumpBufferTimer = P.JUMP_BUFFER;
        }
        if (inputState.jumpReleased) {
            ph.jumpHeld = false;
            ph.jumpReleased = true;
        }

        // Check if we can jump
        const canCoyoteJump = ph.coyoteTimer > 0;
        const canDoubleJump = this.jumps < this.maxJumps && !this.ground;
        const hasBufferedJump = ph.jumpBufferTimer > 0;

        // Perform jump
        if ((inputState.jumpPressed || hasBufferedJump) && !this.charging) {
            if (canCoyoteJump && this.jumps === 0) {
                // Ground/coyote jump
                this.performJump(P.JUMP_FORCE);
                ph.coyoteTimer = 0;
                ph.jumpBufferTimer = 0;
                this.jumps = 1;
            } else if (canDoubleJump && inputState.jumpPressed) {
                // Double jump
                this.performJump(P.DOUBLE_JUMP_FORCE);
                this.jumps++;

                // Visual effect for double jump
                ph.visualScaleY = 1.15;
                ph.visualScaleX = 0.85;
            }
        }
    },

    performJump(force) {
        this.vy = force;
        this.ground = false;
        this.physics.hasReleasedJump = false;
        this.physics.jumpReleased = false;

        // Jump squash/stretch
        this.physics.visualScaleY = 1.2;
        this.physics.visualScaleX = 0.8;

        // Create dust effect
        if (typeof createCombatEffect === 'function') {
            createCombatEffect('dustCloud', this.x + this.w / 2, this.y + this.h, { direction: this.right ? 1 : -1 });
        }
    },

    updateWallMechanics(inputState, levelData) {
        const P = SmoothPhysics;
        const ph = this.physics;

        if (this.ground) {
            ph.lastWallSide = 0;
            return;
        }

        // Check wall collision
        const touchingLeft = this.x <= 0;
        const touchingRight = this.x + this.w >= levelData.length;
        const touchingWall = touchingLeft || touchingRight;

        if (touchingWall && this.vy > 0) {
            // Wall slide
            const wallSide = touchingLeft ? -1 : 1;
            ph.lastWallSide = wallSide;

            // Check if pushing into wall
            const pushingIntoWall = (touchingLeft && inputState.left) || (touchingRight && inputState.right);

            if (pushingIntoWall) {
                // Wall slide - gradual slowdown
                this.vy = this.approach(this.vy, P.WALL_SLIDE_SPEED, P.WALL_SLIDE_ACCEL);
                this.pose = 'wallSlide';
                ph.wallStickTimer = P.WALL_STICK_TIME;

                // Reset jump for wall jump
                this.jumps = 1; // Allow one more jump (wall jump)
            }

            // Wall jump
            if (inputState.jumpPressed && ph.wallStickTimer > 0) {
                // Jump away from wall
                this.vy = P.WALL_JUMP_FORCE_Y;
                this.vx = P.WALL_JUMP_FORCE_X * -wallSide;
                this.right = wallSide < 0;
                this.jumps = 2; // Used wall jump
                ph.wallJumpLockout = P.WALL_JUMP_LOCKOUT;
                ph.wallStickTimer = 0;
                ph.hasReleasedJump = false;

                // Visual
                ph.visualScaleY = 1.1;
                ph.visualScaleX = 0.9;

                if (typeof sfx !== 'undefined') sfx.play('wallJump');
            }
        } else if (!touchingWall) {
            ph.lastWallSide = 0;
        }
    },

    updateDashing(inputState) {
        const P = SmoothPhysics;
        const ph = this.physics;

        // Currently dashing
        if (ph.dashTimer > 0) {
            this.vx = ph.dashDirection.x * P.DASH_SPEED;
            this.vy = ph.dashDirection.y * P.DASH_SPEED * 0.5;

            // Dash ending
            if (ph.dashTimer === 1) {
                // Retain some momentum
                this.vx = ph.dashDirection.x * P.DASH_END_SPEED;
                this.vy = Math.max(0, this.vy * 0.5);
            }
            return;
        }

        // Start dash
        if (inputState.dashPressed && this.dashCD <= 0 && ph.canDash) {
            // Determine dash direction
            let dashX = this.right ? 1 : -1;
            let dashY = 0;

            if (inputState.up) dashY = -1;
            if (inputState.down) dashY = 1;
            if (inputState.left) dashX = -1;
            if (inputState.right) dashX = 1;

            // Normalize diagonal dash
            if (dashX !== 0 && dashY !== 0) {
                const mag = Math.sqrt(dashX * dashX + dashY * dashY);
                dashX /= mag;
                dashY /= mag;
            }

            ph.dashDirection = { x: dashX, y: dashY };
            ph.dashTimer = P.DASH_DURATION;
            this.dashCD = 25;
            this.invincible = P.DASH_DURATION;

            if (!this.ground) {
                ph.canDash = false; // Only one air dash
            }

            // Visual stretch in dash direction
            ph.visualScaleX = 1.3;
            ph.visualScaleY = 0.7;

            if (typeof sfx !== 'undefined') sfx.play('dash');
        }

        // Reset air dash on ground
        if (this.ground) {
            ph.canDash = true;
        }
    },

    applyMovement(levelData) {
        // Smooth velocity application
        this.smoothVX = this.lerp(this.smoothVX, this.vx, 0.4);
        this.smoothVY = this.lerp(this.smoothVY, this.vy, 0.6);

        // Apply position
        this.x += this.smoothVX;
        this.y += this.smoothVY;

        // Bounds
        this.x = Math.max(0, Math.min(levelData.length - this.w, this.x));
    },

    checkGroundCollision(levelData) {
        const P = SmoothPhysics;

        // Ground check
        this.ground = false;

        if (this.y + this.h >= GROUND) {
            this.y = GROUND - this.h;
            this.ground = true;
        }

        // Platform check
        if (this.vy >= 0) {
            for (const p of levelData.platforms) {
                if (this.x + this.w > p.x && this.x < p.x + p.w) {
                    if (this.y + this.h >= p.y && this.y + this.h <= p.y + 20 + this.vy) {
                        this.y = p.y - this.h;
                        this.ground = true;
                        break;
                    }
                }
            }
        }

        // Reset on ground
        if (this.ground) {
            this.vy = 0;
            this.jumps = 0;
            this.physics.canDash = true;
            this.airDashed = false;
        }
    },

    handleLanding() {
        const P = SmoothPhysics;
        const ph = this.physics;

        // Determine landing intensity
        const landingSpeed = Math.abs(ph.preLandingSpeed);

        if (landingSpeed > P.HARD_LANDING_THRESHOLD) {
            // Hard landing
            ph.landingRecovery = P.HARD_LANDING_RECOVERY;
            ph.visualScaleY = P.LANDING_SQUASH * 0.9;
            ph.visualScaleX = P.LANDING_STRETCH * 1.1;

            // Screen shake for very hard landings
            if (landingSpeed > P.HARD_LANDING_THRESHOLD * 1.5) {
                if (typeof screenShake !== 'undefined') screenShake(3, 5);
            }

            // Dust effect
            if (typeof createCombatEffect === 'function') {
                createCombatEffect('groundCrack', this.x + this.w / 2, this.y + this.h);
            }
        } else {
            // Soft landing
            ph.landingRecovery = P.LANDING_RECOVERY;
            ph.visualScaleY = P.LANDING_SQUASH;
            ph.visualScaleX = P.LANDING_STRETCH;
        }

        // Check for buffered jump
        if (ph.jumpBufferTimer > 0) {
            this.performJump(P.JUMP_FORCE);
            ph.jumpBufferTimer = 0;
        }
    },

    updateVisualEffects() {
        const ph = this.physics;

        // Smooth visual scale back to normal
        ph.visualScaleX = this.lerp(ph.visualScaleX, 1, 0.2);
        ph.visualScaleY = this.lerp(ph.visualScaleY, 1, 0.2);

        // Running bob
        if (this.ground && Math.abs(this.vx) > 1) {
            ph.visualOffsetY = Math.sin(this.frame * 0.4) * 2;
        } else {
            ph.visualOffsetY = this.lerp(ph.visualOffsetY, 0, 0.3);
        }
    },

    // Utility functions
    approach(current, target, amount) {
        if (current < target) {
            return Math.min(current + amount, target);
        } else {
            return Math.max(current - amount, target);
        }
    },

    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    // Get visual transform for drawing
    getVisualTransform() {
        const ph = this.physics;
        return {
            scaleX: ph.visualScaleX,
            scaleY: ph.visualScaleY,
            offsetY: ph.visualOffsetY
        };
    }
};

// ============================================================================
// INPUT HELPER - Converts raw key state to physics-friendly format
// ============================================================================

class SmoothInputHandler {
    constructor() {
        this.current = {
            left: false,
            right: false,
            up: false,
            down: false,
            jump: false,
            dash: false,
            attack: false,
            special: false
        };

        this.previous = { ...this.current };

        this.state = {
            left: false,
            right: false,
            up: false,
            down: false,
            jumpPressed: false,
            jumpReleased: false,
            jumpHeld: false,
            dashPressed: false
        };
    }

    update(keys, pressed, released) {
        // Store previous
        this.previous = { ...this.current };

        // Update current
        this.current.left = keys['ArrowLeft'] || false;
        this.current.right = keys['ArrowRight'] || false;
        this.current.up = keys['ArrowUp'] || false;
        this.current.down = keys['ArrowDown'] || false;
        this.current.jump = keys['ArrowUp'] || false;
        this.current.dash = keys['Space'] || false;

        // Generate state
        this.state.left = this.current.left;
        this.state.right = this.current.right;
        this.state.up = this.current.up;
        this.state.down = this.current.down;

        this.state.jumpPressed = this.current.jump && !this.previous.jump;
        this.state.jumpReleased = !this.current.jump && this.previous.jump;
        this.state.jumpHeld = this.current.jump;

        this.state.dashPressed = this.current.dash && !this.previous.dash;

        return this.state;
    }
}

// ============================================================================
// CAMERA SMOOTHING
// ============================================================================

class SmoothCamera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.width = width;
        this.height = height;

        // Camera settings
        this.leadAmount = 100;     // How far ahead to look
        this.smoothing = 0.08;     // Base smoothing
        this.fastSmoothing = 0.15; // Smoothing when far from target
        this.deadzone = 50;        // Don't move camera in deadzone

        // Shake
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
    }

    update(targetX, targetY, targetVX, levelLength) {
        // Add look-ahead based on velocity
        const lookAhead = targetVX * this.leadAmount * 0.1;

        // Calculate ideal camera position
        this.targetX = targetX - this.width / 3 + lookAhead;

        // Clamp to level bounds
        this.targetX = Math.max(0, Math.min(levelLength - this.width, this.targetX));

        // Calculate distance to target
        const dist = Math.abs(this.targetX - this.x);

        // Use faster smoothing when far from target
        const smoothing = dist > 100 ? this.fastSmoothing : this.smoothing;

        // Apply deadzone
        if (dist > this.deadzone) {
            this.x += (this.targetX - this.x) * smoothing;
        }

        // Update shake
        if (this.shakeDuration > 0) {
            this.shakeDuration--;
            this.shakeOffsetX = (Math.random() - 0.5) * this.shakeIntensity * 2;
            this.shakeOffsetY = (Math.random() - 0.5) * this.shakeIntensity * 2;
            this.shakeIntensity *= 0.9;
        } else {
            this.shakeOffsetX = 0;
            this.shakeOffsetY = 0;
        }
    }

    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
    }

    getX() {
        return this.x + this.shakeOffsetX;
    }

    getY() {
        return this.y + this.shakeOffsetY;
    }
}

// ============================================================================
// APPLY SMOOTH PHYSICS TO PLAYER
// ============================================================================

function applySmoothPhysicsToPlayer(player) {
    // Apply mixin
    Object.assign(player, SmoothPhysicsMixin);

    // Initialize
    player.initSmoothPhysics();

    console.log('Smooth physics applied to player');
}

// ============================================================================
// SCREEN SHAKE HELPER
// ============================================================================

let gameCamera = null;

function screenShake(intensity, duration) {
    if (gameCamera) {
        gameCamera.shake(intensity, duration);
    }
}

// ============================================================================
// EXPORT
// ============================================================================

if (typeof module !== 'undefined') {
    module.exports = {
        SmoothPhysics,
        PhysicsState,
        SmoothPhysicsMixin,
        SmoothInputHandler,
        SmoothCamera,
        applySmoothPhysicsToPlayer,
        screenShake
    };
}

console.log('Smooth Physics System loaded!');
