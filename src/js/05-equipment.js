/* ╔══════════════════════════════════════════╗
        ║  MODULE 5: 装备与商店                 ║
        ╚══════════════════════════════════════════╝ */
// ==================== 比较装备 ====================
        function compareEquipment(newEquip, oldEquip) {
            if (!oldEquip) return true; // 没有旧装备，直接装备
            
// 武器/主手：比较攻击力，有特效的优先
            if (newEquip.type === 'weapon' || newEquip.type === 'mainHand') {
                if (newEquip.atk > oldEquip.atk) return true;
                if (newEquip.atk === oldEquip.atk && newEquip.effect && !oldEquip.effect) return true;
                return false;
            }
            // 防具类：比较防御力
            if (['armor', 'offHand', 'helmet', 'chest', 'gloves', 'boots'].includes(newEquip.type)) {
                if (newEquip.def > oldEquip.def) return true;
                if (newEquip.atk && oldEquip.atk && newEquip.atk > oldEquip.atk) return true;
                return false;
            }
            // 饰品：比较总属性
            return (newEquip.atk + newEquip.def) > (oldEquip.atk + oldEquip.def);
        }
        
                // ==================== 装备对比弹窗 ====================
                let equipCompareCallback = null;  // 弹窗回调
        
                function showEquipCompare(newEquip, callback) {
                                    equipCompareCallback = callback;
                                    const p = gameState.player;
                                    const slotCfg = CONFIG.EQUIPMENT_SLOTS[newEquip.type];
                                    const oldEquip = p.equipment[newEquip.type];
                                    // 诅咒装备不可替换
                                    if (oldEquip && oldEquip.cursed) {
                                        addLog(`⚠️ ${oldEquip.name} 被诅咒，无法替换！需到城堡净化`, 'log-danger');
                                        callback(false);
                                        return;
                                    }
                    const content = document.getElementById('equip-compare-content');
            
                    const renderEquipCard = (equip, label, isNew) => {
                        if (!equip) {
                            return `<div style="background:#0a0a0a; border:1px solid #333; border-radius:8px; padding:12px; text-align:center;">
                                <div style="color:#${isNew?'fa0':'888'}; font-size:13px; font-weight:bold; margin-bottom:6px;">${label}</div>
                                <div style="color:#555; font-size:28px; padding:20px;">空</div>
                            </div>`;
                        }
                        const qColor = (equip.quality != null && CONFIG.QUALITY_CONFIG[equip.quality]) ? CONFIG.QUALITY_CONFIG[equip.quality].color : '#fff';
                        const qName = (equip.quality != null && CONFIG.QUALITY_CONFIG[equip.quality]) ? CONFIG.QUALITY_CONFIG[equip.quality].name : '';
                        let stats = [];
                        if (equip.atk) stats.push(`🗡️+${equip.atk}`);
                        if (equip.def) stats.push(`🛡️+${equip.def}`);
                        if (equip.maxHp) stats.push(`❤️+${equip.maxHp}`);
                        let affixStr = '';
                        if (equip.affixes && equip.affixes.length > 0) {
                            affixStr = equip.affixes.map(a => {
                                const v = a.val != null ? (a.isPct ? a.val + '%' : a.val) : '';
                                return `<span style="color:#0ff;">${a.name}${v ? '+' + v : ''}</span>`;
                            }).join(' · ');
                        }
                        let effectStr = '';
                        if (equip.effect) {
                            effectStr = `<span style="color:#f66;">${equip.effect === 'poison' ? '☠️中毒' : '🩸流血'}${equip.effectChance ? Math.floor(equip.effectChance*100)+'%' : ''}</span>`;
                        }
                        return `<div style="background:#0a0a0a; border:1px solid ${qColor}66; border-left:3px solid ${qColor}; border-radius:8px; padding:12px; text-align:center;">
                            <div style="color:#${isNew?'fa0':'888'}; font-size:13px; font-weight:bold; margin-bottom:6px;">${label}</div>
                            <div style="font-size:16px; color:${qColor}; font-weight:bold;">${slotCfg.icon} ${equip.name}</div>
                            <div style="color:#aaa; font-size:12px;">${qName}</div>
                            <div style="color:#0f0; font-size:14px; margin-top:6px;">${stats.join(' ') || '无属性'}</div>
                            ${affixStr ? `<div style="font-size:11px; margin-top:4px;">${affixStr}</div>` : ''}
                            ${effectStr ? `<div style="font-size:12px; margin-top:4px;">${effectStr}</div>` : ''}
                        </div>`;
                    };
            
                    content.innerHTML = renderEquipCard(newEquip, '🆕 新装备', true) + renderEquipCard(oldEquip, '📋 当前装备', false);
                    document.getElementById('equip-compare-modal').style.display = 'flex';
                }
        
                function equipCompareChoose(replace) {
                    document.getElementById('equip-compare-modal').style.display = 'none';
                    if (equipCompareCallback) {
                        equipCompareCallback(replace);
                        equipCompareCallback = null;
                    }
                }
        
                // ==================== 打开宝箱 ====================
                function openChest(chestIndex) {
                                            const chest = gameState.chests[chestIndex];
                                            const p = gameState.player;
                                            gameState.chests.splice(chestIndex, 1);  // 先移除宝箱

                                            const chestEq = chest.content;
                                            // 天赋：幸运 Lv1 额外5%概率获得装备
                                            const e2lv = getTalentLevel('e2');
                                            let bonusChance = e2lv >= 1 ? 0.05 : 0;
                                            // 也可能有额外品质
                                            const eq = chestEq;
                                            if (e2lv >= 2 && Math.random() < 0.10) {
                                                eq.quality = Math.min(eq.quality + 1, 8);
                                            }
                                            if (e2lv >= 3 && Math.random() < 0.20) {
                                                eq.quality = Math.min(eq.quality + 1, 8);
                                            }

                                            showEquipCompare(eq, (replace) => {
                                                            if (replace) {
                                                                const oldEquip = p.equipment[eq.type];
                                                                if (oldEquip) {
                                                                    addLog(`替换：${oldEquip.name} → ${eq.name}`, 'log-gain');
                                                                } else {
                                                                    addLog(`获得 ${eq.name}，已装备！`, 'log-gain');
                                                                }
                                                                p.equipment[eq.type] = eq;
                                                                sfx.play('equip');
                                                            } else {
                                                                addLog(`放弃 ${eq.name}`, 'log-system');
                                                            }
                                                            renderMap();
                                                            updateStatusBar();
                                                        });
                            
                                                        addLog('宝箱已打开', 'log-system');
                                                                                                                sfx.play('chest');
                                                                                                                gameState.achievementStats.chestsOpened++;
                                                                                                                checkAchievements();
        }
        
        // ==================== 商店系统 ====================
        
                // 城堡 NPC 交互
                function interactCastleNPC(npc) {
                    if (npc.type === 'healer') {
                        const p = gameState.player;
                        const totalHp = p.maxHp + sumEquipHp();
                        const healed = totalHp - p.hp;
                        p.hp = totalHp;
                        addLog(`💚 治疗师恢复了 ${healed} 点 HP！满血了！`, 'log-gain');
                        sfx.play('heal');
                        updateStatusBar();
                    } else if (npc.type === 'shop') {
                        openShop(npc);
                    } else if (npc.type === 'sage') {
                                            const tips = [
                                                '👑 暴击+穿透的装备组合适合高输出哦',
                                                '👑 护盾属性在 Boss 战中非常关键呢',
                                                '👑 冰冻和眩晕可以完全跳过敌人的回合~',
                                                '👑 每 5 层会遇到 Boss，击败后才能看到出口',
                                                '👑 精英怪在地图上显示为 👑，击败必掉装备哟'
                                            ];
                                            addLog(`👸 公主：${npc.desc}`, 'log-system');
                                            addLog(`👸 "${tips[Math.floor(Math.random() * tips.length)]}"`, 'log-system');
                                            sfx.play('talk');
                                        } else if (npc.type === 'blacksmith') {
                                                                                    openBlacksmith();
                                                                                } else if (npc.type === 'cleanser') {
                                                                                    if (CURSE.hasCursed(gameState.player)) {
                                                                                        if (gameState.gold >= 50) {
                                                                                            gameState.gold -= 50;
                                                                                            const count = CURSE.cleanse(gameState.player);
                                                                                            addLog(`✨ 净化师解除了 ${count} 件诅咒装备！`, 'log-gain');
                                                                                            sfx.play('heal');
                                                                                        } else {
                                                                                            addLog('✨ 净化师：解除诅咒需要 50 金币', 'log-system');
                                                                                        }
                                                                                    } else {
                                                                                        addLog('✨ 净化师：你没有诅咒装备需要净化', 'log-system');
                                                                                    }
                                                                                    updateStatusBar();
                                                                                }
                                        }
        
                                // 随机事件 NPC
                                function triggerEventNPC() {
                                            const p = gameState.player;
                                            const good = Math.random() < 0.5; // 50/50
            
                                            // === 普通属性事件（带随机幅度） ===
                                            const statEvents = [
                                                { text: '旅者给了你药水', attr:'hp', base:15, rng:10, icon:'❤️' },
                                                { text: '捡到了钱袋', attr:'gold', base:20, rng:30, icon:'💰' },
                                                { text: '老人传授剑法', attr:'atk', base:2, rng:2, icon:'🗡️' },
                                                { text: '轻甲碎片', attr:'def', base:1, rng:2, icon:'🛡️' },
                                                { text: '温暖力量涌动', attr:'maxHp', base:10, rng:15, icon:'❤️' },
                                                { text: '骑士强化武器', attr:'atk', base:2, rng:4, icon:'🗡️' },
                                                { text: '发现疗伤泉水', attr:'heal', base:1, rng:0, icon:'✨' },
                                                { text: '地精送护甲片', attr:'def', base:2, rng:3, icon:'🛡️' },
                                                { text: '石缝藏金币', attr:'gold', base:30, rng:40, icon:'💰' },
                                                { text: '隐者教导冥想', attr:'maxHp', base:15, rng:15, icon:'❤️' },
                                                { text: '精灵的祝福', attr:'hp', base:15, rng:15, icon:'❤️' },
                                            ];
            
                                            // === 戏剧性特殊事件 ===
                                            const specialGood = [
                                                { text: '一道光芒闪过——这层所有怪物化为尘埃！', action:'killAll' },
                                                { text: '神秘的宝箱凭空出现在你面前！', action:'freeEquip' },
                                                { text: '一阵旋风将你卷到了下一层入口', action:'nextFloor' },
                                                { text: '仙人传授心法，你升了一级！', action:'levelUp' },
                                            ];
                                            const specialBad = [
                                                { text: 'NPC突然变形——它是一只伪装的精英怪！', action:'spawnElite' },
                                                { text: '地板裂开了！你跌落到好几层之下', action:'floorDown' },
                                                { text: '一股黑暗力量卷走了你最珍贵的装备！', action:'stealEquip' },
                                                { text: '传送门开启了——直接把你拖进了Boss房间！', action:'bossFloor' },
                                            ];
            
                                            const useSpecial = Math.random() < 0.35; // 35% 特殊事件
                                                        let text = '', effectDesc = '';
                                                        let specialAction = null;
            
                                                        if (useSpecial) {
                                                            const pool = good ? specialGood : specialBad;
                                                            const ev = pool[Math.floor(Math.random() * pool.length)];
                                                            text = ev.text;
                                                            specialAction = ev.action;
                
                                                // 执行特殊事件
                                                if (ev.action === 'killAll') {
                                                    const count = gameState.enemies.filter(e => e !== null).length;
                                                    gameState.enemies = [];
                                                    addLog('🧙 神秘法师出现在你面前...', 'log-system');
                                                    addLog(`"${text}"`, 'log-system');
                                                    addLog(`💥 消灭了 ${count} 个敌人！`, 'log-gain');
                                                } else if (ev.action === 'freeEquip') {
                                                    const eq = generateEquipment();
                                                    // 给一件蓝色品质装备
                                                    eq.quality = Math.max(eq.quality || 2, 2);
                                                    const qCfg = CONFIG.QUALITY_CONFIG[eq.quality];
                                                    eq.name = qCfg.name + eq.name.replace(/^\[.*?\]\s*/, '');
                                                    const oldEq = p.equipment[eq.type];
                                                    if (oldEq) {
                                                        addLog('🧙 流浪商人出现在你面前...', 'log-system');
                                                        addLog(`"${text}"`, 'log-system');
                                                        addLog(`🎁 获得 ${eq.name}，替换了 ${oldEq.name}`, 'log-gain');
                                                    } else {
                                                        addLog('🧙 流浪商人出现在你面前...', 'log-system');
                                                        addLog(`"${text}"`, 'log-system');
                                                        addLog(`🎁 获得 ${eq.name}！`, 'log-gain');
                                                    }
                                                    p.equipment[eq.type] = eq;
                                                } else if (ev.action === 'nextFloor') {
                                                    gameState.floor++;
                                                    addLog('🧙 风之精灵出现在你面前...', 'log-system');
                                                    addLog(`"${text}"`, 'log-system');
                                                    addLog(`⬇️ 进入第 ${gameState.floor} 层！`, 'log-gain');
                                                } else if (ev.action === 'levelUp') {
                                                    p.exp += CONFIG.EXP_BASE * (p.level + 1);
                                                    addLog('🧙 仙人出现在你面前...', 'log-system');
                                                    addLog(`"${text}"`, 'log-system');
                                                } else if (ev.action === 'spawnElite') {
                                                    const theme = CONFIG.THEMES[gameState.theme] || CONFIG.THEMES.abyss;
                                                    const floor = gameState.floor;
                                                    const scale = 1 + (floor - 1) * 0.35;
                                                    const abilityPool = CONFIG.ELITE_ABILITIES || [];
                                                    const shuffled = [...abilityPool].sort(() => Math.random() - 0.5);
                                                    const abilities = shuffled.slice(0, 1 + Math.floor(Math.random() * 2));
                                                    const enemy = {
                                                        x: gameState.eventNPC.x, y: gameState.eventNPC.y,
                                                        hp: Math.floor(35 * 2 * scale),
                                                        atk: Math.floor(9 * 1.5 * scale),
                                                        def: Math.floor(2 * scale),
                                                        exp: Math.floor(15 * 3),
                                                        gold: Math.floor(10 * 2),
                                                        isElite: true,
                                                        emoji: '👑',
                                                        name: '伪装者',
                                                        eliteAbilities: abilities
                                                    };
                                                    gameState.enemies.push(enemy);
                                                    addLog('🧙 神秘人诡异地笑着...', 'log-system');
                                                    addLog(`"${text}"`, 'log-system');
                                                    addLog('⚠️ 👑 精英"伪装者"出现在地图上！', 'log-danger');
                                                } else if (ev.action === 'floorDown') {
                                                    const drop = 3 + Math.floor(Math.random() * 5);
                                                    gameState.floor = Math.max(1, gameState.floor - drop);
                                                    addLog('🧙 暗影法师出现在你面前...', 'log-system');
                                                    addLog(`"${text}"`, 'log-system');
                                                    addLog(`⬆️ 跌落到第 ${gameState.floor} 层！`, 'log-danger');
                                                } else if (ev.action === 'stealEquip') {
                                                    const slots = Object.keys(p.equipment).filter(k => p.equipment[k]);
                                                    if (slots.length > 0) {
                                                        const slot = slots[Math.floor(Math.random() * slots.length)];
                                                        const stolen = p.equipment[slot];
                                                        p.equipment[slot] = null;
                                                        addLog('🧙 蒙面盗贼出现在你面前...', 'log-system');
                                                        addLog(`"${text}"`, 'log-system');
                                                        addLog(`😱 失去了 ${stolen.name}！`, 'log-danger');
                                                    } else {
                                                        // 没装备可抢，扣金币
                                                        gameState.gold = Math.max(0, gameState.gold - 30);
                                                        addLog('🧙 蒙面盗贼出现在你面前...', 'log-system');
                                                        addLog(`"${text}"`, 'log-system');
                                                        addLog('😱 你身上没什么可抢的，盗贼拿走了30金币', 'log-danger');
                                                    }
                                                } else if (ev.action === 'bossFloor') {
                                                    const bossFloor = Math.ceil(gameState.floor / 5) * 5;
                                                    gameState.floor = bossFloor;
                                                    addLog('🧙 黑暗祭司出现在你面前...', 'log-system');
                                                    addLog(`"${text}"`, 'log-system');
                                                    addLog(`🐲 被传送到第 ${bossFloor} 层——Boss层！准备好了吗？`, 'log-danger');
                                                }
                                            } else {
                                                // 普通属性事件，加随机幅度
                                                const ev = statEvents[Math.floor(Math.random() * statEvents.length)];
                                                const rv = ev.rng > 0 ? Math.floor(Math.random() * ev.rng) : 0;
                                                const totalVal = good ? ev.base + rv : -(ev.base + rv);
                                                text = good
                                                    ? `"幸运！${ev.text}（${ev.icon}+${totalVal}）"`
                                                    : `"倒霉！${ev.text.replace(/送|强化|捡|发现|给|祝福/g, m => ({'送':'偷','强化':'摧毁','捡':'扔','发现':'毁','给':'拿','祝福':'诅咒'}[m]||m))}（${ev.icon}${totalVal}）"`;
                
                                                const npcName = good ? '幸运旅者' : '暗影之人';
                                                addLog(`🧙 ${npcName}出现在你面前...`, 'log-system');
                                                addLog(text, 'log-system');
                
                                                if (ev.attr === 'hp') {
                                                    p.hp = Math.max(1, p.hp + totalVal);
                                                    addLog(`${good?'✨':'⚠️'} HP ${totalVal > 0 ? '+' + totalVal : totalVal}（∇${p.hp}）`, good?'log-gain':'log-danger');
                                                } else if (ev.attr === 'gold') {
                                                    gameState.gold = Math.max(0, gameState.gold + totalVal);
                                                    addLog(`${good?'✨':'⚠️'} 金币 ${totalVal > 0 ? '+' + totalVal : totalVal}（∇${gameState.gold}）`, good?'log-gain':'log-danger');
                                                } else if (ev.attr === 'atk') {
                                                    p.atk = Math.max(1, p.atk + totalVal);
                                                    addLog(`${good?'✨':'⚠️'} 攻击 ${totalVal > 0 ? '+' + totalVal : totalVal}（∇${p.atk}）`, good?'log-gain':'log-danger');
                                                } else if (ev.attr === 'def') {
                                                    p.def = Math.max(0, p.def + totalVal);
                                                    addLog(`${good?'✨':'⚠️'} 防御 ${totalVal > 0 ? '+' + totalVal : totalVal}（∇${p.def}）`, good?'log-gain':'log-danger');
                                                } else if (ev.attr === 'maxHp') {
                                                    p.maxHp = Math.max(10, p.maxHp + totalVal);
                                                    p.hp = Math.min(p.hp, p.maxHp + sumEquipHp());
                                                    addLog(`${good?'✨':'⚠️'} HP上限 ${totalVal > 0 ? '+' + totalVal : totalVal}（∇${p.maxHp}）`, good?'log-gain':'log-danger');
                                                } else if (ev.attr === 'heal') {
                                                    p.hp = p.maxHp + sumEquipHp();
                                                    addLog('✨ 满血恢复！', 'log-gain');
                                                }
                                            }
            
                                            gameState.eventNPC = null;
                                                showEventEffect(good);
                                                sfx.play(good ? 'levelup' : 'hurt');
            
                                                        // 楼层变更需要重新生成地图
                                                        if (useSpecial && specialAction && ['nextFloor','floorDown','bossFloor'].includes(specialAction)) {
                                                            generateMap();
                                                        }
            
                                                        if (useSpecial && specialAction === 'spawnElite') {
                                                            renderMap();
                                                        }
            
                                                        renderMap();
                                                        updateStatusBar();
                                                        if (useSpecial && specialAction === 'levelUp') checkLevelUp();
                                                    }
        
                                        function enterDungeon() {
                                            gameState.floor = gameState.savedFloor || 1;
                                            gameState.savedFloor = 0;
                                            gameState.theme = 'abyss';  // 重置主题，城堡不在 CONFIG.THEMES 中
                                            addLog(`🌀 你踏入传送门，回到第 ${gameState.floor} 层！`, 'log-system');
                    sfx.play('boss');
                    generateMap();
                                        renderMap();
                                        updateStatusBar();
                                        autosaveGame();
                                    }
        
                // 打开商店弹窗
        function openShop(npc) {
            gameState.shopOpen = true;
            gameState.currentNPC = npc;
            
            const modal = document.getElementById('shop-modal');
            const title = document.getElementById('shop-title');
            const goldDisplay = document.getElementById('shop-gold');
            const container = document.getElementById('shop-items-container');
            
            // 设置标题和金币
            title.textContent = `${npc.icon} ${npc.name}`;
            goldDisplay.textContent = isNaN(gameState.gold) ? '0' : gameState.gold;
            
// 生成商店商品：6件随机装备 + 3瓶药水
            const items = generateShopItems();
            currentShopItems = items;  // 保存引用供购买时查找
const categories = [
                { types: ['mainHand'], icon: '🗡️', label: '武器' },
                { types: ['offHand', 'helmet', 'chest', 'gloves', 'boots'], icon: '🛡️', label: '防具' },
                { types: ['ring1', 'ring2', 'necklace'], icon: '💍', label: '饰品' },
                { types: ['potion'], icon: '🧪', label: '药水' }
            ];
            
            let html = '';
            let globalIndex = 0;
            const clsShop = classCfg();
            const discountMult = clsShop.shopDiscount ? (1 - clsShop.shopDiscount) : 1;
            // 天赋：商人折扣
            const talentDiscount = [0, 0.10, 0.18, 0.25][getTalentLevel('e3')];
            const finalDiscountMult = Math.max(0.5, discountMult - talentDiscount);
            // 固化商店售价，确保显示与购买价格一致
            currentShopItems.forEach(item => { item.shopPrice = Math.floor(item.price * finalDiscountMult); });
            const showDiscount = finalDiscountMult < 1;
            
categories.forEach(cat => {
                const catItems = items.filter(i => cat.types.includes(i.type));
                if (catItems.length === 0) return;
                
html += `<div style="color: ${npc.color}; font-size: 15px; font-weight: bold; margin: 12px 0 6px; border-bottom: 1px solid ${npc.color}44; padding-bottom: 4px;">${cat.icon} ${cat.label}${showDiscount ? ' <span style=\\\"color:#ff0;font-size:11px;\\\">(' + Math.round((1-finalDiscountMult)*100) + '折)</span>' : ''}</div>`;
                html += '<div style="display: grid; gap: 8px; margin-bottom: 8px;">';
                
                catItems.forEach((item) => {
                    const actualPrice = item.shopPrice;
                    const canAfford = gameState.gold >= actualPrice;
                    const btnBg = canAfford ? '#2a4a2a' : '#3a3a3a';
                    const btnBorder = canAfford ? '#4ecdc4' : '#666';
                    const cursor = canAfford ? 'pointer' : 'not-allowed';
                    const opacity = canAfford ? '1' : '0.5';
                    
// 物品类型图标 + 品质颜色
                    let typeIcon = '📦';
                    let qColor = '#fff';
                    if (item.type === 'potion') {
                        typeIcon = '🧪';
                    } else if (CONFIG.EQUIPMENT_SLOTS[item.type]) {
                        typeIcon = CONFIG.EQUIPMENT_SLOTS[item.type].icon;
                        if (item.quality != null && CONFIG.QUALITY_CONFIG[item.quality]) {
                            qColor = CONFIG.QUALITY_CONFIG[item.quality].color;
                        }
                    }
                    
                    // 装备描述：攻击/防御/HP
                    let itemDesc = item.desc || '';
                    if (!itemDesc && item.type !== 'potion') {
                        const parts = [];
                        if (item.atk) parts.push(`⚔+${item.atk}`);
                        if (item.def) parts.push(`🛡+${item.def}`);
                        if (item.maxHp) parts.push(`❤+${item.maxHp}`);
                        if (item.affixes && item.affixes.length > 0) {
                            parts.push(item.affixes.map(a => a.name).join(' '));
                        }
                        itemDesc = parts.join(' ');
                    }
                    
                    html += `
                        <div style="background: ${btnBg}; border: 2px solid ${btnBorder}; padding: 10px 14px; border-radius: 8px; cursor: ${cursor}; opacity: ${opacity}; transition: all 0.2s; display: flex; align-items: center; gap: 12px;"
                             onmouseover="if(${canAfford}){this.style.transform='scale(1.02)';this.style.borderColor='#ffd700'}"
                             onmouseout="this.style.transform='scale(1)';this.style.borderColor='${btnBorder}'"
                             onclick="buyItem(${globalIndex})">
                            <span style="font-size: 24px; flex-shrink: 0;">${typeIcon}</span>
                            <div style="flex: 1; min-width: 0;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
<span style="color: ${qColor}; font-size: 15px; font-weight: bold;">${item.name}</span>
                                    <span style="color: ${canAfford ? '#ffd700' : '#ff6b6b'}; font-size: 14px; font-weight: bold; flex-shrink: 0;">💰 ${actualPrice}G${actualPrice !== item.price ? `<span style=\\\"color:#888;text-decoration:line-through;font-size:11px;margin-left:4px;\\\">${item.price}</span>` : ''}</span>
                                </div>
                                <div style="color: #aaa; font-size: 12px; margin-top: 2px;">${itemDesc}</div>
                            </div>
                        </div>
                    `;
                    globalIndex++;
                });
                html += '</div>';
            });
            
            container.innerHTML = html;
            modal.style.display = 'flex';
            
            addLog(`💬 与 ${npc.name} 交谈`, 'log-system');
            sfx.play('shop');
        }
        
        // 关闭商店弹窗
        function closeShop() {
            gameState.shopOpen = false;
            gameState.currentNPC = null;
            document.getElementById('shop-modal').style.display = 'none';
        }
        
        // 购买商品
function buyItem(itemIndex) {
            const item = currentShopItems[itemIndex];
            if (!item) return;
            const p = gameState.player;
            
            // 盗贼商店折扣 + 天赋商人
            const clsShop = classCfg();
            const discountMult = clsShop.shopDiscount ? (1 - clsShop.shopDiscount) : 1;
            const talentDiscount = [0, 0.10, 0.18, 0.25][getTalentLevel('e3')];
            const actualPrice = item.shopPrice;
            
            // 检查金币
            if (gameState.gold < actualPrice) {
                addLog(`金币不足！需要 ${actualPrice}G (当前 ${gameState.gold}G)`, 'log-danger');
                return;
            }
            
            // 扣除金币
            gameState.gold -= actualPrice;
            
            // 根据物品类型应用效果
if (item.type === 'potion') {
                const healBonus = 1 + (clsShop.potionBonus || 0) + (clsShop.healBonus || 0) + sumAffixBonuses().heal / 100;
                const totalHp = p.maxHp + sumEquipHp();
                const rawHeal = Math.min(item.heal, totalHp - p.hp);
                const healAmount = Math.min(Math.floor(rawHeal * healBonus), totalHp - p.hp);
                p.hp += healAmount;
                const discountNote = clsShop.shopDiscount ? ` (折扣价${actualPrice}G)` : '';
                addLog(`🛒 购买 ${item.name}，恢复 ${healAmount} HP (-${actualPrice}G${discountNote})`, 'log-gain');
} else if (item.type !== 'potion') {
                // 装备类：直接装备（已是完整装备对象）
                const slotKey = item.type;
                const oldEquip = p.equipment[slotKey];
                const descParts = [];
                if (item.atk) descParts.push(`⚔+${item.atk}`);
                if (item.def) descParts.push(`🛡+${item.def}`);
                if (oldEquip) {
                    addLog(`🛒 购买 ${item.name} (${descParts.join(' ')})，替换 ${oldEquip.name}`, 'log-gain');
                } else {
                    addLog(`🛒 购买 ${item.name} (${descParts.join(' ')})`, 'log-gain');
                }
                p.equipment[slotKey] = item;  // 完整对象直接装备
            }
            
            // 更新商店显示
            updateShopDisplay();
            updateStatusBar();
            sfx.play('buy');
        }
        
// 生成商店商品
        function generateShopItems() {
            const items = [];
            // 6件随机装备
            for (let i = 0; i < 6; i++) {
                const eq = generateEquipment();
                eq.price = Math.floor((eq.quality + 1) * 18 + Math.random() * 15);
                items.push(eq);
            }
            // 3瓶药水
            const potions = [
                { type: 'potion', name: '生命药水', price: 20, heal: 50, desc: '恢复50HP' },
                { type: 'potion', name: '高级药水', price: 45, heal: 120, desc: '恢复120HP' },
                { type: 'potion', name: '超级药水', price: 80, heal: 250, desc: '恢复250HP' }
            ];
            return items.concat(potions);
        }
        
        // 临时存储当前商店商品（用于购买时查找）
        let currentShopItems = [];
        
        // 更新商店显示（刷新金币和按钮状态）
        function updateShopDisplay() {
            if (!gameState.currentNPC) return;
            openShop(gameState.currentNPC);
        }
        
        
        /* ╔══════════════════════════════════════════╗
        ║  MODULE 6: 天赋系统                   ║
        ╚══════════════════════════════════════════╝ */

// ==================== 生成装备（品质+名称+词缀+套装） ====================
        function generateEquipment() {
            const floor = gameState.floor;
            
            // 1. 随机槽位
            const slotKeys = Object.keys(CONFIG.EQUIPMENT_SLOTS);
            const slotKey = slotKeys[Math.floor(Math.random() * slotKeys.length)];
            const slotCfg = CONFIG.EQUIPMENT_SLOTS[slotKey];
            
            // 2. 按权重随机品质（高层倾向高品质）
            const quality = rollQuality(floor);
            const qCfg = CONFIG.QUALITY_CONFIG[quality];
            
            // 3. 主手武器特殊效果（10%概率带毒/流血）
            let effect = null, effectChance = 0;
            if (slotKey === 'mainHand' && Math.random() < 0.1) {
                const availSpecials = CONFIG.SPECIAL_WEAPONS.filter(w => w.tier <= Math.min(quality, 4));
                if (availSpecials.length > 0) {
                    const sp = availSpecials[Math.floor(Math.random() * availSpecials.length)];
                    effect = sp.effect;
                    effectChance = sp.chance;
                }
            }
            
            // 4. 从名称池随机选基础名
            const slotType = slotTypeMap(slotKey);
            const namePool = CONFIG.EQUIP_NAME_POOL[slotType] || CONFIG.EQUIP_NAME_POOL.weapon;
            const baseName = namePool[Math.floor(Math.random() * namePool.length)];
            const fullName = qCfg.name + baseName;
            
            // 5. 计算基础属性
            const atkR = qCfg.atkR, defR = qCfg.defR, hpR = qCfg.hpR;
            let atk = 0, def = 0, maxHp = 0;
            if (slotCfg.stat === 'atk') {
                atk = randRange(atkR[0], atkR[1]);
            } else if (slotCfg.stat === 'def') {
                def = randRange(defR[0], defR[1]);
            } else {
                atk = randRange(atkR[0], atkR[1]);
                def = randRange(defR[0], defR[1]);
            }
            maxHp = randRange(hpR[0], hpR[1]);
            
            // 6. 生成词缀
            const affixCount = qCfg.affixCount;
            let affixes = [];
            if (affixCount > 0) {
                let pool = [...CONFIG.AFFIX_POOL.universal];
                if (['weapon','offhand'].includes(slotType)) pool = pool.concat(CONFIG.AFFIX_POOL.weapon);
                if (['head','body'].includes(slotType)) pool = pool.concat(CONFIG.AFFIX_POOL.defense);
                if (['hand','foot','ring','neck'].includes(slotType)) pool = pool.concat(CONFIG.AFFIX_POOL.explore);
                // 随机不重复选取
                const shuffled = [...pool].sort(() => Math.random() - 0.5);
                for (let i = 0; i < Math.min(affixCount, shuffled.length); i++) {
                    const a = shuffled[i];
                    const vi = Math.min(quality, (a.vals || a.vals_pct || [0]).length - 1);
                    const val = a.vals ? a.vals[vi] : (a.vals_pct ? a.vals_pct[vi] : null);
                    affixes.push({ id: a.id, name: a.name, desc: a.desc, val: val, isPct: !!a.vals_pct });
                }
            }
            
            // 7. 5% 概率附带套装（品质4+）
            let setId = null, setName = null;
            if (quality >= 3 && Math.random() < 0.05) {
                const setKeys = Object.keys(CONFIG.SET_SYSTEM);
                const sk = setKeys[Math.floor(Math.random() * setKeys.length)];
                const set = CONFIG.SET_SYSTEM[sk];
                if (set.parts.includes(slotKey)) {
                    setId = sk; setName = set.name;
                }
            }
            
const equip = { type: slotKey, name: fullName, quality, atk, def, maxHp, affixes, setId, setName, effect, effectChance };
            // 诅咒装备：第5层起 8% 概率，品质4+提升到15%
            if (floor >= 5 && Math.random() < (quality >= 4 ? 0.15 : 0.08)) {
                CURSE.apply(equip);
            }
            return equip;
        }
        
        function rollQuality(floor) {
                    const weights = [...CONFIG.QUALITY_WEIGHT];
                    // 高层提升最低品质
                    const boost = Math.floor(floor / 8);
                    for (let i = 0; i < boost && i < weights.length - 1; i++) {
                        weights[i] = Math.max(1, weights[i] - 2);
                        weights[weights.length - 1 - i] += 2;
                    }
                    // 天赋：幸运 Lv3 品质+1（直接偏向最高品质）
                    const e2lv = getTalentLevel('e2');
                    if (e2lv >= 3) {
                        // 品质+1效果：将最低3个品质的权重转移到下一档
                        for (let i = 0; i < weights.length - 1; i++) {
                            const transfer = Math.max(1, Math.floor(weights[i] * 0.3));
                            weights[i] -= transfer;
                            weights[i + 1] += transfer;
                        }
                    } else if (e2lv >= 2) {
                        // 稀有率+10%
                        const rareIdx = weights.findIndex((_, i) => i >= 4); // 稀有及以上
                        const fromLow = Math.max(1, Math.floor(weights[0] * 0.3));
                        weights[0] -= fromLow;
                        if (rareIdx >= 0) weights[rareIdx] += fromLow;
                    }
                    const total = weights.reduce((a,b) => a + b, 0);
                    let r = Math.random() * total;
                    for (let i = 0; i < weights.length; i++) {
                        r -= weights[i];
                        if (r <= 0) return i;
                    }
                    return weights.length - 1;
        }
        
        function slotTypeMap(slotKey) {
            const map = { mainHand: 'weapon', offHand: 'offhand', helmet: 'head', chest: 'body', gloves: 'hand', boots: 'foot', ring1: 'ring', ring2: 'ring', necklace: 'neck' };
            return map[slotKey] || 'weapon';
        }
        
        function randRange(min, max) { return Math.floor(min + Math.random() * (max - min + 1)); }
        
        // ==================== 生成 Boss 专属武器（必定特殊） ====================
        // ==================== 生成 Boss 专属武器（必定特殊） ====================
                function generateBossWeapon() {
                    // Boss 掉落随机装备，品质保底 + 属性加成
                    const equip = generateEquipment();
                    // Boss 加成：品质至少蓝色(3)，属性 ×1.5，多 1 条词缀
                    equip.quality = Math.max(equip.quality || 3, 3);
                    const qCfg = CONFIG.QUALITY_CONFIG[equip.quality] || CONFIG.QUALITY_CONFIG[3];
                    equip.name = qCfg.name + equip.name.replace(/^\[.*?\]\s*/, '');  // 更新品质前缀
                    if (equip.atk) equip.atk = Math.max(equip.atk, Math.floor(equip.atk * 1.4) + 2);
                    if (equip.def) equip.def = Math.max(equip.def, Math.floor(equip.def * 1.4) + 1);
                    if (equip.maxHp) equip.maxHp = Math.max(equip.maxHp, Math.floor(equip.maxHp * 1.4) + 3);
                    if (!equip.affixes) equip.affixes = [];
                    // 额外确保至少 1 条战斗词缀
                    const combatAffixes = (CONFIG.AFFIX_POOL.weapon || []).concat(CONFIG.AFFIX_POOL.defense || []);
                    if (combatAffixes.length > 0 && equip.affixes.length < 3) {
                        const bonus = combatAffixes[Math.floor(Math.random() * combatAffixes.length)];
                        equip.affixes.push({...bonus});
                        equip.affixes.forEach(a => {  // Boss 词缀效果 ×1.5
                            for (const k of ['allAtk','allDef','allHp','critRate','penetration','doubleHit','damageReduce','maxShield','lifesteal','killHeal','freezeRate','stunRate','igniteRate','vulnRate','bossDmg','block','heal','regen','gold']) {
                                if (a[k]) a[k] = Math.floor(a[k] * 1.5);
                            }
                        });
                    }
                    return equip;
                }
