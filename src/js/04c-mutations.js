// ==================== 怪物突变辅助 (v3.29.0) ====================
function checkMutationDodge(enemy) {
    if (!enemy) return false;
    if (enemy.mutation === 'dodge' && Math.random() < 0.2) {
        addLog(`💨 ${enemy.name} 闪避了你的攻击！`, 'log-combat');
        return true;
    }
    return false;
}
function checkMutationSniper(enemy, shielded) {
    if (!enemy) return 0;
    if (enemy.mutation === 'sniper' && shielded > 0) {
        addLog(`🎯 ${enemy.name}(狙击) 无视护盾！`, 'log-danger');
        return shielded;
    }
    return 0;
}
function applyMutationOnHit(enemy, player) {
    if (!enemy) return;
    if (enemy.mutation === 'burn') {
        player.burnTurns = (player.burnTurns || 0) + 2;
        addLog(`🔥 ${enemy.name}(灼烧) 点燃了你！(2回合)`, 'log-danger');
    }
    if (enemy.mutation === 'freeze') {
        player.frozenTurns = (player.frozenTurns || 0) + 1;
        addLog(`❄️ ${enemy.name}(冰冻) 冻结了你！(1回合)`, 'log-danger');
    }
}
function spawnMutationSummon(deadEnemy) {
    if (!deadEnemy || deadEnemy.mutation !== 'summon') return;
            const dirs = [[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[-1,1],[1,-1],[1,1]];
            const pool = CONFIG.THEME_ENEMIES[gameState.theme] || CONFIG.THEME_ENEMIES.abyss;
            const type = pool[Math.floor(Math.random() * pool.length)];
            const scale = 1 + (gameState.floor - 1) * 0.35;
            for (const [dx, dy] of dirs.sort(() => Math.random() - 0.5)) {
                const nx = deadEnemy.x + dx, ny = deadEnemy.y + dy;
                if (nx > 0 && nx < CONFIG.MAP_WIDTH-1 && ny > 0 && ny < CONFIG.MAP_HEIGHT-1 &&
                    gameState.map[ny] && gameState.map[ny][nx] === '.' &&
                    !gameState.enemies.some(e => e && e.x === nx && e.y === ny) &&
                    !(nx === gameState.player.x && ny === gameState.player.y)) {
                    gameState.enemies.push({
                        x: nx, y: ny,
                        hp: Math.floor(CONFIG.BASE_ENEMY_HP * scale * type.hpMod),
                        maxHp: Math.floor(CONFIG.BASE_ENEMY_HP * scale * type.hpMod),
                        atk: Math.floor(CONFIG.BASE_ENEMY_ATK * scale * type.atkMod),
                        def: Math.floor(CONFIG.BASE_ENEMY_DEF * scale * type.defMod),
                        exp: Math.floor(20 * scale * type.expMod * 0.5),
                        gold: Math.floor((Math.random() * 5 + 2) * gameState.floor),
                        isBoss: false, name: type.name, emoji: type.emoji,
                    });
                    addLog(`📡 ${deadEnemy.name} 死亡时召唤了 ${type.name}！`, 'log-danger');
                    renderMap();
                    return;
                }
            }
        }
