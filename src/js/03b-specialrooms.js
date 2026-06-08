                // ==================== 特殊房间生成器 ====================

                // 宝藏室：满地金币，走路拾取
                function generateTreasureRoom() {
                    gameState.enemies = [];
                    gameState.potions = [];
                    gameState.chests = [];
                    gameState.isBossFloor = false;
                    gameState.isShopFloor = false;
                    // 生成金币阵列（覆盖 floor 区域）
                    gameState.treasureCoins = [];
                    const coinCount = 15 + Math.floor(Math.random() * 15); // 15-30 金币
                    const walkable = [];
                    for (let y = 1; y < CONFIG.MAP_HEIGHT - 1; y++) {
                        for (let x = 1; x < CONFIG.MAP_WIDTH - 1; x++) {
                            if (gameState.map[y][x] === '.') walkable.push({x,y});
                        }
                    }
                    shuffleArray(walkable);
                    for (let i = 0; i < coinCount && i < walkable.length; i++) {
                        gameState.treasureCoins.push(walkable[i]);
                    }
                    // 出口直接可见
                    if (walkable.length > coinCount) {
                        gameState.exit = walkable[coinCount];
                    }
                }

                // 竞技场：矩形房间，3波怪物
                function generateArena() {
                                    gameState.enemies = [];
                                    gameState.potions = [];
                                    gameState.chests = [];
                                    gameState.isBossFloor = false;
                                    gameState.isShopFloor = false;
                                    gameState.specialRoom.state = { wave: 0, maxWaves: 3, cleared: false, exitPos: { x: Math.floor(CONFIG.MAP_WIDTH/2), y: CONFIG.MAP_HEIGHT - 2 } };
                                    gameState.exit = { x: -1, y: -1 }; // 未清完不可离开
                    // 在房间内放置第一波怪物（远离玩家）
                    spawnArenaWave(1);
                }

                function spawnArenaWave(waveNum) {
                    gameState.enemies = [];
                    gameState.specialRoom.state.wave = waveNum;
                    const scale = 1 + (gameState.floor - 1) * 0.35;
                    const enemyPool = CONFIG.THEME_ENEMIES[gameState.theme] || CONFIG.THEME_ENEMIES.abyss;
                    const count = 2 + waveNum; // 波1=3只, 波2=4只, 波3=5只
                    // 收集远离玩家(3格+)的空位
                    const farPositions = [];
                    for (let y = 1; y < CONFIG.MAP_HEIGHT - 1; y++) {
                        for (let x = 1; x < CONFIG.MAP_WIDTH - 1; x++) {
                            if (gameState.map[y][x] === '.' &&
                                (Math.abs(x - gameState.player.x) > 3 || Math.abs(y - gameState.player.y) > 3)) {
                                farPositions.push({x,y});
                            }
                        }
                    }
                    shuffleArray(farPositions);
                    for (let i = 0; i < count && i < farPositions.length; i++) {
                        const pos = farPositions[i];
                        const type = enemyPool[Math.floor(Math.random() * enemyPool.length)];
                        const atkBoost = 1 + waveNum * 0.3; // 每波攻击+30%
                        gameState.enemies.push({
                            x: pos.x, y: pos.y,
                            hp: Math.floor(CONFIG.BASE_ENEMY_HP * scale * type.hpMod),
                            maxHp: Math.floor(CONFIG.BASE_ENEMY_HP * scale * type.hpMod),
                            atk: Math.floor(CONFIG.BASE_ENEMY_ATK * scale * type.atkMod * atkBoost),
                            def: Math.floor(CONFIG.BASE_ENEMY_DEF * scale * type.defMod),
                            exp: Math.floor(20 * scale * type.expMod * 1.5),
                            gold: Math.floor((Math.random() * 10 + 5) * gameState.floor * 1.5),
                            isBoss: false, isElite: false,
                            name: type.name, emoji: type.emoji,
                            isArena: true,
                        });
                    }
                    addLog(`⚔️ 竞技场 第 ${waveNum}/${gameState.specialRoom.state.maxWaves} 波：${count} 只怪物！`, 'log-danger');
                    sfx.play('boss');
                }

                function checkArenaClear() {
                    if (gameState.enemies.length === 0) {
                        const state = gameState.specialRoom.state;
                        if (state.wave >= state.maxWaves) {
                            // 全部清完！给奖励
                            gameState.specialRoom.state.cleared = true;
                            gameState.exit = gameState.specialRoom.state.exitPos;
                            addLog('🏆 竞技场通关！一件传奇装备作为奖励！', 'log-gain');
                            const reward = generateEquipment();
                            reward.quality = Math.max(reward.quality || 4, 4); // 稀有保底
                            const qCfg = CONFIG.QUALITY_CONFIG[reward.quality];
                            reward.name = qCfg.name + reward.name.replace(/^\[.*?\]\s*/, '');
                            // 额外金币
                            gameState.gold += gameState.floor * 30;
                            addLog(`💰 额外获得 ${gameState.floor * 30} 金币！`, 'log-gain');
                            showEquipCompare(reward, (replace) => {
                                if (replace) { gameState.player.equipment[reward.type] = reward; }
                                renderMap(); updateStatusBar();
                            });
                        } else {
                            // 下一波
                            addLog(`⚔️ 第 ${state.wave} 波已清！准备下一波...`, 'log-system');
                            spawnArenaWave(state.wave + 1);
                            renderMap(); updateStatusBar();
                        }
                    }
                }

                // 祭坛：献祭一件装备换取永久属性
                function generateAltar() {
                    gameState.enemies = [];
                    gameState.potions = [];
                    gameState.chests = [];
                    gameState.isBossFloor = false;
                    gameState.isShopFloor = false;
                    gameState.specialRoom.state = { used: false };
                    // 出口可见
                    gameState.exit = { x: Math.floor(CONFIG.MAP_WIDTH/2), y: CONFIG.MAP_HEIGHT - 2 };
                }

                function openAltar() {
                    if (gameState.specialRoom.state.used) {
                        addLog('⛓️ 祭坛已经使用过了...', 'log-system');
                        return;
                    }
                    const p = gameState.player;
                    const slotKeys = Object.keys(CONFIG.EQUIPMENT_SLOTS);
                    const equipped = slotKeys.filter(k => p.equipment[k]);
                    if (equipped.length === 0) {
                        addLog('⛓️ 你没有可以献祭的装备...', 'log-system');
                        return;
                    }
                    let html = '<div style="text-align:center;color:#c6f;font-size:16px;margin-bottom:12px;">⛓️ 选择一件装备献祭给祭坛</div>';
                    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';
                    equipped.forEach(key => {
                        const eq = p.equipment[key];
                        const qCfg = CONFIG.QUALITY_CONFIG[eq.quality] || CONFIG.QUALITY_CONFIG[0];
                        let stats = [];
                        if (eq.atk) stats.push(`🗡️${eq.atk}`);
                        if (eq.def) stats.push(`🛡️${eq.def}`);
                        if (eq.maxHp) stats.push(`❤️${eq.maxHp}`);
                        html += `<div onclick="sacrificeEquip('${key}')" style="cursor:pointer;background:#1a1030;border:2px solid ${qCfg.color};border-radius:8px;padding:10px 14px;min-width:100px;transition:all 0.2s;"
                            onmouseover="this.style.background='#2a2050';this.style.transform='scale(1.05)'"
                            onmouseout="this.style.background='#1a1030';this.style.transform='scale(1)'">
                            <div style="color:${qCfg.color};font-weight:bold;font-size:14px;">${eq.name}</div>
                            <div style="color:#aaa;font-size:12px;">${stats.join(' ')}</div>
                            <div style="color:#c6f;font-size:11px;margin-top:4px;">→ 永久属性加成</div>
                        </div>`;
                    });
                    html += '</div>';
                    html += '<div style="text-align:center;margin-top:12px;"><button onclick="closeAltar()" style="padding:6px 20px;background:#333;color:#aaa;border:1px solid #555;border-radius:4px;cursor:pointer;font-size:14px;">取消</button></div>';
                    document.getElementById('altar-content').innerHTML = html;
                    document.getElementById('altar-modal').style.display = 'flex';
                }
                function sacrificeEquip(slotKey) {
                    const eq = gameState.player.equipment[slotKey];
                    if (!eq) return;
                    const q = eq.quality || 1;
                    const qCfg = CONFIG.QUALITY_CONFIG[q] || CONFIG.QUALITY_CONFIG[1];
                    // 根据品质给永久属性加成
                    const hpBonus = (q + 1) * 8;
                    const atkBonus = Math.floor((q + 1) * 1.5);
                    const defBonus = Math.floor((q + 1) * 1.2);
                    gameState.player.maxHp += hpBonus;
                    gameState.player.hp = Math.min(gameState.player.hp + hpBonus, gameState.player.maxHp + sumEquipHp());
                    gameState.player.atk += atkBonus;
                    gameState.player.def += defBonus;
                    gameState.player.equipment[slotKey] = null;
                    gameState.specialRoom.state.used = true;
                    addLog(`⛓️ 献祭了 ${eq.name}！永久获得 ❤️+${hpBonus} 🗡️+${atkBonus} 🛡️+${defBonus}`, 'log-gain');
                    sfx.play('heal');
                    document.getElementById('altar-modal').style.display = 'none';
                    updateStatusBar();
                }
                function closeAltar() {
                    document.getElementById('altar-modal').style.display = 'none';
                }

                // 图书馆：免费学一个天赋
                function generateLibrary() {
                    gameState.enemies = [];
                    gameState.potions = [];
                    gameState.chests = [];
                    gameState.isBossFloor = false;
                    gameState.isShopFloor = false;
                    gameState.specialRoom.state = { used: false };
                    gameState.exit = { x: Math.floor(CONFIG.MAP_WIDTH/2), y: CONFIG.MAP_HEIGHT - 2 };
                }

                function openLibrary() {
                    if (gameState.specialRoom.state.used) {
                        addLog('📚 你已经在这里学习过了...', 'log-system');
                        return;
                    }
                    // 随机选3个未学满的天赋
                    const available = [];
                    const treeKeys = Object.keys(CONFIG.TALENT_TREES);
                    treeKeys.forEach(treeKey => {
                        const tree = CONFIG.TALENT_TREES[treeKey];
                        (tree.talents || []).forEach(t => {
                            const currentLvl = gameState.unlockedTalents[t.id] || 0;
                            if (currentLvl < (t.maxLevel || 3)) {
                                available.push({ ...t, treeName: tree.name, treeIcon: tree.icon, treeKey });
                            }
                        });
                    });
                    if (available.length === 0) {
                        addLog('📚 所有天赋都已学满！', 'log-system');
                        return;
                    }
                    shuffleArray(available);
                    const choices = available.slice(0, Math.min(3, available.length));
                    let html = '<div style="text-align:center;color:#6cf;font-size:16px;margin-bottom:12px;">📚 选择一项天赋免费学习</div>';
                    html += '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">';
                    choices.forEach(t => {
                        html += `<div onclick="learnLibraryTalent('${t.id}')" style="cursor:pointer;background:#0a1a2a;border:2px solid #6cf;border-radius:8px;padding:12px 16px;min-width:150px;transition:all 0.2s;"
                            onmouseover="this.style.background='#1a2a4a';this.style.transform='scale(1.05)'"
                            onmouseout="this.style.background='#0a1a2a';this.style.transform='scale(1)'">
                            <div style="font-size:24px;margin-bottom:4px;">${t.icon}</div>
                            <div style="color:#ff0;font-weight:bold;font-size:14px;">${t.name}</div>
                            <div style="color:#aaa;font-size:11px;margin-top:4px;">${t.desc || ''}</div>
                            <div style="color:#888;font-size:11px;">${t.treeIcon} ${t.treeName}</div>
                        </div>`;
                    });
                    html += '</div>';
                    html += '<div style="text-align:center;margin-top:12px;"><button onclick="closeLibrary()" style="padding:6px 20px;background:#333;color:#aaa;border:1px solid #555;border-radius:4px;cursor:pointer;font-size:14px;">取消</button></div>';
                    document.getElementById('library-content').innerHTML = html;
                    document.getElementById('library-modal').style.display = 'flex';
                }
                function learnLibraryTalent(talentId) {
                    gameState.unlockedTalents[talentId] = (gameState.unlockedTalents[talentId] || 0) + 1;
                    gameState.specialRoom.state.used = true;
                    const info = getTalentInfo(talentId);
                    addLog(`📚 学会了 ${info.icon} ${info.name} Lv.${gameState.unlockedTalents[talentId]}`, 'log-gain');
                    sfx.play('heal');
                    document.getElementById('library-modal').style.display = 'none';
                    updateTalentPanel(); updateStatusBar();
                }
                function closeLibrary() {
                                                    document.getElementById('library-modal').style.display = 'none';
                                                }

                                        // ==================== 赌博商人 (v3.28.0) ====================
                                        function generateGambleRoom() {
                                            gameState.enemies = [];
                                            gameState.potions = [];
                                            gameState.chests = [];
                                            gameState.isBossFloor = false;
                                            gameState.isShopFloor = false;
                                            gameState.gambleCount = 0;
                                            gameState.exit = { x: Math.floor(CONFIG.MAP_WIDTH/2), y: CONFIG.MAP_HEIGHT - 2 };
                                        }

                                        function rollGamble() {
                                            if (gameState.gold < CONFIG.GAMBLE_COST) { addLog('🎰 金币不足20G！', 'log-system'); return; }
                                            if (gameState.gambleCount >= CONFIG.GAMBLE_MAX_PER_FLOOR) { addLog('🎰 本层已用完3次机会！', 'log-system'); return; }
                                            gameState.gold -= CONFIG.GAMBLE_COST;
                                            gameState.gambleCount++;
                                            const totalWeight = CONFIG.GAMBLE_POOL.reduce((s, item) => s + item.weight, 0);
                                            let roll = Math.random() * totalWeight;
                                            let prize = CONFIG.GAMBLE_POOL[0];
                                            for (const item of CONFIG.GAMBLE_POOL) {
                                                roll -= item.weight;
                                                if (roll <= 0) { prize = item; break; }
                                            }
                                            addLog(`🎰 转动轮盘...（第${gameState.gambleCount}/${CONFIG.GAMBLE_MAX_PER_FLOOR}次）`, 'log-item');
                                            sfx.play('chest');
                                            switch (prize.type) {
                                                case 'nothing': addLog(`  💨 ${prize.msg}`, 'log-system'); break;
                                                case 'gold': gameState.gold += prize.amount; addLog(`  💰 ${prize.msg}`, 'log-gain'); break;
                                                case 'potion': {
                                                    const rTypes = CONFIG.POTION_TYPES.filter(pt => pt.rarity === 'common' || pt.rarity === 'uncommon');
                                                    const rt = rTypes[Math.floor(Math.random() * rTypes.length)];
                                                    const beltFull = gameState.potionBelt.filter(p => p !== null).length >= CONFIG.POTION_BELT_MAX;
                                                    const emptySlot = gameState.potionBelt.findIndex(p => p === null);
                                                    if (!beltFull && emptySlot !== -1) {
                                                        gameState.potionBelt[emptySlot] = { type: rt.id, icon: rt.icon, name: rt.name, color: rt.color };
                                                        addLog(`  🧪 ${prize.msg}（${rt.icon || '🧪'} ${rt.name || '药水'}已放入背包）`, 'log-gain');
                                                    } else {
                                                        addLog(`  🧪 ${prize.msg}（背包已满，丢弃）`, 'log-system');
                                                    }
                                                    break;
                                                }
                                                case 'equipment': {
                                                    const eq = generateEquipment();
                                                    showEquipCompare(eq, (replace) => {
                                                        if (replace) gameState.player.equipment[eq.type] = eq;
                                                        renderMap(); updateStatusBar();
                                                    });
                                                    return; // 提前返回，不要renderPotionBelt
                                                }
                                                case 'talent': gameState.talentPoints++; addLog(`  ⭐ ${prize.msg}`, 'log-gain'); break;
                                                case 'skipBoss': gameState._skipBossToken = true; addLog(`  ${prize.msg}`, 'log-gain'); break;
                                            }
                                            renderPotionBelt();
                                            updateStatusBar();
                                        }

                                        // ==================== 时空裂缝 (v3.28.0) ====================
                                        function generateRiftRoom() {
                                            gameState.enemies = [];
                                            gameState.potions = [];
                                            gameState.chests = [];
                                            gameState.isBossFloor = false;
                                            gameState.isShopFloor = false;
                                            gameState.exit = { x: -1, y: -1 }; // 出口由门的选择决定
                                            // 放置1-2个守卫怪物
                                            const scale = 1 + (gameState.floor - 1) * 0.35;
                                            const enemyPool = CONFIG.THEME_ENEMIES[gameState.theme] || CONFIG.THEME_ENEMIES.abyss;
                                            const guardCount = 1 + (Math.random() < 0.5 ? 1 : 0);
                                            const centerX = Math.floor(CONFIG.MAP_WIDTH/2), centerY = Math.floor(CONFIG.MAP_HEIGHT/2);
                                            const guardPositions = [
                                                { x: centerX-2, y: centerY }, { x: centerX+2, y: centerY },
                                                { x: centerX, y: centerY-1 }, { x: centerX, y: centerY+1 }
                                            ];
                                            for (let i = 0; i < guardCount; i++) {
                                                const pos = guardPositions[i];
                                                const type = enemyPool[Math.floor(Math.random() * enemyPool.length)];
                                                gameState.enemies.push({
                                                    x: pos.x, y: pos.y,
                                                    hp: Math.floor(CONFIG.BASE_ENEMY_HP * scale * type.hpMod),
                                                    maxHp: Math.floor(CONFIG.BASE_ENEMY_HP * scale * type.hpMod),
                                                    atk: Math.floor(CONFIG.BASE_ENEMY_ATK * scale * type.atkMod),
                                                    def: Math.floor(CONFIG.BASE_ENEMY_DEF * scale * type.defMod),
                                                    exp: Math.floor(20 * scale * type.expMod),
                                                    gold: Math.floor((Math.random() * 10 + 5) * gameState.floor),
                                                    isBoss: false, isElite: false,
                                                    name: type.name, emoji: type.emoji,
                                                    isRiftGuard: true,
                                                });
                                            }
                                            addLog(`🕳️ 守卫者挡在门前！击败他们才能选择门`, 'log-danger');
                                        }

                                        function chooseRiftDoor(red) {
                                            if (gameState.enemies.length > 0) { addLog('🕳️ 先击败守卫者！', 'log-system'); return; }
                                            if (red) {
                                                const jump = 3 + Math.floor(Math.random() * 3);
                                                gameState.floor = Math.max(1, gameState.floor + jump);
                                                addLog(`🔴 跃入红色裂缝！跳升${jump}层，到达第${gameState.floor}层`, 'log-gain');
                                                // 高风险奖励：必定高品质宝箱
                                                addLog('🔴 裂缝中浮现了一个远古宝箱！', 'log-gain');
                                                sfx.play('floor');
                                                generateMap();
                                                // 生成一个额外高品质宝箱
                                                if (gameState.chests) {
                                                    const eq = generateEquipment();
                                                    eq.quality = Math.min(8, eq.quality + 3);
                                                    gameState.chests.push({ x: gameState.player.x+1, y: gameState.player.y, content: eq, type: 'equipment' });
                                                }
                                            } else {
                                                gameState.floor = Math.max(1, gameState.floor - 2);
                                                addLog(`🔵 踏入蓝色裂缝！回退2层，到达第${gameState.floor}层`, 'log-system');
                                                sfx.play('floor');
                                                generateMap();
                                            }
                                            // 清除裂缝状态
                                            gameState.specialRoom = null;
                                            renderMap();
                                            updateStatusBar();
                                            renderPotionBelt();
                                        }

                                        // ==================== 训练场 (v3.28.0) ====================
                                        function generateTrainingRoom() {
                                            gameState.enemies = [];
                                            gameState.potions = [];
                                            gameState.chests = [];
                                            gameState.isBossFloor = false;
                                            gameState.isShopFloor = false;
                                            gameState.specialRoom.state = { used: false };
                                            gameState.isTrainingMode = false;
                                            gameState.exit = { x: Math.floor(CONFIG.MAP_WIDTH/2), y: CONFIG.MAP_HEIGHT - 2 };
                                            // 生成幻影敌人
                                            const p = gameState.player;
                                            const scale = 1 + (gameState.floor - 1) * 0.35;
                                            const centerX = Math.floor(CONFIG.MAP_WIDTH/2), centerY = Math.floor(CONFIG.MAP_HEIGHT/2);
                                            gameState.enemies.push({
                                                x: centerX, y: centerY,
                                                hp: Math.floor((p.maxHp + sumEquipHp()) * 1.5),
                                                maxHp: Math.floor((p.maxHp + sumEquipHp()) * 1.5),
                                                atk: Math.floor((p.atk + sumEquipAtk()) * 0.8),
                                                def: Math.floor((p.def + sumEquipDef()) * 0.8),
                                                exp: Math.floor(30 * scale * 3),
                                                gold: 0,
                                                isBoss: false, isElite: false,
                                                name: `${gameState.playerName}的幻影`, emoji: '👤',
                                                isTrainingDummy: true,
                                            });
                                            addLog('🏋️ 一个与你实力相当的幻影出现了！安全对战，不会真正受伤', 'log-system');
                                        }

                                        // ==================== 许愿井 (v3.28.0) ====================
                                        function generateWellRoom() {
                                            gameState.enemies = [];
                                            gameState.potions = [];
                                            gameState.chests = [];
                                            gameState.isBossFloor = false;
                                            gameState.isShopFloor = false;
                                            gameState.wellUsed = false;
                                            gameState.exit = { x: Math.floor(CONFIG.MAP_WIDTH/2), y: CONFIG.MAP_HEIGHT - 2 };
                                        }

                                        function makeWish(tierIdx) {
                                            if (gameState.wellUsed) { addLog('🌟 许愿井已经使用过了...', 'log-system'); return; }
                                            const tier = CONFIG.WELL_TIERS[tierIdx];
                                            if (!tier) return;
                                            if (gameState.gold < tier.cost) { addLog(`🌟 金币不足${tier.cost}G！`, 'log-system'); return; }
                                            gameState.gold -= tier.cost;
                                            gameState.wellUsed = true;
                                            sfx.play('chest');
                                            if (tier.legendary) {
                                                // 200G：必定传奇
                                                const legEq = LEGENDARY.generate();
                                                LEGENDARY.unlock(legEq.legendaryId);
                                                addLog(`🌟 许愿井泛起金光！传奇「${legEq.name}」浮现！`, 'log-gain');
                                                showEquipCompare(legEq, (replace) => {
                                                    if (replace) gameState.player.equipment[legEq.type] = legEq;
                                                    renderMap(); updateStatusBar();
                                                });
                                                return;
                                            }
                                            if (Math.random() < tier.equipChance) {
                                                const eq = generateEquipment();
                                                eq.quality = Math.min(8, tier.qualityMin + Math.floor(Math.random() * (tier.qualityMax - tier.qualityMin + 1)));
                                                addLog(`🌟 许愿井中浮出一件装备：${eq.name}！`, 'log-gain');
                                                showEquipCompare(eq, (replace) => {
                                                    if (replace) gameState.player.equipment[eq.type] = eq;
                                                    renderMap(); updateStatusBar();
                                                });
                                            } else {
                                                addLog('🌟 许愿井泛起涟漪...什么也没发生', 'log-system');
                                                updateStatusBar();
                                            }
                                        }
