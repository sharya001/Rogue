/* ╔══════════════════════════════════════════╗
        ║  MODULE 2: 音频引擎 (SFX + BGM)        ║
        ╚══════════════════════════════════════════╝ */
// ==================== 音效定义 ====================
            play(name) {
                this.init();
                if (this.muted || !this.ctx) return;
                
                switch (name) {
                    case 'hit': // 攻击命中
                        this.tone(220, 'square', 0.08, 0.25);
                        this.noise(0.05, 0.15);
                        break;
                        
                    case 'crit': // 暴击
                        this.tone(440, 'square', 0.06, 0.3);
                        this.tone(660, 'square', 0.06, 0.25, 0.04);
                        this.tone(880, 'square', 0.1, 0.2, 0.08);
                        this.noise(0.08, 0.12);
                        break;
                        
                    case 'kill': // 击杀敌人
                        this.sweep(600, 200, 'square', 0.15, 0.25);
                        this.tone(800, 'sine', 0.1, 0.15, 0.12);
                        this.tone(1000, 'sine', 0.15, 0.12, 0.2);
                        break;
                        
                    case 'boss_kill': // Boss 击杀
                        this.sweep(800, 200, 'sawtooth', 0.2, 0.3);
                        this.tone(523, 'sine', 0.15, 0.25, 0.18);
                        this.tone(659, 'sine', 0.15, 0.25, 0.3);
                        this.tone(784, 'sine', 0.2, 0.3, 0.42);
                        this.tone(1047, 'sine', 0.3, 0.25, 0.58);
                        break;
                        
                    case 'hurt': // 受到伤害
                        this.tone(150, 'sawtooth', 0.15, 0.3);
                        this.noise(0.1, 0.2);
                        break;
                        
                    case 'heal': // 喝药水
                        this.sweep(300, 600, 'sine', 0.2, 0.2);
                        this.tone(600, 'sine', 0.15, 0.15, 0.18);
                        break;
                        
                    case 'levelup': // 升级
                        this.tone(523, 'square', 0.12, 0.25);
                        this.tone(659, 'square', 0.12, 0.25, 0.12);
                        this.tone(784, 'square', 0.12, 0.25, 0.24);
                        this.tone(1047, 'square', 0.25, 0.3, 0.36);
                        break;
                        
                    case 'chest': // 开宝箱
                        this.tone(500, 'sine', 0.08, 0.2);
                        this.tone(700, 'sine', 0.08, 0.2, 0.08);
                        this.tone(900, 'sine', 0.12, 0.2, 0.16);
                        break;
                        
                    case 'gold': // 获得金币
                        this.tone(1200, 'sine', 0.06, 0.15);
                        this.tone(1600, 'sine', 0.1, 0.12, 0.06);
                        break;
                        
                    case 'floor': // 进入新层
                        this.sweep(200, 80, 'sine', 0.4, 0.2);
                        this.noise(0.15, 0.08, 0.1);
                        break;
                        
                    case 'boss': // Boss 出现
                        this.tone(80, 'sawtooth', 0.3, 0.3);
                        this.tone(100, 'sawtooth', 0.3, 0.25, 0.25);
                        this.tone(80, 'sawtooth', 0.4, 0.3, 0.5);
                        this.noise(0.2, 0.1, 0.3);
                        break;
                        
                    case 'shop': // 打开商店
                        this.tone(800, 'sine', 0.08, 0.15);
                        this.tone(1000, 'sine', 0.08, 0.12, 0.08);
                        this.tone(1200, 'sine', 0.1, 0.15, 0.16);
                        break;
                        
                    case 'buy': // 购买物品
                        this.tone(600, 'sine', 0.06, 0.15);
                        this.tone(900, 'sine', 0.1, 0.15, 0.06);
                        break;
                        
                    case 'gameover': // 游戏结束
                        this.tone(400, 'sawtooth', 0.3, 0.3);
                        this.sweep(400, 100, 'sawtooth', 0.5, 0.25, 0.28);
                        this.tone(80, 'sine', 0.8, 0.2, 0.7);
                        break;
                        
                    case 'walk': // 走路
                        this.noise(0.03, 0.06);
                        break;
                        
                    case 'wall': // 撞墙
                        this.tone(100, 'sine', 0.08, 0.15);
                        break;
                        
                    case 'equip': // 装备物品
                        this.tone(500, 'square', 0.06, 0.15);
                        this.tone(700, 'square', 0.08, 0.15, 0.06);
                        this.tone(900, 'square', 0.12, 0.2, 0.12);
                        break;
                        
                    case 'poison': // 中毒效果
                        this.sweep(300, 100, 'sine', 0.2, 0.15);
                        this.noise(0.1, 0.08, 0.05);
                        break;
                        
                    case 'start': // 游戏开始
                        this.tone(262, 'square', 0.1, 0.2);
                        this.tone(330, 'square', 0.1, 0.2, 0.1);
                        this.tone(392, 'square', 0.1, 0.2, 0.2);
                        this.tone(523, 'square', 0.2, 0.25, 0.3);
                        break;
                }
            },
            
            toggle() {
                this.muted = !this.muted;
                if (!this.muted) {
                    this.init();
                    this.play('gold');
                }
                return this.muted;
            },
            
        };
        
        function toggleSfx() {
                    const muted = sfx.toggle();
                    const btn = document.getElementById('sfx-toggle');
                    btn.textContent = muted ? '🔇' : '🔊';
                    btn.classList.toggle('muted', muted);
                }
        
                function toggleAutoAttack() {
                    gameState.autoAttack = !gameState.autoAttack;
                    const btn = document.getElementById('auto-attack-toggle');
                    btn.textContent = gameState.autoAttack ? '🗡️' : '✋';
                    btn.classList.toggle('off', !gameState.autoAttack);
                    if (!gameState.autoAttack && gameState.enemies.length > 0) {
                        addLog('⚠️ 自动攻击已中断', 'log-system');
                    }
                }
        
        /* ====== [BGM 已禁用 - 保留备份] ======
                // ==================== BGM 引擎 (外部音频文件 + 随机播放) ====================
                // 每个主题 3-4 首 WAV 文件，进层时随机选一首
                const BGM_DIR = 'assets/bgm';
                const BGM_TRACKS = {
                    abyss:   ['abyss_1.wav', 'abyss_2.wav', 'abyss_3.wav', 'abyss_4.wav'],
                    forest:  ['forest_1.wav', 'forest_2.wav', 'forest_3.wav', 'forest_4.wav'],
                    cave:    ['cave_1.wav', 'cave_2.wav', 'cave_3.wav'],
                    volcano: ['volcano_1.wav', 'volcano_2.wav', 'volcano_3.wav', 'volcano_4.wav'],
                    ice:     ['ice_1.wav', 'ice_2.wav', 'ice_3.wav', 'ice_4.wav'],
                };

                const bgm = { muted: false, playing: false, currentTheme: 'abyss', audio: null, fadeTimer: null, _lastTrack: '', _pickTrack(theme) { const tracks = BGM_TRACKS[theme] || BGM_TRACKS.abyss; let pick; do { pick = tracks[Math.floor(Math.random() * tracks.length)]; } while (pick === this._lastTrack && tracks.length > 1); this._lastTrack = pick; return BGM_DIR + '/' + theme + '/' + pick; }, stop() { this.playing = false; if (this.fadeTimer) { clearInterval(this.fadeTimer); this.fadeTimer = null; } if (this.audio) { this.audio.pause(); this.audio.currentTime = 0; this.audio.src = ''; this.audio = null; } }, fadeOut(dur, cb) { if (!this.audio) { if (cb) cb(); return; } if (this.fadeTimer) { clearInterval(this.fadeTimer); } const steps = 20; const interval = (dur * 1000) / steps; const startVol = this.audio.volume; let step = 0; this.fadeTimer = setInterval(() => { step++; if (step >= steps) { clearInterval(this.fadeTimer); this.fadeTimer = null; this.stop(); if (cb) cb(); } else if (this.audio) { this.audio.volume = startVol * (1 - step / steps); } }, interval); }, fadeIn(dur) { if (!this.audio) return; const targetVol = 0.6; this.audio.volume = 0.01; const steps = 20; const interval = (dur * 1000) / steps; let step = 0; const timer = setInterval(() => { step++; if (step >= steps) { clearInterval(timer); if (this.audio) this.audio.volume = targetVol; } else if (this.audio) { this.audio.volume = targetVol * (step / steps); } }, interval); }, play(theme) { if (this.muted) return; this.stop(); this.currentTheme = theme || 'abyss'; this.playing = true; const src = this._pickTrack(this.currentTheme); this.audio = new Audio(src); this.audio.loop = true; this.audio.volume = 0.01; this.audio.play().catch(() => {}); this.fadeIn(1.0); }, switchTheme(theme) { if (theme === this.currentTheme) return; this.fadeOut(0.4, () => { this.play(theme); }); }, toggle() { this.muted = !this.muted; if (this.muted) { this.fadeOut(0.3); } else { this.play(this.currentTheme); } return this.muted; } };

                function toggleBgm() { const muted = bgm.toggle(); const btn = document.getElementById('bgm-toggle'); btn.textContent = muted ? '🔇' : '🎵'; btn.classList.toggle('muted', muted); }
                ====== [BGM 禁用结束] ====== */

        
        
        /* ╔══════════════════════════════════════════╗
        ║  MODULE 3: 地图系统                   ║
        ╚══════════════════════════════════════════╝ */
