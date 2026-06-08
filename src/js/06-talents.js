/* ╔══════════════════════════════════════════╗
        ║  MODULE 6: 天赋系统 (3级进阶)            ║
        ╚══════════════════════════════════════════╝ */
// ==================== 天赋系统 ====================
        // 获取天赋等级
        function getTalentLevel(talentId) {
                    return gameState.unlockedTalents[talentId] || 0;
                }

                // 根据 talentId 获取天赋名称/描述/图标
                function getTalentInfo(talentId) {
                                    const trees = CONFIG.TALENT_TREES;
                                    for (const treeName of Object.keys(trees)) {
                                        const tree = trees[treeName];
                                        for (const t of (tree.talents || [])) {
                                            if (t.id === talentId) return t;
                                        }
                                    }
                                    return null;
                                }
        
        // 获取升级天赋所需消耗的天赋点
        function getTalentUpgradeCost(currentLevel) {
            // currentLevel: 0=未学, 1=Lv1, 2=Lv2
            // 返回升级到下一级所需的点数
            if (currentLevel === 0) return 1;      // 首次学习 → Lv1 = 1点
            if (currentLevel === 1) return 2;      // Lv1→Lv2 = 2点
            if (currentLevel === 2) return 3;      // Lv2→Lv3 = 3点
            return 999;                            // 已满级
        }

        // 获取某类天赋累积加成
        function getTalentSum(ids) {
            let sum = 0;
            ids.forEach(id => { sum += getTalentLevel(id); });
            return sum;
        }
        
        // 更新侧边栏天赋面板
        function updateTalentPanel() {
            const listEl = document.getElementById('talent-list');
            const pointsEl = document.getElementById('talent-points-display');
            if (!listEl || !pointsEl) return;
            
            pointsEl.textContent = `可用天赋点: ${gameState.talentPoints}`;
            pointsEl.style.color = gameState.talentPoints > 0 ? '#ff0' : '#666';
            
            let html = '';
            const talents = gameState.unlockedTalents;
            for (const [id, lv] of Object.entries(talents)) {
                if (lv <= 0) continue;
                // 找到天赋信息
                let info = null;
                for (const tree of Object.values(CONFIG.TALENT_TREES)) {
                    const found = tree.talents.find(t => t.id === id);
                    if (found) { info = found; break; }
                }
                if (!info) continue;
                const lvClass = lv >= 3 ? 'lv3' : (lv >= 2 ? 'lv2' : '');
                const stars = '★'.repeat(lv) + '☆'.repeat(3 - lv);
                html += `<span class="talent-badge ${lvClass}" title="${info.desc}">${info.icon}${info.name}${stars}</span>`;
            }
            listEl.innerHTML = html || '<span style="color:#555;font-size:11px;">暂无天赋</span>';
            
            updateSkillButton();
        }
        
        // 更新主动技能按钮
        function updateSkillButton() {
            const btn = document.getElementById('skill-btn');
            if (!btn) return;
            
            // 查找主动技能
            let activeTalent = null;
            for (const tree of Object.values(CONFIG.TALENT_TREES)) {
                const found = tree.talents.find(t => t.active && getTalentLevel(t.id) > 0);
                if (found) { activeTalent = found; break; }
            }
            
            if (!activeTalent) {
                btn.textContent = '🔒 未学习技能';
                btn.className = 'skill-btn cooldown';
                return;
            }
            
            if (gameState.skillActive && gameState.skillTurns > 0) {
                btn.textContent = `${activeTalent.icon} ${activeTalent.name} (剩余${gameState.skillTurns}回合)`;
                btn.className = 'skill-btn active';
            } else if (gameState.skillCooldown > 0) {
                btn.textContent = `${activeTalent.icon} ${activeTalent.name} (冷却${gameState.skillCooldown}层)`;
                btn.className = 'skill-btn cooldown';
            } else {
                btn.textContent = `${activeTalent.icon} ${activeTalent.name} [Q]`;
                btn.className = 'skill-btn ready';
            }
        }
        
        // 使用主动技能
        function useActiveSkill() {
            if (gameState.isGameOver) return;
            if (gameState.skillCooldown > 0 || gameState.skillActive) return;
            
            // 查找主动技能
            let activeTalent = null;
            for (const tree of Object.values(CONFIG.TALENT_TREES)) {
                const found = tree.talents.find(t => t.active && getTalentLevel(t.id) > 0);
                if (found) { activeTalent = found; break; }
            }
            if (!activeTalent) return;
            
            const talentId = activeTalent.id;
            const lv = getTalentLevel(talentId);
            
            if (talentId === 'e6') {
                // 探知：随等级扩大范围
                const range = lv >= 3 ? 3 : (lv >= 2 ? 3 : 2); // Lv1:2, Lv2:3, Lv3:3(全图)
                const cooldown = lv >= 3 ? 2 : (lv >= 2 ? 2 : 3);
                
                if (lv >= 3) {
                    // Lv3: 全图揭示
                    gameState.skillActive = true;
                    gameState.skillTurns = 1;
                    gameState.skillCooldown = cooldown;
                    addLog(`👁️ 探知发动！Lv3 全图揭示！`, 'log-system');
                } else if (lv >= 2) {
                    // Lv2: 5x5范围+显示怪物
                    gameState.skillActive = true;
                    gameState.skillTurns = 1;
                    gameState.skillCooldown = cooldown;
                    addLog(`👁️ 探知发动！Lv2 揭示周围5×5区域`, 'log-system');
                } else {
                    // Lv1: 3x3
                    gameState.skillActive = true;
                    gameState.skillTurns = 1;
                    gameState.skillCooldown = cooldown;
                    addLog(`👁️ 探知发动！揭示周围区域`, 'log-system');
                }
                sfx.play('floor');
                                revealArea(lv);
                            } else if (talentId === 's6') {
                const turns = lv >= 3 ? 7 : (lv >= 2 ? 5 : 3);
                const cooldown = lv >= 3 ? 5 : 8;
                gameState.skillActive = true;
                gameState.skillTurns = turns;
                gameState.skillCooldown = cooldown;
                addLog(`✨ 圣盾发动！Lv${lv} ${turns}回合内免疫伤害`, 'log-gain');
                sfx.play('boss_kill');
            }
        
                            gameState.achievementStats.skillUses++;
                            checkAchievements();
            updateSkillButton();
            updateStatusBar();
        }
        
        // 探知：揭示周围区域（支持等级）
        function revealArea(level) {
            const p = gameState.player;
            let range = level >= 3 ? 99 : (level >= 2 ? 3 : 2);
            addLog(`👁️ 探知 Lv${level}：范围${range}×${range}`, 'log-system');
            
            let nearby = [];
            for (let dy = -range; dy <= range; dy++) {
                for (let dx = -range; dx <= range; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = p.x + dx, ny = p.y + dy;
                    if (nx < 0 || ny < 0 || nx >= CONFIG.MAP_WIDTH || ny >= CONFIG.MAP_HEIGHT) continue;
                    const cell = gameState.map[ny][nx];
                    if (cell === '#') continue;
                    // Boss 层未击败 Boss 时隐藏出口
                    if (gameState.isBossFloor && !gameState.bossDefeated) continue;
                    if (Math.abs(nx - gameState.exit.x) <= 1 && Math.abs(ny - gameState.exit.y) <= 1) nearby.push('🚪出口方向');
                    // Lv2+ 显示附近怪物
                    if (range >= 3 && (cell === 'g' || cell === 'e' || cell === 'B')) {
                        nearby.push(`${cell === 'g' ? '👾怪物' : cell === 'e' ? '👑精英' : '🐲Boss'}`);
                    }
                }
            }
            if (nearby.length > 0) addLog(`👁️ ${nearby.slice(0, 3).join(' · ')}`, 'log-gain');
        }
        
        // 每回合/战斗结束后减少主动技能回合
        function tickSkillTurns() {
            if (gameState.skillActive && gameState.skillTurns > 0) {
                gameState.skillTurns--;
                if (gameState.skillTurns <= 0) {
                    gameState.skillActive = false;
                    // Lv3 圣盾结束后满血恢复
                    const skillTalent = findActiveSkillTalent();
                    if (skillTalent && skillTalent.id === 's6' && getTalentLevel('s6') >= 3) {
                        gameState.player.hp = Math.min(gameState.player.hp + gameState.player.maxHp, gameState.player.maxHp + sumEquipHp());
                        addLog(`✨ 圣盾结束！Lv3 满血恢复！`, 'log-gain');
                    }
                    addLog(`主动技能效果结束，进入冷却`, 'log-system');
                }
                updateSkillButton();
            }
        }

        function findActiveSkillTalent() {
            for (const tree of Object.values(CONFIG.TALENT_TREES)) {
                const found = tree.talents.find(t => t.active && getTalentLevel(t.id) > 0);
                if (found) return found;
            }
            return null;
        }
        
        // 每层减少冷却
        function tickSkillCooldown() {
                    if (gameState.skillCooldown > 0) {
                        // 魔力紊乱：冷却消耗翻倍
                        const ticks = gameState.envEffect && gameState.envEffect.id === 'magicChaos' ? 2 : 1;
                        gameState.skillCooldown = Math.max(0, gameState.skillCooldown - ticks);
                        if (gameState.skillCooldown <= 0) {
                            addLog(`⚡ 主动技能冷却完毕！`, 'log-system');
                        }
                        updateSkillButton();
                    }
                }
        
        // 打开天赋选择弹窗
        function openTalentModal() {
            const modal = document.getElementById('talent-modal');
            if (!modal) return;
            
            const subtitle = document.getElementById('talent-modal-subtitle');
            const container = document.getElementById('talent-trees-container');
            
            subtitle.textContent = `剩余天赋点: ${gameState.talentPoints}`;
            
            let html = '';
            for (const [treeKey, tree] of Object.entries(CONFIG.TALENT_TREES)) {
                html += `<div class="talent-tree-group">`;
                html += `<div class="talent-tree-header" style="color:${tree.color}">${tree.icon} ${tree.name}</div>`;
                html += `<div class="talent-grid">`;
                
                tree.talents.forEach(talent => {
                    const currentLv = getTalentLevel(talent.id);
                    const isMaxed = currentLv >= talent.maxLevel;
                    const upgradeCost = getTalentUpgradeCost(currentLv);
                    const canAfford = gameState.talentPoints >= upgradeCost;
                    const cls = isMaxed ? 'maxed' : (!canAfford ? 'disabled' : '');
                    const costLabel = isMaxed ? 'MAX' : (gameState.talentPoints <= 0 ? '0点' : `消耗${upgradeCost}点`);
                    const stars = '★'.repeat(currentLv) + '☆'.repeat(talent.maxLevel - currentLv);
                    
                    const canClick = canAfford && !isMaxed;
                    html += `<div class="talent-item ${cls}" onclick="${canClick ? `learnTalent('${treeKey}','${talent.id}')` : ''}">`;
                    html += `<span class="talent-item-icon">${talent.icon}</span>`;
                    html += `<span class="talent-item-name">${talent.name}</span>`;
                    html += `<span class="talent-item-level">${stars}</span>`;
                    html += `<span class="talent-item-desc">${talent.desc}${talent.active ? ' [主动]' : ''}</span>`;
                    html += `<span class="talent-item-cost">${costLabel}</span>`;
                    html += `</div>`;
                });
                
                html += `</div></div>`;
            }
            
            container.innerHTML = html;
            modal.style.display = 'flex';
            if (gameState.talentPoints > 0) {
                gameState.shopOpen = true;
            }
        }
        
        // 关闭天赋弹窗
function closeTalentModal() {
            document.getElementById('talent-modal').style.display = 'none';
            gameState.shopOpen = false;
        }

function learnTalent(treeKey, talentId) {
            if (gameState.talentPoints <= 0) return;
            
            const tree = CONFIG.TALENT_TREES[treeKey];
            if (!tree) return;
            const talent = tree.talents.find(t => t.id === talentId);
            if (!talent) return;
            
            const currentLv = getTalentLevel(talentId);
            if (currentLv >= talent.maxLevel) return;
            
            // 消耗天赋点
            const cost = getTalentUpgradeCost(currentLv);
            if (gameState.talentPoints < cost) return;
            
            gameState.talentPoints -= cost;
            gameState.unlockedTalents[talentId] = currentLv + 1;
            
            const newLv = getTalentLevel(talentId);
            addLog(`⭐ 天赋升级：${talent.icon} ${talent.name} Lv${newLv}`, 'log-gain');
            sfx.play('levelup');
            
            // 应用天赋效果
            applyTalentEffect(talentId, treeKey);
            
            // 刷新弹窗
            if (gameState.talentPoints > 0) {
                openTalentModal();
            } else {
                closeTalentModal();
            }
            
            updateTalentPanel();
            updateStatusBar();
        }

// 获取天赋等级值（用于计算型天赋）
function getTalentValue(talentId, level) {
    // 返回指定等级时的实际加成值
    switch (talentId) {
        // 战斗系
        case 'c1': return [10, 20, 30][level - 1] / 100;  // 击杀恢复比例
        case 'c2': return [3, 6, 10][level - 1];            // 攻击加成
        case 'c3': return [3, 6, 10][level - 1];            // 防御加成
        case 'c4': return [3, 6, 9][level - 1];             // 暴击率加成%
        case 'c5': return [2.0, 2.5, 3.0][level - 1];       // 暴击伤害倍率
        case 'c6': return [
            { chance: 0.15, dmg: 0.5, pierce: false },
            { chance: 0.20, dmg: 0.6, pierce: false },
            { chance: 0.25, dmg: 0.8, pierce: true }
        ][level - 1];
        // 探索系
        case 'e1': return [0.5, 1.0, 1.5][level - 1];       // 宝箱金币加成
        case 'e2': return [0.05, 0.12, 0.20][level - 1];    // 宝箱装备率
        case 'e3': return [0.10, 0.18, 0.25][level - 1];    // 商店折扣
        case 'e4': return [0.30, 0.60, 1.0][level - 1];     // 击杀金币
        case 'e5': return [0.15, 0.30, 0.50][level - 1];    // 捷径减少比例
        case 'e6': return [3, 3, 2][level - 1];             // 探知冷却
        // 生存系
        case 's1': return [15, 30, 50][level - 1];          // HP加成
        case 's2': return [0.03, 0.06, 0.10][level - 1];    // 每层恢复
        case 's3': return [0.5, 0.25, 0.0][level - 1];      // 剩余伤害比例
        case 's4': return [0.20, 0.40, 0.60][level - 1];    // 药水效果
        case 's5': return [{ hp: 0.30, defMult: 2, atkMult: 1 },
                          { hp: 0.30, defMult: 2, atkMult: 1.5 },
                          { hp: 0.20, defMult: 2, atkMult: 1.5, burn: true }
        ][level - 1];
        case 's6': return [3, 5, 7][level - 1];             // 无敌回合数
        default: return 0;
    }
}

function applyTalentEffect(talentId, treeKey) {
            const p = gameState.player;
            const lv = getTalentLevel(talentId);
            
            // 立即生效的天赋（永久属性加成）
            switch (talentId) {
                case 'c2': p.atk += [3, 3, 4][lv - 1]; break;     // 重击：每级增量
                case 'c3': p.def += [3, 3, 4][lv - 1]; break;     // 铁壁：每级增量
                case 's1': p.maxHp += [15, 15, 20][lv - 1]; p.hp += [15, 15, 20][lv - 1]; break; // 坚韧
            }
        }

function checkTalentUnlock(newLevel) {
            if (newLevel > 0 && newLevel % CONFIG.TALENT_PER_LEVEL === 0) {
                gameState.talentPoints++;
                addLog(`⭐ 获得天赋点！(Lv${newLevel}) 当前 ${gameState.talentPoints} 点`, 'log-gain');
                updateTalentPanel();
                // 延迟弹出选择界面
                setTimeout(() => openTalentModal(), 500);
            }
        }
