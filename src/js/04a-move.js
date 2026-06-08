/* ╔══════════════════════════════════════════╗
        ║  MODULE 4: 玩家与战斗                 ║
        ╚══════════════════════════════════════════╝ */
// ==================== 移动动画辅助 ====================
function spawnFootstepParticles(fromX, fromY) {
    const mapDisplay = document.getElementById('map-display');
    if (!mapDisplay) return;
    const rect = mapDisplay.getBoundingClientRect();
    const cellW = rect.width / CONFIG.MAP_WIDTH;
    const cellH = rect.height / CONFIG.MAP_HEIGHT;
    const cx = rect.left + fromX * cellW + cellW / 2;
    const cy = rect.top + fromY * cellH + cellH / 2;
    for (let i = 0; i < 3; i++) {
        const p = document.createElement('span');
        p.className = 'footstep-particle';
        p.textContent = ['·','✦','•'][i];
        p.style.left = cx + 'px';
        p.style.top = cy + 'px';
        p.style.setProperty('--fx', (Math.random() - 0.5) * 20 + 'px');
        p.style.setProperty('--fy', (Math.random() * 8 - 16) + 'px');
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 500);
    }
}
function triggerMapShake(dx, dy) {
    const mapDisplay = document.getElementById('map-display');
    if (!mapDisplay) return;
    let cls = '';
    if (dy < 0) cls = 'shake-u';
    else if (dy > 0) cls = 'shake-d';
    else if (dx < 0) cls = 'shake-l';
    else if (dx > 0) cls = 'shake-r';
    if (cls) { mapDisplay.classList.add(cls); setTimeout(() => mapDisplay.classList.remove(cls), 160); }
}
// ==================== 更新状态栏 ====================
function updateStatusBar() {
            const p = gameState.player;
// 计算总属性（基础 + 装备）- 汇总9槽位全部加成
            const totalAtk = p.atk + sumEquipAtk();
            const totalDef = p.def + sumEquipDef();
            const totalMaxHp = p.maxHp + sumEquipHp();
            
            // HP 血条（基于包含装备加成的总 HP，上限 100%）
            const hpPercent = Math.min((p.hp / totalMaxHp) * 100, 100);
            document.getElementById('hp-bar-fill').style.width = hpPercent + '%';
            
// 调试模式：HP 显示带标记
            if (gameState.godMode) {
                document.getElementById('stat-hp').textContent = `${p.hp}/${totalMaxHp} 🛡️`;
                document.getElementById('stat-hp').style.color = '#0ff';
                document.getElementById('hp-bar-fill').style.background = 'linear-gradient(90deg, #0ff, #0f0)';
            } else {
                document.getElementById('stat-hp').textContent = `${p.hp}/${totalMaxHp}`;
                document.getElementById('stat-hp').style.color = '#fff';
                document.getElementById('hp-bar-fill').style.background = 'linear-gradient(90deg, #f00, #0f0)';
            }
            
            document.getElementById('stat-atk').textContent = totalAtk;
            document.getElementById('stat-def').textContent = totalDef;
            document.getElementById('stat-gold').textContent = isNaN(gameState.gold) ? '0' : gameState.gold;
            document.getElementById('stat-level').textContent = p.level;
            
            // 经验条
            const expNeeded = CONFIG.EXP_BASE + (p.level - 1) * 25;
            const expPercent = (p.exp / expNeeded) * 100;
            document.getElementById('exp-bar-fill').style.width = expPercent + '%';
            document.getElementById('stat-exp').textContent = `${p.exp}/${expNeeded}`;
            
// 更新装备显示（9槽位）
            const slotKeys = Object.keys(CONFIG.EQUIPMENT_SLOTS);
            slotKeys.forEach(key => {
                const slotEl = document.getElementById('eslot-' + key);
                if (!slotEl) return;
                const item = p.equipment[key];
                const nameEl = slotEl.querySelector('.es-name');
                if (item) {
                    nameEl.textContent = item.name;
                    slotEl.classList.add('has-item');
                    // 品质颜色
                    if (item.quality != null && CONFIG.QUALITY_CONFIG[item.quality]) {
                                            nameEl.style.color = CONFIG.QUALITY_CONFIG[item.quality].color;
                                        }
                                        // 诅咒装备暗紫色
                                        if (item.cursed) { nameEl.style.color = '#c6f'; slotEl.style.borderColor = '#c6f'; }
                    // hover 显示属性详情
                    const parts = [];
                    if (item.atk) parts.push(`🗡️${item.atk}`);
                    if (item.def) parts.push(`🛡️${item.def}`);
                    if (item.maxHp) parts.push(`❤️${item.maxHp}`);
                    let affixStr = '';
                    if (item.affixes && item.affixes.length > 0) {
                        affixStr = '\n' + item.affixes.map(a => a.name + (a.val ? '+' + a.val + (a.isPct ? '%' : '') : '')).join(' · ');
                    }
                    slotEl.title = item.name + (parts.length > 0 ? ' [' + parts.join(' ') + ']' : '') + affixStr;
                } else {
                    nameEl.textContent = '空';
                    nameEl.style.color = '#666';
                    slotEl.classList.remove('has-item');
                    slotEl.title = '';
                }
            });
            
            // 更新楼层信息
                        updateFloorInfo();
                        // 渲染药水背包
                        renderPotionBelt();
                    }
        
        // ==================== 更新楼层信息 ====================
        function updateFloorInfo() {
                    // 城堡层：不显示地城信息
                    if (gameState.floor === 0) {
                        const fi = document.getElementById('floor-info');
                        if (fi) fi.style.display = 'none';
                        return;
                    }
                    // 计算敌人强度倍率
            const scale = 1 + (gameState.floor - 1) * 0.35;
            let intensity = '普通';
            let intensityColor = '#ff0';
            
            if (gameState.floor >= 20) {
                intensity = '噩梦';
                intensityColor = '#f0f';
            } else if (gameState.floor >= 15) {
                intensity = '地狱';
                intensityColor = '#f00';
            } else if (gameState.floor >= 10) {
                intensity = '困难';
                intensityColor = '#f80';
            } else if (gameState.floor >= 5) {
                intensity = '精英';
                intensityColor = '#fa0';
            }
            
            // 层数 - 根据层数着色
            const floorEl = document.getElementById('info-floor');
            floorEl.textContent = gameState.floor;
            if (gameState.floor >= 15) floorEl.style.color = '#f00';
            else if (gameState.floor >= 10) floorEl.style.color = '#f80';
            else if (gameState.floor >= 5) floorEl.style.color = '#fa0';
            else floorEl.style.color = '#0ff';
            
            // 层数卡片边框随层数变化
            const floorCard = floorEl.closest('.floor-card');
            if (floorCard) floorCard.style.borderColor = intensityColor + '66';
            
            // 强度
            const enemyEl = document.getElementById('info-enemy');
            
            // Boss 层特殊显示
            if (gameState.isBossFloor && gameState.enemies.length > 0) {
                const boss = gameState.enemies.find(e => e.isBoss);
                if (boss) {
                    enemyEl.textContent = boss.name;
                    enemyEl.style.color = '#f00';
                    enemyEl.style.fontSize = '11px';
                    // Boss 卡片红色边框
                    const bossCard = enemyEl.closest('.floor-card');
                    if (bossCard) { bossCard.style.borderColor = '#f00'; bossCard.style.background = '#1a0000'; }
                }
            } else if (gameState.isShopFloor) {
                // 商店层特殊显示
                enemyEl.textContent = '商店层';
                enemyEl.style.color = '#0f0';
                enemyEl.style.fontSize = '11px';
                const shopCard = enemyEl.closest('.floor-card');
                if (shopCard) { shopCard.style.borderColor = '#0f0'; shopCard.style.background = '#001a00'; }
            } else {
                enemyEl.textContent = intensity;
                enemyEl.style.color = intensityColor;
                enemyEl.style.fontSize = '15px';
                // 重置卡片样式
                const normalCard = enemyEl.closest('.floor-card');
                if (normalCard) { normalCard.style.borderColor = '#333'; normalCard.style.background = '#0a0a0a'; }
            }
            
            // 敌人数 - 有敌人时高亮
            const enemiesEl = document.getElementById('info-enemies');
            enemiesEl.textContent = gameState.enemies.length;
            if (gameState.enemies.length > 3) enemiesEl.style.color = '#f55';
            else if (gameState.enemies.length > 0) enemiesEl.style.color = '#fa0';
            else enemiesEl.style.color = '#666';
            
            // 宝箱数 - 有宝箱时高亮
            const chestsEl = document.getElementById('info-chests');
            chestsEl.textContent = gameState.chests.length;
            if (gameState.chests.length > 0) chestsEl.style.color = '#ffd700';
            else chestsEl.style.color = '#666';
            
            // 当前主题
                        const themeObj = CONFIG.THEMES[gameState.theme] || CONFIG.THEMES.abyss;
                        const themeEl = document.getElementById('info-theme');
                        // 如果有环境效果，主题行改为显示环境效果
                        if (gameState.envEffect) {
                            themeEl.textContent = `${gameState.envEffect.icon} ${gameState.envEffect.name}`;
                            themeEl.style.color = gameState.envEffect.color;
                        } else {
                            themeEl.textContent = `${themeObj.icon} ${themeObj.name}`;
                            themeEl.style.color = themeObj.accentColor;
                        }
                        // 环境效果边框颜色
                        const gameView = document.getElementById('game-view');
                        if (gameView) {
                            gameView.style.boxShadow = gameState.envEffect
                                ? `0 0 16px ${gameState.envEffect.color}44, inset 0 0 16px ${gameState.envEffect.color}22`
                                : '';
                        }
                    }
        
        // ==================== 玩家移动 ====================
        function movePlayer(dx, dy) {
            if (gameState.isGameOver) return;
            if (gameState.animating) return;
            
            const newX = gameState.player.x + dx;
            const newY = gameState.player.y + dy;
            
            // 边界检查
            if (newX < 0 || newX >= CONFIG.MAP_WIDTH || newY < 0 || newY >= CONFIG.MAP_HEIGHT) {
                return;
            }
            
            // 墙壁检查（速度药水/穿墙无视碰撞）
                                    if (gameState.map[newY][newX] === '#' && !(gameState.player._speedPotion > 0) && !gameState.player._phaseWalk) {
                            sfx.play('wall');
                            return;
                        }
            
            // 敌人检查
                        const enemyIndex = gameState.enemies.findIndex(e => e !== null && e.x === newX && e.y === newY);
            // 稀有怪捕获
                                                if (gameState.rareMonster && newX === gameState.rareMonster.x && newY === gameState.rareMonster.y) {
                                                    captureRareMonster();
                                                    return;
                                                }

            if (enemyIndex !== -1) {
                launchAttackEffect(enemyIndex);
                return;
            }
            
            // 药水检查 → 显示拾取弹窗
                        const potionIndex = gameState.potions.findIndex(p => p.x === newX && p.y === newY);
                        if (potionIndex !== -1) {
                            gameState.player.x = newX;
                            gameState.player.y = newY;
                            showPotionPickup(potionIndex);
                            renderMap();
                            updateStatusBar();
                            return;
                        }
            
            // 宝箱检查
            const chestIndex = gameState.chests.findIndex(c => c.x === newX && c.y === newY);
            if (chestIndex !== -1) {
                const chest = gameState.chests[chestIndex];
                if (chest.type === 'key') {
                    // 钥匙：自动拾取，玩家移动到钥匙位置（不解锁，钥匙进入背包）
                    gameState.chests.splice(chestIndex, 1);
                    gameState.keyPicked = true;
                    gameState._keyDropped = false;  // 重置钥匙掉落标记
                    addLog(`🔑 拾取了钥匙！走到锁住的传送门上自动解锁。`, 'log-gain');
                    gameState.player.x = newX;
                    gameState.player.y = newY;
                    sfx.play('chest');
                    renderMap();
                    updateStatusBar();
                    return;
                } else {
                    openChest(chestIndex);
                    // 打开宝箱后不移动，停留在原地
                    renderMap();
                    updateStatusBar();
                    return;
                }
            }
            
            // 商店层：检查 NPC 接触
            if (gameState.isShopFloor && gameState.shopNPCs) {
                const npc = gameState.shopNPCs.find(n => n.x === newX && n.y === newY);
                if (npc) {
                    // 不移动，而是打开商店弹窗
                    openShop(npc);
                    return;
                }
            }
            
            // 城堡：NPC 交互 + 传送门
                        if (gameState.floor === 0) {
                            // 装饰物不可穿越
                            if (gameState.castleDecorations) {
                                const blocked = gameState.castleDecorations.find(d => d.x === newX && d.y === newY && d.blocking !== false);
                                if (blocked) {
                                    sfx.play('wall');
                                    return;
                                }
                            }
                            // 碰到城堡 NPC
                            const cnpc = gameState.castleNPCs.find(n => n.x === newX && n.y === newY);
                if (cnpc) {
                    interactCastleNPC(cnpc);
                    return;
                }
                // 碰到传送门
                if (newX === gameState.castlePortal.x && newY === gameState.castlePortal.y) {
                    enterDungeon();
                    return;
                }
            }
            
                        // 事件 NPC 交互
                                    if (gameState.eventNPC && newX === gameState.eventNPC.x && newY === gameState.eventNPC.y) {
                                        triggerEventNPC();
                                        return;
                                    }

                                    // 特殊房间：宝藏室拾取金币
                                    if (gameState.specialRoom && gameState.specialRoom.type === 'treasure' && gameState.treasureCoins) {
                                        const coinIdx = gameState.treasureCoins.findIndex(c => c.x === newX && c.y === newY);
                                        if (coinIdx !== -1) {
                                            const e1lv = getTalentLevel('e1') || 1;
                                            const goldAmt = Math.floor((5 + Math.floor(Math.random() * 10) + gameState.floor) * (1 + [0, 0.5, 1.0, 1.5][e1lv - 1]));
                                            gameState.gold += goldAmt;
                                            gameState.treasureCoins.splice(coinIdx, 1);
                                            addLog(`💰 捡到 ${goldAmt} 金币！剩余 ${gameState.treasureCoins.length} 个`, 'log-gain');
                                            sfx.play('heal');
                                            gameState.player.x = newX; gameState.player.y = newY;
                                            renderMap(); updateStatusBar();
                                            return;
                                        }
                                    }
                                    // 特殊房间：竞技场 - 通过combat处理
                                    // 特殊房间：祭坛交互
                                    if (gameState.specialRoom && gameState.specialRoom.type === 'altar') {
                                        const cx = Math.floor(CONFIG.MAP_WIDTH/2), cy = Math.floor(CONFIG.MAP_HEIGHT/2);
                                        if (newX === cx && newY === cy) { openAltar(); return; }
                                    }
                                    // 特殊房间：图书馆交互
                                    if (gameState.specialRoom && gameState.specialRoom.type === 'library') {
                                        const cx = Math.floor(CONFIG.MAP_WIDTH/2), cy = Math.floor(CONFIG.MAP_HEIGHT/2);
                                        if (newX === cx && newY === cy) { openLibrary(); return; }
                                                                            }
                                                                            // 特殊房间：赌博商人 (v3.28.0)
                                                                            if (gameState.specialRoom && gameState.specialRoom.type === 'gamble') {
                                                                                const cx = Math.floor(CONFIG.MAP_WIDTH/2), cy = Math.floor(CONFIG.MAP_HEIGHT/2);
                                                                                if (newX === cx && newY === cy) { rollGamble(); return; }
                                                                            }
                                                                            // 特殊房间：时空裂缝 (v3.28.0)
                                                                            if (gameState.specialRoom && gameState.specialRoom.type === 'rift') {
                                                                                const cx = Math.floor(CONFIG.MAP_WIDTH/2), cy = Math.floor(CONFIG.MAP_HEIGHT/2);
                                                                                if (newX === cx-1 && newY === cy) { chooseRiftDoor(true); return; }
                                                                                if (newX === cx+1 && newY === cy) { chooseRiftDoor(false); return; }
                                                                            }
                                                                            // 特殊房间：训练场 (v3.28.0)
                                                                            if (gameState.specialRoom && gameState.specialRoom.type === 'training') {
                                                                                const cx = Math.floor(CONFIG.MAP_WIDTH/2), cy = Math.floor(CONFIG.MAP_HEIGHT/2);
                                                                                if (newX === cx && newY === cy && !gameState.specialRoom.state.used) {
                                                                                    gameState.isTrainingMode = true;
                                                                                    gameState.specialRoom.state.used = true;
                                                                                    addLog('🏋️ 进入训练模式！HP不会真正减少', 'log-system');
                                                                                    // 让玩家自动遭遇幻影
                                                                                    gameState.player.x = newX; gameState.player.y = newY;
                                                                                    const enemyIdx = gameState.enemies.findIndex(e => e && e.isTrainingDummy);
                                                                                    if (enemyIdx !== -1) combat(enemyIdx);
                                                                                    renderMap(); updateStatusBar();
                                                                                    return;
                                                                                }
                                                                            }
                                                                            // 特殊房间：许愿井 (v3.28.0)
                                                                            if (gameState.specialRoom && gameState.specialRoom.type === 'well') {
                                                                                const cx = Math.floor(CONFIG.MAP_WIDTH/2), cy = Math.floor(CONFIG.MAP_HEIGHT/2);
                                                                                if (newX === cx && newY === cy) {
                                                                                    showWellModal();
                                                                                    return;
                                                                                }
                                                                            }
            
            // 回城传送门：返回城堡，保存当前楼层
                        if (gameState.castleReturnPortal && newX === gameState.castleReturnPortal.x && newY === gameState.castleReturnPortal.y) {
                            gameState.savedFloor = gameState.floor;
                            gameState.floor = 0;
                            gameState.theme = 'castle';
                            gameState.castleReturnPortal = null;
                            addLog('🏰 你穿过传送门，回到了勇者大厅', 'log-system');
                                                        sfx.play('floor');
                                                        generateCastle(true);  // returnVisit=true，玩家放传送门旁
                                                                                    renderMap();
                                                                                    updateStatusBar();
                                                                                    autosaveGame();
                                                                                    return;
                        }
            
                        // 出口检查
            if (newX === gameState.exit.x && newY === gameState.exit.y) {
                // 钥匙系统：锁门拦截 + 自动解锁（v3.42.0）
                if (gameState.exitLocked && !gameState.keyPicked && !gameState.isBossFloor && !gameState.isShopFloor && !gameState.specialRoom) {
                    addLog('🔒 出口已被锁住，需要钥匙才能进入！', 'log-system');
                    return;
                }
                if (gameState.exitLocked && gameState.keyPicked && !gameState.isBossFloor && !gameState.isShopFloor && !gameState.specialRoom) {
                    gameState.exitLocked = false;
                    gameState.keyPicked = false;
                    addLog('🔑 钥匙自动插入锁孔，出口已解锁！传送门开启！', 'log-gain');
                    sfx.play('chest');
                    renderMap();
                    updateStatusBar();
                    return;
                }
                // 正常传送逻辑
                gameState.floor++;
                                // 清除本层药水效果
                                const p = gameState.player;
                                if (p._powerPotion) { p._powerPotion = false; addLog('💪 力量药水效果消失', 'log-system'); }
                                if (p._greedLure) { p._greedLure = false; p._goldBoost = 0; addLog('🎣 贪婪诱饵效果消失', 'log-system'); }
                                if (p._berserker) { p._berserker = false; addLog('🩸 狂战士之血效果消失', 'log-system'); }
                                if (p._phaseWalk) { p._phaseWalk = false; addLog('🏃 穿墙效果消失', 'log-system'); }
                                addLog(`=== 进入第 ${gameState.floor} 层 ===`, 'log-system');
                
// 牧师：每层恢复 5% HP
                const clsFloor = classCfg();
let healPercent = clsFloor.floorHealPercent || 0;
                // 天赋：再生 + 词缀再生
                healPercent += [0, 0.03, 0.06, 0.10][getTalentLevel('s2')];
                healPercent += sumAffixBonuses().regen / 100;
                if (healPercent > 0) {
                    const totalMaxHpForHeal = gameState.player.maxHp + sumEquipHp();
                    const healAmt = Math.floor(totalMaxHpForHeal * healPercent);
                    const actualHeal = Math.min(healAmt, totalMaxHpForHeal - gameState.player.hp);
                    if (actualHeal > 0) {
                        gameState.player.hp += actualHeal;
                        addLog(`✨ 圣光祝福：恢复了 ${actualHeal} 点 HP`, 'log-gain');
                    }
                }
                
                sfx.play('floor');
                tickSkillCooldown();
                generateMap();
                                renderMap();
                                updateStatusBar();
                                autosaveGame();
                                gameState.floorStartKills = gameState.runKills;  // 本层起始击杀
                                return;
                            }
            
                            // 移动玩家
                        gameState.player.x = newX;
                                                gameState.player.y = newY;
                                                gameState.achievementStats.steps++;
                                                                        if (gameState.achievementStats.steps % 100 === 0) checkAchievements();
                                                                        // 稀有怪逃跑移动
                                                                        if (gameState.rareMonster) {
                                                                            gameState.rareMonster.turnsLeft--;
                                                                            if (gameState.rareMonster.turnsLeft <= 0) {
                                                                                addLog('💎 稀有幻影消失了...', 'log-system');
                                                                                gameState.rareMonster = null;
                                                                            } else {
                                                                                // 随机移动1格（避开墙壁/敌人/玩家）
                                                                                const dirs = [[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[-1,1],[1,-1],[1,1]];
                                                                                const rm = gameState.rareMonster;
                                                                                const shuffled = dirs.sort(() => Math.random() - 0.5);
                                                                                for (const [dx, dy] of shuffled) {
                                                                                    const nx = rm.x + dx, ny = rm.y + dy;
                                                                                    if (nx > 0 && nx < CONFIG.MAP_WIDTH-1 && ny > 0 && ny < CONFIG.MAP_HEIGHT-1 &&
                                                                                        gameState.map[ny] && gameState.map[ny][nx] === '.' &&
                                                                                        !(nx === gameState.player.x && ny === gameState.player.y) &&
                                                                                        !gameState.enemies.some(e => e && e.x === nx && e.y === ny)) {
                                                                                        rm.x = nx; rm.y = ny; break;
                                                                                    }
                                                                                }
                                                                            }
                                                                            renderMap();
                                                                        }
                                                                        // 诅咒装备HP流失
                                                                        let curseDrain = 0;
                                                                        for (const slot of Object.values(gameState.player.equipment)) {
                                                                            if (slot && slot.cursed && slot.cursePenalty && slot.cursePenalty.hpDrainPct) {
                                                                                curseDrain += slot.cursePenalty.hpDrainPct;
                                                                            }
                                                                        }
                                                                        if (curseDrain > 0 && !gameState.godMode) {
                                                                            const drainAmt = Math.max(1, Math.floor((gameState.player.maxHp + sumEquipHp()) * curseDrain / 100));
                                                                            gameState.player.hp = Math.max(1, gameState.player.hp - drainAmt);
                                                                        }

                        // 环境效果：毒雾 — 每步掉血 5% 最大HP（至少1点）
                        if (gameState.envEffect && gameState.envEffect.id === 'poisonMist' && !gameState.godMode) {
                            const poisonDmg = Math.max(1, Math.floor((gameState.player.maxHp + sumEquipHp()) * 0.05));
                            gameState.player.hp = Math.max(0, gameState.player.hp - poisonDmg);
                            if (gameState.player.hp <= 0) { gameOver(); return; }
                        }

                        // 移动动画：足迹粒子 + 地图微震
                        const oldPx = gameState.player.x, oldPy = gameState.player.y;
                        sfx.play('walk');
                        spawnFootstepParticles(oldPx, oldPy);
                        triggerMapShake(dx, dy);
                        gameState._stepping = true;
            
                                    // 速度药水：穿墙判定 + 回合递减
                                    if (gameState.player._speedPotion > 0) {
                                        gameState.player._speedPotion--;
                                        if (gameState.player._speedPotion <= 0) addLog('⚡ 速度药水效果消失', 'log-system');
                                    }
                                    // 荆棘反伤回合递减
                                    if (gameState.player._thornsTurns > 0) {
                                        gameState.player._thornsTurns--;
                                        if (gameState.player._thornsTurns <= 0) addLog('🛡️ 荆棘反伤效果消失', 'log-system');
                                    }

                                    renderMap();
            updateStatusBar();
                    }

                    // ==================== 许愿井弹窗 (v3.28.0) ====================
        function showWellModal() {
            if (gameState.wellUsed) { addLog('🌟 许愿井已经使用过了...', 'log-system'); return; }
            const modal = document.getElementById('well-modal');
            let html = '<div style="text-align:center;color:#ff0;font-size:18px;font-weight:bold;margin-bottom:12px;">🌟 许愿井</div>';
            html += '<div style="color:#aaa;font-size:12px;margin-bottom:10px;">投入金币，许愿获得装备！</div>';
            html += `<div style="color:#ffd700;margin-bottom:10px;">💰 持有金币：${gameState.gold}G</div>`;
            CONFIG.WELL_TIERS.forEach((tier, idx) => {
                const canAfford = gameState.gold >= tier.cost;
                let desc = tier.legendary ? '100%获得传奇装备' : (tier.equipChance >= 1 ? '100%获得装备' : `${Math.round(tier.equipChance*100)}%获得装备`);
                html += `<button onclick="document.getElementById('well-modal').style.display='none';gameState.shopOpen=false;makeWish(${idx})" 
                    style="display:block;width:100%;padding:10px;margin:6px 0;background:${canAfford?'#1a1a00':'#111'};border:2px solid ${canAfford?'#ffd700':'#555'};border-radius:8px;color:${canAfford?'#ffd700':'#666'};font-size:14px;cursor:${canAfford?'pointer':'not-allowed'};text-align:left;"
                    ${canAfford?'':'disabled'}>
                    💰 ${tier.name} ${tier.cost}G — ${desc}
                </button>`;
            });
            html += '<button onclick="document.getElementById(\'well-modal\').style.display=\'none\';gameState.shopOpen=false" style="margin-top:8px;padding:8px 20px;background:#333;color:#aaa;border:1px solid #555;border-radius:4px;cursor:pointer;width:100%;">[ESC] 离开</button>';
            document.getElementById('well-content').innerHTML = html;
            modal.style.display = 'flex';
            gameState.shopOpen = true;
        }
                    let _pendingPotionIdx = -1; // 当前拾取中的药水索引

function getPotionEffectDesc(id) {
    const p = gameState.player;
    const totalMaxHp = p.maxHp + sumEquipHp();
    const totalAtk = p.atk + sumEquipAtk();
    switch (id) {
        case 'health': { const h = Math.floor(totalMaxHp * 0.30); return `恢复 ${h} HP（30% × ${totalMaxHp}）`; }
        case 'mana': return `主动技能冷却-2（当前${gameState.skillCooldown}层）`;
        case 'shield': return `获得 20 护盾（当前${p.shield || 0}）`;
        case 'speed': return '本层无视碰撞 3 回合';
        case 'power': { const b = Math.floor(totalAtk * 0.30); return `本层攻击力 +${b}（30% × ${totalAtk}）`; }
        case 'aoePoison': return `全图 ${gameState.enemies.length} 只敌人追加中毒`;
        case 'greedLure': return '本层掉落+200% · 怪物攻击+30%';
        case 'chronos': return '下次致命伤害保留 1 HP（一次性）';
        case 'berserker': {
            const ba = Math.floor(totalAtk * 0.50);
            const bc = Math.max(1, Math.floor(totalMaxHp * 0.05));
            return `攻击+50%（+${ba}）暴击+20% · 每次攻击扣 ${bc} HP`;
        }
        case 'thorns': return '5 回合反弹 50% 伤害 + 等额护盾';
        case 'gamble': return '⚠️ 随机生成一瓶未知效果药水';
        default: return '';
    }
}

function showPotionPickup(idx) {
    if (gameState.isGameOver) return;
    _pendingPotionIdx = idx;
    const potion = gameState.potions[idx];
    const ptCfg = (CONFIG.POTION_TYPES || []).find(pt => pt.id === potion.type) || {};
    const modal = document.getElementById('potion-pickup-modal');
    document.getElementById('pp-icon').textContent = ptCfg.icon || '🧪';
    document.getElementById('pp-name').textContent = ptCfg.name || '未知药水';
    document.getElementById('pp-desc').textContent = getPotionEffectDesc(potion.type) || ptCfg.desc || '';
    const beltFull = gameState.potionBelt.filter(p => p !== null).length >= (CONFIG.POTION_BELT_MAX || 4);
    document.getElementById('pp-belt-warning').style.display = beltFull ? 'block' : 'none';
    const slotsDiv = document.getElementById('pp-belt-slots');
    if (beltFull) {
        slotsDiv.style.display = 'flex';
        slotsDiv.style.gap = '4px';
        slotsDiv.style.justifyContent = 'center';
        let html = '<span style="color:#aaa;font-size:11px;">替换哪个？</span>';
        gameState.potionBelt.forEach((bp, i) => {
            const bCfg = bp ? (CONFIG.POTION_TYPES || []).find(pt => pt.id === bp.type) : null;
            const bDesc = bp ? getPotionEffectDesc(bp.type) : '';
            html += `<button onclick="choosePotionAction('replace',${i})" style="padding:4px 8px;background:#1a1a0a;border:1px solid #ffd700;border-radius:4px;color:#ffd700;font-size:12px;cursor:pointer;" title="${bDesc}">${bCfg ? bCfg.icon : '—'} ${bCfg ? bCfg.name : '空'}</button>`;
        });
        slotsDiv.innerHTML = html;
        document.getElementById('pp-belt-btn').textContent = '🔄 替换背包';
    } else {
        slotsDiv.style.display = 'none';
        document.getElementById('pp-belt-btn').textContent = '🎒 放入背包';
    }
    modal.style.display = 'flex';
    gameState.shopOpen = true;
}

function choosePotionAction(action, replaceIdx) {
    const modal = document.getElementById('potion-pickup-modal');
    modal.style.display = 'none';
    const potion = gameState.potions[_pendingPotionIdx];
    if (!potion) { gameState.shopOpen = false; return; }
    const ptCfg = (CONFIG.POTION_TYPES || []).find(pt => pt.id === potion.type) || {};

    if (action === 'drink') {
        drinkPotion(potion);
        gameState.potions.splice(_pendingPotionIdx, 1);
    } else if (action === 'belt') {
        const icon = ptCfg.icon || potion.icon || '🧪';
        const name = ptCfg.name || '未知药水';
        const beltFull = gameState.potionBelt.filter(p => p !== null).length >= (CONFIG.POTION_BELT_MAX || 4);
        if (beltFull) {
            const targetIdx = (replaceIdx !== undefined && replaceIdx >= 0) ? replaceIdx : 0;
            const oldPotion = gameState.potionBelt[targetIdx];
            const oldCfg = oldPotion ? (CONFIG.POTION_TYPES || []).find(pt => pt.id === oldPotion.type) : null;
            gameState.potionBelt[targetIdx] = { type: potion.type, icon: icon, name: name, color: ptCfg.color || potion.color || '#0f0' };
            gameState.potions.splice(_pendingPotionIdx, 1);
            addLog(`🔄 替换了${oldCfg ? oldCfg.icon+' '+oldCfg.name : '空槽'}，放入${icon} ${name}`, 'log-item');
        } else {
            const emptySlot = gameState.potionBelt.findIndex(p => p === null);
            if (emptySlot !== -1) {
                gameState.potionBelt[emptySlot] = { type: potion.type, icon: icon, name: name, color: ptCfg.color || potion.color || '#0f0' };
                gameState.potions.splice(_pendingPotionIdx, 1);
                addLog(`🎒 ${icon} ${name} 已放入背包`, 'log-item');
            }
        }
    } else if (action === 'replace' && replaceIdx !== undefined) {
        choosePotionAction('belt', replaceIdx);
        return;
    } else {
        gameState.potions.splice(_pendingPotionIdx, 1);
        addLog(`🗑️ 丢弃了${ptCfg.icon || potion.icon || '🧪'} ${ptCfg.name || '未知药水'}`, 'log-system');
    }

    _pendingPotionIdx = -1;
    gameState.shopOpen = false;
    renderPotionBelt();
    renderMap();
    updateStatusBar();
}

                    function drinkPotion(potion) {
                        const ptCfg = (CONFIG.POTION_TYPES || []).find(pt => pt.id === potion.type) || {};
                        const p = gameState.player;
                        const totalMaxHp = p.maxHp + sumEquipHp();
                        addLog(`🧪 喝下了${ptCfg.icon || potion.icon || '🧪'} ${ptCfg.name || '未知药水'}`, 'log-item');
                        sfx.play('heal');

                        // 毒雾中使用药水追踪
                        if (gameState.envEffect && gameState.envEffect.id === 'poisonMist') {
                            gameState.achievementStats.poisonPotionUses++;
                            checkAchievements();
                        }

                        switch (potion.type) {
                            case 'health': {
                                const clsHeal = classCfg();
                                const healBonus = 1 + (clsHeal.potionBonus || 0) + (clsHeal.healBonus || 0) + sumAffixBonuses().heal / 100 + [0, 0.20, 0.40, 0.60][getTalentLevel('s4')];
                                const healAmt = Math.floor(totalMaxHp * 0.30 * healBonus);
                                p.hp = Math.min(p.hp + healAmt, totalMaxHp);
                                addLog(`  ❤️ 恢复了 ${healAmt} 点 HP`, 'log-gain');
                                break;
                            }
                            case 'mana':
                                gameState.skillCooldown = Math.max(0, gameState.skillCooldown - 2);
                                addLog(`  💙 技能冷却减少2层 (剩余${gameState.skillCooldown}层)`, 'log-gain');
                                break;
                            case 'shield':
                                p.shield = (p.shield || 0) + 20;
                                p.maxShield = Math.max(p.maxShield || 0, p.shield);
                                addLog(`  🛡️ 获得20护盾 (当前${p.shield})`, 'log-gain');
                                break;
                            case 'speed':
                                p._speedPotion = 3;
                                addLog(`  ⚡ 获得穿墙能力，持续3回合`, 'log-gain');
                                break;
                            case 'power':
                                p._powerPotion = true;
                                addLog(`  💪 本层攻击力+30%`, 'log-gain');
                                break;
                            case 'aoePoison':
                                gameState.enemies.forEach(e => {
                                    if (e && !e.isBoss) e.poisoned = Math.max(e.poisoned || 0, 3);
                                });
                                addLog(`  ☠️ 全图敌人中毒！`, 'log-gain');
                                break;
                            case 'greedLure':
                                p._greedLure = true;
                                p._goldBoost = 2.0;
                                addLog(`  🎣 金币掉落+200%，怪物攻击+30%！`, 'log-gain');
                                break;
                            case 'chronos':
                                p._chronosTonic = true;
                                addLog(`  🕰️ 获得时空庇护：下次致命伤害保留1HP`, 'log-gain');
                                break;
                            case 'berserker':
                                p._berserker = true;
                                addLog(`  🩸 狂战士之血：攻击+50%暴击+20%，每次攻击扣5%HP`, 'log-gain');
                                break;
                            case 'thorns':
                                p._thornsTurns = 5;
                                addLog(`  🛡️ 荆棘反伤：5回合内反弹50%伤害+等额护盾`, 'log-gain');
                                break;
                            case 'gamble': {
                                // 随机选一个其他药水效果
                                const otherTypes = CONFIG.POTION_TYPES.filter(pt => pt.id !== 'gamble');
                                const randomType = otherTypes[Math.floor(Math.random() * otherTypes.length)];
                                const fakePotion = { type: randomType.id };
                                addLog(`  📦 盲盒开出：${randomType.icon} ${randomType.name}！`, 'log-gain');
                                drinkPotion(fakePotion);
                                return; // drinkPotion 内部已处理日志
                            }
                        }
                        renderPotionBelt();
                        updateStatusBar();
                    }

                    function usePotionFromBelt(index) {
                        if (gameState.isGameOver || gameState.shopOpen || gameState.animating) return;
                        if (document.getElementById('levelup-modal').style.display === 'flex') return;
                        if (document.getElementById('equip-compare-modal').style.display === 'flex') return;
                        const potion = gameState.potionBelt[index];
                        if (!potion) return;
                        drinkPotion(potion);
                        gameState.potionBelt[index] = null;
                        renderPotionBelt();
                        updateStatusBar();
                    }

                    function renderPotionBelt() {
                        for (let i = 0; i < (CONFIG.POTION_BELT_MAX || 4); i++) {
                            const slotEl = document.getElementById('pbelt-' + i);
                            if (!slotEl) continue;
                            const iconEl = slotEl.querySelector('.pb-icon');
                            const potion = gameState.potionBelt[i];
                            if (potion) {
                                iconEl.textContent = potion.icon || '🧪';
                                iconEl.style.color = potion.color || '#0f0';
                                slotEl.classList.add('has-potion');
                                if (potion.type === 'aoePoison') slotEl.classList.add('poison-slot');
                                else slotEl.classList.remove('poison-slot');
                                slotEl.title = potion.name + ' - ' + getPotionEffectDesc(potion.type);
                            } else {
                                iconEl.textContent = '—';
                                iconEl.style.color = '#666';
                                slotEl.classList.remove('has-potion', 'poison-slot');
                                slotEl.title = '空槽';
                            }
                        }
                    }

                // 捕获稀有幻影 (v3.43.3 提取到外部)
                function captureRareMonster() {
                    const rewards = [
                        { name:'天赋点', icon:'⭐', act:() => { gameState.talentPoints += 1 + Math.floor(Math.random()*2); return gameState.talentPoints; } },
                        { name:'工匠点数', icon:'🔨', act:() => { const pts = 5 + Math.floor(Math.random()*11); META.addPoints(pts); return pts; } },
                        { name:'全图揭示', icon:'👁️', act:() => { for(let y=1;y<CONFIG.MAP_HEIGHT-1;y++)for(let x=1;x<CONFIG.MAP_WIDTH-1;x++)if(gameState.map[y][x]==='#')gameState.map[y][x]='.'; renderMap(); return '已揭示'; } },
                        { name:'力量强化', icon:'💪', act:() => { gameState.player.atk += Math.floor(gameState.player.atk*0.25); gameState.player.def += Math.floor(gameState.player.def*0.25); return '本层ATK/DEF+25%'; } },
                        { name:'穿墙', icon:'🏃', act:() => { gameState.player._phaseWalk = true; return '本层无视碰撞'; } },
                        { name:'升级', icon:'⬆️', act:() => { gameState.player.exp += CONFIG.EXP_BASE * gameState.player.level; checkLevelUp(); return '获得经验'; } },
                        { name:'诅咒装备', icon:'🎲', act:() => { const eq = generateEquipment(); CURSE.apply(eq); gameState.player.equipment[eq.type] = eq; return eq.name; } },
                        { name:'金币', icon:'💰', act:() => { const g = gameState.floor * 20; gameState.gold += g; return `${g}G`; } },
                    ];
                    const count = 1 + (Math.random() < 0.4 ? 1 : 0);
                    const picked = [...rewards].sort(() => Math.random() - 0.5).slice(0, count);
                    addLog('💎 捕获了稀有幻影！', 'log-gain');
                    picked.forEach(r => {
                        const val = r.act();
                        addLog(`  ${r.icon} ${r.name}: ${val}`, 'log-gain');
                    });
                    gameState.rareMonster = null;
                    sfx.play('chest');
                    updateStatusBar();
                    renderMap();
                }
