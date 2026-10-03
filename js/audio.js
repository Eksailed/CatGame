// Sound Effects and Music Synthesizer via Web Audio API
class SoundManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.musicPlaying = false;
        this.musicTimer = null;
        this.currentTrackStep = 0;
        this.initOnFirstClick();
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initOnFirstClick() {
        const unlock = () => {
            this.init();
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
        };
        window.addEventListener('pointerdown', unlock);
        window.addEventListener('keydown', unlock);
    }

    setMuted(muted) {
        this.muted = muted;
        if (this.ctx) {
            if (muted && this.ctx.state === 'running') {
                this.ctx.suspend();
            } else if (!muted && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }
    }

    toggleMute() {
        this.setMuted(!this.muted);
        return this.muted;
    }

    // Play tone with envelope
    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.2, pitchBend = 0) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            if (pitchBend !== 0) {
                osc.frequency.exponentialRampToValueAtTime(Math.max(10, freq + pitchBend), now + duration);
            }

            gain.gain.setValueAtTime(gainVal, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {
            console.warn(e);
        }
    }

    // Noise generator for hits/explosions
    playNoise(duration = 0.2, gainVal = 0.25, isLow = false) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const bufferSize = this.ctx.sampleRate * duration;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = isLow ? 'lowpass' : 'bandpass';
            filter.frequency.setValueAtTime(isLow ? 250 : 1200, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(gainVal, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
        } catch (e) {
            console.warn(e);
        }
    }

    // --- GAME SFX ---

    // Cat Meow (cute pitch glide)
    playMeow() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.12);
            osc.frequency.exponentialRampToValueAtTime(500, now + 0.35);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) {}
    }

    // Purr wave sound
    playPurr() {
        this.playTone(180, 'sine', 0.25, 0.15, -40);
    }

    // Fish boomerang throw
    playFishThrow() {
        this.playTone(600, 'triangle', 0.12, 0.15, 300);
    }

    // Yarn ball bounce
    playYarnBounce() {
        this.playTone(320, 'sine', 0.1, 0.18, 120);
    }

    // Laser shoot
    playLaser() {
        this.playTone(1200, 'sawtooth', 0.09, 0.12, -900);
    }

    // Slipper throw
    playSlipper() {
        this.playTone(280, 'square', 0.08, 0.1, 80);
    }

    // Enemy hit / damage
    playEnemyHit() {
        this.playNoise(0.08, 0.15, true);
    }

    // Player hit / ouch (heavy bass impact + cat hurt yowl)
    playPlayerHurt(isAcid = false, isBoss = false) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;

            // 1. Heavy physical punch impact thud
            const punchOsc = this.ctx.createOscillator();
            const punchGain = this.ctx.createGain();
            punchOsc.type = 'triangle';
            punchOsc.frequency.setValueAtTime(isBoss ? 160 : 130, now);
            punchOsc.frequency.exponentialRampToValueAtTime(30, now + 0.16);

            punchGain.gain.setValueAtTime(isBoss ? 0.45 : 0.35, now);
            punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            punchOsc.connect(punchGain);
            punchGain.connect(this.ctx.destination);
            punchOsc.start(now);
            punchOsc.stop(now + 0.2);

            // 2. Cat hurt screech / hiss
            const screechOsc = this.ctx.createOscillator();
            const screechGain = this.ctx.createGain();
            screechOsc.type = 'sawtooth';
            screechOsc.frequency.setValueAtTime(750, now + 0.02);
            screechOsc.frequency.exponentialRampToValueAtTime(220, now + 0.22);

            screechGain.gain.setValueAtTime(0.001, now);
            screechGain.gain.setValueAtTime(0.25, now + 0.02);
            screechGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

            screechOsc.connect(screechGain);
            screechGain.connect(this.ctx.destination);
            screechOsc.start(now);
            screechOsc.stop(now + 0.25);

            // 3. Noise crunch
            this.playNoise(0.14, isBoss ? 0.35 : 0.25, true);

            // 4. Acid sizzle if acid
            if (isAcid) {
                setTimeout(() => {
                    this.playNoise(0.22, 0.28, false);
                }, 40);
            }
        } catch (e) {}
    }

    // XP Collect chime
    playXpPickup() {
        const notes = [587.33, 659.25, 783.99, 880];
        const note = notes[Math.floor(Math.random() * notes.length)];
        this.playTone(note, 'sine', 0.1, 0.12, 50);
    }

    // Coin Pickup chime
    playCoinPickup() {
        this.playTone(987.77, 'sine', 0.08, 0.15, 0);
        setTimeout(() => {
            this.playTone(1318.51, 'sine', 0.15, 0.18, 0);
        }, 50);
    }

    // Level up fanfare
    playLevelUp() {
        const fanfare = [
            { f: 523.25, d: 0.1, delay: 0 },
            { f: 659.25, d: 0.1, delay: 100 },
            { f: 783.99, d: 0.12, delay: 200 },
            { f: 1046.50, d: 0.35, delay: 320 }
        ];
        fanfare.forEach(item => {
            setTimeout(() => {
                this.playTone(item.f, 'triangle', item.d, 0.25, 0);
            }, item.delay);
        });
    }

    // Bomb explosion
    playExplosion() {
        this.playNoise(0.5, 0.35, true);
        this.playTone(120, 'sine', 0.4, 0.3, -80);
    }

    // Freeze sound
    playFreeze() {
        this.playTone(1600, 'sine', 0.3, 0.2, -600);
        setTimeout(() => this.playTone(1200, 'sine', 0.3, 0.15, -400), 100);
    }

    // Button click
    playClick() {
        this.playTone(600, 'sine', 0.05, 0.1, -150);
    }

    // Game over sound
    playGameOver() {
        this.playTone(400, 'sawtooth', 0.25, 0.2, -100);
        setTimeout(() => this.playTone(300, 'sawtooth', 0.25, 0.2, -80), 200);
        setTimeout(() => this.playTone(200, 'sawtooth', 0.5, 0.25, -60), 400);
    }

    // Cat Dash / Dodge swoosh
    playDash() {
        this.playNoise(0.14, 0.25, false);
        this.playTone(400, 'triangle', 0.12, 0.15, -200);
    }

    // Boss Warning Siren
    playBossWarning() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.playTone(220, 'sawtooth', 0.18, 0.3, 100);
            }, i * 220);
        }
    }

    // Lucky Mystery Chest Opening Fanfare
    playChestOpen() {
        const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        arpeggio.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.12, 0.2, 20);
            }, idx * 60);
        });
    }

    // Super Weapon Evolution Fanfare
    playEvolution() {
        const notes = [
            { f: 440, d: 0.12, delay: 0 },
            { f: 554.37, d: 0.12, delay: 120 },
            { f: 659.25, d: 0.15, delay: 240 },
            { f: 880, d: 0.2, delay: 380 },
            { f: 1108.73, d: 0.45, delay: 520 }
        ];
        notes.forEach(n => {
            setTimeout(() => {
                this.playTone(n.f, 'triangle', n.d, 0.3, 0);
            }, n.delay);
        });
    }

    // Enemy Acid Spit
    playSpit() {
        this.playTone(700, 'sawtooth', 0.12, 0.14, -450);
    }

    // Wood Crate Break
    playWoodBreak() {
        this.playNoise(0.18, 0.3, true);
        this.playTone(150, 'square', 0.08, 0.2, -60);
    }

    // Enemies Enraged Hiss
    playEnrage() {
        this.playNoise(0.35, 0.3, false);
        this.playTone(320, 'sawtooth', 0.25, 0.25, 120);
    }

    // Whirlwind Claw Slash
    playClawSlash() {
        this.playTone(850, 'sawtooth', 0.1, 0.2, -600);
        this.playNoise(0.08, 0.22, true);
    }

    // Valerian Flask Shatter
    playFlaskBreak() {
        this.playNoise(0.12, 0.28, true);
        this.playTone(480, 'sine', 0.15, 0.15, -200);
    }

    // Static Fur Lightning Zap
    playStaticZap() {
        this.playTone(1100, 'square', 0.08, 0.2, -700);
        this.playNoise(0.1, 0.25, true);
    }

    // Meow Mine Explosion
    playMineExplosion() {
        this.playNoise(0.3, 0.4, true);
        this.playTone(120, 'triangle', 0.25, 0.35, -80);
    }

    // Upbeat looping 8-bit background music
    startMusic() {
        if (this.musicPlaying) return;
        this.musicPlaying = true;
        this.init();

        const bassNotes = [130.81, 130.81, 164.81, 146.83, 130.81, 174.61, 164.81, 146.83];
        const leadNotes = [
            523.25, 0, 659.25, 523.25, 783.99, 0, 659.25, 0,
            880.00, 783.99, 659.25, 0, 587.33, 659.25, 523.25, 0
        ];

        let beat = 0;
        const tempoMs = 180;

        this.musicTimer = setInterval(() => {
            if (this.muted || !this.ctx || this.ctx.state !== 'running') return;

            // Bass note
            const bFreq = bassNotes[Math.floor((beat % 16) / 2)];
            if (beat % 2 === 0) {
                this.playTone(bFreq, 'triangle', 0.15, 0.08, 0);
            }

            // Lead note
            const lFreq = leadNotes[beat % leadNotes.length];
            if (lFreq > 0) {
                this.playTone(lFreq, 'sine', 0.12, 0.05, 0);
            }

            beat = (beat + 1) % 64;
        }, tempoMs);
    }

    stopMusic() {
        this.musicPlaying = false;
        if (this.musicTimer) {
            clearInterval(this.musicTimer);
            this.musicTimer = null;
        }
    }
}

window.soundManager = new SoundManager();
