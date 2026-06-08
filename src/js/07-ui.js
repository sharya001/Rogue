/* ╔══════════════════════════════════════════╗
        ║  MODULE 7: UI 与生命周期              ║
        ╚══════════════════════════════════════════╝ */
/* ╔══════════════════════════════════════════╗
        ║  MODULE 7: UI 与生命周期              ║
        ╚══════════════════════════════════════════╝ */
// ==================== 装备详情弹窗 ====================
function toggleEquipDetail() {
                    const modal = document.getElementById('equip-detail-modal');
                    if (modal.style.display === 'flex') {
                        closeEquipDetail();
                    } else {
                        openEquipDetail();
                    }
                }

                // ==================== 角色属性面板 [C键] ====================
                function toggleCharSheet() {
                            try {
                                const modal = document.getElementById('char-sheet-modal');
                                if (modal.style.display === 'flex') {
                                    closeCharSheet();
                                } else {
                                    openCharSheet();
                                }
                            } catch(e) {
                                console.error('toggleCharSheet error:', e);
                                addLog('⚠️ 面板打开失败，请查看控制台', 'log-system');
                            }
                        }

                        function closeCharSheet() {
                            document.getElementById('char-sheet-modal').style.display = 'none';
                        }

                        function openCharSheet() {
                                    try {
                                                            const p = gameState.player;
                                                            const cls = classCfg();
                                                            const eq = p.equipment;
                                                            const affix = sumAffixBonuses();

                                                            const totalAtk = p.atk + sumEquipAtk();
                                    const totalDef = p.def + sumEquipDef();
                                    const totalMaxHp = p.maxHp + sumEquipHp();
                                    const equipAtk = sumEquipAtk();
                                    const equipDef = sumEquipDef();
                                    const equipHp = sumEquipHp();
                                    const slotKeys = Object.keys(CONFIG.EQUIPMENT_SLOTS);
                                    const theme = CONFIG.THEMES[gameState.theme] || gameState.castleTheme || CONFIG.THEMES.abyss;

                                    // === 左栏：基本信息 + 词缀 + 职业 ===
                                    let left = '';
                                    // 基本信息块
                                    left += '<div style="background:#0a0a0a; border:1px solid #333; border-radius:6px; padding:8px 10px; margin-bottom:8px;">';
                                    left += '<div style="color:#0f0; font-size:14px; font-weight:bold; margin-bottom:6px; border-bottom:1px solid #333; padding-bottom:3px;">📊 基本信息</div>';
                                    let infoRows = [];
                                    infoRows.push(`名字: <b style="color:#0ff;">${gameState.playerName}</b>`);
                                                                        infoRows.push(`职业: <b style="color:#ff0;">${cls.icon} ${cls.name}</b>  |  等级: <b style="color:#0f0;">Lv.${p.level}</b>`);
                                                                        infoRows.push(`楼层: <b style="color:#fa0;">第 ${gameState.floor} 层</b>  |  主题: <b style="color:#888;">${theme.icon} ${theme.name}</b>`);
                                                                        infoRows.push(`💰金币: <b style="color:#fa0;">${gameState.gold}</b>`);
                                                                        left += infoRows.map(r => `<div style="font-size:14px; padding:2px 0;">${r}</div>`).join('');
                                    left += '</div>';

                                    // 属性块
                                    left += '<div style="background:#0a0a0a; border:1px solid #333; border-radius:6px; padding:8px 10px; margin-bottom:8px;">';
                                    left += '<div style="color:#0f0; font-size:14px; font-weight:bold; margin-bottom:6px; border-bottom:1px solid #333; padding-bottom:3px;">📈 战斗属性</div>';
                                    let statRows = [];
                                    statRows.push(`❤️HP: <b style="color:#f66;">${p.hp}/${totalMaxHp}</b> <span style="color:#888;font-size:12px;">(基础${p.maxHp}+装备${equipHp})</span>`);
                                                                        statRows.push(`🗡️攻击: <b style="color:#ff0;">${totalAtk}</b> <span style="color:#888;font-size:12px;">(基础${p.atk}+装备${equipAtk})</span>`);
                                                                        statRows.push(`🛡️防御: <b style="color:#6af;">${totalDef}</b> <span style="color:#888;font-size:12px;">(基础${p.def}+装备${equipDef})</span>`);
                                                                        left += statRows.map(r => `<div style="font-size:14px; padding:2px 0;">${r}</div>`).join('');
                                                                                                            // 新战斗属性（紧凑一行）
                                                                                                            const pStats = [];
                                                                                                            if (p.shield > 0) pStats.push(`🛡️盾:${p.shield}`);
                                                                                                            if (p.penetration + affix.penetration > 0) pStats.push(`🔩穿透:${p.penetration + affix.penetration}`);
                                                                                                            if (p.critRate + affix.critRate > 5) pStats.push(`💥暴击:${p.critRate + affix.critRate}%`);
                                                                                                            if (p.doubleHit + affix.doubleHit > 0) pStats.push(`🗡️连击:${p.doubleHit + affix.doubleHit}%`);
                                                                                                            if (p.damageReduce + affix.damageReduce > 0) pStats.push(`🛡️免伤:${p.damageReduce + affix.damageReduce}%`);
                                                                                                            if (p.freezeRate + affix.freezeRate > 0) pStats.push(`❄️冰:${p.freezeRate + affix.freezeRate}%`);
                                                                                                            if (p.stunRate + affix.stunRate > 0) pStats.push(`😵晕:${p.stunRate + affix.stunRate}%`);
                                                                                                            if (p.igniteRate + affix.igniteRate > 0) pStats.push(`🔥燃:${p.igniteRate + affix.igniteRate}%`);
                                                                                                            if (p.vulnerableRate + affix.vulnerableRate > 0) pStats.push(`💔脆:${p.vulnerableRate + affix.vulnerableRate}%`);
                                                                                                            if (pStats.length > 0) {
                                                                                                                left += `<div style="font-size:12px; color:#aaa; padding:4px 0 0; border-top:1px solid #222; margin-top:2px;">${pStats.join(' · ')}</div>`;
                                                                                                            }
                                                                                                            left += '</div>';

                                    // 词缀 + 职业合并块
                                    left += '<div style="background:#0a0a0a; border:1px solid #333; border-radius:6px; padding:8px 10px;">';
                                    left += '<div style="color:#0f0; font-size:14px; font-weight:bold; margin-bottom:6px; border-bottom:1px solid #333; padding-bottom:3px;">🔷 词缀 & 职业</div>';
                                    // 词缀（紧凑网格）
                                    let affixLines = [];
                                    if (affix.critRate) affixLines.push(`💥<b style="color:#f66;">暴击+${affix.critRate}%</b>`);
                                    if (affix.bossDmg) affixLines.push(`🗡️<b style="color:#f93;">破阵+${affix.bossDmg}%</b>`);
                                    if (affix.block) affixLines.push(`🛡️<b style="color:#6af;">格挡+${affix.block}%</b>`);
                                    if (affix.lifesteal) affixLines.push(`🩸<b style="color:#f00;">吸血+${affix.lifesteal}%</b>`);
                                    if (affix.gold) affixLines.push(`💰<b style="color:#fa0;">财富+${affix.gold}%</b>`);
                                    if (affix.luck) affixLines.push(`🍀<b style="color:#0f0;">幸运+${affix.luck}%</b>`);
                                    if (affix.heal) affixLines.push(`🧪<b style="color:#f6f;">治愈+${affix.heal}%</b>`);
                                    if (affix.regen) affixLines.push(`✨<b style="color:#0ff;">再生+${affix.regen}%</b>`);
                                    if (affix.penetration) affixLines.push(`🔩<b style="color:#fff;">穿透+${affix.penetration}</b>`);
                                    if (affix.doubleHit) affixLines.push(`🗡️<b style="color:#fa0;">连击+${affix.doubleHit}%</b>`);
                                    if (affix.damageReduce) affixLines.push(`🛡️<b style="color:#6af;">免伤+${affix.damageReduce}%</b>`);
                                    if (affix.maxShield) affixLines.push(`🛡️<b style="color:#0ff;">护盾+${affix.maxShield}</b>`);
                                    if (affix.killHeal) affixLines.push(`💀<b style="color:#f66;">回血+${affix.killHeal}%</b>`);
                                    if (affix.freezeRate) affixLines.push(`❄️<b style="color:#6cf;">冰冻+${affix.freezeRate}%</b>`);
                                    if (affix.stunRate) affixLines.push(`😵<b style="color:#ff0;">眩晕+${affix.stunRate}%</b>`);
                                    if (affix.igniteRate) affixLines.push(`🔥<b style="color:#f60;">点燃+${affix.igniteRate}%</b>`);
                                    if (affix.vulnerableRate) affixLines.push(`💔<b style="color:#f0f;">脆弱+${affix.vulnerableRate}%</b>`);
                                    if (affixLines.length > 0) {
                                                                            left += '<div style="display:flex; flex-wrap:wrap; gap:4px 14px; font-size:13px; margin-bottom:5px;">' + affixLines.map(l => `<span>${l}</span>`).join('') + '</div>';
                                                                        } else {
                                                                            left += '<span style="color:#555;font-size:13px;">无词缀 </span>';
                                                                        }
                                                                        left += `<span style="color:#888;font-size:13px;">| ${cls.icon} ${cls.name}: ${cls.desc}</span>`;
                                    left += '</div>';

                                    // === 右栏：装备 + 天赋 + 套装 ===
                                    let right = '';
                                    // 装备 3×3 紧凑
                                    right += '<div style="background:#0a0a0a; border:1px solid #333; border-radius:6px; padding:8px 10px; margin-bottom:8px;">';
                                    right += '<div style="color:#0f0; font-size:14px; font-weight:bold; margin-bottom:6px; border-bottom:1px solid #333; padding-bottom:3px;">🎒 装备 (9槽)</div>';
                                    right += '<div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:3px;">';
                                    slotKeys.forEach(key => {
                                        const item = eq[key];
                                        const slotCfg = CONFIG.EQUIPMENT_SLOTS[key];
                                        if (!item) {
                                                                                    right += `<div style="font-size:13px; color:#444; padding:3px 4px; border:1px solid #222; border-radius:3px; text-align:center;">${slotCfg.icon}<br><span style="font-size:12px;">空</span></div>`;
                                                                                } else {
                                                                                    const qColor = (item.quality != null && CONFIG.QUALITY_CONFIG[item.quality]) ? CONFIG.QUALITY_CONFIG[item.quality].color : '#fff';
                                                                                    let metrics = [];
                                                                                    if (item.atk) metrics.push(`🗡️${item.atk}`);
                                                                                    if (item.def) metrics.push(`🛡️${item.def}`);
                                                                                    if (item.maxHp) metrics.push(`❤️${item.maxHp}`);
                                                                                    right += `<div style="font-size:13px; padding:4px 5px; border:1px solid #0a0; border-radius:3px; text-align:center; background:#0a1a0a; line-height:1.3; cursor:default;" title="${item.name} ${metrics.join(' ')}">${slotCfg.icon} <span style="color:${qColor};font-weight:bold;">${item.name}</span><br><span style="color:#aaa;font-size:12px;">${metrics.join(' ')}</span></div>`;
                                        }
                                    });
                                    right += '</div></div>';

                                    // 天赋 + 套装 紧凑并排
                                    right += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">';
                                                                        // 天赋
                                                                        right += '<div style="background:#0a0a0a; border:1px solid #333; border-radius:6px; padding:10px 12px;">';
                                                                        right += '<div style="color:#0f0; font-size:14px; font-weight:bold; margin-bottom:6px; border-bottom:1px solid #333; padding-bottom:3px;">⭐ 天赋</div>';
                                                                        const tal = gameState.unlockedTalents;
                                                                        const talIds = Object.keys(tal);
                                                                        if (talIds.length === 0) {
                                                                            right += '<div style="color:#555; font-size:13px;">(未学习)</div>';
                                                                        } else {
                                                                            const treeIcons = { c: '🗡️', e: '🧭', s: '❤️' };
                                                                            talIds.forEach(id => {
                                                                                const level = tal[id];
                                                                                const info = getTalentInfo(id);
                                                                                const icon = treeIcons[id.charAt(0)] || '⭐';
                                                                                const lvColor = level >= 3 ? '#ff0' : level >= 2 ? '#0ff' : '#0f0';
                                                                                right += `<div style="font-size:13px; padding:1px 0;">${icon} <span style="color:${lvColor};">Lv${level}</span> <span style="color:#ccc;">${info ? info.name : id}</span></div>`;
                                                                            });
                                                                        }
                                                                        right += `<div style="font-size:13px; color:#888; margin-top:3px;">天赋点: <b style="color:#ff0;">${gameState.talentPoints}</b></div>`;
                                                                        right += '</div>';
                                                                        // 套装
                                                                        right += '<div style="background:#0a0a0a; border:1px solid #333; border-radius:6px; padding:10px 12px;">';
                                                                        right += '<div style="color:#0f0; font-size:14px; font-weight:bold; margin-bottom:6px; border-bottom:1px solid #333; padding-bottom:3px;">💎 套装</div>';
                                                                        const setCounts = {};
                                                                        slotKeys.forEach(key => { const item = eq[key]; if (item && item.setId) setCounts[item.setId] = (setCounts[item.setId] || 0) + 1; });
                                                                        const setIds = Object.keys(setCounts);
                                                                        if (setIds.length === 0) {
                                                                            right += '<div style="color:#555; font-size:13px;">(未激活)</div>';
                                                                        } else {
                                                                            setIds.forEach(sid => {
                                                                                const set = CONFIG.SET_SYSTEM[sid];
                                                                                const count = setCounts[sid];
                                                                                right += `<div style="font-size:13px; padding:2px 0;"><b style="color:#f6f;">${set.name}</b> <span style="color:#fa0;">${count}件</span></div>`;
                                                                                set.bonus.forEach((b, i) => {
                                                                                    const threshold = (i + 1) * 2;
                                                                                    const active = count >= threshold;
                                                                                    right += `<div style="font-size:12px; padding-left:8px; color:${active?'#0f0':'#555'};">${active?'✅':'⬜'}${threshold}件 ${b}</div>`;
                                                                                });
                                                                            });
                                                                        }
                                                                        right += '</div></div>';
                
                                                                                                            document.getElementById('char-sheet-content').innerHTML = left + right;
                                                document.getElementById('char-sheet-modal').style.display = 'flex';
                                            } catch(e) {
                                                console.error('openCharSheet error:', e, e.stack);
                                                document.getElementById('char-sheet-content').innerHTML = `<div style="color:#f00; padding:20px;">⚠️ 面板出错: ${e.message}<br><span style="font-size:12px;color:#888;">请查看 F12 控制台</span></div>`;
                                                document.getElementById('char-sheet-modal').style.display = 'flex';
                                            }
                                        }
        
        function openEquipDetail() {
            const modal = document.getElementById('equip-detail-modal');
            const content = document.getElementById('equip-detail-content');
            const bonusEl = document.getElementById('ed-total-bonus');
            const p = gameState.player;
            const eq = p.equipment;
            
            // 汇总总加成
            let totalAtk = 0, totalDef = 0, totalHp = 0;
            const slotKeys = Object.keys(CONFIG.EQUIPMENT_SLOTS);
            
            let html = '<div style="display:grid; gap:6px;">';
            
            slotKeys.forEach(key => {
                const item = eq[key];
                const slotCfg = CONFIG.EQUIPMENT_SLOTS[key];
                if (!item) {
                    html += `<div style="background:#0a0a0a; border:1px solid #333; border-radius:6px; padding:6px 10px; color:#555; font-size:12px;">${slotCfg.icon} ${slotCfg.name}: <span style="color:#444;">空</span></div>`;
                    return;
                }
                
                totalAtk += item.atk || 0;
                totalDef += item.def || 0;
                totalHp += item.maxHp || 0;
                
                const qCfg = item.quality != null ? CONFIG.QUALITY_CONFIG[item.quality] : null;
                const qColor = qCfg ? qCfg.color : '#fff';
                const qName = qCfg ? qCfg.name : '';
                
                let statStr = [];
                if (item.atk) statStr.push(`🗡️+${item.atk}`);
                if (item.def) statStr.push(`🛡️+${item.def}`);
                if (item.maxHp) statStr.push(`❤️+${item.maxHp}`);
                
                // 词缀
                let affixStr = '';
                if (item.affixes && item.affixes.length > 0) {
                    affixStr = item.affixes.map(a => {
                        const v = a.val != null ? (a.isPct ? a.val + '%' : a.val) : '';
                        return `<span style="color:#ff0;">${a.desc}${v}</span>`;
                    }).join(' | ');
                }
                
                html += `<div style="background:#0a0a0a; border:1px solid ${qColor}66; border-left:3px solid ${qColor}; border-radius:6px; padding:6px 10px;">`;
                html += `<div style="display:flex; justify-content:space-between; align-items:center;">`;
                html += `<span style="font-size:14px;">${slotCfg.icon} <b style="color:${qColor}">${item.name}</b></span>`;
                html += `<span style="color:${qColor}; font-size:11px;">${qName}</span>`;
                html += `</div>`;
                html += `<div style="color:#0f0; font-size:12px; margin-top:2px;">${statStr.join(' ')}</div>`;
                if (affixStr) html += `<div style="font-size:11px; margin-top:2px;">${affixStr}</div>`;
                if (item.setName) html += `<div style="color:#f93; font-size:11px;">🔗 套装: ${item.setName}</div>`;
                html += `</div>`;
            });
            
            html += '</div>';
            
            // 套装汇总
            const setCounts = {};
            slotKeys.forEach(key => {
                const item = eq[key];
                if (item && item.setId) {
                    setCounts[item.setId] = (setCounts[item.setId] || 0) + 1;
                }
            });
            
            let setHtml = '';
            for (const [sid, count] of Object.entries(setCounts)) {
                const set = CONFIG.SET_SYSTEM[sid];
                if (!set) continue;
                setHtml += `<div style="background:#1a1a00; border:1px solid #f93; border-radius:5px; padding:6px 10px; margin-top:6px;">`;
                setHtml += `<span style="color:#f93; font-weight:bold;">🔗 ${set.name}套装 (${count}件)</span>`;
                set.bonus.forEach((b, i) => {
                    const threshold = [2, 4, 6][i];
                    const active = count >= threshold;
                    setHtml += `<div style="color:${active?'#0f0':'#555'}; font-size:11px; margin-left:8px;">${active?'✅':'⬜'} ${threshold}件: ${b}</div>`;
                });
                setHtml += `</div>`;
            }
            
            content.innerHTML = html + setHtml;
            bonusEl.textContent = `🗡️+${totalAtk} 🛡️+${totalDef} ❤️+${totalHp}`;
            modal.style.display = 'flex';
            gameState.shopOpen = true;  // 锁定移动
        }
        
        function closeEquipDetail() {
            document.getElementById('equip-detail-modal').style.display = 'none';
            gameState.shopOpen = false;
        }
        
        // 学习/升级天赋
        
        
        // 应用天赋被动效果
        
        
        // 检查升级时获得天赋点
        
        
        
        /* ╔══════════════════════════════════════════╗
        ║  MODULE 7: UI 与生命周期              ║
        ╚══════════════════════════════════════════╝ */
        
// ==================== 游戏结束 ====================
        function gameOver() {
                    // 训练模式：不真正死亡 (v3.28.0)
                    if (gameState.isTrainingMode) {
                        gameState.isTrainingMode = false;
                        gameState.player.hp = gameState.player.maxHp + sumEquipHp();
                        addLog('🏋️ 训练结束！幻影被击败，你获得了宝贵的战斗经验', 'log-gain');
                        sfx.play('levelup');
                        updateStatusBar();
                        return;
                    }
                    // 时空凝滞药水：致命伤保留1HP（一次性）
                    if (gameState.player && gameState.player._chronosTonic) {
                        gameState.player.hp = 1;
                        gameState.player._chronosTonic = false;
                        addLog('🕰️ 时空凝滞发动！你从死亡边缘被拉了回来（HP=1）', 'log-gain');
                        sfx.play('heal');
                        updateStatusBar();
                        return;
                    }
                                    gameState.isGameOver = true;
                                                        gameState.achievementStats.deathCount++;
                                                        saveAchievements();
                                                                                    document.getElementById('levelup-modal').style.display = 'none';
                                                                                    document.getElementById('altar-modal').style.display = 'none';
                                                                                    document.getElementById('library-modal').style.display = 'none';
                                                                                                                                                                        document.getElementById('blacksmith-modal').style.display = 'none';
                                                                                                                                                                                                                                                                                                                                                document.getElementById('leaderboard-modal').style.display = 'none';
                                                                                                                                                                                                                                                                                                                                                document.getElementById('workshop-modal').style.display = 'none';
                                                                                                                                                                                                                                                                                                                                                            document.getElementById('well-modal').style.display = 'none';
            document.getElementById('potion-pickup-modal').style.display = 'none';
                                                                                                                                                                                                                                                                                                                                                                                                // === 死亡动画 ===
                                                        const gameView = document.getElementById('game-view');
                                                        // 创建闪红层
                                                        let flash = document.getElementById('death-flash');
                                                        if (!flash) {
                                                            flash = document.createElement('div');
                                                            flash.id = 'death-flash';
                                                            document.body.appendChild(flash);
                                                        }
                                                        // 闪红（分两段：快闪→慢消）
                                                        flash.classList.add('active');
                                                        setTimeout(() => { flash.style.opacity = '0.4'; }, 200);
                                                        setTimeout(() => { flash.style.opacity = '0.15'; }, 500);
                                                        setTimeout(() => { flash.classList.remove('active'); flash.style.opacity = ''; }, 900);
                                                        // 震颤
                                                        if (gameView) {
                                                            gameView.classList.add('death-shaking');
                                                            setTimeout(() => gameView.classList.remove('death-shaking'), 800);
                                                        }
                                                        // 粒子爆发（分两波）
                                                        const px = gameState.player.x, py = gameState.player.y;
                                                        const mapRect = document.getElementById('map-display').getBoundingClientRect();
                                                        const cellW = mapRect.width / CONFIG.MAP_WIDTH;
                                                        const cellH = mapRect.height / CONFIG.MAP_HEIGHT;
                                                        const cx = mapRect.left + px * cellW + cellW/2;
                                                        const cy = mapRect.top + py * cellH + cellH/2;
                                                        const spawnParticles = (count, delay) => {
                                                            setTimeout(() => {
                                                                for (let i = 0; i < count; i++) {
                                                                    const p = document.createElement('span');
                                                                    p.className = 'death-particle';
                                                                    p.textContent = ['💀','💥','❌','☠','🩸','†','⛧','✟'][Math.floor(Math.random() * 8)];
                                                                    p.style.left = cx + 'px';
                                                                    p.style.top = cy + 'px';
                                                                    p.style.fontSize = (16 + Math.random() * 24) + 'px';
                                                                    p.style.color = Math.random() < 0.5 ? '#f00' : '#f66';
                                                                    const angle = Math.random() * Math.PI * 2;
                                                                    const dist = 50 + Math.random() * 100;
                                                                    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
                                                                    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
                                                                    p.style.animationDuration = (0.8 + Math.random() * 1.5) + 's';
                                                                    document.body.appendChild(p);
                                                                    setTimeout(() => p.remove(), 2500);
                                                                }
                                                            }, delay);
                                                        };
                                                        spawnParticles(10, 0);     // 第一波
                                                        spawnParticles(8, 300);    // 第二波
                                                        // 延迟显示 Game Over
                                                        setTimeout(() => {
                                                            document.getElementById('final-floor').textContent = gameState.floor;
                                                            document.getElementById('final-name').textContent = gameState.playerName;
                                                            const cls = CONFIG.CLASSES[gameState.playerClass];
                                                            const finalClass = document.getElementById('final-class');
                                                            if (cls && finalClass) {
                                                                finalClass.textContent = `${cls.icon} ${cls.name}`;
                                                                finalClass.style.color = cls.color;
                                                            }
                                                            document.getElementById('game-over').style.display = 'flex';
                                                                                                                    }, 1200);
                                                                                                                    // 计算并显示得分
                                                                                                                    setTimeout(() => {
                                                                                                                        const score = calcScore();
                                                                                                                        document.getElementById('final-score').textContent = `🏆 综合得分: ${score}`;
                                                                                                                        const floor = gameState.floor;
                                                                                                                        const kills = gameState.runKills;
                                                                                                                        const gold = gameState.gold;
                                                                                                                        const clsCfg = CONFIG.CLASSES[gameState.playerClass];
                                                                                                                        const mult = CONFIG.CLASS_SCORE_MULT[gameState.playerClass] || 1.0;
                                                                                                                        document.getElementById('final-score-detail').textContent = 
                                                                                                                            `层数 ${floor}×${CONFIG.SCORE_FLOOR_BASE} + 击杀 ${kills}×${CONFIG.SCORE_KILL_BONUS} + 金币 ${gold}×${CONFIG.SCORE_GOLD_BONUS}` +
                                                                                                                            (mult !== 1.0 ? ` × ${clsCfg.name}系数${mult}` : '');
                                                                                                                        // 保存到排行榜
                                                                                                                        saveToLeaderboard(score);
                                                                                                                    }, 100);
                            addLog(`${gameState.playerName} 已死亡... 游戏结束`, 'log-danger');
                            // 工匠点数结算
                            const metaPts = gameState.floor * 2 + Math.floor(gameState.runKills / 2);
                            META.addPoints(metaPts);
                            addLog(`⚒️ 获得 ${metaPts} 工匠点数（累计: ${META.getPoints()}）`, 'log-system');
                            sfx.play('gameover');
                        }
        
        // ==================== 返回开始界面 ====================
        function backToStart() {
            document.getElementById('game-over').style.display = 'none';
            document.getElementById('start-screen').style.display = 'flex';
            renderClassCards();
            
            // 重置开始界面的头像预览
            const preview = document.getElementById('avatar-preview');
            const placeholder = document.getElementById('avatar-placeholder');
            if (gameState.playerAvatar) {
                preview.src = gameState.playerAvatar;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
} else {
                preview.style.display = 'none';
                placeholder.style.display = 'block';
                switchPxlAvatar(gameState.playerClass);
            }
            
            // 恢复之前的角色名
            document.getElementById('player-name-input').value = gameState.playerName !== '无名勇者' ? gameState.playerName : '';
            document.getElementById('player-name-input').focus();
            
                        // 刷新开始界面数据
                        refreshStartScreen();
                                    drawCastleBg();
                                }
        
        // ==================== 应用职业属性加成 ====================
        function applyClassBonuses() {
            const cls = CONFIG.CLASSES[gameState.playerClass];
            if (!cls) return;
            const p = gameState.player;
            p.hp += cls.hpBonus;
            p.maxHp += cls.hpBonus;
            p.atk += cls.atkBonus;
            p.def += cls.defBonus;
        }
        
        // 获取当前职业配置的辅助函数
        function classCfg() {
            return CONFIG.CLASSES[gameState.playerClass] || {};
        }
        
        // ==================== 重新开始 ====================
        function restartGame() {
            // 清除旧的 afk 定时器（v3.43.3）
            if (gameState._afkTimer) { clearInterval(gameState._afkTimer); gameState._afkTimer = null; }
            
            // 保留角色名和头像
            const savedName = gameState.playerName;
            const savedAvatar = gameState.playerAvatar;
            const savedClass = gameState.playerClass;
            
            gameState = {
                player: {
                                    x: 0,
                                    y: 0,
                                    hp: 100,
                                    maxHp: 100,
                                    atk: 10,
                                    def: 5,
                                    level: 1,
                                    exp: 0,
                                    // 新战斗属性
                                    critRate: 5,          // 暴击率 (%)
                                    penetration: 0,       // 穿透伤害 (真实伤害)
                                    doubleHit: 0,         // 连击率 (%)
                                    damageReduce: 0,      // 伤害减免 (%)
                                    shield: 0,            // 当前护盾值
                                    maxShield: 0,         // 最大护盾值 (战斗开始时重置)
                                    lifestealRate: 0,     // 生命偷取率 (%)
                                    killHeal: 0,          // 击杀回血率 (%)
                                    freezeRate: 0,        // 冰冻率 (%)
                                    stunRate: 0,          // 眩晕率 (%)
                                    igniteRate: 0,        // 点燃率 (%)
                                    vulnerableRate: 0,    // 脆弱率 (%)
                                    equipment: {
                                                            mainHand: null, offHand: null,
                                                            helmet: null, chest: null,
                                                            gloves: null, boots: null,
                                                            ring1: null, ring2: null,
                                                                                                                        necklace: null,
                                                                                                                    },
                                                                                                                    buffs: [], debuffs: {},
_speedPotion: 0, _powerPotion: false, _greedLure: false,
                                                                                                                                                                                                                                         _chronosTonic: false, _berserker: false, _thornsTurns: 0,
                                                                                                                                                                                                                                         _phaseWalk: false,
                                                                                                                                                                                                                                         burnTurns: 0, frozenTurns: 0, stunned: false,
                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                map: [],
                enemies: [],
                potions: [],
                                                potionBelt: [null, null, null, null],
                                                chests: [],
                                exit: { x: 0, y: 0 },
                                floor: 0,
                                gold: 0,
                                isGameOver: false,
                            savedFloor: 0,
                isBossFloor: false,
                bossDefeated: false,
                isShopFloor: false,
                shopNPCs: [],
                shopOpen: false,
                currentNPC: null,
                godMode: false,
                            oneHitKill: false,
                            achievements: {},      // 已解锁成就 {id: true}
                            achievementStats: { kills:0, equipCollected:0, eliteKills:0, bossKills:0, steps:0, chestsOpened:0, fullClearCount:0, goldTotal:0, skillUses:0, deathCount:0, poisonPotionUses:0 },
                            animating: false,
                            autoAttack: true,  // 自动攻击（默认开启）
                            playerName: savedName,
                playerAvatar: savedAvatar,
                playerClass: savedClass,
                talentPoints: 0,
                unlockedTalents: {},
                stats: { kills:0, deaths:0, steps:0, farthestFloor:0, startTime:Date.now() },
                skillCooldown: 0,
                skillActive: false,
                skillTurns: 0,
                                theme: 'abyss',
                                levelUpChoices: [],
                                                                specialRoom: null,
                                                                                                                                                                envEffect: null,
                                                                                                                                                                runKills: 0,
                                                                                                                                                                floorStartKills: 0,
                                                                                                                                                                rareMonster: null,
                                                                                                                                                                                                                                                                                                                                gambleCount: 0,
                                                                                                                                                                                                                                                                                                                                wellUsed: false,
                                                                                                                                                                                                                                                                                                                                isTrainingMode: false,
                                                                                                                                                                                                                                                                                                                                exitLocked: true,     // 出口是否锁定（仅普通层）
                                                                                                                                                                                                                                                                                                                                keyPicked: false,     // 钥匙是否已拾取
                                                                                                                                                                                                                                                                                                                                totalEnemies: 0,      // 本层普通怪物总数（钥匙系统）
                                                                                                                                                                                                                                                                                                                                            };
            
            // 应用职业属性加成
                        applyClassBonuses();
                        // 应用工匠永久升级
                        META.applyToPlayer(gameState.player);
            
            document.getElementById('game-over').style.display = 'none';
            document.getElementById('game-log').innerHTML = '';
            
            // 更新侧边栏角色信息
            updateCharInfo();
            updateTalentPanel();
            
            addLog(`=== 欢迎，${gameState.playerName}！新游戏开始 ===`, 'log-system');
            const clsCfg = CONFIG.CLASSES[gameState.playerClass];
            addLog(`职业：${clsCfg.icon} ${clsCfg.name}`, 'log-system');
            addLog('探索深渊，击杀敌人，到达出口！', 'log-system');
            addLog('控制：方向键 / WASD', 'log-system');
            addLog('宝箱可能含有装备、金币或药水', 'log-system');
            
            generateMap();
            renderMap();
            updateStatusBar();
        }
        
        // ==================== 更新侧边栏角色信息 ====================
        function updateCharInfo() {
            // 更新名字
            document.getElementById('sidebar-name').textContent = gameState.playerName;
            
            // 更新头像
            const avatarImg = document.getElementById('sidebar-avatar');
            const avatarPlaceholder = document.getElementById('sidebar-avatar-placeholder');
            
            if (gameState.playerAvatar) {
                avatarImg.src = gameState.playerAvatar;
                avatarImg.style.display = 'block';
                avatarPlaceholder.style.display = 'none';
            } else {
                avatarImg.style.display = 'none';
                avatarPlaceholder.style.display = 'flex';
            }
            
            // 更新职业显示（v3.43.2 — 与名字合并一行）
            const clsElement = document.getElementById('sidebar-class');
            const cls = CONFIG.CLASSES[gameState.playerClass];
            if (clsElement && cls) {
                clsElement.innerHTML = `${cls.icon} ${cls.name}`;
                clsElement.style.color = cls.color;
            }
            
// 切换像素头像
            if (!gameState.playerAvatar) {
                switchPxlAvatar(gameState.playerClass);
            }
        }
        
        
        /* ╔══════════════════════════════════════════╗
        ║  MODULE 8: 入口与初始化               ║
        ╚══════════════════════════════════════════╝ */
        
// ==================== 排行榜系统 ====================

        function escHtml(s) {
                    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
                }

// ==================== 统计面板 ====================
function showStats() {
    const s = gameState.stats || {};
    const elapsed = s.startTime ? Math.floor((Date.now() - s.startTime) / 1000) : 0;
    const h = Math.floor(elapsed / 3600), m = Math.floor((elapsed % 3600) / 60), sec = elapsed % 60;
    const timeStr = h > 0 ? `${h}时${m}分${sec}秒` : `${m}分${sec}秒`;
    const rows = [
        ['累计击杀', s.kills || 0],
        ['累计死亡', s.deaths || 0],
        ['累计步数', s.steps || 0],
        ['最远到达', `第 ${s.farthestFloor || 0} 层`],
        ['游戏时长', timeStr],
    ];
    let html = '';
    rows.forEach(([label, val]) => {
        html += `<div class="stat-row"><span class="stat-label">${label}</span><span class="stat-value">${val}</span></div>`;
    });
    document.getElementById('stats-content').innerHTML = html;
    document.getElementById('stats-modal').style.display = 'flex';
    gameState.shopOpen = true;
}
function closeStats() {
    document.getElementById('stats-modal').style.display = 'none';
    gameState.shopOpen = false;
}

// ==================== 设置面板 (v3.36.0) ====================
function openSettings() {
    // 同步当前配置到开关状态
    updateToggleUI('enemyInfoPanel', document.getElementById('toggle-enemyInfoPanel'));
    updateToggleUI('damageNumbers', document.getElementById('toggle-damageNumbers'));
    // 敌人统计列表已屏蔽 (v3.43.1)
    document.getElementById('settings-modal').style.display = 'flex';
    if (!gameState.isInCombat) gameState.shopOpen = true;
}

function closeSettings() {
    document.getElementById('settings-modal').style.display = 'none';
    gameState.shopOpen = false;
}

function updateToggleUI(key, el) {
    if (el) {
        el.classList.toggle('active', CONFIG.SETTINGS[key] !== false);
    }
}

function toggleSetting(key, el) {
    CONFIG.SETTINGS[key] = !CONFIG.SETTINGS[key];
    el.classList.toggle('active', CONFIG.SETTINGS[key]);
    // 即时生效提示
    const labels = { enemyInfoPanel: '敌人属性面板', damageNumbers: '伤害数字显示', enemyList: '敌人统计列表' };
    // showToast 已移除，不再显示提示
}

function saveSettingsAndClose() {
    saveSettings();
    closeSettings();
    // showToast('✅ 设置已保存', 1000);
}

function resetSettingsAndClose() {
    CONFIG.SETTINGS.enemyInfoPanel = true;
    CONFIG.SETTINGS.damageNumbers = true;
    // CONFIG.SETTINGS.enemyList = true;  // 已屏蔽 (v3.43.1)
    updateToggleUI('enemyInfoPanel', document.getElementById('toggle-enemyInfoPanel'));
    updateToggleUI('damageNumbers', document.getElementById('toggle-damageNumbers'));
    // updateToggleUI('enemyList', document.getElementById('toggle-enemyList'));  // 已屏蔽
    // showToast('↺ 设置已重置为默认', 1000);
    saveSettings();
    closeSettings();
}

// ==================== 敌人统计列表（已屏蔽 v3.43.1）====================
function updateEnemyList() {
    return; // 已屏蔽
    if (!CONFIG.SETTINGS.enemyList) {
        const panel = document.getElementById('enemy-list-panel');
        if (panel) panel.style.display = 'none';
        return;
    }
    
    const panel = document.getElementById('enemy-list-panel');
    const itemsEl = document.getElementById('enemy-list-items');
    if (!panel || !itemsEl) return;
    
    const enemies = (gameState.enemies || []).filter(e => e && e.hp > 0);
    
    if (enemies.length === 0) {
        panel.style.display = 'none';
        return;
    }
    
    panel.style.display = '';
    document.getElementById('enemy-list-count').textContent = '(' + enemies.length + ')';
    
    let html = '';
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        const hpPercent = Math.max(0, e.hp / e.maxHp) * 100;
        const hpClass = hpPercent <= 20 ? 'critical' : hpPercent <= 50 ? 'low' : '';
        const nameClass = e.isRareBoss ? 'boss-name' : e.isBoss ? 'boss-name' : e.isElite ? 'elite-name' : '';
        let badge = '';
        if (e.isRareBoss) badge = '<span class="enemy-list-badge boss-badge">💎稀有</span>';
        else if (e.isBoss) badge = '<span class="enemy-list-badge boss-badge">🐲Boss</span>';
        else if (e.isElite) badge = '<span class="enemy-list-badge elite-badge">👑精英</span>';
        
        const icon = e.isRareBoss ? '💎' : e.isBoss ? '🐲' : (e.emoji || '👹');
        
        html += '<div class="enemy-list-row">' +
            '<span class="enemy-list-icon">' + icon + '</span>' +
            '<div class="enemy-list-info">' +
                '<div class="enemy-list-name ' + nameClass + '">' + (e.name || '未知敌人') + '</div>' +
                '<div class="enemy-list-hp-bar"><div class="enemy-list-hp-fill ' + hpClass + '" style="width:' + hpPercent + '%"></div></div>' +
            '</div>' +
            '<span class="enemy-list-hp-text">' + e.hp + '/' + e.maxHp + '</span>' +
            badge +
        '</div>';
    }
    
    itemsEl.innerHTML = html;
}
