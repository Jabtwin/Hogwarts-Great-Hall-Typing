/* ==========================================================================
   HOGWARTS GREAT HALL - APPLICATION ENGINE
   Floating Canvas Candles, Procedural Hedwig's Theme Celesta, and Typing Spells
   ========================================================================== */

// --- 1. HARRY POTTER WIZARDING TEXT DATABASE ---
const HARRY_POTTER_TEXTS = {
    spell: [
        "Expecto Patronum! To summon a patronus, you must concentrate with all your strength on a single, highly powerful happy memory. Draw a wide circular movement with your wand, channeling the warmth of that joy into your core. A silver wisp of light will emerge, morphing into a guardian animal to ward off Dementors. Focus and hold the memory!",
        "Wingardium Leviosa! The levitation charm requires a precise flick and swish. Point your wand directly at the target, execute a smooth circular flick of the wrist, and swish downwards. Pronounce the words clearly, elongating the 'o' sound: Win-gar-dium Le-vi-o-sa. Watch in wonder as the feather slowly rises and drifts in mid-air.",
        "Alohomora! Point your wand directly at the iron lock of the chamber door. Visualize the internal tumblers aligning, whispering the unlocking spell with calm authority. A loud metallic click will echo through the dark stone corridor, releasing the heavy ancient latch. Tread carefully, for what lies behind the door is dark and dangerous."
    ],
    map: [
        "Messrs Moony, Wormtail, Padfoot, and Prongs are proud to present the Marauder's Map. This parchment shows every detail of Hogwarts Castle, including secret passages, classrooms, and the real-time movement of every living soul. To reveal its secrets, tap it with your wand and declare: 'I solemnly swear that I am up to no good.'",
        "Mischief Managed! Once you have finished exploring the secret tunnels and corridors of Hogwarts Castle, you must wipe the parchment clean to prevent it from falling into Filch's hands. Tap your wand against the center of the parchment and whisper: 'Mischief Managed.' The ink lines will fade away, leaving blank parchment once more.",
        "I solemnly swear that I am up to no good. By declaring these words, the blank parchment awakens, casting ink spiderwebs across the page. Scribe names and moving footsteps appear in gold script, mapping out the Great Hall, the dungeons, and the high astronomy tower. A marvelous piece of magic made by four mischievous students."
    ],
    legend: [
        "Oh, you may not think I'm pretty, but don't judge on what you see. I'll eat myself if you can find a smarter hat than me. You can keep your bowlers sleek, your top hats tall and flat, for I'm the Hogwarts Sorting Hat, and I can cap them all. There's nothing hidden in your head the Sorting Hat can't see, so try me on and I will tell you where you ought to be!",
        "Welcome to the Great Hall! The enchanted ceiling above is decorated to reflect the exact state of the starry night sky outside. Floating candles hover silently in the air by the hundreds, illuminating the long wooden house tables. Here, the four houses of Hogwarts gather under the wise leadership of Headmaster Albus Dumbledore.",
        "Happiness can be found, even in the darkest of times, if one only remembers to turn on the light. These words of Albus Dumbledore echo through the Great Hall. Magic is not simply a tool of power, but a force of light, friendship, and courage that binds the hearts of wizards and witches together against the dark forces of the world."
    ],
    hallows: [
        "The Tale of the Three Brothers: Three wizards met a treacherous river. They used their magic to construct a bridge, but Death appeared, feeling cheated. Crafty Death offered each brother a gift. The first asked for an unbeatable wand, the second a stone to recall the dead, and the third a way to hide from Death himself.",
        "The Elder Wand, the Resurrection Stone, and the Cloak of Invisibility. Together, these three legendary artifacts form the Deathly Hallows. It is written that whoever unites these three magical objects shall become the true Master of Death. But beware, for two of the three brothers met a swift and tragic end due to their foolish desires.",
        "The third brother was the wisest of all. He asked for the Cloak of Invisibility to walk unseen, and Death handed him a piece of his own cloak. The brother lived a long and peaceful life, avoiding Death until he was very old. He then took off the cloak, gifted it to his son, and greeted Death as an old friend, departing this life as equals."
    ]
};

// --- 2. THE WEBAUDIO PRO-MUSIC & SOUND SYNTHESIZER ---
class HogwartsAudio {
    constructor() {
        this.ctx = null;
        this.quillVolume = 0.6;
        this.ambientVolume = 0.2;
        this.quillEnabled = true;
        this.isPlayingAmbient = false;
        
        // Procedural Ambient Nodes
        this.fireSource = null;
        this.windSource = null;
        this.ambientGainNode = null;
        
        // Hedwig's Theme Celesta Sequencer States
        this.isMelodyPlaying = false;
        this.melodyTimeoutId = null;
        this.noteIndex = 0;
        this.scheduledNotes = [];
    }

    init() {
        if (this.ctx) return;
        
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
        
        // Setup Ambient Gain Node
        this.ambientGainNode = this.ctx.createGain();
        this.ambientGainNode.gain.value = this.ambientVolume;
        this.ambientGainNode.connect(this.ctx.destination);
    }

    // A. QUILL SCRIBING SOUNDS (Synthesized)
    playQuillScratch() {
        if (!this.quillEnabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        
        // 1. Friction Noise
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noiseNode = this.ctx.createBufferSource(buffer);
        const filterNode = this.ctx.createBiquadFilter();
        filterNode.type = 'bandpass';
        filterNode.frequency.setValueAtTime(800 + Math.random() * 600, now);
        filterNode.Q.setValueAtTime(3.0, now);
        
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.01, now);
        gainNode.gain.linearRampToValueAtTime(this.quillVolume * 0.15, now + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        // 2. Click strike
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(1500, now);
        clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.01);
        
        clickGain.gain.setValueAtTime(this.quillVolume * 0.08, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
        
        noiseNode.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        
        noiseNode.start(now);
        noiseNode.stop(now + 0.09);
        clickOsc.start(now);
        clickOsc.stop(now + 0.02);
    }

    playErrorThud() {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        
        const lowpass = this.ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(250, now);
        
        gain.gain.setValueAtTime(this.quillVolume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        osc.connect(lowpass);
        lowpass.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.25);
    }

    playVictoryBell() {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        // Hogwarts victory bell chime
        const frequencies = [220.00, 261.63, 329.63, 440.00, 523.25]; 
        
        frequencies.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = (idx % 2 === 0) ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            
            const strikeDelay = idx * 0.05;
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(this.quillVolume * 0.18, now + strikeDelay + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + strikeDelay + 2.5);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now + strikeDelay);
            osc.stop(now + strikeDelay + 3.0);
        });
    }

    // B. PROCEDURAL HEDWIG'S THEME CELESTA BELL SYNTHESIZER
    // Generates crystal clean Celesta sounds with fundamental frequency and metallic ring ovetones
    synthesizeCelestaNote(freq, startTime, duration) {
        if (!this.ctx) return;

        const now = startTime;
        
        // 1. Fundamental Bell Tone (Sine Wave)
        const sineOsc = this.ctx.createOscillator();
        const sineGain = this.ctx.createGain();
        sineOsc.type = 'sine';
        sineOsc.frequency.setValueAtTime(freq, now);
        
        // Celesta Bell Envelope: Instant attack, long metallic sustain-release
        sineGain.gain.setValueAtTime(0, now);
        sineGain.gain.linearRampToValueAtTime(this.quillVolume * 0.28, now + 0.005);
        sineGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        // 2. High Metallic Overtone (Triangle Wave tuned to exact fourth harmonic)
        const ringOsc = this.ctx.createOscillator();
        const ringGain = this.ctx.createGain();
        ringOsc.type = 'triangle';
        ringOsc.frequency.setValueAtTime(freq * 4.01, now); // Slightly detuned for chorusing
        
        ringGain.gain.setValueAtTime(0, now);
        ringGain.gain.linearRampToValueAtTime(this.quillVolume * 0.08, now + 0.005);
        ringGain.gain.exponentialRampToValueAtTime(0.001, now + (duration * 0.6)); // decays faster
        
        // 3. High Pass Filter to make it sound thin and crystal clean
        const hpFilter = this.ctx.createBiquadFilter();
        hpFilter.type = 'highpass';
        hpFilter.frequency.setValueAtTime(300, now);

        // Connections
        sineOsc.connect(sineGain);
        sineGain.connect(hpFilter);
        
        ringOsc.connect(ringGain);
        ringGain.connect(hpFilter);
        
        hpFilter.connect(this.ctx.destination);
        
        // Start playback
        sineOsc.start(now);
        sineOsc.stop(now + duration + 0.1);
        
        ringOsc.start(now);
        ringOsc.stop(now + duration + 0.1);
    }

    // Hedwig's Theme Sequence timeline mapping
    startHedwigThemeLoop() {
        if (this.isMelodyPlaying) return;
        this.init();
        
        this.isMelodyPlaying = true;
        this.noteIndex = 0;
        this.scheduledNotes = [];
        
        // Notes: { freq, duration_multiplier }
        const B3 = 246.94, E4 = 329.63, G4 = 392.00, Fs4 = 369.99, B4 = 493.88, A4 = 440.00, Ds4 = 311.13, F4 = 349.23;
        
        const HEDWIG_MELODY = [
            { freq: B3, dur: 0.5 },
            { freq: E4, dur: 0.75 },
            { freq: G4, dur: 0.25 },
            { freq: Fs4, dur: 0.5 },
            { freq: E4, dur: 1.0 },
            { freq: B4, dur: 0.5 },
            { freq: A4, dur: 1.5 },
            { freq: Fs4, dur: 1.5 },
            
            { freq: E4, dur: 0.75 },
            { freq: G4, dur: 0.25 },
            { freq: Fs4, dur: 0.5 },
            { freq: Ds4, dur: 1.0 },
            { freq: F4, dur: 0.5 },
            { freq: B3, dur: 2.0 }
        ];

        const beatUnit = 0.85; // Timing rate (tempo)
        
        const playNextScheduledNote = () => {
            if (!this.isMelodyPlaying || !this.ctx) return;
            
            const now = this.ctx.currentTime;
            const note = HEDWIG_MELODY[this.noteIndex];
            
            // Synthesize the bell sound
            this.synthesizeCelestaNote(note.freq, now, note.dur * beatUnit * 2.0);
            
            // Increment note pointer
            const delay = note.dur * beatUnit * 1000;
            this.noteIndex = (this.noteIndex + 1) % HEDWIG_MELODY.length;
            
            // Queue next note
            this.melodyTimeoutId = setTimeout(playNextScheduledNote, delay);
        };
        
        playNextScheduledNote();
    }

    stopHedwigThemeLoop() {
        if (!this.isMelodyPlaying) return;
        
        if (this.melodyTimeoutId) {
            clearTimeout(this.melodyTimeoutId);
        }
        this.isMelodyPlaying = false;
    }

    // C. PROCEDURAL CASTLE BACKGROUND AMBIENCE (Fireplace & Castle Storm)
    startProceduralAmbient() {
        if (this.isPlayingAmbient || !this.ctx) return;
        this.init();
        
        const now = this.ctx.currentTime;
        
        // 1. Castle Howling Storm (Filtered low noise sweeps)
        const windBufferSize = this.ctx.sampleRate * 4.0;
        const windBuffer = this.ctx.createBuffer(1, windBufferSize, this.ctx.sampleRate);
        const windData = windBuffer.getChannelData(0);
        for (let i = 0; i < windBufferSize; i++) {
            windData[i] = Math.random() * 2 - 1;
        }
        
        this.windSource = this.ctx.createBufferSource();
        this.windSource.buffer = windBuffer;
        this.windSource.loop = true;
        
        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.setValueAtTime(300, now);
        windFilter.Q.setValueAtTime(1.5, now);
        
        this.windSource.connect(windFilter);
        windFilter.connect(this.ambientGainNode);
        this.windSource.start(now);
        
        // Modulate storm intensity periodically
        this.windModulator = setInterval(() => {
            if (!this.ctx || this.ctx.state === 'suspended') return;
            const t = this.ctx.currentTime;
            // Sweep bandpass frequency to sound like wind gusts through stone arches
            windFilter.frequency.exponentialRampToValueAtTime(180 + Math.random() * 320, t + 2.5);
        }, 3000);

        // 2. Hearth Crackling Fire (Periodic snap bursts)
        const fireBufferSize = this.ctx.sampleRate * 2.0;
        const fireBuffer = this.ctx.createBuffer(1, fireBufferSize, this.ctx.sampleRate);
        const fireData = fireBuffer.getChannelData(0);
        for (let i = 0; i < fireBufferSize; i++) {
            fireData[i] = Math.random() * 2 - 1;
        }
        
        this.fireSource = this.ctx.createBufferSource();
        this.fireSource.buffer = fireBuffer;
        this.fireSource.loop = true;
        
        const fireFilter = this.ctx.createBiquadFilter();
        fireFilter.type = 'bandpass';
        fireFilter.frequency.value = 160;
        
        const crackleGain = this.ctx.createGain();
        crackleGain.gain.setValueAtTime(0.05, now);
        
        this.fireSource.connect(fireFilter);
        fireFilter.connect(crackleGain);
        crackleGain.connect(this.ambientGainNode);
        this.fireSource.start(now);
        
        this.crackleInterval = setInterval(() => {
            if (!this.ctx || this.ctx.state === 'suspended' || this.ambientVolume === 0) return;
            
            const snapTime = this.ctx.currentTime;
            const clickOsc = this.ctx.createOscillator();
            const clickGain = this.ctx.createGain();
            
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(2500 + Math.random() * 2500, snapTime);
            
            clickGain.gain.setValueAtTime(0.01 + Math.random() * 0.08, snapTime);
            clickGain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.015 + Math.random() * 0.02);
            
            clickOsc.connect(clickGain);
            clickGain.connect(this.ambientGainNode);
            clickOsc.start(snapTime);
            clickOsc.stop(snapTime + 0.05);
        }, 400);

        this.isPlayingAmbient = true;
    }

    stopProceduralAmbient() {
        if (!this.isPlayingAmbient) return;
        
        if (this.windSource) {
            try { this.windSource.stop(); } catch(e){}
            this.windSource = null;
        }
        if (this.fireSource) {
            try { this.fireSource.stop(); } catch(e){}
            this.fireSource = null;
        }
        if (this.crackleInterval) clearInterval(this.crackleInterval);
        if (this.windModulator) clearInterval(this.windModulator);
        
        this.isPlayingAmbient = false;
    }

    setAmbientVolume(vol) {
        this.ambientVolume = vol;
        if (this.ambientGainNode) {
            this.ambientGainNode.gain.value = vol;
        }
    }

    setQuillVolume(vol) {
        this.quillVolume = vol;
    }
}

const audioScribe = new HogwartsAudio();

// --- 3. ENCHANTED FLOATING CANDLES PARTICLE SYSTEM (BACKGROUND CANVAS) ---
class FloatingCandlesEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.candles = [];
        this.maxCandles = 28; // Beautiful floating array
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createCandle(preDistribute = false) {
        const width = Math.random() * 5 + 7;   // Candle thickness (7px - 12px)
        const height = Math.random() * 30 + 40; // Candle length (40px - 70px)
        return {
            x: Math.random() * this.canvas.width,
            // If preDistributing, scatter them vertically. Otherwise start at bottom
            y: preDistribute ? Math.random() * this.canvas.height * 0.8 : this.canvas.height + 50,
            width: width,
            height: height,
            speedY: Math.random() * 0.25 + 0.15, // Drift slowly upward
            swayRange: Math.random() * 1.5 + 0.5,
            swaySpeed: Math.random() * 0.005 + 0.002,
            swayOffset: Math.random() * 100,
            flameFlicker: 0,
            opacity: preDistribute ? Math.random() * 0.6 + 0.35 : 0.01,
            fadeInSpeed: 0.005,
            meltRatio: Math.random() * 4 // drips layout
        };
    }

    init() {
        for (let i = 0; i < this.maxCandles; i++) {
            this.candles.push(this.createCandle(true));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const now = Date.now();
        
        for (let i = 0; i < this.candles.length; i++) {
            const c = this.candles[i];
            
            // Fade in candle gradually on spawn
            if (c.opacity < 0.95 && c.y > this.canvas.height * 0.15) {
                c.opacity += c.fadeInSpeed;
            }
            
            // Fade out candle as it drifts near the top enchanted starry ceiling
            if (c.y < this.canvas.height * 0.25) {
                c.opacity -= 0.0018;
            }
            
            // Render the candle parts
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, Math.min(1, c.opacity));
            
            // Dynamic position shifts
            c.y -= c.speedY;
            c.x += Math.sin((c.y * c.swaySpeed) + c.swayOffset) * (c.swayRange * 0.05);
            
            // 1. Draw 3D rounded candle wax cylinder
            const cylinderGrad = this.ctx.createLinearGradient(c.x, c.y, c.x + c.width, c.y);
            cylinderGrad.addColorStop(0, '#dad2c5');     // Darker shade
            cylinderGrad.addColorStop(0.3, '#fbf8f3');   // Highlights
            cylinderGrad.addColorStop(1, '#cdc4b3');     // Dark edge
            
            this.ctx.fillStyle = cylinderGrad;
            
            // Rounded top/bottom edges using pathways
            this.ctx.beginPath();
            this.ctx.moveTo(c.x, c.y + 4);
            this.ctx.quadraticCurveTo(c.x + c.width/2, c.y, c.x + c.width, c.y + 4);
            this.ctx.lineTo(c.x + c.width, c.y + c.height - 4);
            this.ctx.quadraticCurveTo(c.x + c.width/2, c.y + c.height, c.x, c.y + c.height - 4);
            this.ctx.closePath();
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = 'rgba(0,0,0,0.4)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0; // reset
            
            // Draw wax dripping detail
            this.ctx.fillStyle = '#f6f3eb';
            this.ctx.beginPath();
            this.ctx.arc(c.x + c.width * 0.3, c.y + 7 + c.meltRatio, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 2. Draw black wick
            this.ctx.beginPath();
            this.ctx.moveTo(c.x + c.width/2, c.y + 2);
            this.ctx.lineTo(c.x + c.width/2, c.y - 4);
            this.ctx.lineWidth = 1.5;
            this.ctx.strokeStyle = '#222';
            this.ctx.stroke();
            
            // 3. Draw flickering candle teardrop flame
            c.flameFlicker = Math.sin(now * 0.015 + c.swayOffset) * 1.5;
            const flameHeight = 15 + c.flameFlicker * 0.5;
            const flameWidth = 6 + Math.cos(now * 0.02 + c.swayOffset) * 0.8;
            const flameY = c.y - 6;
            
            // A. Soft magical outer fire glow
            this.ctx.beginPath();
            this.ctx.arc(c.x + c.width/2, flameY - flameHeight/3, flameWidth * 3.5, 0, Math.PI * 2);
            const outerGlow = this.ctx.createRadialGradient(
                c.x + c.width/2, flameY - flameHeight/2, 1, 
                c.x + c.width/2, flameY - flameHeight/2, flameWidth * 3.5
            );
            outerGlow.addColorStop(0, 'rgba(255, 120, 10, 0.28)');
            outerGlow.addColorStop(1, 'rgba(255, 120, 10, 0)');
            this.ctx.fillStyle = outerGlow;
            this.ctx.fill();

            // B. Main Teardrop Flame Body
            this.ctx.beginPath();
            this.ctx.moveTo(c.x + c.width/2 - flameWidth, flameY);
            // Curves to peak of teardrop
            this.ctx.quadraticCurveTo(c.x + c.width/2 - flameWidth * 1.2, flameY - flameHeight * 0.6, c.x + c.width/2, flameY - flameHeight);
            this.ctx.quadraticCurveTo(c.x + c.width/2 + flameWidth * 1.2, flameY - flameHeight * 0.6, c.x + c.width/2 + flameWidth, flameY);
            this.ctx.closePath();
            
            const flameGrad = this.ctx.createLinearGradient(c.x, flameY - flameHeight, c.x, flameY);
            flameGrad.addColorStop(0, '#fff4cc'); // Yellow core
            flameGrad.addColorStop(0.5, '#ffa500'); // Orange middle
            flameGrad.addColorStop(1, '#ff3300'); // Red base
            
            this.ctx.fillStyle = flameGrad;
            this.ctx.fill();
            
            // C. Tiny blue flame base
            this.ctx.beginPath();
            this.ctx.arc(c.x + c.width/2, flameY - 1, flameWidth * 0.6, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 100, 255, 0.45)';
            this.ctx.fill();
            
            this.ctx.restore();
            
            // Reset candle when completely faded out or drifts off ceiling
            if (c.opacity <= 0 || c.y < -80) {
                this.candles[i] = this.createCandle();
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// --- 4. THE TIME TURNER SPECTRUM VISUALIZER ---
class TimeTurnerVisualizer {
    constructor(canvasId, audioAnalyzer) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.analyzer = audioAnalyzer;
        this.rotationAngle = 0;
        this.dataArray = new Uint8Array(this.analyzer ? this.analyzer.frequencyBinCount : 0);
        this.resize();
    }

    resize() {
        this.canvas.width = 250;
        this.canvas.height = 250;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = 80;
    }

    updateAnalyzer(newAnalyzer) {
        this.analyzer = newAnalyzer;
        this.dataArray = new Uint8Array(this.analyzer ? this.analyzer.frequencyBinCount : 0);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const now = Date.now();
        let volume = 0;
        let bass = 0;
        
        if (this.analyzer) {
            this.analyzer.getByteFrequencyData(this.dataArray);
            let sum = 0;
            for (let i = 0; i < this.dataArray.length; i++) {
                sum += this.dataArray[i];
                if (i < 10) bass += this.dataArray[i];
            }
            volume = sum / this.dataArray.length;
            bass = bass / 10;
        } else {
            // Faux breathing chimes
            volume = 12 + Math.sin(now * 0.002) * 4;
            bass = 12 + Math.cos(now * 0.001) * 4;
        }

        const intensity = volume / 255;
        const bassIntensity = bass / 255;
        
        // Spin rate increases with volume
        this.rotationAngle += 0.004 + (intensity * 0.04);
        
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.rotationAngle);
        
        // 1. Radial magical lightning flares mapped to frequencies
        if (this.analyzer) {
            const barCount = 72;
            const innerRad = this.radius + (bassIntensity * 14);
            
            for (let i = 0; i < barCount; i++) {
                const angle = (i / barCount) * Math.PI * 2;
                const dataIndex = Math.floor((i / barCount) * (this.dataArray.length * 0.65));
                const value = this.dataArray[dataIndex] || 0;
                
                const barLength = (value / 255) * 55;
                
                if (barLength > 1) {
                    const x1 = Math.cos(angle) * innerRad;
                    const y1 = Math.sin(angle) * innerRad;
                    const x2 = Math.cos(angle) * (innerRad + barLength);
                    const y2 = Math.sin(angle) * (innerRad + barLength);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.lineWidth = 2.2;
                    // Glowing cyan-gold sparks
                    this.ctx.strokeStyle = `hsla(${35 + (value/255)*60}, 100%, ${65 + (value/255)*30}%, ${0.45 + (value/255)*0.55})`;
                    this.ctx.stroke();
                }
            }
        }
        
        // 2. Draw Hogwarts Elder Wand / Deathly Hallows Circular Seals
        const dynamicRad = this.radius + (bassIntensity * 10);
        
        // Golden Snitch core outer shield
        this.ctx.beginPath();
        this.ctx.arc(0, 0, dynamicRad, 0, Math.PI * 2);
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = '#ffc83b';
        this.ctx.shadowBlur = 12 + (intensity * 18);
        this.ctx.shadowColor = 'rgba(255, 200, 59, 0.7)';
        this.ctx.stroke();
        this.ctx.shadowBlur = 0; // reset
        
        // Concentric inside seal
        this.ctx.beginPath();
        this.ctx.arc(0, 0, dynamicRad - 8, 0, Math.PI * 2);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'rgba(255, 200, 59, 0.4)';
        this.ctx.stroke();

        // Inscribe Deathly Hallows geometric seal
        // Triangle
        this.ctx.beginPath();
        const startY = -(dynamicRad - 8);
        const bottomY = (dynamicRad - 8) * Math.sin(Math.PI / 6);
        const bottomX = (dynamicRad - 8) * Math.cos(Math.PI / 6);
        
        this.ctx.moveTo(0, startY);
        this.ctx.lineTo(bottomX, bottomY);
        this.ctx.lineTo(-bottomX, bottomY);
        this.ctx.closePath();
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = 'rgba(255, 200, 59, 0.55)';
        this.ctx.stroke();
        
        // Resurrection Circle
        this.ctx.beginPath();
        const circleRad = (dynamicRad - 8) * 0.45;
        this.ctx.arc(0, bottomY - circleRad, circleRad, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Elder Wand Line (Vertical bisector)
        this.ctx.beginPath();
        this.ctx.moveTo(0, startY);
        this.ctx.lineTo(0, bottomY);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Floating Golden Snitch wings (that flap dynamically to bass frequencies!)
        this.ctx.save();
        const wingFlap = Math.sin(now * 0.045 + (bassIntensity * 0.35)) * 0.5;
        
        // Left Wing
        this.ctx.beginPath();
        this.ctx.ellipse(-dynamicRad - 15, -10, 35, 12, wingFlap, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 200, 59, 0.65)';
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
        
        // Right Wing
        this.ctx.beginPath();
        this.ctx.ellipse(dynamicRad + 15, -10, 35, 12, -wingFlap, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 200, 59, 0.65)';
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
        this.ctx.restore();

        // Dots on seal vertices
        const dotCount = 6;
        for (let i = 0; i < dotCount; i++) {
            const angle = (i / dotCount) * Math.PI * 2;
            const dx = Math.cos(angle) * (dynamicRad - 4);
            const dy = Math.sin(angle) * (dynamicRad - 4);
            
            this.ctx.beginPath();
            this.ctx.arc(dx, dy, 2.5 + (intensity * 2.5), 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffc83b';
            this.ctx.fill();
        }
        
        this.ctx.restore();
        
        // Pulse the HTML Hat icon in center
        const scale = 1 + (bassIntensity * 0.16);
        const pulsar = document.getElementById('music-pulsar');
        if (pulsar) {
            pulsar.style.transform = `scale(${scale})`;
            if (this.analyzer && volume > 20) {
                pulsar.classList.add('pulsing');
            } else {
                pulsar.classList.remove('pulsing');
            }
        }
        
        requestAnimationFrame(() => this.draw());
    }
}

// --- 5. HOGWARTS SCRIBE TYPING GAME ENGINE ---
class HogwartsScribeEngine {
    constructor() {
        this.textDisplay = document.getElementById('text-display');
        this.typingInput = document.getElementById('typing-input');
        this.timerLabel = document.getElementById('stat-timer');
        this.wpmLabel = document.getElementById('stat-wpm');
        this.accLabel = document.getElementById('stat-acc');
        this.scrollBody = document.getElementById('scroll-body');
        this.focusOverlay = document.getElementById('focus-overlay');
        this.restartBtn = document.getElementById('restart-btn');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        
        // Game variables
        this.activeGenre = 'spell';
        this.originalText = "";
        this.charArray = [];
        this.charIndex = 0;
        this.correctChars = 0;
        this.totalTyped = 0;
        this.errors = 0;
        
        // Scribe States
        this.isTimerRunning = false;
        this.timeLeft = 60;
        this.duration = 60;
        this.timerId = null;
        
        this.isFocused = false;
    }

    init() {
        this.loadNewText();
        
        this.typingInput.addEventListener('input', () => this.handleTyping());
        this.typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        this.scrollBody.addEventListener('click', (e) => {
            e.stopPropagation();
            this.typingInput.focus();
            this.setFocusState(true);
        });
        
        document.addEventListener('click', () => {
            this.setFocusState(false);
        });

        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeGenre = btn.getAttribute('data-genre');
                this.resetTest();
            });
        });
        
        this.restartBtn.addEventListener('click', () => this.resetTest());
        
        this.typingInput.focus();
        this.setFocusState(true);
    }

    setFocusState(focused) {
        this.isFocused = focused;
        if (focused) {
            this.focusOverlay.classList.remove('show');
        } else {
            if (!document.getElementById('results-modal').classList.contains('open')) {
                this.focusOverlay.classList.add('show');
            }
        }
    }

    loadNewText() {
        const corpus = HARRY_POTTER_TEXTS[this.activeGenre];
        const randomIdx = Math.floor(Math.random() * corpus.length);
        this.originalText = corpus[randomIdx];
        
        this.textDisplay.innerHTML = "";
        this.charArray = [];
        this.charIndex = 0;
        
        this.originalText.split("").forEach((char, index) => {
            const span = document.createElement('span');
            span.innerText = char;
            span.classList.add('untyped');
            this.textDisplay.appendChild(span);
            this.charArray.push(span);
        });
        
        if (this.charArray.length > 0) {
            this.charArray[0].classList.add('caret');
        }
    }

    handleTyping() {
        const value = this.typingInput.value;
        const currentTypedLength = value.length;
        
        audioScribe.init();
        
        if (!this.isTimerRunning && currentTypedLength > 0) {
            this.startTimer();
        }

        for (let i = 0; i < currentTypedLength; i++) {
            const expectedChar = this.originalText[i];
            const enteredChar = value[i];
            const span = this.charArray[i];
            
            span.classList.remove('caret');

            if (enteredChar === expectedChar) {
                if (!span.classList.contains('correct')) {
                    if (span.classList.contains('incorrect')) this.errors--;
                    span.classList.remove('untyped', 'incorrect');
                    span.classList.add('correct');
                    audioScribe.playQuillScratch();
                }
            } else {
                if (!span.classList.contains('incorrect')) {
                    span.classList.remove('untyped', 'correct');
                    span.classList.add('incorrect');
                    this.errors++;
                    audioScribe.playErrorThud();
                }
            }
        }

        for (let i = currentTypedLength; i < this.charArray.length; i++) {
            const span = this.charArray[i];
            span.classList.remove('correct', 'incorrect', 'caret');
            span.classList.add('untyped');
        }

        this.charIndex = currentTypedLength;
        
        if (this.charIndex < this.charArray.length) {
            this.charArray[this.charIndex].classList.add('caret');
            this.scrollToCaret();
        }

        this.calculateStats(currentTypedLength);

        if (this.charIndex >= this.charArray.length) {
            this.endTest();
        }
    }

    scrollToCaret() {
        const activeSpan = this.charArray[this.charIndex];
        if (!activeSpan) return;
        
        const scrollOffset = activeSpan.offsetTop - this.scrollBody.offsetTop - 80;
        this.scrollBody.scrollTo({
            top: scrollOffset,
            behavior: 'smooth'
        });
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.resetTest();
            e.preventDefault();
        }
    }

    startTimer() {
        this.isTimerRunning = true;
        this.timeLeft = this.duration;
        this.timerLabel.innerText = `${this.timeLeft}s`;
        
        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.timerLabel.innerText = `${this.timeLeft}s`;
            
            const timeElapsed = (this.duration - this.timeLeft) / 60;
            if (timeElapsed > 0) {
                const totalCorrect = this.originalText.substring(0, this.charIndex).split("").filter((c, idx) => {
                    return this.charArray[idx].classList.contains('correct');
                }).length;
                
                const wpm = Math.round((totalCorrect / 5) / timeElapsed);
                this.wpmLabel.innerText = wpm;
            }

            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }

    calculateStats(typedLength) {
        if (typedLength === 0) {
            this.wpmLabel.innerText = "0";
            this.accLabel.innerText = "100%";
            return;
        }

        const correctTyped = this.originalText.substring(0, typedLength).split("").filter((c, idx) => {
            return this.charArray[idx].classList.contains('correct');
        }).length;
        
        const acc = Math.round((correctTyped / typedLength) * 100);
        this.accLabel.innerText = `${acc}%`;
    }

    resetTest() {
        clearInterval(this.timerId);
        this.isTimerRunning = false;
        this.timeLeft = this.duration;
        this.charIndex = 0;
        this.errors = 0;
        
        this.timerLabel.innerText = `${this.duration}s`;
        this.wpmLabel.innerText = "0";
        this.accLabel.innerText = "100%";
        
        this.typingInput.value = "";
        this.loadNewText();
        this.scrollBody.scrollTop = 0;
        
        this.typingInput.focus();
        this.setFocusState(true);
    }

    endTest() {
        clearInterval(this.timerId);
        this.isTimerRunning = false;
        this.typingInput.blur();
        
        audioScribe.playVictoryBell();

        const timeElapsed = Math.max(1, this.duration - this.timeLeft);
        const correctTyped = this.charArray.filter(span => span.classList.contains('correct')).length;
        
        const finalWpm = Math.round((correctTyped / 5) / (timeElapsed / 60)) || 0;
        const totalTyped = this.typingInput.value.length;
        const finalAcc = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;
        
        // wizarding ranks assignment
        let rankBadge = "🧹";
        let rankTitle = "SQUIB CITIZEN";
        let rankDesc = "Alas! You scribe at a snail's pace, lacking spell coordination. Argus Filch is signaling you to assist with mop sweeping!";
        
        if (finalWpm >= 80 && finalAcc >= 95) {
            rankBadge = "🧙‍♂️";
            rankTitle = "HOGWARTS HEADMASTER";
            rankDesc = "Outstanding wizardry! The words spun under your keyboard like high alchemical starlight. Dumbledore yields his seat to you!";
        } else if (finalWpm >= 60) {
            rankBadge = "🦅";
            rankTitle = "ORDER OF THE PHOENIX";
            rankDesc = "Stunning speeds! Your wand reflexes are elite. The Order honors your invaluable skill at encoding spell grimoires.";
        } else if (finalWpm >= 40) {
            rankBadge = "⚡";
            rankTitle = "MINISTRY AUROR";
            rankDesc = "Fast and lethal! Your fingers struck correct spells like red-spark combat jinxes. Dark wizards flee in terror.";
        } else if (finalWpm >= 20) {
            rankBadge = "🎓";
            rankTitle = "HOGWARTS STUDENT";
            rankDesc = "Acceptable progress. You transcribe accurately, but you must speed up wrist movements in Hermione's next class!";
        }

        document.getElementById('rank-badge').innerText = rankBadge;
        document.getElementById('rank-title').innerText = rankTitle;
        document.getElementById('rank-desc').innerText = rankDesc;
        
        document.getElementById('results-wpm').innerText = `${finalWpm} WPM`;
        document.getElementById('results-acc').innerText = `${finalAcc}%`;
        document.getElementById('results-time').innerText = `${timeElapsed} seconds`;
        document.getElementById('results-errors').innerText = `${this.errors} spelling typos`;
        
        const modal = document.getElementById('results-modal');
        modal.classList.add('open');
    }
}

// --- 6. INITIALIZATION & MUSIC CONTROLS DECK ---
document.addEventListener('DOMContentLoaded', () => {
    // A. Start Hogwarts Floating Candles Engine
    const candles = new FloatingCandlesEngine('ambient-canvas');
    candles.init();
    candles.animate();

    // B. Start Hogwarts Scribing Mechanics
    const scribe = new HogwartsScribeEngine();
    scribe.init();

    // C. Setup Interactive Music Player Elements
    const dropzone = document.getElementById('music-dropzone');
    const fileInput = document.getElementById('music-file-input');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const ambientSlider = document.getElementById('ambient-slider');
    const trackLabel = document.getElementById('track-name');
    const soundToggle = document.getElementById('quill-sound-toggle');
    const retryModalBtn = document.getElementById('modal-retry-btn');
    
    // Core HTML Audio object
    const audioElement = new Audio();
    audioElement.loop = true;
    
    let audioSourceNode = null;
    let audioAnalyserNode = null;
    
    // Init Snitch Visualizer
    const visualizer = new TimeTurnerVisualizer('visualizer-canvas', null);
    visualizer.draw();

    // Handle Local Music Upload
    function loadSelectedMusic(file) {
        if (!file) return;
        
        audioScribe.init();
        
        // Stop synthesized Hedwig melody loop if playing
        audioScribe.stopHedwigThemeLoop();
        
        const fileURL = URL.createObjectURL(file);
        audioElement.src = fileURL;
        trackLabel.innerText = `⚡ Summoned: ${file.name}`;
        
        if (!audioSourceNode) {
            audioSourceNode = audioScribe.ctx.createMediaElementSource(audioElement);
            audioAnalyserNode = audioScribe.ctx.createAnalyser();
            audioAnalyserNode.fftSize = 256;
            
            audioSourceNode.connect(audioAnalyserNode);
            audioAnalyserNode.connect(audioScribe.ctx.destination);
            
            visualizer.updateAnalyzer(audioAnalyserNode);
        }

        audioElement.volume = volumeSlider.value;
        audioElement.play();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        
        // Layer procedural fireplace storm ambient sound underneath
        audioScribe.startProceduralAmbient();
    }

    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        loadSelectedMusic(file);
    });

    // Play & Pause controls
    playPauseBtn.addEventListener('click', () => {
        audioScribe.init();
        
        if (audioElement.src) {
            // Handling custom uploaded soundtrack
            if (audioElement.paused) {
                audioElement.play();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                audioScribe.startProceduralAmbient();
            } else {
                audioElement.pause();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                audioScribe.stopProceduralAmbient();
            }
        } else {
            // Loop synthesized Celesta Hedwig's Theme intro
            if (audioScribe.isMelodyPlaying) {
                audioScribe.stopHedwigThemeLoop();
                audioScribe.stopProceduralAmbient();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                trackLabel.innerText = `🎵 Silent Hall Mood`;
            } else {
                audioScribe.startHedwigThemeLoop();
                audioScribe.startProceduralAmbient();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                trackLabel.innerText = `🔮 Ambient: Hedwig's Theme (Procedural Celesta bell synth) + Castle Storm`;
            }
        }
    });

    // Sliders
    volumeSlider.addEventListener('input', (e) => {
        audioElement.volume = e.target.value;
        audioScribe.setQuillVolume(e.target.value); // Sync synth note volume
    });

    ambientSlider.addEventListener('input', (e) => {
        audioScribe.setAmbientVolume(e.target.value);
        if (e.target.value > 0) {
            audioScribe.startProceduralAmbient();
        }
    });

    soundToggle.addEventListener('change', (e) => {
        audioScribe.quillEnabled = e.target.checked;
    });

    retryModalBtn.addEventListener('click', () => {
        document.getElementById('results-modal').classList.remove('open');
        scribe.resetTest();
    });
});
