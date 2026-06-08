// ==================== 战斗特效系统 ====================
        
        function getGridCoords() {
            const player = gameState.player;
            const gameView = document.getElementById('game-view');
            const mapDisplay = document.getElementById('map-display');
            const mapRect = mapDisplay.getBoundingClientRect();
            const viewRect = gameView.getBoundingClientRect();
            const cellW = mapRect.width / CONFIG.MAP_WIDTH;
            const cellH = mapRect.height / CONFIG.MAP_HEIGHT;
            return { gameView, mapRect, viewRect, cellW, cellH };
        }
        
        function gridToPixel(gridX, gridY, coords) {
            const x = (coords.mapRect.left - coords.viewRect.left) + gridX * coords.cellW + coords.cellW / 2;
            const y = (coords.mapRect.top - coords.viewRect.top) + gridY * coords.cellH + coords.cellH / 2;
            return { x, y };
        }
        
        function launchAttackEffect(enemyIndex) {
            gameState.animating = true;
            const type = CONFIG.ATTACK_TYPES[Math.floor(Math.random() * CONFIG.ATTACK_TYPES.length)];
            const player = gameState.player;
            const enemy = gameState.enemies[enemyIndex];
            const coords = getGridCoords();
            const start = gridToPixel(player.x, player.y, coords);
            const end = gridToPixel(enemy.x, enemy.y, coords);
            const gameView = coords.gameView;
            const DURATION = 280; // ms
            
            switch (type) {
                case 'fireball': launchFireball(gameView, start, end, enemyIndex, DURATION); break;
                case 'lightning': launchLightning(gameView, start, end, enemyIndex, DURATION); break;
                case 'hurricane': launchHurricane(gameView, start, end, enemyIndex, DURATION); break;
                case 'sword': launchSword(gameView, start, end, enemyIndex, DURATION); break;
                case 'fist': launchFist(gameView, start, end, enemyIndex, DURATION); break;
            }
        }
        
        // 通用：创建元素并设置初始位置
        function createFx(gameView, className, x, y, offsetX, offsetY) {
            const el = document.createElement('div');
            el.className = 'battle-fx ' + className;
            el.style.left = (x + (offsetX || 0)) + 'px';
            el.style.top = (y + (offsetY || 0)) + 'px';
            gameView.appendChild(el);
            return el;
        }
        
        // 通用：命中后执行战斗（enemyIndex < 0 时仅显示命中特效，不触发战斗逻辑）
        function finishAttack(gameView, enemyIndex, hitClassName, endX, endY) {
            const hit = document.createElement('div');
            hit.className = hitClassName;
            hit.style.left = (endX - 20) + 'px';
            hit.style.top = (endY - 20) + 'px';
            hit.style.position = 'absolute';
            gameView.appendChild(hit);
            setTimeout(() => hit.remove(), 400);
            if (enemyIndex >= 0) {
                combat(enemyIndex);
                gameState.animating = false;
            }
        }
        
        // 通用：生成拖尾
        function spawnTrail(gameView, trailClass, x, y, count, interval) {
            let i = 0;
            const iv = setInterval(() => {
                if (i >= count) { clearInterval(iv); return; }
                const t = document.createElement('div');
                t.className = trailClass;
                t.style.left = x + 'px';
                t.style.top = y + 'px';
                t.style.position = 'absolute';
                t.style.pointerEvents = 'none';
                t.style.zIndex = '49';
                gameView.appendChild(t);
                setTimeout(() => t.remove(), 400);
                i++;
            }, interval);
            return iv;
        }
        
        // ==================== 🔥 火球 ====================
        function launchFireball(gameView, start, end, enemyIndex, dur) {
            const el = createFx(gameView, 'fx-fireball', start.x - 10, start.y - 10);
            requestAnimationFrame(() => {
                el.style.left = (end.x - 10) + 'px';
                el.style.top = (end.y - 10) + 'px';
            });
            // 拖尾
            let trailI = 0;
            const trailIv = setInterval(() => {
                if (trailI >= 5) { clearInterval(trailIv); return; }
                const curX = parseFloat(el.style.left);
                const curY = parseFloat(el.style.top);
                const t = document.createElement('div');
                t.className = 'fx-fireball-trail';
                t.style.left = (curX + 4) + 'px';
                t.style.top = (curY + 4) + 'px';
                gameView.appendChild(t);
                setTimeout(() => t.remove(), 350);
                trailI++;
            }, 45);
            setTimeout(() => {
                el.remove(); clearInterval(trailIv);
                finishAttack(gameView, enemyIndex, 'fx-fireball-hit', end.x, end.y);
            }, dur + 40);
        }
        
// ==================== ⚡ 闪电 ====================
        function launchLightning(gameView, start, end, enemyIndex, dur) {
            const el = createFx(gameView, 'fx-lightning', start.x - 8, start.y - 8);
            // 闪电 zigzag 拖尾
            let boltI = 0;
            const boltIv = setInterval(() => {
                if (boltI >= 6) { clearInterval(boltIv); return; }
                const curX = parseFloat(el.style.left) + 8;
                const curY = parseFloat(el.style.top) + 8;
                const bolt = document.createElement('div');
                bolt.className = 'fx-lightning-bolt';
                bolt.style.left = (curX - 1) + 'px';
                bolt.style.top = (curY - 8) + 'px';
                bolt.style.height = (12 + Math.random() * 10) + 'px';
                bolt.style.transform = `rotate(${Math.random() * 360}deg)`;
                gameView.appendChild(bolt);
                setTimeout(() => bolt.remove(), 300);
                boltI++;
            }, 35);
            requestAnimationFrame(() => {
                el.style.left = (end.x - 8) + 'px';
                el.style.top = (end.y - 8) + 'px';
            });
            setTimeout(() => {
                el.remove(); clearInterval(boltIv);
                finishAttack(gameView, enemyIndex, 'fx-lightning-hit', end.x, end.y);
            }, dur + 40);
        }
        
// ==================== 🌪️ 飓风 ====================
        function launchHurricane(gameView, start, end, enemyIndex, dur) {
            const el = createFx(gameView, 'fx-hurricane', start.x - 14, start.y - 14);
            let trailI = 0;
            const trailIv = setInterval(() => {
                if (trailI >= 5) { clearInterval(trailIv); return; }
                const curX = parseFloat(el.style.left);
                const curY = parseFloat(el.style.top);
                const t = document.createElement('div');
                t.className = 'fx-hurricane-trail';
                t.style.left = (curX + 5) + 'px';
                t.style.top = (curY + 5) + 'px';
                gameView.appendChild(t);
                setTimeout(() => t.remove(), 400);
                trailI++;
            }, 45);
            requestAnimationFrame(() => {
                el.style.left = (end.x - 14) + 'px';
                el.style.top = (end.y - 14) + 'px';
            });
            setTimeout(() => {
                el.remove(); clearInterval(trailIv);
                finishAttack(gameView, enemyIndex, 'fx-hurricane-hit', end.x, end.y);
            }, dur + 40);
        }
        
// ==================== 🗡️ 刀剑 ====================
        function launchSword(gameView, start, end, enemyIndex, dur) {
            const el = createFx(gameView, 'fx-sword', start.x - 15, start.y - 3);
            // 计算飞行角度
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            el.style.transform = `rotate(${angle}deg)`;
            let trailI = 0;
            const trailIv = setInterval(() => {
                if (trailI >= 5) { clearInterval(trailIv); return; }
                const curX = parseFloat(el.style.left);
                const curY = parseFloat(el.style.top);
                const t = document.createElement('div');
                t.className = 'fx-sword-trail';
                t.style.left = (curX + 5) + 'px';
                t.style.top = (curY) + 'px';
                t.style.transform = `rotate(${angle}deg)`;
                gameView.appendChild(t);
                setTimeout(() => t.remove(), 300);
                trailI++;
            }, 40);
            requestAnimationFrame(() => {
                el.style.left = (end.x - 15) + 'px';
                el.style.top = (end.y - 3) + 'px';
            });
            setTimeout(() => {
                el.remove(); clearInterval(trailIv);
                finishAttack(gameView, enemyIndex, 'fx-sword-hit', end.x, end.y);
            }, dur + 40);
        }
        
// ==================== 👊 铁拳 ====================
        function launchFist(gameView, start, end, enemyIndex, dur) {
            const el = createFx(gameView, 'fx-fist', start.x - 14, start.y - 14);
            el.textContent = '👊';
            let trailI = 0;
            const trailIv = setInterval(() => {
                if (trailI >= 5) { clearInterval(trailIv); return; }
                const curX = parseFloat(el.style.left);
                const curY = parseFloat(el.style.top);
                const t = document.createElement('div');
                t.className = 'fx-fist-trail';
                t.style.left = (curX + 7) + 'px';
                t.style.top = (curY + 7) + 'px';
                gameView.appendChild(t);
                setTimeout(() => t.remove(), 300);
                trailI++;
            }, 45);
            requestAnimationFrame(() => {
                el.style.left = (end.x - 14) + 'px';
                el.style.top = (end.y - 14) + 'px';
            });
            setTimeout(() => {
                el.remove(); clearInterval(trailIv);
                // 铁拳命中用 💥 emoji
                const hit = document.createElement('div');
                hit.className = 'fx-fist-hit';
                hit.textContent = '💥';
                hit.style.left = (end.x - 18) + 'px';
                hit.style.top = (end.y - 18) + 'px';
                hit.style.position = 'absolute';
                gameView.appendChild(hit);
                setTimeout(() => hit.remove(), 350);
                if (enemyIndex >= 0) {
                    combat(enemyIndex);
                    gameState.animating = false;
                }
            }, dur + 40);
        }
        // ==================== 战斗系统 ====================

        // 金币倍率计算（提取自8处重复代码，v3.39.0）
        function getGoldMultiplier(enemy, affix, player, isEliteOverride) {
            const talentBonus = [0, 0.3, 0.6, 1.0][Math.max(0, getTalentLevel('e4') - 1)];
            const affixBonus = (affix && affix.gold) ? affix.gold / 100 : 0;
            const potionBonus = player && player._goldBoost ? player._goldBoost : 0;
            const eliteBonus = (isEliteOverride && getTalentLevel('e4') >= 2)
                ? [0, 1, 2][Math.max(0, getTalentLevel('e4') - 1)] : 0;
            const bossBonus = (enemy && enemy.isBoss && getTalentLevel('e4') >= 3) ? 0.5 : 0;
            return 1 + talentBonus + affixBonus + potionBonus + eliteBonus + bossBonus;
        }

// 汇总全部装备攻击力
        function sumEquipAtk() {
            let sum = 0;
            const eq = gameState.player.equipment;
            for (const slot of Object.values(eq)) {
                if (slot && slot.atk) sum += slot.atk;
            }
            sum += sumAffixBonuses().allAtk;
            // 诅咒加成
            for (const slot of Object.values(gameState.player.equipment)) {
                if (slot && slot.cursed && slot.curseBonus) {
                    if (slot.curseBonus.atkPct) sum += Math.floor(gameState.player.atk * slot.curseBonus.atkPct / 100);
                    if (slot.curseBonus.allPct) sum += Math.floor(gameState.player.atk * slot.curseBonus.allPct / 100);
                }
            }
            return sum;
        }
        
        // 汇总全部装备防御力
        function sumEquipDef() {
            let sum = 0;
            const eq = gameState.player.equipment;
            for (const slot of Object.values(eq)) {
                if (slot && slot.def) sum += slot.def;
            }
            sum += sumAffixBonuses().allDef;
            // 诅咒加成/惩罚
            for (const slot of Object.values(gameState.player.equipment)) {
                if (slot && slot.cursed && slot.curseBonus) {
                    if (slot.curseBonus.defPct) sum += Math.floor(gameState.player.def * slot.curseBonus.defPct / 100);
                    if (slot.curseBonus.allPct) sum += Math.floor(gameState.player.def * slot.curseBonus.allPct / 100);
                }
                if (slot && slot.cursed && slot.cursePenalty) {
                    if (slot.cursePenalty.defPct) sum += Math.floor(gameState.player.def * slot.cursePenalty.defPct / 100);
                }
            }
            return sum;
        }
        
        // 汇总全部装备 HP 加成
        function sumEquipHp() {
            let sum = 0;
            const eq = gameState.player.equipment;
            for (const slot of Object.values(eq)) {
                if (slot && slot.maxHp) sum += slot.maxHp;
            }
            return sum + sumAffixBonuses().maxHp;
        }
        
        // 击杀后通用效果（嗜血/吸血/升级）
        function afterKillEffects(player, affix) {
                    gameState.achievementStats.kills++;
                                        gameState.runKills++;
                                        gameState.stats.kills++;
                                        checkAchievements();
                    if (getTalentLevel('c1') > 0) {
                        const healPct = [0.10, 0.20, 0.30][getTalentLevel('c1') - 1];
                        const healAmt = Math.floor(player.maxHp * healPct) + (getTalentLevel('c1') >= 3 ? 5 : 0);
                        player.hp = Math.min(player.hp + healAmt, player.maxHp + sumEquipHp());
                        addLog(`🩸 嗜血：恢复 ${healAmt} HP (Lv${getTalentLevel('c1')})`, 'log-gain');
            }
            if (affix.lifesteal) {
                            player.hp = Math.min(player.hp + affix.lifesteal, player.maxHp + sumEquipHp());
                        }
                        checkLevelUp();
                        // 竞技场：检查是否清完波次
                                                                                                if (gameState.specialRoom && gameState.specialRoom.type === 'arena') {
                                                                                                    checkArenaClear();
                                                                                                }
                                                                                                // 训练场：击杀幻影后重置模式 (v3.28.0)
                                                if (gameState.isTrainingMode) {
                                                    gameState.isTrainingMode = false;
                                                    player.hp = player.maxHp + sumEquipHp();
                                                    addLog('🏋️ 训练结束！幻影被击败，HP已恢复', 'log-gain');
                                                }
                                            }
        
        // 汇总全部装备词缀效果
        function sumAffixBonuses() {
            const bonus = {
                critRate: 0, bossDmg: 0, block: 0, lifesteal: 0, gold: 0, luck: 0,
                heal: 0, regen: 0, allAtk: 0, allDef: 0, maxHp: 0, penetration: 0,
                doubleHit: 0, damageReduce: 0, maxShield: 0, killHeal: 0,
                freezeRate: 0, stunRate: 0, igniteRate: 0, vulnerableRate: 0
            };
            const eq = gameState.player.equipment;
            for (const slot of Object.values(eq)) {
                if (!slot || !slot.affixes) continue;
                slot.affixes.forEach(a => {
                    if (bonus.hasOwnProperty(a.id)) {
                        bonus[a.id] += (a.val || 0);
                    }
                });
            }
            return bonus;
        }
        
        // 检查精英怪是否拥有指定能力
        function hasEliteAbility(enemy, abilityId) {
                    return enemy.eliteAbilities && enemy.eliteAbilities.some(a => a.id === abilityId);
                }

                // === 通用更新序列 (v3.39.0) ===

                // 击杀后更新：隐藏面板 + 渲染地图 + 状态栏 + 敌人列表 + 技能冷却
                function updateAfterCombat() {
                    hideEnemyPanel();
                    renderMap();
                    updateStatusBar();
                    updateEnemyList();
                    tickSkillTurns();
                }

                // 通用更新（无敌人列表）：地图 + 状态栏 + 自动存档
                function updateStatusBarAfter() {
                    renderMap();
                    updateStatusBar();
                    autosaveGame();
                }

                function combat(enemyIndex) {
                    const enemy = gameState.enemies[enemyIndex];
                    if (!enemy) { gameState.animating = false; return; }
                    const player = gameState.player;
                    const affix = sumAffixBonuses();

                    // 扣血辅助函数：训练模式下不扣血 (v3.41.3)
                    function takeDamage(amount) {
                        if (gameState.isTrainingMode) return;
                        player.hp -= amount;
                    }

                    // 秒杀模式：一击毙命
                                                                                if (gameState.oneHitKill) {
                                                                                    addLog(`💀 秒杀 ${enemy.name || '敌人'}！`, 'log-combat');
                                                                                    const exp = enemy.exp || 5;
                                                                                    const gold = isNaN(enemy.gold) ? 2 : enemy.gold;
                                                                                    player.exp += exp;
                                                                                    gameState.gold += Math.floor(gold * getGoldMultiplier(enemy, affix, player, false));
                                                                                    addLog(`获得 ${exp} 经验 + ${gold} 金币`, 'log-gain');
                                                                                    // Boss 秒杀也掉落装备
                                                                                    if (enemy.isBoss) {
                                                                                        const bossEquip = generateBossWeapon();
                                                                                        gameState.enemies.splice(enemyIndex, 1);
                                                                                        showEquipCompare(bossEquip, (replace) => {
                                                                                            if (replace) {
                                                                                                const oldWeapon = player.equipment[bossEquip.type];
                                                                                                if (oldWeapon) {
                                                                                                    addLog(`🐲 Boss 掉落：${bossEquip.name}，替换 ${oldWeapon.name}！`, 'log-item');
                                                                                                } else {
                                                                                                    addLog(`🐲 Boss 掉落：${bossEquip.name}，已装备！`, 'log-item');
                                                                                                }
                                                                                                player.equipment[bossEquip.type] = bossEquip;
                                                                                            } else {
                                                                                                addLog(`🐲 Boss 掉落：${bossEquip.name}，已放弃`, 'log-item');
                                                                                            }
                                                                                            afterKillEffects(player, affix);
                                                                                            tickSkillTurns();
                                                                                            gameState.bossDefeated = true;
                                                                                            if (gameState.hiddenExit) {
                                                                                                gameState.exit = gameState.hiddenExit;
                                                                                                addLog('🌀 传送门出现了！', 'log-system');
                                                                                            }
                                                                                            renderMap();
                                                                                            updateStatusBar();
                                                                                            checkLevelUp();
                                                                                        });
                                                                                        return;
                                                                                    }
                                                                                    // 普通/精英敌人秒杀
                                                                                    gameState.enemies[enemyIndex] = null;
                                                                                    gameState.enemies = gameState.enemies.filter(e => e !== null);
                                                                                    afterKillEffects(player, affix);
                                                                                                                                            tickSkillTurns();
                                                                                                                                            updateStatusBarAfter();
                                                                                    checkLevelUp();
                                                                                    return;
                                                                                }
            
                                        // 战斗开始时重置护盾
                    if (player.maxShield > 0) player.shield = player.maxShield;
            
                    // 初始化敌人debuff槽
                                        if (!enemy.buffs) enemy.buffs = [];
                                        if (!enemy.debuffs) enemy.debuffs = {};  // { vulnerable: turns_left, ignite: turns_left }

                    // ==================== 敌人属性面板 (v3.36.0) ====================
                    if (CONFIG.SETTINGS.enemyInfoPanel) {
                        showEnemyPanel(enemy);
                    }

                                        // 迅捷突变：首回合先制攻击 (v3.29.0)
                                        if (enemy.mutation === 'swift' && !enemy._swifted) {
                                            enemy._swifted = true;
                                            const swiftDef = player.def + sumEquipDef();
                                            const swiftDmg = Math.max(1, enemy.atk - swiftDef);
                                            const swiftShielded = Math.min(player.shield || 0, swiftDmg);
                                            const swiftActual = swiftDmg - swiftShielded;
                                            if (swiftShielded > 0) player.shield -= swiftShielded;
                                            takeDamage(swiftActual);
                                            addLog(`⚡ ${enemy.name}(迅捷) 先制攻击！造成 ${swiftDmg} 伤害`, 'log-danger');
                                            if (player.hp <= 0) {
                                                if (player._chronosTonic) { player._chronosTonic = false; player.hp = 1; addLog('🕰️ 时空凝滞触发！保留1HP！', 'log-gain'); }
                                                else { gameOver(); return; }
                                            }
                                            applyMutationOnHit(enemy, player);
                                        }
            
                    // 汇总战斗属性（玩家基础 + 装备词缀）
                    const totalCrit = player.critRate + affix.critRate;
                    const totalPen = player.penetration + affix.penetration;
                    const totalDoubleHit = player.doubleHit + affix.doubleHit;
                    const totalDamageReduce = player.damageReduce + affix.damageReduce;
                    const totalFreeze = player.freezeRate + affix.freezeRate;
                    const totalStun = player.stunRate + affix.stunRate;
                    const totalIgnite = player.igniteRate + affix.igniteRate;
                    const totalVulnerable = player.vulnerableRate + affix.vulnerableRate;
            
                    // 计算装备加成后的总属性
                                let totalAtk = player.atk + sumEquipAtk();
                                // 药水：力量药水 +30%，狂战士之血 +50%
                                if (player._powerPotion) totalAtk = Math.floor(totalAtk * 1.30);
                                if (player._berserker) totalAtk = Math.floor(totalAtk * 1.50);
                                let totalDef = player.def + sumEquipDef();
            // 天赋：顽强 (HP<30% 防御翻倍)
                        const s5lv = getTalentLevel('s5');
                        if (s5lv > 0) {
                            const threshold = s5lv >= 3 ? 0.20 : 0.30;
                            if (player.hp < player.maxHp * threshold) {
                                totalDef *= 2;
                                if (s5lv >= 2) totalAtk = Math.floor(totalAtk * 1.5);
                                if (s5lv >= 3) {
                                    addLog(`🔥 顽强 Lv3 激发！攻防+灼烧！`, 'log-gain');
                                    totalAtk = Math.floor(totalAtk * 1.3);
                                }
                            }
                        }
            
            // Boss 战提示
            if (enemy.isBoss) {
                            addLog(`🐲 Boss 战：${enemy.name} (HP:${enemy.hp} 攻击:${enemy.atk} 防御:${enemy.def})`, 'log-danger');
                            combatBossShake();
                        } else if (enemy.isElite) {
                            addLog(`⭐ 精英怪：${enemy.name} [${enemy.abilityNames}] (HP:${enemy.hp} ATK:${enemy.atk})`, 'log-danger');
                        } else {
                addLog(`遭遇敌人！HP:${enemy.hp} 攻击:${enemy.atk} 防御:${enemy.def}`, 'log-danger');
            }
            
            // Boss 战 / 精英战 / 手动模式：单回合制
                        if ((enemy.isBoss || enemy.isElite) || !gameState.autoAttack) {
                // 处理持续效果（中毒/流血 + 点燃/脆弱）
                                                handleDotEffects(player, enemy);
                                // Boss诅咒持续伤害
                                if (player._curseTurns > 0) {
                                    const curseDmg = Math.floor((player.maxHp + sumEquipHp()) * 0.05);
                                    player.hp = Math.max(1, player.hp - curseDmg);
                                    player._curseTurns--;
                                    addLog(`💀 Boss诅咒：损失 ${curseDmg} HP（剩余${player._curseTurns}回合）`, 'log-danger');
                                    if (player.hp <= 0) {
                                        if (player._chronosTonic) { player._chronosTonic = false; player.hp = 1; addLog('🕰️ 时空凝滞触发！保留1HP！', 'log-gain'); }
                                        else { gameOver(); return; }
                                    }
                                }
                                if (player._skipTurn) { player._skipTurn = false; addLog('👁️ 被Boss凝视，跳过本回合！', 'log-danger'); }
                
                                // 冰冻/眩晕：敌人跳过本回合
                                if (enemy.frozen) {
                                    enemy.frozen = false;
                                    addLog(`❄️ 敌人在冰封中无法行动`, 'log-combat');
                                    updateAfterCombat(); return;
                                }
                                if (enemy.stunned) {
                                    enemy.stunned = false;
                                    addLog(`😵 敌人眩晕中无法行动`, 'log-combat');
                                    updateAfterCombat(); return;
                                }
                
                                // 玩家灼烧/冰冻/眩晕处理
                                if (player.burnTurns > 0) {
                                    const burnDmg = Math.max(1, Math.floor((player.maxHp + sumEquipHp()) * 0.03));
                                    player.hp = Math.max(1, player.hp - burnDmg);
                                    player.burnTurns--;
                                    addLog(`🔥 灼烧造成 ${burnDmg} 伤害（剩余${player.burnTurns}回合）`, 'log-danger');
                                    if (player.hp <= 0) {
                                        if (player._chronosTonic) { player._chronosTonic = false; player.hp = 1; addLog('🕰️ 时空凝滞触发！保留1HP！', 'log-gain'); }
                                        else { gameOver(); return; }
                                    }
                                }
                                let _cc = (player.frozenTurns > 0);
                                if (player.frozenTurns > 0) { player.frozenTurns--; addLog(`❄️ 你被冰冻了，无法行动（剩余${player.frozenTurns}回合）`, 'log-danger'); }
                                if (player.stunned) { player.stunned = false; _cc = true; addLog(`😵 你被眩晕了，无法行动！`, 'log-danger'); }
                                if (!_cc) {
                                // 玩家攻击
                                                if (checkMutationDodge(enemy)) { updateAfterCombat(); return; }
                                                const cls = classCfg();
                let effectiveDef = cls.penPercent ? Math.floor(enemy.def * (1 - cls.penPercent)) : enemy.def;
                                if (enemy._defBuff) { effectiveDef *= 2; enemy._defBuff = false; }
                                let playerDamage = Math.max(1, totalAtk - effectiveDef);
                                if (gameState.player._atkDebuff) { playerDamage = Math.floor(playerDamage / 2); gameState.player._atkDebuff = false; }
                                                    // 穿透：额外真实伤害
                                                    if (totalPen > 0) playerDamage += totalPen;
                                    
                                                    // 精英硬化：承受伤害 -30%
                                                    if (enemy.isElite && hasEliteAbility(enemy, 'dmgReduce')) playerDamage = Math.floor(playerDamage * 0.7);
                
                                let critChance = (totalCrit + (cls.critBonus || 0)
                                    + getTalentLevel('c4') * 3
                                    + (getTalentLevel('c4') >= 3 ? 3 : 0)) / 100;
                                                if (player._berserker) critChance += 0.20;
                                                const isCrit = Math.random() < critChance;
                                                if (isCrit) {
                    const critMult = getTalentLevel('c5') > 0 ? [2.0, 2.5, 3.0][getTalentLevel('c5') - 1] : CONFIG.CRIT_MULTIPLIER;
                    playerDamage = Math.floor(playerDamage * critMult);
                    addLog(`💥 暴击！造成 ${playerDamage} 点伤害`, 'log-combat');
                    sfx.play('crit');
                    combatCritFlash();
                } else {
                    // 法师穿透提示
                    if (cls.penPercent && enemy.def > 0) {
                        addLog(`你攻击 Boss（穿透防御），造成 ${playerDamage} 点伤害`, 'log-combat');
                    } else {
                        addLog(`你攻击 Boss，造成 ${playerDamage} 点伤害`, 'log-combat');
                    }
                    sfx.play('hit');
                }
// 战士 Boss 伤害加成 + 词缀破阵
                let bossExtra = 0;
                if (cls.bossDmgBonus) bossExtra += cls.bossDmgBonus;
                if (affix.bossDmg) bossExtra += affix.bossDmg / 100;
                if (bossExtra > 0) {
                    const bonus = Math.floor(playerDamage * bossExtra);
                    playerDamage += bonus;
                    addLog(`🗡️ 专精+破阵：对 Boss 额外造成 ${bonus} 点伤害`, 'log-combat');
                }
                enemy.hp -= playerDamage;
                                // ==================== 伤害数字 (v3.37.0) ====================
                                showDamageNumber(enemy, playerDamage, isCrit ? 'crit' : 'damage');
                                // ==================== 敌人属性面板HP更新 (v3.36.0) ====================
                                if (CONFIG.SETTINGS.enemyInfoPanel) updateEnemyPanelHP(enemy);

                                // 药水：狂战士之血 每次攻击扣5%最大HP
                                if (player._berserker) {
                                    const berserkCost = Math.max(1, Math.floor((player.maxHp + sumEquipHp()) * 0.05));
                                    player.hp = Math.max(1, player.hp - berserkCost);
                                }
                                // Boss 掉落处理
                
                                // 攻击后触发状态效果
                                applyCombatEffects(player, enemy, totalFreeze, totalStun, totalIgnite, totalVulnerable);
                
                                // 双连击：概率再攻击一次（敌人不反击）
                                if (totalDoubleHit > 0 && Math.random() * 100 < totalDoubleHit && enemy.hp > 0) {
                                    const doubleDmg = Math.max(1, totalAtk - effectiveDef) + totalPen;
                                    enemy.hp -= doubleDmg;
                                    showDamageNumber(enemy, doubleDmg, 'damage');
                                    // ==================== 敌人属性面板HP更新 (v3.36.0 — 连击) ====================
                                    if (CONFIG.SETTINGS.enemyInfoPanel) updateEnemyPanelHP(enemy);
                                    addLog(`🗡️ 连击！额外造成 ${doubleDmg} 点伤害`, 'log-combat');
                                }
                
                                // 检查死亡
                                                                                if (enemy.hp <= 0) {
                                                                                    // 普通敌人简单清理
                                                                                                                                        if (!enemy.isBoss) {
                                                                                                                                            // 精英怪掉落装备
                                                                                                                                            if (enemy.isElite) {
                                                                                                                                                const eliteEquip = generateEquipment();
                                                                                                                                                gameState.enemies.splice(enemyIndex, 1);
                                                                                                                                                showEquipCompare(eliteEquip, (replace) => {
                                                                                                                                                    if (replace) {
                                                                                                                                                        const oldEquip = player.equipment[eliteEquip.type];
                                                                                                                                                        if (oldEquip) { addLog(`⭐ 精英掉落：${eliteEquip.name}，替换 ${oldEquip.name}！`, 'log-item'); }
                                                                                                                                                        else { addLog(`⭐ 精英掉落：${eliteEquip.name}，已装备！`, 'log-item'); }
                                                                                                                                                        player.equipment[eliteEquip.type] = eliteEquip;
                                                                                                                                                    } else { addLog(`⭐ 精英掉落：${eliteEquip.name}，已放弃`, 'log-item'); }
                                                                                                                                                    player.exp += enemy.exp;
                                                                                                                                                    gameState.gold += Math.floor(enemy.gold * getGoldMultiplier(enemy, affix, player, true));
                                                                                                                                                    afterKillEffects(player, affix);
 hideEnemyPanel();
                                                                                                                                                    updateAfterCombat();
                                                                                                                                                });
                                                                                                                                                return;
                                                                                                                                            }

                                                                                                                                              // 钥匙系统：普通怪物被击败时掉落钥匙（1/n概率，最后一只保底）
                              const droppedEnemyPos = { x: enemy.x, y: enemy.y };
                              if (!enemy.isBoss && !enemy.isElite && gameState.exitLocked && !gameState.keyPicked && !gameState._keyDropped) {
                                  gameState.enemies.splice(enemyIndex, 1);
                                  const remainingNormal = gameState.enemies.filter(e => !e.isBoss && !e.isElite).length;
                                  let keyChance = 1 / gameState.totalEnemies;
                                  if (remainingNormal === 0) keyChance = 1.0;  // 最后一只保底
                                  if (Math.random() < keyChance) {
                                      if (!gameState.chests) gameState.chests = [];
                                      gameState.chests.push({ x: droppedEnemyPos.x, y: droppedEnemyPos.y, type: 'key' });
                                      gameState._keyDropped = true;  // 标记：本层钥匙已掉落，防止重复
                                      addLog(`🔑 敌人掉落了一把钥匙！`, 'log-gain');
                                  }
                              } else {
                                 gameState.enemies.splice(enemyIndex, 1);
                             }

                                                                                                                                            addLog(`${enemy.name || '敌人'}被击败！获得 ${enemy.exp} 经验 + ${enemy.gold} 金币`, 'log-gain');
                                                                                                                                                                    player.exp += enemy.exp;
                                                                                                                                                                    spawnMutationSummon(enemy);
                                                                                                                                                                    gameState.gold += Math.floor(enemy.gold * getGoldMultiplier(enemy, affix, player, false));
                                                                                                                                                                    sfx.play('kill');
                                                                                                                                            afterKillEffects(player, affix);
                                                                                                                                            hideEnemyPanel();
                                                                                                                                                                                tickSkillTurns();
                                                                                                                                                                                updateStatusBarAfter();
                                                                                                                                                                                        return;
                                                                                    }
                                                    
                                                                                    // Boss 死亡完整流程
                                                                                    addLog(`🐲 Boss "${enemy.name}" 被击败！获得 ${enemy.exp} 经验 + ${enemy.gold} 金币`, 'log-gain');
                                                    player.exp += enemy.exp;
                                                    gameState.gold += Math.floor(enemy.gold * getGoldMultiplier(enemy, affix, player, false));
                                                    sfx.play('boss_kill');
                                                    // 破烂王检查
                                                    if (!gameState.achievements.trashKing) {
                                                        const allTrash = Object.values(gameState.player.equipment).every(eq => !eq || eq.quality === 0);
                                                        if (allTrash) unlockAchievement('trashKing');
                                                    }
                    
                                                    const bossWeapon = generateBossWeapon();
                                                    gameState.enemies.splice(enemyIndex, 1);
                    
                                                    // 弹窗选择装备 → 回调中处理后续逻辑
                                                                                                        const handleBossDrop2 = () => {
                                                                                                            // 稀有Boss双掉落：第2件 (30%传奇) (v3.29.0)
                                                                                                            if (enemy.isRareBoss) {
                                                                                                                const drop2 = Math.random() < 0.3 ? LEGENDARY.generate() : generateEquipment();
                                                                                                                const dropLabel = drop2.legendary ? '✨ 稀有Boss传奇掉落' : '🐲 稀有Boss掉落';
                                                                                                                showEquipCompare(drop2, (replace2) => {
                                                                                                                    if (replace2) {
                                                                                                                        player.equipment[drop2.type] = drop2;
                                                                                                                        if (drop2.legendary) { LEGENDARY.unlock(drop2.legendaryId); addLog(`✨ 传奇「${drop2.name}」已收录图鉴！`, 'log-gain'); }
                                                                                                                        addLog(`${dropLabel}：${drop2.name}，已装备！`, 'log-item');
                                                                                                                    }
                                                                                                                    finishBossKill();
                                                                                                                });
                                                                                                            } else {
                                                                                                                finishBossKill();
                                                                                                            }
                                                                                                        };
                                                                                                        const finishBossKill = () => {
                                                                                                            if (gameState.isBossFloor && gameState.hiddenExit) {
                                                                                                                gameState.exit = gameState.hiddenExit;
                                                                                                                gameState.bossDefeated = true;
                                                                                                                addLog('🌀 传送门出现了！', 'log-system');
                                                                                                            }
                                                                                                            // 传奇装备掉落（普通Boss 10%）
                                                                                                            if (enemy.isBoss && !enemy.isRareBoss && Math.random() < 0.1) {
                                                                                                                const legEq = LEGENDARY.generate();
                                                                                                                showEquipCompare(legEq, (replaceLeg) => {
                                                                                                                    if (replaceLeg) {
                                                                                                                        player.equipment[legEq.type] = legEq;
                                                                                                                        LEGENDARY.unlock(legEq.legendaryId);
                                                                                                                        addLog('✨ 传奇「' + legEq.name + '」已收录图鉴！', 'log-gain');
                                                                                                                    }
                                                                                                                    afterKillEffects(player, affix);
                                                                                                                    tickSkillTurns(); updateStatusBarAfter();
                                                                                                                });
                                                                                                            } else {
                                                                                                                afterKillEffects(player, affix); tickSkillTurns(); updateStatusBarAfter();
                                                                                                            }
                                                                                                        };
                                                                                                        showEquipCompare(bossWeapon, (replace) => {
                                                                                                            if (replace) {
                                                                                                                const oldWeapon = player.equipment[bossWeapon.type];
                                                                                                                if (oldWeapon) addLog('🐲 Boss 掉落：' + bossWeapon.name + '，替换 ' + oldWeapon.name + '！', 'log-item');
                                                                                                                else addLog('🐲 Boss 掉落：' + bossWeapon.name + '，已装备！', 'log-item');
                                                                                                                player.equipment[bossWeapon.type] = bossWeapon;
                                                                                                            } else {
                                                                                                                addLog('🐲 Boss 掉落：' + bossWeapon.name + '，已放弃', 'log-item');
                                                                                                            }
                                                                                                            handleBossDrop2();
                                                                                                                                                                                                                    });
                                                                                                                                                                hideEnemyPanel();
                                                                                                                                                                return;
                                                                                                                                                            }
                                }
                // Boss 反击
                                // Boss 技能（40%概率触发）
                                if (enemy.isBoss && Math.random() < 0.4 && !gameState.godMode) {
                                    const skills = [
                                        {
                                            name:'龙息', icon:'🐉', desc:'全屏火焰！HP-30%',
                                            act:() => {
                                                const dmg = Math.floor((gameState.player.maxHp + sumEquipHp()) * 0.3);
                                                gameState.player.hp = Math.max(1, gameState.player.hp - dmg);
                                                return `HP -${dmg}`;
                                            }
                                        },
                                        { name:'雷暴', icon:'⚡', desc:'攻击力减半！',
                                            act:() => { gameState.player._atkDebuff = true; return 'ATK -50%'; } },
                                        { name:'铁壁', icon:'🛡️', desc:'防御翻倍1回合',
                                            act:() => { enemy._defBuff = true; return 'DEF ×2'; } },
                                        { name:'凝视', icon:'👁️', desc:'跳过下一回合',
                                            act:() => { gameState.player._skipTurn = true; return '跳过回合'; } },
                                        { name:'诅咒', icon:'💀', desc:'持续掉血3回合',
                                            act:() => { gameState.player._curseTurns = 3; return '每回合-5%HP'; } },
                                        {
                                            name:'分身', icon:'🔄', desc:'召唤2个分身',
                                            act:() => {
                                                for (let s=0; s<2; s++) {
                                                    const cx = enemy.x + (Math.random()-0.5)*6|0,
                                                        cy = enemy.y + (Math.random()-0.5)*4|0;
                                                    if (cx>0 && cx<CONFIG.MAP_WIDTH-1 && cy>0 && cy<CONFIG.MAP_HEIGHT-1
                                                        && gameState.map[cy] && gameState.map[cy][cx]==='.') {
                                                        gameState.enemies.push({
                                                            x:cx, y:cy,
                                                            hp:Math.floor(enemy.hp*0.5),
                                                            atk:Math.floor(enemy.atk*0.6),
                                                            def:enemy.def,
                                                            exp:Math.floor(enemy.exp*0.3),
                                                            gold:Math.floor(enemy.gold*0.2),
                                                            emoji:enemy.emoji,
                                                            name:enemy.name+'分身',
                                                            isClone:true
                                                        });
                                                    }
                                                }
                                                return '召唤2分身';
                                            }
                                        },
                                        {
                                            name:'旋风', icon:'🌪️', desc:'强制移位',
                                            act:() => {
                                                for (let t=0; t<10; t++){
                                                    const nx = gameState.player.x + (Math.random()-0.5)*8|0,
                                                        ny = gameState.player.y + (Math.random()-0.5)*6|0;
                                                    if (nx>0 && nx<CONFIG.MAP_WIDTH-1 && ny>0 && ny<CONFIG.MAP_HEIGHT-1
                                                        && gameState.map[ny] && gameState.map[ny][nx]==='.') {
                                                        gameState.player.x = nx;
                                                        gameState.player.y = ny;
                                                        break;
                                                    }
                                                }
                                                return '强制移位';
                                            }
                                        },
                                        {
                                            name:'自爆', icon:'💥', desc:'濒死自爆',
                                            act:() => {
                                                if (enemy.hp < enemy.maxHp * 0.2) {
                                                    const dmg = Math.floor((gameState.player.maxHp + sumEquipHp()) * 0.8);
                                                    gameState.player.hp = Math.max(1, gameState.player.hp - dmg);
                                                    return `HP -${dmg}`;
                                                }
                                                return null;
                                            }
                                        },
                                    ];
                                    const usable = skills.filter(s => !(s.name === '自爆' && enemy.hp >= enemy.maxHp * 0.2));
                                    const skill = usable[Math.floor(Math.random() * usable.length)];
                                    const result = skill.act();
                                    if (result) {
                                        addLog(`🐲 Boss「${skill.icon}${skill.name}」${skill.desc} (${result})`, 'log-danger');
                                        sfx.play('boss');
                                    }
                                }
                                // Boss 反击
                                let enemyDamage = Math.max(1, enemy.atk - totalDef);
                // 药水：贪婪诱饵 敌人攻击+30%
                if (player._greedLure) enemyDamage = Math.floor(enemyDamage * 1.30);
                                // 减伤：受到伤害 -X%
                                                                if (totalDamageReduce > 0) {
                                                                    const origDmg = enemyDamage;
                                                                    enemyDamage = Math.max(1, Math.floor(enemyDamage * (1 - totalDamageReduce / 100)));
                                                                    if (enemyDamage < origDmg) addLog(`🛡️ 免伤 ${totalDamageReduce}%：${origDmg}→${enemyDamage}`, 'log-combat');
                                                                }
                                                                // 护盾吸收
                                                                if (player.shield > 0) {
                                                                    const sniperPierce = checkMutationSniper(enemy, player.shield || 0);
                if (sniperPierce > 0) { enemyDamage += sniperPierce; player.shield = 0; }
                const shielded = Math.min(player.shield, enemyDamage);
                                                                    player.shield -= shielded;
                                                                    enemyDamage -= shielded;
                                                                    addLog(`🛡️ 护盾吸收了 ${shielded} 点伤害 (剩余${player.shield})`, 'log-combat');
                                                                }
                                if (gameState.godMode) {
                    enemyDamage = 0;
                    addLog(`Boss 反击，但调试模式免疫伤害 (0 伤害)`, 'log-danger');
                } else if (gameState.skillActive && gameState.skillTurns > 0 && getTalentLevel('s6') > 0) {
                    enemyDamage = 0;
                    addLog(`✨ 圣盾：免疫 Boss 攻击！`, 'log-gain');
                } else {
                    // 盗贼闪避
const clsDodge = classCfg();
                    if (clsDodge.dodgeChance && Math.random() < clsDodge.dodgeChance) {
                        enemyDamage = 0;
                        addLog(`🗡️ 闪避！你躲过了 Boss 的攻击`, 'log-gain');
                        sfx.play('hit');
                    } else if (affix.block && Math.random() < affix.block / 100) {
                        enemyDamage = Math.floor(enemyDamage * 0.5);
                        addLog(`🛡️ 格挡！减半 Boss 伤害至 ${enemyDamage}`, 'log-gain');
                        takeDamage(enemyDamage);
                        sfx.play('hit');
                    } else {
                                             takeDamage(enemyDamage);
                                                                                         addLog(`Boss 反击，对你造成 ${enemyDamage} 点伤害`, 'log-danger');
                                            // 天赋：反击
                                                                                      if (getTalentLevel('c6') > 0 && Math.random() < [0.15, 0.20, 0.25][getTalentLevel('c6') - 1] && enemy.hp > 0) {
                                                                                          const lv = getTalentLevel('c6');
                                                                                          const counterDmg = Math.floor(enemyDamage * [0.5, 0.6, 0.8][lv - 1]);
                                                                                          enemy.hp -= counterDmg;
                                                                                          addLog(`↩️ 天赋反击 Lv${lv}！反弹 ${counterDmg} 伤害${lv >= 3 ? '（穿透防御）' : ''}`, 'log-gain');
                                    if (CONFIG.SETTINGS.enemyInfoPanel) updateEnemyPanelHP(enemy);
                                                                                                // 反击杀死：触发死亡
                                                                                                if (enemy.hp <= 0) {
                                                                                                    // 普通敌人简单清理
                                                                                                                                                                                                        if (!enemy.isBoss) {
                                                                                                                                                                                                            // 精英怪掉落
                                                                                                                                                                                                            if (enemy.isElite) {
                                                                                                                                                                                                                const eliteEquip = generateEquipment();
                                                                                                                                                                                                                gameState.enemies.splice(enemyIndex, 1);
                                                                                                                                                                                                                showEquipCompare(eliteEquip, (replace) => {
                                                                                                                                                                                                                    if (replace) {
                                                                                                                                                                                                                        const oldWeapon = player.equipment[eliteEquip.type];
                                                                                                                                                                                                                        if (oldWeapon) { addLog(`⭐ 精英掉落：${eliteEquip.name}，替换 ${oldWeapon.name}！`, 'log-item'); }
                                                                                                                                                                                                                        else { addLog(`⭐ 精英掉落：${eliteEquip.name}，已装备！`, 'log-item'); }
                                                                                                                                                                                                                        player.equipment[eliteEquip.type] = eliteEquip;
                                                                                                                                                                                                                    } else { addLog(`⭐ 精英掉落：${eliteEquip.name}，已放弃`, 'log-item'); }
                                                                                                                                                                                                                    player.exp += enemy.exp;
                                                                                                                                                                                                                    gameState.gold += Math.floor(enemy.gold * getGoldMultiplier(enemy, affix, player, true));
                                                                                                                                                                                                                    afterKillEffects(player, affix);
                                                                                                                                                                                                                    hideEnemyPanel();
updateAfterCombat();
                                                                                                                                                                                                                });
                                                                                                                                                                                                                return;
                                                                                                                                                                                                            }
                                                                                                        
                                                                                                                                                                                                            addLog(`${enemy.name || '敌人'}被反击击败！获得 ${enemy.exp} 经验 + ${enemy.gold} 金币`, 'log-gain');
                                                                                                        player.exp += enemy.exp;
                                                                                                        gameState.gold += Math.floor(enemy.gold * getGoldMultiplier(enemy, affix, player, false));
                                                                                                        sfx.play('kill');
                                                                                                        gameState.enemies.splice(enemyIndex, 1);
                                                                                                        afterKillEffects(player, affix);
                                                                                                                                                                tickSkillTurns();
                                                                                                                                                                updateStatusBarAfter();
hideEnemyPanel();
                                                                                                        return;
                                                                                                    }
                                                    
                                                                                                                                                    addLog(`🐲 Boss "${enemy.name}" 被反击击败！获得 ${enemy.exp} 经验 + ${enemy.gold} 金币`, 'log-gain');
                                                                                                    player.exp += enemy.exp;
                                                                                                    gameState.gold += Math.floor(enemy.gold * getGoldMultiplier(enemy, affix, player, false));
                                                                                                    sfx.play('boss_kill');
                                                    // 破烂王检查
                                                    if (!gameState.achievements.trashKing) {
                                                        const allTrash = Object.values(gameState.player.equipment).every(eq => !eq || eq.quality === 0);
                                                        if (allTrash) unlockAchievement('trashKing');
                                                    }
                                                                                                    const bossWeapon = generateBossWeapon();
                                                                                                    gameState.enemies.splice(enemyIndex, 1);
                                                    
                                                                                                    showEquipCompare(bossWeapon, (replace) => {
                                                                                                        if (replace) {
                                                                                                            const oldWeapon = player.equipment[bossWeapon.type];
                                                                                                                                                                                                                        if (oldWeapon) { addLog(`🐲 Boss 掉落：${bossWeapon.name}，替换 ${oldWeapon.name}！`, 'log-item'); }
                                                                                                                                                                                                                        else { addLog(`🐲 Boss 掉落：${bossWeapon.name}，已装备！`, 'log-item'); }
                                                                                                                                                                                                                        player.equipment[bossWeapon.type] = bossWeapon;
                                                                                                        } else {
                                                                                                            addLog(`🐲 Boss 掉落：${bossWeapon.name}，已放弃`, 'log-item');
                                                                                                        }
                                                        
                                                                                                        if (gameState.isBossFloor && gameState.hiddenExit) {
                                                                                                                                                                    gameState.exit = gameState.hiddenExit;
                                                                                                                                                                    gameState.bossDefeated = true;
                                                                                                                                                                    addLog(`🌀 传送门出现了！`, 'log-system');
                                                                                                                                                                }
                                                                                                                                // 传奇装备掉落（Boss 10%）
                                                                                                                                if (enemy.isBoss && Math.random() < 0.1) {
                                                                                                                                    const legEq = LEGENDARY.generate();
                                                                                                                                    showEquipCompare(legEq, (replace) => {
                                                                                                                                        if (replace) {
                                                                                                                                            gameState.player.equipment[legEq.type] = legEq;
                                                                                                                                            LEGENDARY.unlock(legEq.legendaryId);
                                                                                                                                            addLog(`✨ 传奇「${legEq.name}」已收录图鉴！`, 'log-gain');
                                                                                                                                        }
                                                                                                                                        afterKillEffects(player, affix);
                                                                                                                                        tickSkillTurns(); updateStatusBarAfter();
                                                                                                                                    });
                                                                                                                                    return;
                                                                                                                                }
                        
                                                                                                                                                                afterKillEffects(player, affix);
                                                                                                                                                                tickSkillTurns();
                                                                                                                                                                updateStatusBarAfter();
                                                                                                    });
                                                                                                    return;
                                                                                                }
                                            }
                                            sfx.play('hurt');
                        // 突变：灼烧/冰冻 (v3.29.0)
                        if (enemyDamage > 0) applyMutationOnHit(enemy, player);
                                                                    // 药水：荆棘反伤（反弹50%伤害+等额护盾）
                                                                    if (enemyDamage > 0 && player._thornsTurns > 0) {
                                                                        const reflectDmg = Math.floor(enemyDamage * 0.5);
                                                                        enemy.hp -= reflectDmg;
                                                                        player.shield = (player.shield || 0) + reflectDmg;
                                                                        player.maxShield = Math.max(player.maxShield || 0, player.shield);
                                                                        addLog(`🛡️ 荆棘反伤！反弹 ${reflectDmg} 伤害，获得 ${reflectDmg} 护盾`, 'log-gain');
                                                                        if (CONFIG.SETTINGS.enemyInfoPanel) updateEnemyPanelHP(enemy);
                                                                        sfx.play('hit');
                                                                    }
                                                                                                                                    }
                                                                                                            }
                    
                                                                // 精英怪攻击附效
                                                                if (enemy.isElite && enemyDamage > 0) {
                                                                    if (hasEliteAbility(enemy, 'poison') && Math.random() < 0.2) {
                                                                        if (!player.buffs) player.buffs = [];
                                                                        if (!player.buffs.includes('poison')) { player.buffs.push('poison'); addLog(`☠️ 精英攻击附带中毒！`, 'log-danger'); }
                                                                    }
                                                                    if (hasEliteAbility(enemy, 'bleed') && Math.random() < 0.2) {
                                                                        if (!player.buffs) player.buffs = [];
                                                                        if (!player.buffs.includes('bleed')) { player.buffs.push('bleed'); addLog(`🩸 精英攻击附带流血！`, 'log-danger'); }
                                                                    }
                                                                    if (hasEliteAbility(enemy, 'ignite') && Math.random() < 0.2) {
                                                                        if (!player.debuffs) player.debuffs = {};
                                                                        if (!(player.debuffs.ignite > 0)) { player.debuffs.ignite = 3; addLog(`🔥 精英攻击点燃了你！`, 'log-danger'); }
                                                                    }
                                                                    if (hasEliteAbility(enemy, 'freeze') && Math.random() < 0.15) {
                                                                        player.frozenTurns = (player.frozenTurns || 0) + 1;
                                                                        addLog(`❄️ 精英攻击冰冻了你！跳过下回合`, 'log-danger');
                                                                    }
                                                                    if (hasEliteAbility(enemy, 'stun') && Math.random() < 0.15) {
                                                                        player.stunned = true;
                                                                        addLog(`😵 精英攻击眩晕了你！跳过下回合`, 'log-danger');
                                                                    }
                                                                    if (hasEliteAbility(enemy, 'penetration') && !gameState.godMode) {
                                                                        const penDmg = Math.floor(3 + gameState.floor * 0.5);
                                                                        takeDamage(penDmg);
                                                                        addLog(`🔩 精英穿透：额外 ${penDmg} 真实伤害`, 'log-danger');
                                                                    }
                                                                    if (hasEliteAbility(enemy, 'doubleHit') && Math.random() < 0.25) {
                                                                        const doubleDmg = Math.max(1, Math.floor(enemyDamage * 0.6));
                                                                        takeDamage(doubleDmg);
                                                                        addLog(`🗡️ 精英连击！额外造成 ${doubleDmg} 伤害`, 'log-danger');
                                                                    }
                                                                }
                    
                                                                                    if (player.hp <= 0) {
                        if (player._chronosTonic) { player._chronosTonic = false; player.hp = 1; addLog('🕰️ 时空凝滞触发！保留1HP！', 'log-gain'); }
                        else {
                            player.hp = 0;
                            gameOver();
                        }
                    }
                
                renderMap();
                updateStatusBar();
                tickSkillTurns();
                return;
            }
            
             // ==================== 普通敌人：自动战斗到结束（逐回合播放） ====================
             // round 和 affix 必须在 combat() 内部声明，避免多次调用累积 (v3.43.3)
             let round = 0;

              function autoCombatRound() {
                   // 检查自动战斗是否被中断
                   if (!gameState.autoAttack) {
                       addLog('⚠️ 自动攻击已停止', 'log-system');
                       gameState.animating = false;
                       renderMap();
                       updateStatusBar();
                       return;
                   }
                   // 检查战斗是否已结束
                   if (enemy.hp <= 0 || player.hp <= 0) {
                      if (enemy.hp <= 0) {
                          // 钥匙系统：autoCombatRound 击杀也需掉落钥匙（1/n概率，最后一只保底）
                          const droppedEnemyPos = { x: enemy.x, y: enemy.y };
                          if (!enemy.isBoss && !enemy.isElite && gameState.exitLocked && !gameState.keyPicked && !gameState._keyDropped) {
                              gameState.enemies.splice(enemyIndex, 1);
                              const remainingNormal = gameState.enemies.filter(e => !e.isBoss && !e.isElite).length;
                              let keyChance = 1 / gameState.totalEnemies;
                              if (remainingNormal === 0) keyChance = 1.0;  // 最后一只保底
                              if (Math.random() < keyChance) {
                                  if (!gameState.chests) gameState.chests = [];
                                  gameState.chests.push({ x: droppedEnemyPos.x, y: droppedEnemyPos.y, type: 'key' });
                                  gameState._keyDropped = true;  // 标记：本层钥匙已掉落，防止重复
                                  addLog(`🔑 敌人掉落了一把钥匙！`, 'log-gain');
                              }
                          } else {
                             gameState.enemies.splice(enemyIndex, 1);
                        }
                        addLog(`${enemy.name || '敌人'}被击败！获得 ${enemy.exp} 经验 + ${enemy.gold} 金币`, 'log-gain');
                        player.exp += enemy.exp;
                        spawnMutationSummon(enemy);
                        gameState.gold += Math.floor(enemy.gold * getGoldMultiplier(enemy, affix, player, false));
                        sfx.play('kill');
                        afterKillEffects(player, affix);
                        addLog(`——— 战斗结束 (${round}回合) ———`, 'log-system');
                        hideEnemyPanel();
                        updateAfterCombat();
                        gameState.animating = false;
                        return;
                    }
                    // 玩家死亡
                    if (player.hp <= 0) {
                        if (player._chronosTonic) {
                            player._chronosTonic = false;
                            player.hp = 1;
                            addLog('🕰️ 时空凝滞触发！保留1HP！', 'log-gain');
                        } else {
                            player.hp = 0;
                            addLog(`——— 战斗结束 (${round}回合) ———`, 'log-system');
                            gameOver();
                            hideEnemyPanel();
                            updateAfterCombat();
                            gameState.animating = false;
                            return;
                        }
                    }
                    return;
                }
                
                // 回合计数 + DOT
                round++;
                handleDotEffects(player, enemy);
                if (enemy.hp <= 0) { hideEnemyPanel(); autoCombatRound(); return; }
                
                // 攻击动画
                const fxType = CONFIG.ATTACK_TYPES[Math.floor(Math.random() * CONFIG.ATTACK_TYPES.length)];
                const coords = getGridCoords();
                const start = gridToPixel(player.x, player.y, coords);
                const end = gridToPixel(enemy.x, enemy.y, coords);
                const gv = coords.gameView;
                const FX_DUR = 250;
                
                switch (fxType) {
                    case 'fireball': launchFireball(gv, start, end, -1, FX_DUR); break;
                    case 'lightning': launchLightning(gv, start, end, -1, FX_DUR); break;
                    case 'hurricane': launchHurricane(gv, start, end, -1, FX_DUR); break;
                    case 'sword': launchSword(gv, start, end, -1, FX_DUR); break;
                    case 'fist': launchFist(gv, start, end, -1, FX_DUR); break;
                }
                
                // 动画结束后执行本回合逻辑
                setTimeout(() => {
                    // burn/freeze/stun
                    if (player.burnTurns > 0) {
                        const burnDmg = Math.max(1, Math.floor((player.maxHp + sumEquipHp()) * 0.03));
                        player.hp = Math.max(1, player.hp - burnDmg);
                        player.burnTurns--;
                        addLog(`🔥 灼烧造成 ${burnDmg} 伤害（剩余${player.burnTurns}回合）`, 'log-danger');
                        if (player.hp <= 0) {
                            if (player._chronosTonic) { player._chronosTonic = false; player.hp = 1; addLog('🕰️ 时空凝滞触发！保留1HP！', 'log-gain'); }
                            else { player.hp = 0; gameOver(); updateAfterCombat(); gameState.animating = false; return; }
                        }
                    }
                    let _cc2 = (player.frozenTurns > 0);
                    if (player.frozenTurns > 0) { player.frozenTurns--; addLog(`❄️ 你被冰冻了，无法行动（剩余${player.frozenTurns}回合）`, 'log-danger'); }
                    if (player.stunned) { player.stunned = false; _cc2 = true; addLog(`😵 你被眩晕了，无法行动！`, 'log-danger'); }
                    if (!_cc2) {
                        if (checkMutationDodge(enemy)) { updateAfterCombat(); return; }
                        const cls = classCfg();
                        let effectiveDef = cls.penPercent ? Math.floor(enemy.def * (1 - cls.penPercent)) : enemy.def;
                        if (enemy._defBuff) { effectiveDef *= 2; enemy._defBuff = false; }
                        let playerDamage = Math.max(1, totalAtk - effectiveDef);
                        if (gameState.player._atkDebuff) { playerDamage = Math.floor(playerDamage / 2); gameState.player._atkDebuff = false; }
                        if (totalPen > 0) playerDamage += totalPen;
                        if (enemy.isElite && hasEliteAbility(enemy, 'dmgReduce')) playerDamage = Math.floor(playerDamage * 0.7);
                        
                        let critChance = (totalCrit + (cls.critBonus || 0) + getTalentLevel('c4') * 3 + (getTalentLevel('c4') >= 3 ? 3 : 0)) / 100;
                        if (player._berserker) critChance += 0.20;
                        const isCrit = Math.random() < critChance;
                        if (isCrit) {
                            const critMult = getTalentLevel('c5') > 0 ? [2.0, 2.5, 3.0][getTalentLevel('c5') - 1] : CONFIG.CRIT_MULTIPLIER;
                            playerDamage = Math.floor(playerDamage * critMult);
                            addLog(`[R${round}] 💥 暴击！造成 ${playerDamage} 点伤害`, 'log-combat');
                            sfx.play('crit');
                        } else {
                            addLog(`[R${round}] 你攻击敌人，造成 ${playerDamage} 点伤害`, 'log-combat');
                            sfx.play('hit');
                        }
                        enemy.hp -= playerDamage;
                        showDamageNumber(enemy, playerDamage, isCrit ? 'crit' : 'damage');
                        if (CONFIG.SETTINGS.enemyInfoPanel) updateEnemyPanelHP(enemy);
                        if (player._berserker) {
                            const berserkCost = Math.max(1, Math.floor((player.maxHp + sumEquipHp()) * 0.05));
                            player.hp = Math.max(1, player.hp - berserkCost);
                        }
                        if (enemy.isElite && hasEliteAbility(enemy, 'lifesteal')) {
                            const healAmt = Math.floor(playerDamage * 0.15);
                            enemy.hp += healAmt;
                            if (enemy.hp > enemy.maxHp) enemy.hp = enemy.maxHp;
                        }
                        if (enemy.hp <= 0) {
                            addLog(`${enemy.name || '敌人'}被击败！获得 ${enemy.exp} 经验 + ${enemy.gold} 金币`, 'log-gain');
                            player.exp += enemy.exp;
                            gameState.gold += Math.floor(enemy.gold * getGoldMultiplier(enemy, affix, player, false));
                            sfx.play('kill');
                            spawnMutationSummon(enemy);
                            afterKillEffects(player, affix);
                              // 钥匙系统：普通层掉落钥匙（1/n概率，最后一只保底）
                              const droppedEnemyPos = { x: enemy.x, y: enemy.y };
                              if (!enemy.isBoss && !enemy.isElite && gameState.exitLocked && !gameState.keyPicked && !gameState._keyDropped) {
                                  gameState.enemies.splice(enemyIndex, 1);
                                  const remainingNormal = gameState.enemies.filter(e => !e.isBoss && !e.isElite).length;
                                  let keyChance = 1 / gameState.totalEnemies;
                                  if (remainingNormal === 0) keyChance = 1.0;  // 最后一只保底
                                  if (Math.random() < keyChance) {
                                      if (!gameState.chests) gameState.chests = [];
                                      gameState.chests.push({ x: droppedEnemyPos.x, y: droppedEnemyPos.y, type: 'key' });
                                      gameState._keyDropped = true;  // 标记：本层钥匙已掉落，防止重复
                                      addLog(`🔑 敌人掉落了一把钥匙！`, 'log-gain');
                                  }
                              } else {
                                 gameState.enemies.splice(enemyIndex, 1);
                             }
                            hideEnemyPanel();
                            addLog(`——— 战斗结束 (${round}回合) ———`, 'log-system');
                            renderMap();
                            updateStatusBar();
                            tickSkillTurns();
                            gameState.animating = false;
                            return;
                        }
                        
                        // 敌人反击
                        let enemyDamage = Math.max(1, enemy.atk - totalDef);
                        if (player._greedLure) enemyDamage = Math.floor(enemyDamage * 1.30);
                        if (totalDamageReduce > 0) {
                            const origDmg = enemyDamage;
                            enemyDamage = Math.max(1, Math.floor(enemyDamage * (1 - totalDamageReduce / 100)));
                            if (enemyDamage < origDmg) addLog(`🛡️ 免伤 ${totalDamageReduce}%：${origDmg}→${enemyDamage}`, 'log-combat');
                        }
                        if (player.shield > 0) {
                            const sniperPierce = checkMutationSniper(enemy, player.shield || 0);
                            if (sniperPierce > 0) { enemyDamage += sniperPierce; player.shield = 0; }
                            const shielded = Math.min(player.shield, enemyDamage);
                            player.shield -= shielded;
                            enemyDamage -= shielded;
                            addLog(`🛡️ 护盾吸收了 ${shielded} 点伤害 (剩余${player.shield})`, 'log-combat');
                        }
                        if (gameState.godMode) { enemyDamage = 0; addLog(`[R${round}] 敌人反击，调试模式免疫 (0 伤害)`, 'log-danger'); }
                        else if (gameState.skillActive && gameState.skillTurns > 0 && getTalentLevel('s6') > 0) { enemyDamage = 0; addLog(`[R${round}] ✨ 圣盾：免疫攻击！`, 'log-gain'); }
                        else {
                            const clsDodge = classCfg();
                            if (clsDodge.dodgeChance && Math.random() < clsDodge.dodgeChance) {
                                enemyDamage = 0;
                                addLog(`[R${round}] 🗡️ 闪避！你躲过了攻击`, 'log-gain');
                                sfx.play('hit');
                            } else if (affix.block && Math.random() < affix.block / 100) {
                                enemyDamage = Math.floor(enemyDamage * 0.5);
                                addLog(`[R${round}] 🛡️ 格挡！减半伤害至 ${enemyDamage}`, 'log-gain');
                                takeDamage(enemyDamage);
                                sfx.play('hit');
                            } else {
                                takeDamage(enemyDamage);
                                addLog(`[R${round}] 敌人反击，造成 ${enemyDamage} 点伤害`, 'log-danger');
                                if (getTalentLevel('c6') > 0 && Math.random() < 0.3) {
                                    const lv = getTalentLevel('c6');
                                    const counterDmg = Math.floor(enemyDamage * 0.3 * lv);
                                    enemy.hp -= counterDmg;
                                    addLog(`[R${round}] ↩️ 天赋反击 Lv${lv}！反弹 ${counterDmg} 伤害`, 'log-gain');
                                    if (CONFIG.SETTINGS.enemyInfoPanel) updateEnemyPanelHP(enemy);
                                    if (enemy.hp <= 0) { addLog(`${enemy.name || '敌人'}被反击击倒！`, 'log-gain'); enemy.hp = 0; }
                                }
                                sfx.play('hurt');
                                if (enemyDamage > 0) applyMutationOnHit(enemy, player);
                                if (enemyDamage > 0 && player._thornsTurns > 0) {
                                    const reflectDmg = Math.floor(enemyDamage * 0.5);
                                    enemy.hp -= reflectDmg;
                                    player.shield = (player.shield || 0) + reflectDmg;
                                    player.maxShield = Math.max(player.maxShield, player.shield);
                                    addLog(`🛡️ 荆棘反伤！反弹 ${reflectDmg} 伤害，获得 ${reflectDmg} 护盾`, 'log-gain');
                                    if (CONFIG.SETTINGS.enemyInfoPanel) updateEnemyPanelHP(enemy);
                                    sfx.play('hit');
                                }
                            }
                        }
                        if (enemy.isElite && enemyDamage > 0) {
                            if (hasEliteAbility(enemy, 'poison') && Math.random() < 0.25) {
                                if (!player.buffs) player.buffs = [];
                                if (!player.buffs.includes('poison')) { player.buffs.push('poison'); addLog(`☠️ 精英攻击使你中毒！`, 'log-danger'); }
                            }
                            if (hasEliteAbility(enemy, 'bleed') && Math.random() < 0.25) {
                                if (!player.buffs) player.buffs = [];
                                if (!player.buffs.includes('bleed')) { player.buffs.push('bleed'); addLog(`🩸 精英攻击使你流血！`, 'log-danger'); }
                            }
                            if (hasEliteAbility(enemy, 'ignite') && Math.random() < 0.25) {
                                if (!player.debuffs) player.debuffs = {};
                                if (!(player.debuffs.ignite > 0)) { player.debuffs.ignite = 3; addLog(`🔥 精英攻击点燃了你！`, 'log-danger'); }
                            }
                            if (hasEliteAbility(enemy, 'freeze') && Math.random() < 0.15) {
                                player.frozenTurns = (player.frozenTurns || 0) + 1;
                                addLog(`❄️ 精英攻击冰冻了你！跳过下回合`, 'log-danger');
                            }
                            if (hasEliteAbility(enemy, 'stun') && Math.random() < 0.15) {
                                player.stunned = true;
                                addLog(`😵 精英攻击眩晕了你！跳过下回合`, 'log-danger');
                            }
                            if (hasEliteAbility(enemy, 'penetration') && !gameState.godMode) {
                                const penDmg = Math.floor(3 + gameState.floor * 0.5);
                                takeDamage(penDmg);
                                addLog(`🔩 精英穿透：额外 ${penDmg} 真实伤害`, 'log-danger');
                            }
                            if (hasEliteAbility(enemy, 'doubleHit') && Math.random() < 0.35) {
                                const doubleDmg = Math.max(1, Math.floor(enemy.atk * 0.5 * (1 - Math.max(0, totalDef * 0.8))));
                                takeDamage(doubleDmg);
                                addLog(`🗡️ 精英连击！额外造成 ${doubleDmg} 伤害`, 'log-danger');
                            }
                        }
                        
                        if (player.hp <= 0) {
                            if (player._chronosTonic) {
                                player._chronosTonic = false;
                                player.hp = 1;
                                addLog('🕰️ 时空凝滞触发！保留1HP！', 'log-gain');
                            } else {
                                player.hp = 0;
                                addLog(`——— 战斗结束 (${round}回合) ———`, 'log-system');
                                hideEnemyPanel();
                                gameOver();
                                renderMap();
                                updateStatusBar();
                            }
                            tickSkillTurns();
                            gameState.animating = false;
                            return;
                        }
                    }
                    
                    renderMap();
                    updateStatusBar();
                    
                    // 下一回合（间隔 350ms）
                    setTimeout(autoCombatRound, 350);
                    }, FX_DUR + 60);
                }

            // 启动自动战斗
            autoCombatRound();
        }

                // ==================== 处理持续伤害效果 ====================
function handleDotEffects(player, enemy) {
                    if (!enemy || !player) return;
                    // 天赋：抗毒 Lv1 减少50%玩家DOT伤害（通过buff检查）
                    const s3lv = getTalentLevel('s3');
                    const dotReduction = [1, 0.5, 0.25, 0][s3lv];

                    if (enemy.buffs && enemy.buffs.includes('poison')) {
                        const poisonDmg = CONFIG.POISON_DAMAGE;
                        enemy.hp -= poisonDmg;
                        addLog(`☠️ 敌人中毒，损失 ${poisonDmg} 点 HP`, 'log-combat');
                        sfx.play('poison');
                    }
                        if (CONFIG.SETTINGS.enemyInfoPanel) updateEnemyPanelHP(enemy);
            
                    // 流血效果
                    if (enemy.buffs && enemy.buffs.includes('bleed')) {
                        const bleedDmg = Math.floor(enemy.maxHp * CONFIG.BLEED_PERCENT);
                        enemy.hp -= bleedDmg;
                        addLog(`🩸 敌人流血，损失 ${bleedDmg} 点 HP`, 'log-combat');
                    }
                        if (CONFIG.SETTINGS.enemyInfoPanel) updateEnemyPanelHP(enemy);

                    // 玩家中毒/流血减伤 (s3 抗毒)
                    if (s3lv > 0 && (player.buffs || []).length > 0) {
                        let playerDotDmg = 0;
                        if (player.buffs.includes('poison')) {
                            playerDotDmg = Math.floor(CONFIG.POISON_DAMAGE * dotReduction);
                            takeDamage(playerDotDmg);
                        }
                        if (player.buffs.includes('bleed')) {
                            const bleedDmg = Math.floor(player.maxHp * CONFIG.BLEED_PERCENT * dotReduction);
                            takeDamage(bleedDmg);
                        }
                        if (playerDotDmg > 0) {
                            addLog(`💔 你承受了 ${playerDotDmg} 点持续伤害${s3lv >= 3 ? '（已免疫）' : ''}`, 'log-danger');
                            // Lv3 完全免疫
                            if (s3lv >= 3) {
                                player.buffs = player.buffs.filter(b => b !== 'poison' && b !== 'bleed');
                            }
                        }
                        // Lv2 持续减半
                        if (s3lv >= 2) {
                            // 毒持续减半（已通过 dotReduction=0.25 实现）
                        }
                    }
            
    // 点燃：每回合掉血，持续3回合
    if (enemy.debuffs && enemy.debuffs.ignite > 0) {
        const igniteDmg = 5 + Math.floor(gameState.floor / 3);
        enemy.hp -= igniteDmg;
        if (CONFIG.SETTINGS.enemyInfoPanel) updateEnemyPanelHP(enemy);
        enemy.debuffs.ignite--;
        addLog(`🔥 敌人被点燃，损失 ${igniteDmg} 点 HP (剩余${enemy.debuffs.ignite}回合)`, 'log-combat');
    }
            
    // 脆弱：倒计时
    if (enemy.debuffs && enemy.debuffs.vulnerable > 0) {
        enemy.debuffs.vulnerable--;
        if (enemy.debuffs.vulnerable <= 0) {
            addLog(`💔 脆弱效果消失`, 'log-system');
        }
    }
            
    // 冰冻/眩晕：跳过敌人回合（在 combat 中处理）
}

                // ==================== 攻击后触发状态效果 ====================
                function applyCombatEffects(player, enemy, freezeRate, stunRate, igniteRate, vulnerableRate) {
                    if (!enemy) return;
                    if (!enemy.debuffs) enemy.debuffs = {};
                    if (!enemy.frozen) enemy.frozen = false;
                    if (!enemy.stunned) enemy.stunned = false;
            
                    if (freezeRate > 0 && Math.random() * 100 < freezeRate) {
                        enemy.frozen = true;
                        addLog(`❄️ 冰冻！敌人跳过下回合`, 'log-combat');
                    }
                    if (!enemy.stunned && stunRate > 0 && Math.random() * 100 < stunRate) {
                        enemy.stunned = true;
                        addLog(`😵 眩晕！敌人跳过下回合`, 'log-combat');
                    }
                    if (igniteRate > 0 && Math.random() * 100 < igniteRate && !(enemy.debuffs.ignite > 0)) {
                        enemy.debuffs.ignite = 3;
                        addLog(`🔥 点燃！敌人3回合内持续掉血`, 'log-combat');
                    }
                    if (vulnerableRate > 0 && Math.random() * 100 < vulnerableRate && !(enemy.debuffs.vulnerable > 0)) {
                        enemy.debuffs.vulnerable = 2;
                        addLog(`💔 脆弱！敌人承伤增加 2回合`, 'log-combat');
                    }
                }
        
        // ==================== 触发武器特效 ====================
function triggerWeaponEffect(player, enemy) {
            if (!enemy) return;
            if (!enemy.buffs) enemy.buffs = [];
            
            // 1. 主手武器自带特效（毒液匕首/锯齿长剑等）
            const weapon = player.equipment.mainHand;
            if (weapon && weapon.effect && Math.random() < (weapon.effectChance || 0.15)) {
                applyDotEffect(enemy, weapon.effect);
            }
            
            // 2. 词缀特效（剧毒/撕裂）
            if (weapon && weapon.affixes) {
                weapon.affixes.forEach(a => {
                    if (a.id === 'poisonHit' && Math.random() < 0.15) applyDotEffect(enemy, 'poison');
                    if (a.id === 'bleedHit' && Math.random() < 0.15) applyDotEffect(enemy, 'bleed');
                });
            }
        }
        
        function applyDotEffect(enemy, effectType) {
            if (effectType === 'poison' && !enemy.buffs.includes('poison')) {
                enemy.buffs.push('poison');
                addLog(`☠️ 武器特效：敌人中毒！`, 'log-poison');
                sfx.play('poison');
            } else if (effectType === 'bleed' && !enemy.buffs.includes('bleed')) {
                enemy.buffs.push('bleed');
                addLog(`🩸 武器特效：敌人流血！`, 'log-bleed');
            }
        }
        
        
        /* ╔══════════════════════════════════════════╗
        ║  MODULE 5: 装备与商店                 ║
        ╚══════════════════════════════════════════╝ */
        
// ==================== 升级系统 (弹窗3选1) ====================
        function checkLevelUp() {
            if (gameState.isGameOver) return;
            const p = gameState.player;
            const expNeeded = CONFIG.EXP_BASE + (p.level - 1) * 25;
                        if (isNaN(p.exp)) p.exp = 0;
                        if (p.exp < expNeeded) return;
            
            // 消耗经验，升级
            p.exp -= expNeeded;
            const oldLevel = p.level;
            p.level++;
            p.hp = p.maxHp + sumEquipHp(); // 满血
            
            // 随机 3 个选项（不重复）
            const pool = [...CONFIG.LEVEL_UP_OPTIONS];
            // 洗牌取前 3
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            gameState.levelUpChoices = pool.slice(0, 3);
            
            showLevelUpModal(oldLevel);
        }

        function showLevelUpModal(oldLevel) {
            const p = gameState.player;
            document.getElementById('lu-level').textContent = oldLevel;
            document.getElementById('lu-newlevel').textContent = p.level;
            
            const choicesDiv = document.getElementById('levelup-choices');
            let html = '';
            gameState.levelUpChoices.forEach((opt, idx) => {
                            // 构建属性明细列表（竖排，每项一行：emoji+数值 + 描述）
                            let details = [];
                            if (opt.hp) details.push({ emoji: '❤️', val: `+${opt.hp}`, desc: '最大生命值' });
                            if (opt.atk) details.push({ emoji: '🗡️', val: `+${opt.atk}`, desc: '每击伤害' });
                            if (opt.def > 0) details.push({ emoji: '🛡️', val: `+${opt.def}`, desc: '伤害减免' });
                            if (opt.def < 0) details.push({ emoji: '🛡️', val: `${opt.def}`, desc: '防御降低' });
                            if (opt.gold) details.push({ emoji: '💰', val: `+${opt.gold}`, desc: '获得金币' });
                            if (opt.critRateBonus) details.push({ emoji: '💥', val: `+${opt.critRateBonus}%`, desc: '暴击率（1.5倍暴击伤害）' });
                            if (opt.penetrationBonus) details.push({ emoji: '🔩', val: `+${opt.penetrationBonus}`, desc: '穿透（无视防御的真实伤害）' });
                            if (opt.doubleHitBonus) details.push({ emoji: '🗡️', val: `+${opt.doubleHitBonus}%`, desc: '连击率（再攻击一次不反击）' });
                            if (opt.damageReduceBonus) details.push({ emoji: '🛡️', val: `+${opt.damageReduceBonus}%`, desc: '减伤（所有伤害降低）' });
                            if (opt.shieldBonus) details.push({ emoji: '🛡️', val: `+${opt.shieldBonus}`, desc: '护盾（战斗开始额外生命）' });
                            if (opt.freezeBonus) details.push({ emoji: '❄️', val: `+${opt.freezeBonus}%`, desc: '冰冻率（冻结敌人1回合）' });
                            if (opt.stunBonus) details.push({ emoji: '😵', val: `+${opt.stunBonus}%`, desc: '眩晕率（跳过敌人回合）' });
                            if (opt.igniteBonus) details.push({ emoji: '🔥', val: `+${opt.igniteBonus}%`, desc: '点燃率（持续3回合掉血）' });
                            if (opt.vulnerableBonus) details.push({ emoji: '💔', val: `+${opt.vulnerableBonus}%`, desc: '脆弱率（承伤+20%持续2回合）' });
                            if (opt.lifestealBonus) details.push({ emoji: '🩸', val: `+${opt.lifestealBonus}%`, desc: '生命偷取（攻击回血）' });
                            if (opt.killHealBonus) details.push({ emoji: '💀', val: `+${opt.killHealBonus}%`, desc: '击杀回血（击败回复HP）' });
                
                            const detailHtml = details.map(d => 
                                `<div style="display:flex; justify-content:space-between; padding:1px 0; font-size:15px;">
                                    <span style="color:#0f0; font-weight:bold;">${d.emoji} ${d.val}</span>
                                    <span style="color:#aaa;">${d.desc}</span>
                                </div>`
                            ).join('');
                
                            html += `<button onclick="applyLevelUpChoice(${idx})" style="
                                display:flex; align-items:flex-start; gap:10px;
                                padding:14px 18px; background:#1a1a1a; 
                                border:2px solid #ff0; border-radius:8px; 
                                cursor:pointer; color:#fff; font-size:16px; 
                                text-align:left; transition:all 0.2s;
                            " onmouseover="this.style.background='#2a2a00';this.style.borderColor='#ff0';
                            this.style.boxShadow='0 0 12px rgba(255,255,0,0.3)';"
                               onmouseout="this.style.background='#1a1a1a';this.style.borderColor='#ff0';
                            this.style.boxShadow='none';">
                                <span style="font-size:28px; padding-top:2px;">${opt.icon}</span>
                                <div style="flex:1;">
                                    <div style="font-weight:bold; color:#ff0; font-size:18px; margin-bottom:4px;">${opt.name}</div>
                                    ${detailHtml}
                                </div>
                            </button>`;
            });
            choicesDiv.innerHTML = html;
            document.getElementById('levelup-modal').style.display = 'flex';
        }

        function applyLevelUpChoice(index) {
                    const opt = gameState.levelUpChoices[index];
                    if (!opt) return;
            
                    const p = gameState.player;
                    p.maxHp += opt.hp || 0;
                    p.atk += opt.atk || 0;
                    p.def += opt.def || 0;
                    if (opt.gold) gameState.gold += opt.gold;
                    // 新战斗属性
                    if (opt.critRateBonus) p.critRate += opt.critRateBonus;
                    if (opt.penetrationBonus) p.penetration += opt.penetrationBonus;
                    if (opt.doubleHitBonus) p.doubleHit += opt.doubleHitBonus;
                    if (opt.damageReduceBonus) p.damageReduce += opt.damageReduceBonus;
                    if (opt.shieldBonus) { p.maxShield += opt.shieldBonus; p.shield = p.maxShield; }
                    if (opt.lifestealBonus) p.lifestealRate += opt.lifestealBonus;
                    if (opt.killHealBonus) p.killHeal += opt.killHealBonus;
                    if (opt.freezeBonus) p.freezeRate += opt.freezeBonus;
                    if (opt.stunBonus) p.stunRate += opt.stunBonus;
                    if (opt.igniteBonus) p.igniteRate += opt.igniteBonus;
                    if (opt.vulnerableBonus) p.vulnerableRate += opt.vulnerableBonus;
            
                    const parts = [];
                    if (opt.hp) parts.push(`❤️+${opt.hp}`);
                    if (opt.atk) parts.push(`🗡️+${opt.atk}`);
                    if (opt.def > 0) parts.push(`🛡️+${opt.def}`);
                    if (opt.def < 0) parts.push(`🛡️${opt.def}`);
                    if (opt.gold) parts.push(`💰+${opt.gold}`);
                    if (opt.critRateBonus) parts.push(`💥+${opt.critRateBonus}%`);
                    if (opt.penetrationBonus) parts.push(`🔩+${opt.penetrationBonus}`);
                    if (opt.doubleHitBonus) parts.push(`🗡️+${opt.doubleHitBonus}%`);
                    if (opt.damageReduceBonus) parts.push(`🛡️+${opt.damageReduceBonus}%`);
                    if (opt.shieldBonus) parts.push(`🛡️+${opt.shieldBonus}`);
                    addLog(`🎉 升级选择了 ${opt.icon}${opt.name}！${parts.join(' ')}`, 'log-gain');
            sfx.play('levelup');
            checkTalentUnlock(p.level);
            
            // 关闭弹窗
            document.getElementById('levelup-modal').style.display = 'none';
            
            // 刷新界面
            renderMap();
            updateStatusBar();
            
            // 继续检查是否还有足够的经验再次升级
            checkLevelUp();
        }

        // ==================== 敌人属性面板 (v3.36.0) ====================
        function showEnemyPanel(enemy) {
            const panel = document.getElementById('enemy-info-panel');
            if (!panel) return;
            panel.className = '';
            if (enemy.isRareBoss) panel.classList.add('rare-boss');
            else if (enemy.isBoss) panel.classList.add('boss');
            else if (enemy.isElite) panel.classList.add('elite');
            
            document.getElementById('enemy-info-name').textContent = (enemy.icon || '') + ' ' + (enemy.name || '敌人');
            document.getElementById('enemy-info-type').textContent =
                enemy.isRareBoss ? '✦ 稀有Boss' :
                enemy.isBoss ? '🐲 Boss' :
                enemy.isElite ? '⭐ 精英' : '普通敌人';
            
            const hpPercent = Math.max(0, enemy.hp / enemy.maxHp) * 100;
            document.getElementById('enemy-hp-bar-fill').style.width = hpPercent + '%';
            document.getElementById('enemy-hp-text').textContent = enemy.hp + '/' + enemy.maxHp;
            
            let stats = [];
            if (enemy.atk) stats.push('⚔️' + enemy.atk);
            if (enemy.def) stats.push('🛡️' + enemy.def);
            if (enemy.abilityNames && Array.isArray(enemy.abilityNames)) stats.push(enemy.abilityNames.join(', '));
            document.getElementById('enemy-info-stats').textContent = stats.join('  ');
            
            panel.style.display = 'block';
        }

        function updateEnemyPanelHP(enemy) {
            const panel = document.getElementById('enemy-info-panel');
            if (!panel || !enemy) return;
            const hpPercent = Math.max(0, enemy.hp / enemy.maxHp) * 100;
            document.getElementById('enemy-hp-bar-fill').style.width = hpPercent + '%';
            document.getElementById('enemy-hp-text').textContent = enemy.hp + '/' + enemy.maxHp;
        }

        function hideEnemyPanel() {
            const panel = document.getElementById('enemy-info-panel');
            if (panel) panel.style.display = 'none';
        }

        // ==================== 伤害数字浮动显示 (v3.37.0) ====================
        function showDamageNumber(enemyObj, value, type) {
            // type: 'damage' | 'crit' | 'heal'
            if (!CONFIG.SETTINGS.damageNumbers) return;
            
            // 通过 #map-display 和敌人坐标计算屏幕位置
            const mapEl = document.getElementById('map-display');
            if (!mapEl) return;
            
            const rect = mapEl.getBoundingClientRect();
            const charsPerRow = CONFIG.MAP_WIDTH;
            
            // 使用实际测量的字符宽度（等宽字体 Courier New 28px）
            const charW = mapEl.offsetWidth / charsPerRow;
            const lineH = parseFloat(getComputedStyle(mapEl).lineHeight) || 28 * 1.2;
            
            // 敌人坐标 → 字符位置
            const px = rect.left + enemyObj.x * charW + charW / 2;
            const py = rect.top + lineH * enemyObj.y + lineH / 2;
            
            const span = document.createElement('span');
            const prefix = type === 'heal' ? '+' : '';
            const suffix = type === 'crit' ? '!' : '';
            span.textContent = prefix + value + suffix;
            span.className = 'damage-number ' + (type === 'crit' ? 'crit' : type === 'heal' ? 'heal' : 'damage');
            span.style.left = (px - 15) + 'px'; // 稍微偏移
            span.style.top = (py - 20) + 'px';
            document.body.appendChild(span);
            
            // 动画结束后清理
            span.addEventListener('animationend', () => span.remove(), { once: true });
        }
