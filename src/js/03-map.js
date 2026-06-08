// ==================== 日志系统 ====================
        function addLog(message, type = '') {
            const logDiv = document.getElementById('game-log');
            const entry = document.createElement('div');
            entry.className = 'log-entry ' + type;
            const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
            entry.textContent = `[${timestamp}] ${message}`;
            logDiv.appendChild(entry);
            
            // 保留最近 20 条
            const entries = logDiv.querySelectorAll('.log-entry');
            if (entries.length > CONFIG.MAX_LOG_ENTRIES) {
                entries[0].remove();
            }
            
            // 自动滚动到底部
            document.getElementById('log-container').scrollTop = document.getElementById('log-container').scrollHeight;
        }
        
        // ==================== 城堡层生成（星辰圣殿） ====================
function generateCastle(returnVisit = false) {
    gameState.map = [];
    const W = CONFIG.MAP_WIDTH;
    const H = CONFIG.MAP_HEIGHT;
    gameState.enemies = []; gameState.potions = []; gameState.chests = [];
    gameState.isBossFloor = false; gameState.isShopFloor = false;
    gameState.theme = 'castle';
    gameState.exit = { x: -1, y: -1 };

    for (let y = 0; y < H; y++) {
        gameState.map[y] = [];
        for (let x = 0; x < W; x++) { gameState.map[y][x] = '#'; }
    }
    for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) { gameState.map[y][x] = '.'; }
    }

    const cx = Math.floor(W / 2), cy = Math.floor(H / 2);
    if (returnVisit) {
        gameState.player.x = cx + 2; gameState.player.y = H - 4;
    } else {
        gameState.player.x = cx; gameState.player.y = H - 3;
    }

    // NPC：四方位+顶端
    gameState.castleNPCs = [
        { x: 4, y: 4, icon: '💚', name: '治疗师', type: 'healer', desc: '免费恢复全部生命值' },
        { x: W - 5, y: 4, icon: '✨', name: '净化师', type: 'cleanser', desc: '解除诅咒装备（50金币/件）' },
        { x: 4, y: H - 5, icon: '🏪', name: '装备商人', type: 'shop', desc: '购买随机装备' },
        { x: W - 5, y: H - 5, icon: '🏗️', name: '铁匠', type: 'blacksmith', desc: '强化装备 + 合成装备' },
        { x: cx, y: 2, icon: '👸', name: '公主', type: 'sage', desc: '勇敢的冒险者，请拯救这片大陆' },
    ];

    gameState.castlePortal = { x: cx, y: cy, icon: '🌀', name: '深渊传送门' };

    // 星辰圣殿配色
    gameState.castleTheme = {
        wall: '░', wallColor: '#48a',
        floor: '·', floorColor: '#1a1a3a',
        bgColor: '#06061a',
        borderColor: '#6af',
        exit: '🌀',
        icon: '🌙',
        name: '星辰圣殿'
    };

    // 装饰物
    gameState.castleDecorations = [];
    // 顶部星空：散布✨⭐
    for (let sx = 2; sx < W - 1; sx += 3) {
        gameState.castleDecorations.push({ x: sx, y: 1, icon: '✨', color: '#eef', size: '1.0em' });
        gameState.castleDecorations.push({ x: sx + 1, y: 2, icon: '·', color: '#aaf', size: '0.8em' });
    }
    gameState.castleDecorations.push({ x: cx, y: 1, icon: '⭐', color: '#fc6', size: '1.6em' });
    gameState.castleDecorations.push({ x: cx - 3, y: 1, icon: '🌙', color: '#eef', size: '1.5em' });
    gameState.castleDecorations.push({ x: cx + 3, y: 1, icon: '🌙', color: '#eef', size: '1.5em' });

    // 四角水晶柱
    gameState.castleDecorations.push({ x: 5, y: 5, icon: '💠', color: '#6cf', size: '1.6em' });
    gameState.castleDecorations.push({ x: W - 6, y: 5, icon: '💠', color: '#6cf', size: '1.6em' });
    gameState.castleDecorations.push({ x: 5, y: H - 6, icon: '💠', color: '#6cf', size: '1.6em' });
    gameState.castleDecorations.push({ x: W - 6, y: H - 6, icon: '💠', color: '#6cf', size: '1.6em' });

    // 魔法阵内圈：8个符文点围绕传送门
    const ring = [
        [-2,0,'◈'],[-1,-1,'◈'],[0,-2,'◈'],[1,-1,'◈'],
        [2,0,'◈'],[1,1,'◈'],[0,2,'◈'],[-1,1,'◈'],
    ];
    ring.forEach(([dx, dy, icon]) => {
        gameState.castleDecorations.push({ x: cx + dx, y: cy + dy, icon: icon, color: '#6cf', size: '1.3em', blocking: false });
    });
    // 内圈发光点
    const inner = [[-1,0,'·'],[0,-1,'·'],[1,0,'·'],[0,1,'·']];
    inner.forEach(([dx, dy, icon]) => {
        gameState.castleDecorations.push({ x: cx + dx, y: cy + dy, icon: icon, color: '#0ff', size: '0.9em', blocking: false });
    });

    // 魔纹路径：从四方通向传送门
    const drawRuneLine = (sx, sy, tx, ty, icon, color) => {
        let x = sx, y = sy;
        while (x !== tx || y !== ty) {
            if (Math.abs(x - tx) >= Math.abs(y - ty)) x += x < tx ? 1 : -1;
            else y += y < ty ? 1 : -1;
            if (x !== tx || y !== ty) {
                gameState.castleDecorations.push({ x: x, y: y, icon: icon, color: color, size: '0.8em', blocking: false });
            }
        }
    };
    // 四条星光路径
    drawRuneLine(cx, cy - 3, cx, cy, '·', '#48c');
    drawRuneLine(cx, cy + 3, cx, cy, '·', '#48c');
    drawRuneLine(cx - 3, cy, cx, cy, '·', '#48c');
    drawRuneLine(cx + 3, cy, cx, cy, '·', '#48c');

    // 底部圣殿入口标记
    gameState.castleDecorations.push({ x: cx, y: H - 2, icon: '▼', color: '#6cf', size: '1.4em', blocking: false });
    gameState.castleDecorations.push({ x: cx - 1, y: H - 2, icon: '◈', color: '#6cf', size: '1.1em', blocking: false });
    gameState.castleDecorations.push({ x: cx + 1, y: H - 2, icon: '◈', color: '#6cf', size: '1.1em', blocking: false });

    // 发光地毯：入口→传送门（中心竖线）
    gameState.castleCarpet = [];
    for (let ry = cy + 3; ry <= H - 3; ry++) {
        gameState.castleCarpet.push({ x: cx, y: ry });
    }

    addLog('🌙 欢迎来到星辰圣殿！', 'log-system');
    addLog('与 NPC 交谈，准备好后踏入中央 🌀 传送门', 'log-system');
}
        function generateMap() {
                    // 城堡层（初始层）：独立生成
                    if (gameState.floor === 0) {
                        generateCastle();
                        return;
                    }
            
                    // 根据层数切换地图主题
            const themeIndex = Math.floor((gameState.floor - 1) / 5) % CONFIG.THEME_ORDER.length;
            const newTheme = CONFIG.THEME_ORDER[themeIndex];
            if (gameState.theme !== newTheme) {
                            const oldTheme = gameState.theme;
                            gameState.theme = newTheme;
                            const themeObj = CONFIG.THEMES[newTheme];
                            const oldThemeObj = CONFIG.THEMES[oldTheme] || gameState.castleTheme || { icon: '🏰', name: '城堡' };
                            addLog(`🌍 环境变化：${oldThemeObj.icon}${oldThemeObj.name} → ${themeObj.icon}${themeObj.name}`, 'log-system');
                // [BGM 已禁用] bgm.switchTheme(newTheme);
                            } else {
                                // [BGM 已禁用] bgm.play(newTheme);
                            }
            
            // 初始化全墙壁
            gameState.map = [];
            for (let y = 0; y < CONFIG.MAP_HEIGHT; y++) {
                gameState.map[y] = [];
                for (let x = 0; x < CONFIG.MAP_WIDTH; x++) {
                    gameState.map[y][x] = '#';
                }
            }
            
            // 随机漫步生成路径
            const totalFloor = Math.floor(CONFIG.MAP_WIDTH * CONFIG.MAP_HEIGHT * 0.4);
            let x = Math.floor(CONFIG.MAP_WIDTH / 2);
            let y = Math.floor(CONFIG.MAP_HEIGHT / 2);
            let floorsCarved = 0;
            
            while (floorsCarved < totalFloor) {
                if (gameState.map[y][x] === '#') {
                    gameState.map[y][x] = '.';
                    floorsCarved++;
                }
                
                // 随机方向
                const dir = Math.floor(Math.random() * 4);
                if (dir === 0 && y > 1) y--;
                else if (dir === 1 && y < CONFIG.MAP_HEIGHT - 2) y++;
                else if (dir === 2 && x > 1) x--;
                else if (dir === 3 && x < CONFIG.MAP_WIDTH - 2) x++;
            }
            
            // 确保边界是墙
            for (let y = 0; y < CONFIG.MAP_HEIGHT; y++) {
                gameState.map[y][0] = '#';
                gameState.map[y][CONFIG.MAP_WIDTH - 1] = '#';
            }
            for (let x = 0; x < CONFIG.MAP_WIDTH; x++) {
                gameState.map[0][x] = '#';
                gameState.map[CONFIG.MAP_HEIGHT - 1][x] = '#';
            }
            
            // 找到所有可行走位置
            const walkable = [];
            for (let y = 1; y < CONFIG.MAP_HEIGHT - 1; y++) {
                for (let x = 1; x < CONFIG.MAP_WIDTH - 1; x++) {
                    if (gameState.map[y][x] === '.') {
                        walkable.push({ x, y });
                    }
                }
            }
            
            // 放置玩家（第一个可行走位置）
            if (walkable.length > 0) {
                gameState.player.x = walkable[0].x;
                gameState.player.y = walkable[0].y;
                walkable.shift();
            }
            
            // 打乱剩余位置
                        shuffleArray(walkable);
            
                        // 判断是否为 Boss 层（每 5 层）——必须在放置出口之前
                        gameState.isBossFloor = (gameState.floor % CONFIG.BOSS_FLOOR_INTERVAL === 0);
            
                        // 判断是否为商店层（每 3 层，且不是 Boss 层）
                                                gameState.isShopFloor = (gameState.floor % CONFIG.SHOP_FLOOR_INTERVAL === 0) && !gameState.isBossFloor;

                                                // 特殊房间判定（非Boss层、非商店层，~40%概率）
                                                                        gameState.specialRoom = null;
                                                                        const _srRoll = Math.random();

                                                                        if (!gameState.isBossFloor && !gameState.isShopFloor && _srRoll < CONFIG.SPECIAL_ROOM_CHANCE) {
                                                                            const roomTypes = CONFIG.SPECIAL_ROOMS;
                                                                            const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
                                                                            gameState.specialRoom = { type: roomType.id };
                                                                            addLog(`${roomType.icon} ⚠️ 你发现了特殊房间：${roomType.name}！${roomType.desc}`, 'log-system');
                                                                            // 弹窗提示
                                                                            const roomName = roomType.name;
                                                                            const roomIcon = roomType.icon;
                                                                            const roomDesc = roomType.desc;
                                                                            setTimeout(() => {
                                                                                const modal = document.getElementById('special-room-modal');
                                                                                if (modal) {
                                                                                    modal.innerHTML = `<div style="text-align:center;"><div style="font-size:32px;margin-bottom:8px;">${roomIcon}</div><div style="color:#ff0;font-size:18px;font-weight:bold;margin-bottom:8px;">发现特殊房间：${roomName}</div><div style="color:#aaa;font-size:14px;margin-bottom:12px;">${roomDesc}</div><button onclick="this.closest('#special-room-modal').style.display='none'" style="padding:6px 24px;background:#333;color:#fff;border:1px solid #666;border-radius:4px;cursor:pointer;font-size:14px;">知道了</button></div>`;
                                                                                    modal.style.display = 'flex';
                                                                                }
                                                                            }, 300);
                                                                            if (roomType.id === 'treasure') { generateTreasureRoom(); }
                                                                                                                                                        else if (roomType.id === 'arena') { generateArena(); }
                                                                                                                                                        else if (roomType.id === 'altar') { generateAltar(); }
                                                                                                                                                        else if (roomType.id === 'library') { generateLibrary(); }
                                                                                                                                                        else if (roomType.id === 'gamble') { generateGambleRoom(); }
                                                                                                                                                        else if (roomType.id === 'rift') { generateRiftRoom(); }
                                                                                                                                                        else if (roomType.id === 'training') { generateTrainingRoom(); }
                                                                                                                                                        else if (roomType.id === 'well') { generateWellRoom(); }
                                                                                                                                                        sfx.play('floor');
                                                                                                                                                        // NOTE: Do NOT return here — must continue to place exit and render
                                                                                                                                                        }

                                                                        // 环境效果判定（非Boss/非商店/非特殊，~20%概率）
                                                                        gameState.envEffect = null;
                                                                        if (!gameState.isBossFloor && !gameState.isShopFloor && Math.random() < CONFIG.ENV_EFFECT_CHANCE) {
                                                                            const effects = CONFIG.ENV_EFFECTS;
                                                                            const env = effects[Math.floor(Math.random() * effects.length)];
                                                                            gameState.envEffect = { id: env.id, icon: env.icon, name: env.name, color: env.color };
                                                                            addLog(`${env.icon} 环境效果：${env.name} — ${env.desc}`, 'log-danger');
                                                                        }
            
                        // 放置出口（最后一个位置，受e5捷径影响）
                        if (walkable.length > 0) {
                            // 特殊房间：不覆盖已设置的出口
                            if (!gameState.specialRoom) {
                            const e5lv = getTalentLevel('e5');
                            let exitIdx;
                            if (e5lv >= 3) {
                                // Lv3: 直接选中间位置（最捷径）
                                exitIdx = Math.floor(walkable.length * 0.5);
                            } else if (e5lv >= 2) {
                                // Lv2: 选倒数1/3位置
                                exitIdx = Math.floor(walkable.length * 0.66);
                            } else {
                                // Lv1: 选倒数15%位置（从末尾算）
                                const offset = Math.max(1, Math.floor(walkable.length * 0.15));
                                exitIdx = Math.max(0, walkable.length - 1 - offset);
                            }
                            let exitPos = walkable[exitIdx];
                            
                            // 可达性检查：确保出口位置与玩家之间存在通路，避免被墙包围 (v3.43.1)
                            function checkReachable(sx, sy, ex, ey) {
                                if (sx === ex && sy === ey) return true;
                                const visited = new Set();
                                const queue = [{ x: sx, y: sy }];
                                visited.add(`${sx},${sy}`);
                                while (queue.length > 0) {
                                    const cur = queue.shift();
                                    for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
                                        const nx = cur.x + dx, ny = cur.y + dy;
                                        const key = `${nx},${ny}`;
                                        if (visited.has(key)) continue;
                                        if (nx < 0 || ny < 0 || nx >= CONFIG.MAP_WIDTH || ny >= CONFIG.MAP_HEIGHT) continue;
                                        if (gameState.map[ny][nx] !== '.') continue;
                                        if (nx === ex && ny === ey) return true;
                                        visited.add(key);
                                        queue.push({ x: nx, y: ny });
                                    }
                                }
                                return false;
                            }
                            
                            // 如果选定的出口不可达，从 walkable 中筛选可达的位置
                            if (!checkReachable(gameState.player.x, gameState.player.y, exitPos.x, exitPos.y)) {
                                const reachable = walkable.filter(pos => 
                                    checkReachable(gameState.player.x, gameState.player.y, pos.x, pos.y)
                                );
                                if (reachable.length > 0) {
                                    exitPos = reachable[Math.floor(Math.random() * reachable.length)];
                                    addLog('🌀 传送门出现在可达位置', 'log-system');
                                }
                            }
                            
                            const finalExit = exitPos;
                // Boss 层：出口隐藏，击败 Boss 后才出现
                if (gameState.isBossFloor) {
                    gameState.hiddenExit = finalExit;  // 保存位置，击败 Boss 后放置
                    gameState.exit = { x: -1, y: -1 };  // 不可达
                    gameState.bossDefeated = false;
                } else {
                    gameState.exit = finalExit;
                }
                            }
                            // 特殊房间：arena 出口由 checkArenaClear 设置，treasure/well 由 generator 设置
                            // rift 由 chooseRiftDoor 处理，其他房间 exit 已在 generator 中设置
                        }
            
            // 放置敌人（特殊房间已由各自生成器处理）
                        gameState.enemies = [];
            
                        if (gameState.specialRoom) {
                            // 特殊房间：不生成怪物，由 generateTreasureRoom/generateArena 等内部处理
                        } else if (gameState.isShopFloor) {
                // 商店层：放置 1 个杂货商人 NPC
                gameState.shopNPCs = [];
                if (walkable.length > 0) {
                    const pos = walkable.pop();
                    gameState.shopNPCs.push({
                        x: pos.x,
                        y: pos.y,
                        ...CONFIG.SHOP_NPCS[0]
                    });
                }
                addLog(`🏪 欢迎来到商店层！走近杂货商人查看商品`, 'log-system');
                addLog(`💰 可用金币：${gameState.gold}`, 'log-system');
            } else if (gameState.isBossFloor) {
                // Boss 层：只生成一个 Boss
                                const pos = walkable.length > 0 ? walkable.pop() : { x: 10, y: 10 };
                                const bossIndex = Math.min(Math.floor((gameState.floor - 1) / CONFIG.BOSS_FLOOR_INTERVAL), CONFIG.BOSS_NAMES.length - 1);
                                const scale = 1 + (gameState.floor - 1) * 0.35;
                                const isRareBoss = gameState.floor % CONFIG.RARE_BOSS_FLOOR_INTERVAL === 0 && gameState.floor > 0;
                                let bossObj;
                                if (isRareBoss) {
                                    const rareIdx = Math.min(Math.floor((gameState.floor - 1) / CONFIG.RARE_BOSS_FLOOR_INTERVAL) % CONFIG.RARE_BOSSES.length, CONFIG.RARE_BOSSES.length - 1);
                                    const rc = CONFIG.RARE_BOSSES[rareIdx];
                                    bossObj = {
                                        x: pos.x, y: pos.y, hp: Math.floor(CONFIG.BASE_ENEMY_HP * CONFIG.BOSS_HP_MULTIPLIER * scale * 1.5), maxHp: Math.floor(CONFIG.BASE_ENEMY_HP * CONFIG.BOSS_HP_MULTIPLIER * scale * 1.5), atk: Math.floor(CONFIG.BASE_ENEMY_ATK * CONFIG.BOSS_ATK_MULTIPLIER * scale * 1.5), def: Math.floor(CONFIG.BASE_ENEMY_DEF * scale * 1.5), exp: Math.floor(20 * CONFIG.BOSS_EXP_MULTIPLIER * 2), gold: Math.floor(50 * CONFIG.BOSS_GOLD_MULTIPLIER * 2), isBoss: true, isRareBoss: true, name: rc.name, emoji: rc.icon, rareSkills: rc.skills,
                                    };
                                    addLog('🐲🔥 稀有Boss「' + rc.icon + ' ' + rc.name + '」降临！属性x1.5，掉落x2！', 'log-danger');
                                } else {
                                    bossObj = {
                                        x: pos.x, y: pos.y, hp: Math.floor(CONFIG.BASE_ENEMY_HP * CONFIG.BOSS_HP_MULTIPLIER * scale), maxHp: Math.floor(CONFIG.BASE_ENEMY_HP * CONFIG.BOSS_HP_MULTIPLIER * scale), atk: Math.floor(CONFIG.BASE_ENEMY_ATK * CONFIG.BOSS_ATK_MULTIPLIER * scale), def: Math.floor(CONFIG.BASE_ENEMY_DEF * scale), exp: Math.floor(20 * CONFIG.BOSS_EXP_MULTIPLIER), gold: Math.floor(50 * CONFIG.BOSS_GOLD_MULTIPLIER), isBoss: true, name: CONFIG.BOSS_NAMES[bossIndex],
                                    };
                                    addLog('⚠️ 警告：Boss ' + CONFIG.BOSS_NAMES[bossIndex] + ' 出现在这一层！', 'log-danger');
                                }
                                gameState.enemies.push(bossObj);
                addLog(`🔒 击败 Boss 后传送门才会出现！`, 'log-system');
                sfx.play('boss');
            } else {
                // 普通层：从主题怪物池随机生成
                const enemyPool = CONFIG.THEME_ENEMIES[gameState.theme] || CONFIG.THEME_ENEMIES.abyss;
                const enemyCount = Math.min(5 + gameState.floor, Math.floor(walkable.length / 3));
                for (let i = 0; i < enemyCount && walkable.length > 0; i++) {
                    const pos = walkable.pop();
                    const scale = 1 + (gameState.floor - 1) * 0.35;  // 缩放系数（v3.13.1 回调）
                    const type = enemyPool[Math.floor(Math.random() * enemyPool.length)];
                                        let mutation = null;
                                        // 怪物突变：~15%概率 (v3.29.0)
                                        if (Math.random() < CONFIG.MONSTER_MUTATION_CHANCE) {
                                            mutation = CONFIG.MONSTER_MUTATIONS[Math.floor(Math.random() * CONFIG.MONSTER_MUTATIONS.length)];
                                        }
                                        const enemyObj = {
                                            x: pos.x,
                                            y: pos.y,
                                            hp: Math.floor(CONFIG.BASE_ENEMY_HP * scale * type.hpMod),
                                            maxHp: Math.floor(CONFIG.BASE_ENEMY_HP * scale * type.hpMod),
                                            atk: Math.floor(CONFIG.BASE_ENEMY_ATK * scale * type.atkMod),
                                            def: Math.floor(CONFIG.BASE_ENEMY_DEF * scale * type.defMod),
                                            exp: Math.floor(20 * scale * type.expMod),
                                            gold: Math.floor((Math.random() * 10 + 5) * gameState.floor),
                                            isBoss: false,
                                            name: mutation ? `【${mutation.icon}${mutation.name}】${type.name}` : type.name,
                                            emoji: type.emoji,
                                            mutation: mutation ? mutation.id : null,
                                        };
                                        // 铁壁：防御×1.5
                                        if (mutation && mutation.id === 'ironWall') enemyObj.def = Math.floor(enemyObj.def * 1.5);
                                        if (mutation) addLog(`${mutation.icon} ${mutation.name}怪物「${enemyObj.name}」出现了！`, 'log-danger');
                                        gameState.enemies.push(enemyObj);
                }
            
                            // 精英怪：~25% 概率出现（Boss层不生成）
                            if (!gameState.isBossFloor && Math.random() < CONFIG.ELITE_CHANCE && walkable.length > 0) {
                                            const pos = walkable.pop();
                                const scale = 1 + (gameState.floor - 1) * 0.35;  // 精英缩放
                                const baseType = enemyPool[Math.floor(Math.random() * enemyPool.length)];
                                // 随机 1-2 个能力
                                const shuffled = [...CONFIG.ELITE_ABILITIES].sort(() => Math.random() - 0.5);
                                const abilityCount = 1 + (Math.random() < 0.4 ? 1 : 0);
                                const abilities = shuffled.slice(0, abilityCount);
                                const abilityNames = abilities.map(a => a.name).join('/');
                                gameState.enemies.push({
                                    x: pos.x,
                                    y: pos.y,
                                    hp: Math.floor(CONFIG.BASE_ENEMY_HP * CONFIG.ELITE_HP_MULTIPLIER * scale),
                                    maxHp: Math.floor(CONFIG.BASE_ENEMY_HP * CONFIG.ELITE_HP_MULTIPLIER * scale),
                                    atk: Math.floor(CONFIG.BASE_ENEMY_ATK * CONFIG.ELITE_ATK_MULTIPLIER * scale),
                                    def: Math.floor(CONFIG.BASE_ENEMY_DEF * scale),
                                    exp: Math.floor(20 * scale * CONFIG.ELITE_EXP_MULTIPLIER),
                                    gold: Math.floor((Math.random() * 10 + 5) * gameState.floor * 2),
                                    isBoss: false,
                                    isElite: true,
                                    name: `⭐精英 ${baseType.name}`,
                                    emoji: baseType.emoji,
                                    eliteAbilities: abilities,
                                    abilityNames: abilityNames
                                });
                                addLog(`⚠️ 精英怪 "${abilityNames}" 出现在这一层！`, 'log-danger');
                                                                            }
                                                                            // 稀有怪：~5% 概率出现（非Boss/商店层，从第3层起）
                                                                            if (!gameState.isBossFloor && !gameState.isShopFloor && gameState.floor >= 3 && Math.random() < 0.05 && walkable.length > 0) {
                                                                                const pos = walkable.pop();
                                                                                gameState.rareMonster = { x: pos.x, y: pos.y, turnsLeft: 3, emoji: '💎', name: '稀有幻影' };
                                                                                addLog('💎 一道彩虹光芒闪过——稀有幻影出现了！3回合后消失！', 'log-system');
                                                                            }
                                                                            }  // end else (Boss/普通敌人)

                                        // 钥匙系统：记录普通层初始普通怪物总数（v3.42.0）
                                        if (!gameState.isBossFloor && !gameState.isShopFloor && !gameState.specialRoom) {
                                            gameState.totalEnemies = gameState.enemies.filter(e => !e.isBoss && !e.isElite).length;
                                            gameState.exitLocked = true;
                                        } else {
                                            gameState.exitLocked = false;
                                        }
            
                                                                                                                        // 放置药水（随机 ~50% 概率出现，1-3瓶，类型按稀有度权重随机）
                                                                                                    gameState.potions = [];
                                                                                                    if (Math.random() < 0.5 && walkable.length > 0) {
                                                                                                        const potionCount = Math.min(3, 1 + Math.floor(Math.random() * 3));
                                                                                                        for (let i = 0; i < potionCount && walkable.length > 0; i++) {
                                                                                                            const pos = walkable.pop();
                                                                                                            const r = Math.random();
                                                                                                            let pType;
                                                                                                            if (r < 0.40) pType = 'health';
                                                                                                            else if (r < 0.58) pType = 'mana';
                                                                                                            else if (r < 0.70) pType = 'shield';
                                                                                                            else if (r < 0.80) pType = 'speed';
                                                                                                            else if (r < 0.88) pType = 'power';
                                                                                                            else if (r < 0.94) pType = 'aoePoison';
                                                                                                            else if (r < 0.97) pType = 'greedLure';
                                                                                                            else if (r < 0.985) pType = 'chronos';
                                                                                                            else if (r < 0.995) pType = 'berserker';
                                                                                                            else if (r < 0.998) pType = 'thorns';
                                                                                                            else pType = 'gamble';
                                                                                                            const ptCfg = (CONFIG.POTION_TYPES || []).find(pt => pt.id === pType);
                                                                                                            gameState.potions.push({
                                                                                                                x: pos.x,
                                                                                                                y: pos.y,
                                                                                                                type: pType,
                                                                                                                icon: ptCfg ? ptCfg.mapIcon : '🧪',
                                                                                                                color: ptCfg ? ptCfg.color : '#0f0'
                                                                                                            });
                                                                                                        }
                                                                                                    }
            
                                                                                                    // 放置宝箱（随机 ~45% 概率出现，Boss层/S层调整）
                        gameState.chests = [];
                        const chestChance = gameState.isBossFloor ? 0.8 : gameState.isShopFloor ? 0.3 : 0.45;
                        if (Math.random() < chestChance && walkable.length > 0) {
                            const chestCount = Math.min(2, 1 + Math.floor(Math.random() * 2));
                            for (let i = 0; i < chestCount && walkable.length > 0; i++) {
                                                            const pos = walkable.pop();
                                                            gameState.chests.push({
                                                                x: pos.x,
                                                                y: pos.y,
                                                                type: 'equipment',
                                                                content: generateEquipment()
                                                            });
                            }
                            }  // end chestChance if
            
                                        // 回城传送门：~15% 概率出现（非Boss层）
                                        if (!gameState.isBossFloor && walkable.length > 0 && Math.random() < 0.15) {
                                            const ppos = walkable.pop();
                                            gameState.castleReturnPortal = { x: ppos.x, y: ppos.y };
                                        } else {
                                                                                    gameState.castleReturnPortal = null;
                                                                                }
            
                                                    // 随机事件NPC：~20% 概率出现（非Boss层）
                                                    if (!gameState.isBossFloor && walkable.length > 0 && Math.random() < 0.2) {
                                                        const epos = walkable.pop();
                                                        gameState.eventNPC = { x: epos.x, y: epos.y };
                                                    } else {
                                                        gameState.eventNPC = null;
                                                    }
            
                                                                                                addLog(`第 ${gameState.floor} 层 - 迷宫生成完毕`, 'log-system');
        // 主题切换预告
        const nextThemeFloor = Math.ceil(gameState.floor / 5) * 5;
        const floorsUntilTheme = nextThemeFloor - gameState.floor;
        if (floorsUntilTheme === 1) {
            const nextThemeKey = CONFIG.THEME_ORDER[Math.floor(nextThemeFloor / 5) % CONFIG.THEME_ORDER.length];
            const nextTheme = CONFIG.THEMES[nextThemeKey];
            if (nextTheme) addLog(`${nextTheme.icon} 前方隐约传来异样的气息... ${nextTheme.name}就在眼前`, 'log-system');
        } else if (floorsUntilTheme === 2) {
            const nextThemeKey = CONFIG.THEME_ORDER[Math.floor(nextThemeFloor / 5) % CONFIG.THEME_ORDER.length];
            const nextTheme = CONFIG.THEMES[nextThemeKey];
            if (nextTheme) addLog(`${nextTheme.icon} 空气中开始弥漫着变化的气息...`, 'log-system');
        }
        sfx.play('floor');
                }
                                        // ==================== 铁匠铺：强化 + 合成 ====================

                        let blacksmithTab = 'enhance';  // 'enhance' | 'synth'

                        function openBlacksmith() {
                            document.getElementById('blacksmith-modal').style.display = 'flex';
                            blacksmithTab = 'enhance';
                            renderBlacksmithTab();
                        }
                        function closeBlacksmith() {
                            document.getElementById('blacksmith-modal').style.display = 'none';
                        }
                        function switchBlacksmithTab(tab) {
                            blacksmithTab = tab;
                            document.getElementById('bs-tab-enhance').style.background = tab === 'enhance' ? '#2a1a00' : '#111';
                            document.getElementById('bs-tab-enhance').style.borderColor = tab === 'enhance' ? '#f90' : '#555';
                            document.getElementById('bs-tab-enhance').style.color = tab === 'enhance' ? '#f90' : '#888';
                            document.getElementById('bs-tab-synth').style.background = tab === 'synth' ? '#2a1a00' : '#111';
                            document.getElementById('bs-tab-synth').style.borderColor = tab === 'synth' ? '#f90' : '#555';
                            document.getElementById('bs-tab-synth').style.color = tab === 'synth' ? '#f90' : '#888';
                            renderBlacksmithTab();
                        }

                        function renderBlacksmithTab() {
                            const container = document.getElementById('blacksmith-content');
                            if (blacksmithTab === 'enhance') {
                                renderEnhanceTab(container);
                            } else {
                                renderSynthTab(container);
                            }
                        }

                        // === 强化页 ===
                        function renderEnhanceTab(container) {
                            const p = gameState.player;
                            const slotKeys = Object.keys(CONFIG.EQUIPMENT_SLOTS);
                            const equipped = slotKeys.filter(k => p.equipment[k]);
                            if (equipped.length === 0) {
                                container.innerHTML = '<div style="text-align:center;color:#888;padding:20px;">你没有装备可强化</div>';
                                return;
                            }
                            let html = `<div style="color:#aaa;font-size:12px;margin-bottom:8px;">💰 金币：${gameState.gold} &nbsp;|&nbsp; 强化消费金币给装备 +1（低费）或 +2（高费）属性</div>`;
                            html += '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';
                            equipped.forEach(key => {
                                const eq = p.equipment[key];
                                const qCfg = CONFIG.QUALITY_CONFIG[eq.quality] || CONFIG.QUALITY_CONFIG[0];
                                const cost1 = (eq.quality + 1) * 30 + 20;
                                const cost2 = cost1 * 2 + 30;
                                let stats = [];
                                if (eq.atk) stats.push(`🗡️${eq.atk}→${eq.atk+1} / ${eq.atk+2}`);
                                if (eq.def) stats.push(`🛡️${eq.def}→${eq.def+1} / ${eq.def+2}`);
                                if (eq.maxHp) stats.push(`❤️${eq.maxHp}→${eq.maxHp+3} / ${eq.maxHp+6}`);
                                html += `<div style="background:#1a1000;border:2px solid ${qCfg.color};border-radius:8px;padding:10px 14px;min-width:160px;">
                                    <div style="color:${qCfg.color};font-weight:bold;font-size:14px;">${eq.name}</div>
                                    <div style="color:#aaa;font-size:11px;margin:4px 0;">${stats.join(' &nbsp;')}</div>
                                    <div style="display:flex;gap:6px;margin-top:6px;">
                                        <button onclick="enhanceEquip('${key}',1)" style="flex:1;padding:4px 8px;background:#1a2a0a;border:1px solid #4a4;border-radius:4px;color:#4f4;font-size:12px;cursor:pointer;${gameState.gold >= cost1 ? '' : 'opacity:0.4;pointer-events:none;'}">+1 💰${cost1}</button>
                                        <button onclick="enhanceEquip('${key}',2)" style="flex:1;padding:4px 8px;background:#2a1a00;border:1px solid #f90;border-radius:4px;color:#fa0;font-size:12px;cursor:pointer;${gameState.gold >= cost2 ? '' : 'opacity:0.4;pointer-events:none;'}">+2 💰${cost2}</button>
                                    </div>
                                </div>`;
                            });
                            html += '</div>';
                            container.innerHTML = html;
                        }

                        function enhanceEquip(slotKey, level) {
                            const eq = gameState.player.equipment[slotKey];
                            if (!eq) return;
                            const cost = ((eq.quality + 1) * 30 + 20) * (level === 2 ? 2 : 1) + (level === 2 ? 30 : 0);
                            if (gameState.gold < cost) return;
                            gameState.gold -= cost;
                            if (eq.atk) eq.atk += level;
                            if (eq.def) eq.def += level;
                            if (eq.maxHp) eq.maxHp += level * 3;
                            // 强化后微调名字
                            if (!eq.name.startsWith('+')) {
                                eq.name = `+${level} ${eq.name}`;
                            } else {
                                const cur = parseInt(eq.name.match(/^\+(\d+)/)?.[1] || 0);
                                eq.name = eq.name.replace(/^\+\d+/, `+${cur + level}`);
                            }
                            addLog(`🔨 强化 ${eq.name}！消耗 ${cost} 金币`, 'log-gain');
                            sfx.play('heal');
                            updateStatusBar();
                            renderEnhanceTab(document.getElementById('blacksmith-content'));
                        }

                        // === 合成页 ===
                        let synthSlot1 = null, synthSlot2 = null;

                        function renderSynthTab(container) {
                            synthSlot1 = null; synthSlot2 = null;
                            const p = gameState.player;
                            const slotKeys = Object.keys(CONFIG.EQUIPMENT_SLOTS);
                            const equipped = slotKeys.filter(k => p.equipment[k]);
                            if (equipped.length < 2) {
                                container.innerHTML = '<div style="text-align:center;color:#888;padding:20px;">需要至少 2 件装备才能合成</div>';
                                return;
                            }
                            let html = '<div style="color:#aaa;font-size:12px;margin-bottom:8px;">⚗️ 选2件装备合成：有概率升级品质，失败则损失一件 &nbsp;|&nbsp; 同部位基础成功率更高</div>';
                            html += '<div style="display:flex;gap:12px;justify-content:center;align-items:flex-start;flex-wrap:wrap;">';
                            // 装备列表
                            html += '<div style="display:flex;flex-wrap:wrap;gap:6px;max-width:400px;">';
                            equipped.forEach(key => {
                                const eq = p.equipment[key];
                                const qCfg = CONFIG.QUALITY_CONFIG[eq.quality] || CONFIG.QUALITY_CONFIG[0];
                                const selected = (synthSlot1 === key || synthSlot2 === key);
                                html += `<div onclick="selectSynthSlot('${key}')" style="cursor:pointer;background:${selected ? '#2a1a00' : '#111'};border:2px solid ${selected ? '#f90' : qCfg.color};border-radius:6px;padding:8px 10px;min-width:100px;transition:all 0.2s;">
                                    <div style="color:${qCfg.color};font-size:13px;font-weight:bold;">${eq.name}</div>
                                    <div style="color:#aaa;font-size:11px;">${CONFIG.EQUIPMENT_SLOTS[key].icon} ${CONFIG.EQUIPMENT_SLOTS[key].name}</div>
                                </div>`;
                            });
                            html += '</div>';
                            // 预览区
                            html += '<div style="background:#0a0a0a;border:2px dashed #555;border-radius:8px;padding:12px;min-width:120px;text-align:center;">';
                            html += '<div style="color:#888;font-size:11px;margin-bottom:6px;">合成预览</div>';
                            if (synthSlot1 && synthSlot2) {
                                const e1 = p.equipment[synthSlot1], e2 = p.equipment[synthSlot2];
                                const baseRate = (e1.type === e2.type) ? 0.7 : 0.35;
                                const qDiff = Math.max((e1.quality||1), (e2.quality||1)) - Math.min((e1.quality||1), (e2.quality||1));
                                const rate = Math.min(0.9, baseRate + qDiff * 0.1);
                                const newQ = Math.min(8, Math.max((e1.quality||1), (e2.quality||1)) + 1);
                                const qCfg = CONFIG.QUALITY_CONFIG[newQ];
                                html += `<div style="color:#fa0;font-size:13px;font-weight:bold;">${qCfg ? qCfg.name : '???'} 装备</div>`;
                                html += `<div style="color:#${rate >= 0.6 ? '4f4' : rate >= 0.4 ? 'fa0' : 'f66'};font-size:14px;font-weight:bold;">成功率 ${Math.floor(rate * 100)}%</div>`;
                                html += `<div style="color:#f66;font-size:10px;">失败则损失 ${e1.name}</div>`;
                                html += `<button onclick="doSynthesize()" style="margin-top:8px;padding:8px 16px;background:#2a1a00;border:2px solid #f90;border-radius:6px;color:#fa0;font-size:14px;font-weight:bold;cursor:pointer;">⚗️ 合成！</button>`;
                            } else {
                                html += '<div style="color:#888;font-size:11px;">点击装备选择2件</div>';
                            }
                            html += '</div></div>';
                            container.innerHTML = html;
                        }

                        function selectSynthSlot(key) {
                            if (synthSlot1 === key) { synthSlot1 = null; }
                            else if (synthSlot2 === key) { synthSlot2 = null; }
                            else if (!synthSlot1) { synthSlot1 = key; }
                            else if (!synthSlot2) { synthSlot2 = key; }
                            else { synthSlot1 = key; synthSlot2 = null; }
                            renderSynthTab(document.getElementById('blacksmith-content'));
                        }

                        function doSynthesize() {
                            if (!synthSlot1 || !synthSlot2) return;
                            const p = gameState.player;
                            const e1 = p.equipment[synthSlot1], e2 = p.equipment[synthSlot2];
                            const baseRate = (e1.type === e2.type) ? 0.7 : 0.35;
                            const qDiff = Math.max((e1.quality||1), (e2.quality||1)) - Math.min((e1.quality||1), (e2.quality||1));
                            const rate = Math.min(0.9, baseRate + qDiff * 0.1);
                            const success = Math.random() < rate;
                            if (success) {
                                const newQ = Math.min(8, Math.max((e1.quality||1), (e2.quality||1)) + 1);
                                const newEquip = generateEquipment();
                                newEquip.quality = newQ;
                                const qCfg = CONFIG.QUALITY_CONFIG[newQ];
                                newEquip.name = qCfg.name + newEquip.name.replace(/^\[.*?\]\s*/, '');
                                // 取两件中较好的基础值再提升
                                if (newEquip.atk) newEquip.atk = Math.floor(Math.max(e1.atk||0, e2.atk||0) * 1.3) + 2;
                                if (newEquip.def) newEquip.def = Math.floor(Math.max(e1.def||0, e2.def||0) * 1.3) + 1;
                                if (newEquip.maxHp) newEquip.maxHp = Math.floor(Math.max(e1.maxHp||0, e2.maxHp||0) * 1.3) + 3;
                                // 继承一件的槽位
                                newEquip.type = e1.type;
                                p.equipment[synthSlot1] = newEquip;
                                p.equipment[synthSlot2] = null;
                                addLog(`⚗️ 合成成功！获得 ${newEquip.name}！`, 'log-gain');
                                sfx.play('heal');
                            } else {
                                p.equipment[synthSlot1] = null;
                                addLog(`⚗️ 合成失败... ${e1.name} 被摧毁了`, 'log-danger');
                                sfx.play('hit');
                            }
                            synthSlot1 = null; synthSlot2 = null;
                            updateStatusBar();
                            renderSynthTab(document.getElementById('blacksmith-content'));
                        }
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        
        // ==================== 精灵图辅助 ====================
        function spriteUrl(type, idx) {
            if (!SPRITES[type]) return '';
            if (Array.isArray(SPRITES[type])) {
                if (idx != null) return SPRITES[type][idx % SPRITES[type].length];
                return SPRITES[type][Math.floor(Math.random() * SPRITES[type].length)];
            }
            // Object (e.g. monster types)
            const keys = Object.keys(SPRITES[type]);
            if (keys.length === 0) return '';
            if (idx != null) return SPRITES[type][keys[idx % keys.length]];
            return SPRITES[type][keys[Math.floor(Math.random() * keys.length)]];
        }
        function spriteBg(type, idx) {
            const url = spriteUrl(type, idx);
            return url ? `background-image:url(${url});` : '';
        }
        
        // ==================== 地图渲染 ====================
        function renderMap() {
                    const themeObj = gameState.theme === 'castle' ? gameState.castleTheme : (CONFIG.THEMES[gameState.theme] || CONFIG.THEMES.abyss);
                    let output = '';
            
                    // 城堡模式：使用城堡配色
                    const isCastle = gameState.floor === 0;
            for (let y = 0; y < CONFIG.MAP_HEIGHT; y++) {
                for (let x = 0; x < CONFIG.MAP_WIDTH; x++) {
                    let text = '';
                    let className = '';
                    let style = '';
                    
                    // 检查是否有实体
                    if (x === gameState.player.x && y === gameState.player.y) {
                        const pc = CONFIG.CLASSES[gameState.playerClass];
                        text = pc ? pc.playerIcon : '🧙';
                        className = 'player';
                                            } else if (gameState.castleReturnPortal && x === gameState.castleReturnPortal.x && y === gameState.castleReturnPortal.y) {
                                                                                            text = '🏰';
                                                                                            className = 'exit';
                                                                                            style = 'font-size:1.8em; color:#fc6;';
                                                                                        } else if (gameState.eventNPC && x === gameState.eventNPC.x && y === gameState.eventNPC.y) {
                                                                                            text = '🧙';
                                                                                            className = 'shop-npc';
                                                                                            style = 'color:#c6f; font-size:1.4em;';
                                                                                        } else if (x === gameState.exit.x && y === gameState.exit.y) {
                                                                        // 钥匙系统：锁定出口显示 🔒，只有 exitLocked=false（走到传送门解锁后）才显示 🌀（v3.42.0）
                                                                        if (!gameState.exitLocked) {
                                                                            text = '🌀';
                                                                            className = 'exit';
                                                                            style = 'font-size:1.5em;';
                                                                        } else {
                                                                            text = '🔒';
                                                                            className = 'exit';
                                                                            style = 'font-size:1.2em; color:#888;';
                                                                        }
                    } else if (gameState.map[y][x] === '#') {
                        text = themeObj.wall;
                        className = 'wall';
                        style = `color:${themeObj.wallColor}`;
                    } else {
                        // 检查敌人
                        // 稀有怪
                        if (gameState.rareMonster && gameState.rareMonster.x === x && gameState.rareMonster.y === y) {
                            text = '💎';
                            className = 'rare-monster';
                        }
                        // 敌人
                        const enemy = gameState.enemies.find(e => e.x === x && e.y === y);
                        if (enemy) {
                            if (enemy.isBoss) {
                                                            text = '🐲';
                                                            className = 'boss';
                                                        } else if (enemy.isElite) {
                                                                                        text = '👑';
                                                                                        className = 'elite';
                                                        } else {
                                text = enemy.emoji || '👹';
                                className = 'enemy';
                            }
                        } else {
                            // 检查药水
                                                        const potion = gameState.potions.find(p => p.x === x && p.y === y);
                                                        if (potion) {
                                                            text = potion.icon || '🧪';
                                                            className = 'potion';
                                                            style = `color:${potion.color || '#0f0'}; font-size:1.1em;`;
                                                        } else {
                                // 检查宝箱
                                const chest = gameState.chests.find(c => c.x === x && c.y === y);
                                if (chest) {
                                    if (chest.type === 'key') {
                                        text = '🔑';
                                        className = 'potion';
                                        style = 'color:#fc6; font-size:1.2em;';
                                    } else {
                                        text = '📦';
                                        className = 'chest';
                                    }
                                } else if (gameState.isShopFloor) {
                                                                    // 检查 NPC
                                                                    const npc = gameState.shopNPCs.find(n => n.x === x && n.y === y);
                                                                    if (npc) {
                                                                        text = npc.icon;
                                                                        className = 'shop-npc';
                                                                    } else {
                                                                        text = themeObj.floor;
                                                                        className = 'floor';
                                                                        style = `color:${themeObj.floorColor}`;
                                                                    }
                                                                } else {
                                                                    // 城堡：检查 NPC 和传送门
                                                                    if (isCastle) {
                                                                        const cnpc = gameState.castleNPCs.find(n => n.x === x && n.y === y);
                                                                        if (cnpc) {
                                                                            text = cnpc.icon;
                                                                            className = 'shop-npc';
                                                                            style = 'color:#fa0; font-size:1.4em; cursor:pointer;';
                                                                        } else if (x === gameState.castlePortal.x && y === gameState.castlePortal.y) {
                                                                                                                                                    text = '🌀';
                                                                                                                                                    className = 'exit';
                                                                                                                                                    style = 'font-size:2em;';
                                                                                                                                                } else {
                                                                                                                                                    // 检查装饰物
                                                                                                                                                    const deco = gameState.castleDecorations.find(d => d.x === x && d.y === y);
                                                                                                                                                    if (deco) {
                                                                                                                                                        text = deco.icon; className = 'deco'; style = `color:${deco.color}; font-size:${deco.size};`;
                                                                                                                                                    } else if (gameState.castleCarpet && gameState.castleCarpet.find(c => c.x === x && c.y === y)) {
                                                                                                                                                        text = '◆'; className = 'floor'; style = 'color:#a33;';
                                                                                                                                                    } else {
                                                                                                                                                        text = themeObj.floor;
                                                                                                                                                        className = 'floor';
                                                                                                                                                        style = `color:${themeObj.floorColor}`;
                                                                                                                                                    }
                                                                                                                                                }
                                                                    } else {
                                                                        text = themeObj.floor;
                                                                        className = 'floor';
                                                                        style = `color:${themeObj.floorColor}`;
                                                                    }
                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                            // 特殊房间：宝藏室金币
                                                                                                                                                                                                                                                                                                                        if (gameState.specialRoom && gameState.specialRoom.type === 'treasure' && gameState.treasureCoins) {
                                                                                                                                                                                                                                                                                                                            const coin = gameState.treasureCoins.find(c => c.x === x && c.y === y);
                                                                                                                                                                                                                                                                                                                            if (coin) { text = '💰'; className = 'potion'; style = 'color:#fc6; font-size:1.1em;'; }
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                        // 特殊房间标记渲染
                                                                                                                                                                                                                                                                                                                        const overlay = renderSpecialOverlay(x, y);
                                                                                                                                                                                                                                                                                                                        if (overlay) { text = overlay.text; className = overlay.className; style = overlay.style; }
                                                                                                                                                                                                                                                                                                                        // 环境效果：黑暗
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            if (gameState.envEffect && gameState.envEffect.id === 'darkness') {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                const dist = Math.abs(x - gameState.player.x) + Math.abs(y - gameState.player.y);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                if (dist > 4 && className !== 'wall') {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    text = '·'; className = 'dark-fog'; style = 'color:#111;';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }
                    let spriteClass = '';
                    let spriteStyle = '';
                    if (spriteMode) {
                                            if (className === 'wall') { spriteClass = ' sprite-cell'; spriteStyle = spriteBg('wall') + 'color:transparent;'; }
                                            else if (className === 'floor') { spriteClass = ' sprite-cell'; spriteStyle = spriteBg('floor') + 'color:transparent;'; }
                        else if (className === 'player') { 
                            spriteClass = ' sprite-cell sprite-player'; 
                            const classKeys = Object.keys(CONFIG.CLASSES);
                            const ci = classKeys.indexOf(gameState.playerClass);
                            spriteStyle = spriteBg('player', ci >= 0 ? ci : 0); 
                        }
                        else if (className === 'boss') { spriteClass = ' sprite-cell sprite-boss'; spriteStyle = SPRITES.boss ? `background-image:url(${SPRITES.boss});` : ''; }
                                                else if (className === 'enemy') { spriteClass = ' sprite-cell'; spriteStyle = spriteBg('monster'); }
                                                else if (className === 'elite') { spriteClass = ' sprite-cell'; spriteStyle = spriteBg('monster'); text = ''; style = 'color:transparent;'; }
                                                else if (className === 'shop-npc') { spriteClass = ''; spriteStyle = ''; }  // 保持文字
                                                else if (className === 'chest') { spriteClass = ' sprite-cell'; spriteStyle = spriteBg('chest'); }
                        else if (className === 'potion') { spriteClass = ' sprite-cell'; spriteStyle = spriteBg('potion'); }
                        else if (className === 'exit') { spriteClass = ' sprite-cell'; spriteStyle = spriteBg('exit'); }
                    }
                    output += `<span class="${className}${spriteClass}" style="${style}${spriteStyle}">${text}</span>`;
                }
                output += '\n';
            }
            document.getElementById('map-display').innerHTML = output;
            
            // 角色移动脉冲动画
            const playerSpan = document.querySelector('#map-display .player');
            if (playerSpan && gameState._stepping) {
                playerSpan.classList.add('stepping');
                gameState._stepping = false;
                setTimeout(() => { if (playerSpan) playerSpan.classList.remove('stepping'); }, 320);
            }

            // 动态更新地图容器主题色
            const gameView = document.getElementById('game-view');
            gameView.style.background = themeObj.bgColor;
                        gameView.style.borderColor = themeObj.borderColor;
            
            // 自动缩放地图以填满容器（延迟确保布局完成）
            requestAnimationFrame(scaleMap);
        }
        
        // ==================== 地图自动缩放（两次测量法）====================
        function scaleMap() {
            const gameView = document.getElementById('game-view');
            const mapDisplay = document.getElementById('map-display');
            if (!gameView || !mapDisplay) return;
            
            // === 第 1 次测量：用参考字号 20px ===
            mapDisplay.style.fontSize = '20px';
            void mapDisplay.offsetHeight;
            
            const cw = gameView.clientWidth - 30;  // 减去 padding
            const ch = gameView.clientHeight - 30;
            const mw1 = mapDisplay.scrollWidth;
            const mh1 = mapDisplay.scrollHeight;
            
            if (cw <= 0 || ch <= 0 || mw1 <= 0 || mh1 <= 0) return;
            
            // 字号与地图尺寸成正比，直接算出目标字号
            const ratioW = cw / mw1;  // 宽度方向需要放大多少倍
            const ratioH = ch / mh1;  // 高度方向需要放大多少倍
            const ratio = Math.min(ratioW, ratioH);
            
            let targetSize = Math.floor(20 * ratio);
            
            // === 第 2 次测量：验证并微调 ===
            mapDisplay.style.fontSize = targetSize + 'px';
            void mapDisplay.offsetHeight;
            
            const mw2 = mapDisplay.scrollWidth;
            const mh2 = mapDisplay.scrollHeight;
            
            // 如果超出容器，缩小 2px
            if (mw2 > cw || mh2 > ch) {
                targetSize -= 2;
            }
            
            mapDisplay.style.fontSize = Math.max(14, targetSize) + 'px';
                    }
        
                    // ==================== 特殊房间渲染覆盖 (v3.29.1) ====================
                    function renderSpecialOverlay(x, y) {
                        if (!gameState.specialRoom) return null;
                        const cx = Math.floor(CONFIG.MAP_WIDTH/2), cy = Math.floor(CONFIG.MAP_HEIGHT/2);
                        switch (gameState.specialRoom.type) {
                            case 'altar':
                                if (x === cx && y === cy && !gameState.specialRoom.state.used)
                                    return { text:'⛓️', className:'shop-npc', style:'color:#c6f; font-size:1.6em; text-shadow:0 0 8px #c6f;' };
                                break;
                            case 'library':
                                if (x === cx && y === cy && !gameState.specialRoom.state.used)
                                    return { text:'📚', className:'shop-npc', style:'color:#6cf; font-size:1.6em; text-shadow:0 0 8px #6cf;' };
                                break;
                            case 'arena':
                                if (gameState.specialRoom.state.cleared) {
                                    const ep = gameState.specialRoom.state.exitPos;
                                    if (ep && x === ep.x && y === ep.y)
                                        return { text:'🏆', className:'exit', style:'color:#fc6; font-size:1.8em;' };
                                }
                                break;
                            case 'gamble':
                                if (x === cx && y === cy)
                                    return { text:'🎰', className:'shop-npc', style:'color:#fa0; font-size:1.8em; text-shadow:0 0 12px #fa0;' };
                                break;
                            case 'rift':
                                if (x === cx-1 && y === cy) return { text:'🔴', className:'shop-npc', style:'color:#f44; font-size:1.8em; text-shadow:0 0 12px #f44;' };
                                if (x === cx+1 && y === cy) return { text:'🔵', className:'shop-npc', style:'color:#44f; font-size:1.8em; text-shadow:0 0 12px #44f;' };
                                break;
                            case 'training':
                                if (x === cx && y === cy && !gameState.specialRoom.state.used)
                                    return { text:'🏋️', className:'shop-npc', style:'color:#6f6; font-size:1.6em; text-shadow:0 0 8px #6f6;' };
                                break;
                            case 'well':
                                if (x === cx && y === cy && !gameState.wellUsed)
                                    return { text:'🌟', className:'shop-npc', style:'color:#ff0; font-size:1.6em; text-shadow:0 0 10px #ff0;' };
                                break;
                        }
                        return null;
                    }
        
                    /* ╔══════════════════════════════════════════╗
        ║  MODULE 4: 玩家与战斗                 ║
        ╚══════════════════════════════════════════╝ */
