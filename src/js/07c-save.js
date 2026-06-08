// ======== 存档系统 ========

                const SAVE_KEY = 'rogue_save';
                const SAVE_VERSION = '3.43.0';

                function autosaveGame() {
                    if (gameState.isGameOver || gameState.floor <= 0) return;
                    try {
                        const saveData = {
                            version: SAVE_VERSION,
                            playerName: gameState.playerName,
                            playerAvatar: gameState.playerAvatar,
                            playerClass: gameState.playerClass,
                            floor: gameState.floor,
                            gold: gameState.gold,
                            runKills: gameState.runKills,
                            player: {
                                x: gameState.player.x, y: gameState.player.y,
                                hp: gameState.player.hp, maxHp: gameState.player.maxHp,
                                atk: gameState.player.atk, def: gameState.player.def,
                                level: gameState.player.level, exp: gameState.player.exp,
                                critRate: gameState.player.critRate,
                                penetration: gameState.player.penetration,
                                doubleHit: gameState.player.doubleHit,
                                damageReduce: gameState.player.damageReduce,
                                shield: gameState.player.shield,
                                maxShield: gameState.player.maxShield,
                                lifestealRate: gameState.player.lifestealRate,
                                killHeal: gameState.player.killHeal,
                                freezeRate: gameState.player.freezeRate,
                                stunRate: gameState.player.stunRate,
                                igniteRate: gameState.player.igniteRate,
                                vulnerableRate: gameState.player.vulnerableRate,
                                equipment: gameState.player.equipment,
                                buffs: gameState.player.buffs,
                                debuffs: gameState.player.debuffs,
                                _speedPotion: gameState.player._speedPotion,
                                _powerPotion: gameState.player._powerPotion,
                                _greedLure: gameState.player._greedLure,
                                _chronosTonic: gameState.player._chronosTonic,
                                _berserker: gameState.player._berserker,
                                _thornsTurns: gameState.player._thornsTurns,
                                _phaseWalk: gameState.player._phaseWalk,
                                burnTurns: gameState.player.burnTurns,
                                frozenTurns: gameState.player.frozenTurns,
                                stunned: gameState.player.stunned,
                            },
                            talentPoints: gameState.talentPoints,
                            unlockedTalents: gameState.unlockedTalents,
                            skillCooldown: gameState.skillCooldown,
                            skillActive: gameState.skillActive,
                            skillTurns: gameState.skillTurns,
                                                         theme: gameState.theme,
                                                         potionBelt: gameState.potionBelt,
                                                         achievements: gameState.achievements,
                            achievementStats: gameState.achievementStats,
                            savedAt: new Date().toISOString(),
                        };
                        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
                    } catch(e) { /* quota exceeded */ }
                }

                function hasSaveData() {
                    try {
                        const raw = localStorage.getItem(SAVE_KEY);
                        if (!raw) return false;
                        const data = JSON.parse(raw);
                        return data && data.version === SAVE_VERSION && data.floor > 0;
                    } catch(e) { return false; }
                }

                function loadGame() {
                    try {
                        const raw = localStorage.getItem(SAVE_KEY);
                        if (!raw) return null;
                        return JSON.parse(raw);
                    } catch(e) { return null; }
                }

                function deleteSave() {
                    try { localStorage.removeItem(SAVE_KEY); } catch(e) {}
                }

                function continueGame() {
                            try {
                                const save = loadGame();
                                if (!save) { alert('未找到存档数据'); return; }
                                // 恢复 gameState
                                gameState.playerName = save.playerName;
                                gameState.playerAvatar = save.playerAvatar;
                                gameState.playerClass = save.playerClass;
                                gameState.floor = save.floor;
                                gameState.gold = save.gold || 0;
                                if (isNaN(gameState.gold)) gameState.gold = 0;
                                gameState.runKills = save.runKills || 0;
                                gameState.talentPoints = save.talentPoints || 0;
                                gameState.unlockedTalents = save.unlockedTalents || {};
                                gameState.skillCooldown = save.skillCooldown || 0;
                                gameState.skillActive = save.skillActive || false;
                                gameState.skillTurns = save.skillTurns || 0;
                                gameState.theme = save.theme || 'abyss';
                                                                gameState.potionBelt = save.potionBelt || [null, null, null, null];
                                                                gameState.achievements = save.achievements || {};
                                gameState.achievementStats = save.achievementStats || { kills:0, equipCollected:0, eliteKills:0, bossKills:0 };
                                // 确保 player 对象存在（页面刷新后 gameState.player 为 null）
                                                if (!gameState.player) {
                                                    gameState.player = {
                                                        x:0, y:0, hp:100, maxHp:100, atk:10, def:5, level:1, exp:0,
                                                        critRate:5, penetration:0, doubleHit:0, damageReduce:0,
                                                        shield:0, maxShield:0, lifestealRate:0, killHeal:0,
                                                        freezeRate:0, stunRate:0, igniteRate:0, vulnerableRate:0,
                                                        equipment: { mainHand:null, offHand:null, helmet:null, chest:null, gloves:null, boots:null, ring1:null, ring2:null, necklace:null },
                                                                                                                buffs: [], debuffs: {},
_speedPotion: 0, _powerPotion: false, _greedLure: false,
                                                                                                                 _chronosTonic: false, _berserker: false, _thornsTurns: 0,
                                                                                                                 _phaseWalk: false,
                                                                                                            };
                                                }
                                                // 恢复玩家属性
                                                const sp = save.player;
                                const p = gameState.player;
                                p.x = sp.x; p.y = sp.y;
                                p.hp = sp.hp; p.maxHp = sp.maxHp;
                                p.atk = sp.atk; p.def = sp.def;
                                p.level = sp.level; p.exp = sp.exp;
                                p.critRate = sp.critRate || 5;
                                p.penetration = sp.penetration || 0;
                                p.doubleHit = sp.doubleHit || 0;
                                p.damageReduce = sp.damageReduce || 0;
                                p.shield = sp.shield || 0;
                                p.maxShield = sp.maxShield || 0;
                                p.lifestealRate = sp.lifestealRate || 0;
                                p.killHeal = sp.killHeal || 0;
                                p.freezeRate = sp.freezeRate || 0;
                                p.stunRate = sp.stunRate || 0;
                                p.igniteRate = sp.igniteRate || 0;
                                p.vulnerableRate = sp.vulnerableRate || 0;
                                 p.equipment = save.player.equipment || {};
                                 p.buffs = sp.buffs || [];
                                 p.debuffs = sp.debuffs || {};
                                 // 恢复药水/状态标记
                                 p._speedPotion = sp._speedPotion || 0;
                                 p._powerPotion = sp._powerPotion || false;
                                 p._greedLure = sp._greedLure || false;
                                 p._chronosTonic = sp._chronosTonic || false;
                                 p._berserker = sp._berserker || false;
                                 p._thornsTurns = sp._thornsTurns || 0;
                                 p._phaseWalk = sp._phaseWalk || false;
                                 p.burnTurns = sp.burnTurns || 0;
                                 p.frozenTurns = sp.frozenTurns || 0;
                                 p.stunned = sp.stunned || false;
                                // 重置死亡标记
                                gameState.isGameOver = false;
                                // 隐藏开始界面
                                document.getElementById('start-screen').style.display = 'none';
                                updateCharInfo();
                                document.getElementById('leaderboard-modal').style.display = 'none';
                                gameState.shopOpen = false;
                                sfx.init();
                                sfx.play('start');
                                generateMap();
                                renderMap();
                                updateStatusBar();
                                updateTalentPanel();
                                addLog(`=== 继续冒险，第 ${gameState.floor} 层 ===`, 'log-system');
                            } catch(e) {
                                alert('继续游戏失败: ' + e.message);
                            }
                        }

                function getBestRecord() {
                    const lb = loadLeaderboard();
                    if (lb.length === 0) return null;
                    return lb[0]; // 排行榜已按分数降序排列
                }
