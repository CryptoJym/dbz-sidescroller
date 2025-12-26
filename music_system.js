// ============================================================================
// ENHANCED MUSIC SYSTEM - Supports Suno-generated audio files
// ============================================================================

class EnhancedMusicSystem {
    constructor() {
        this.ctx = null;
        this.playing = false;
        this.enabled = true;
        this.currentTrack = null;
        this.volume = 0.5;

        // Track sources (can be URLs or base64)
        this.tracks = {
            title: null,
            battle: null,
            boss: null,
            victory: null,
            gameover: null,
            namek: null,
            cellgames: null,
            tournament: null,
            transformation: null,
            select: null
        };

        // Loaded audio buffers
        this.buffers = {};
        this.sources = {};

        // Fallback to procedural music if no files loaded
        this.useProcedural = true;
        this.proceduralMusic = null;

        // Crossfade settings
        this.fadeTime = 1.0; // seconds
    }

    async init() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.ctx.destination);

            // Initialize procedural fallback
            this.proceduralMusic = new ProceduralMusicGenerator(this.ctx, this.masterGain);

            console.log('Enhanced Music System initialized');
        } catch(e) {
            console.error('Failed to initialize audio:', e);
        }
    }

    // Load a track from URL or base64
    async loadTrack(trackName, source) {
        if (!this.ctx) await this.init();

        try {
            let arrayBuffer;

            if (source.startsWith('data:')) {
                // Base64 encoded audio
                const base64 = source.split(',')[1];
                const binary = atob(base64);
                arrayBuffer = new ArrayBuffer(binary.length);
                const view = new Uint8Array(arrayBuffer);
                for (let i = 0; i < binary.length; i++) {
                    view[i] = binary.charCodeAt(i);
                }
            } else {
                // URL
                const response = await fetch(source);
                arrayBuffer = await response.arrayBuffer();
            }

            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            this.buffers[trackName] = audioBuffer;
            this.tracks[trackName] = source;
            this.useProcedural = false;

            console.log(`Loaded track: ${trackName}`);
            return true;
        } catch(e) {
            console.error(`Failed to load track ${trackName}:`, e);
            return false;
        }
    }

    // Load multiple tracks at once
    async loadTracks(trackMap) {
        const promises = Object.entries(trackMap).map(([name, source]) =>
            this.loadTrack(name, source)
        );
        return Promise.all(promises);
    }

    // Play a track with optional crossfade
    play(trackName, loop = true, crossfade = true) {
        if (!this.ctx || !this.enabled) return;

        // If we have a loaded buffer for this track, use it
        if (this.buffers[trackName]) {
            this.playBuffer(trackName, loop, crossfade);
        } else if (this.useProcedural && this.proceduralMusic) {
            // Fall back to procedural music
            this.proceduralMusic.play(trackName);
        }

        this.currentTrack = trackName;
        this.playing = true;
    }

    playBuffer(trackName, loop, crossfade) {
        const buffer = this.buffers[trackName];
        if (!buffer) return;

        // Fade out current track if crossfading
        if (crossfade && this.sources[this.currentTrack]) {
            this.fadeOut(this.currentTrack);
        } else {
            this.stopCurrent();
        }

        // Create new source
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = loop;

        // Create gain for this source (for fading)
        const gainNode = this.ctx.createGain();
        gainNode.gain.value = crossfade ? 0 : 1;

        source.connect(gainNode);
        gainNode.connect(this.masterGain);

        source.start(0);
        this.sources[trackName] = { source, gain: gainNode };

        // Fade in if crossfading
        if (crossfade) {
            gainNode.gain.linearRampToValueAtTime(1, this.ctx.currentTime + this.fadeTime);
        }
    }

    fadeOut(trackName) {
        const track = this.sources[trackName];
        if (!track) return;

        track.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + this.fadeTime);
        setTimeout(() => {
            try {
                track.source.stop();
            } catch(e) {}
            delete this.sources[trackName];
        }, this.fadeTime * 1000);
    }

    stopCurrent() {
        if (this.currentTrack && this.sources[this.currentTrack]) {
            try {
                this.sources[this.currentTrack].source.stop();
            } catch(e) {}
            delete this.sources[this.currentTrack];
        }

        if (this.proceduralMusic) {
            this.proceduralMusic.stop();
        }
    }

    stop() {
        this.stopCurrent();
        this.playing = false;
        this.currentTrack = null;
    }

    pause() {
        if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend();
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stop();
        }
        return this.enabled;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }

    // Play appropriate music for game state
    playForState(gameState, levelIndex = 0) {
        const levelTracks = ['namek', 'cellgames', 'tournament'];

        switch(gameState) {
            case 'title':
                this.play('title');
                break;
            case 'select':
                this.play('select');
                break;
            case 'playing':
                this.play(levelTracks[levelIndex] || 'battle');
                break;
            case 'boss':
                this.play('boss');
                break;
            case 'victory':
                this.play('victory', false);
                break;
            case 'gameover':
                this.play('gameover', false);
                break;
            case 'transformation':
                // Play transformation jingle then return to previous
                this.playOneShot('transformation');
                break;
        }
    }

    // Play a one-shot sound that doesn't interrupt current music
    async playOneShot(trackName) {
        if (!this.ctx || !this.buffers[trackName]) return;

        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers[trackName];
        source.connect(this.masterGain);
        source.start(0);
    }
}

// ============================================================================
// PROCEDURAL MUSIC GENERATOR (Fallback when no Suno tracks loaded)
// ============================================================================

class ProceduralMusicGenerator {
    constructor(audioCtx, destination) {
        this.ctx = audioCtx;
        this.destination = destination;
        this.playing = false;
        this.bpm = 140;
        this.beat = 0;
        this.bar = 0;
        this.nextBeat = 0;
        this.schedulerId = null;

        // Musical patterns
        this.scale = [0, 2, 4, 7, 9, 12, 14, 16]; // Minor pentatonic
        this.currentPattern = 'battle';

        this.patterns = {
            title: {
                bpm: 120,
                bass: [0, 0, 7, 5, 0, 0, 4, 2],
                melody: [[12, 14, 16, 14], [12, 9, 7, 9], [7, 9, 12, 9], [4, 7, 9, 7]],
                drums: [1, 0, 2, 0, 1, 0, 2, 1]
            },
            battle: {
                bpm: 150,
                bass: [0, 7, 0, 5, 0, 7, 0, 4],
                melody: [[12, 16, 19, 16], [14, 12, 9, 12], [9, 7, 4, 7], [0, 4, 7, 4]],
                drums: [1, 2, 1, 2, 1, 2, 1, 2]
            },
            boss: {
                bpm: 130,
                bass: [0, 0, 3, 5, 7, 5, 3, 0],
                melody: [[0, 3, 7, 12], [7, 12, 15, 12], [3, 7, 10, 7], [0, 3, 7, 3]],
                drums: [1, 1, 2, 1, 1, 1, 2, 2]
            },
            victory: {
                bpm: 140,
                bass: [0, 4, 7, 4, 0, 4, 7, 12],
                melody: [[12, 14, 16, 19], [16, 14, 12, 14], [16, 19, 21, 24], [24, 21, 19, 16]],
                drums: [1, 0, 2, 0, 1, 1, 2, 2]
            }
        };
    }

    play(patternName) {
        if (this.playing) this.stop();

        this.currentPattern = patternName;
        const pattern = this.patterns[patternName] || this.patterns.battle;
        this.bpm = pattern.bpm;
        this.beat = 0;
        this.bar = 0;
        this.playing = true;
        this.nextBeat = this.ctx.currentTime;
        this.scheduleBeat();
    }

    stop() {
        this.playing = false;
        if (this.schedulerId) {
            clearTimeout(this.schedulerId);
            this.schedulerId = null;
        }
    }

    scheduleBeat() {
        if (!this.playing) return;

        const beatTime = 60 / this.bpm;
        const now = this.ctx.currentTime;
        const pattern = this.patterns[this.currentPattern] || this.patterns.battle;

        while (this.nextBeat < now + 0.1) {
            this.playBeat(this.nextBeat, pattern);
            this.beat = (this.beat + 1) % 8;
            if (this.beat === 0) this.bar = (this.bar + 1) % 8;
            this.nextBeat += beatTime / 2;
        }

        this.schedulerId = setTimeout(() => this.scheduleBeat(), 50);
    }

    playBeat(time, pattern) {
        // Bass
        if (this.beat % 2 === 0) {
            const bassNote = pattern.bass[this.beat / 2];
            this.playNote(55 * Math.pow(2, bassNote / 12), time, 0.2, 'sawtooth', 0.12);
        }

        // Drums
        const drum = pattern.drums[this.beat];
        if (drum === 1) this.playKick(time);
        else if (drum === 2) this.playSnare(time);
        if (this.beat % 2 === 0) this.playHihat(time);

        // Melody
        if (this.beat % 2 === 0) {
            const melodyBar = pattern.melody[this.bar % pattern.melody.length];
            const note = melodyBar[this.beat / 2];
            this.playNote(220 * Math.pow(2, note / 12), time, 0.15, 'square', 0.07);
        }

        // Arpeggio accent
        if (this.beat === 0 && this.bar % 2 === 0) {
            [0, 4, 7, 12].forEach((n, i) => {
                this.playNote(330 * Math.pow(2, n / 12), time + i * 0.05, 0.1, 'sine', 0.04);
            });
        }
    }

    playNote(freq, time, dur, type, vol) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(time);
        osc.stop(time + dur);
    }

    playKick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.1);
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        osc.connect(gain);
        gain.connect(this.destination);
        osc.start(time);
        osc.stop(time + 0.15);
    }

    playSnare(time) {
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.destination);
        noise.start(time);
    }

    playHihat(time) {
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 8000;
        gain.gain.setValueAtTime(0.04, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.destination);
        noise.start(time);
    }
}

// Export for use in game
if (typeof module !== 'undefined') {
    module.exports = { EnhancedMusicSystem, ProceduralMusicGenerator };
}
