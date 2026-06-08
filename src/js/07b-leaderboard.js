// ======== 排行榜系统 ========
        function calcScore() {
            const floor = gameState.floor;
            const kills = gameState.runKills;
            const gold = gameState.gold;
            const mult = CONFIG.CLASS_SCORE_MULT[gameState.playerClass] || 1.0;
            const raw = floor * CONFIG.SCORE_FLOOR_BASE + kills * CONFIG.SCORE_KILL_BONUS + gold * CONFIG.SCORE_GOLD_BONUS;
            return Math.floor(raw * mult);
        }

        function loadLeaderboard() {
            try {
                const raw = localStorage.getItem(CONFIG.LEADERBOARD_KEY);
                return raw ? JSON.parse(raw) : [];
            } catch(e) { return []; }
        }

        function saveToLeaderboard(score) {
            const lb = loadLeaderboard();
            const entry = {
                name: gameState.playerName,
                class: gameState.playerClass,
                floor: gameState.floor,
                kills: gameState.runKills,
                gold: gameState.gold,
                score: score,
                date: new Date().toISOString().slice(0, 10)
            };
            // 简易防作弊：加校验和
            entry._checksum = btoa(score + ':' + gameState.floor + ':' + gameState.runKills).slice(0, 8);
            lb.push(entry);
            lb.sort((a, b) => b.score - a.score);
            if (lb.length > CONFIG.LEADERBOARD_MAX) lb.length = CONFIG.LEADERBOARD_MAX;
            try {
                localStorage.setItem(CONFIG.LEADERBOARD_KEY, JSON.stringify(lb));
            } catch(e) { /* quota exceeded */ }
        }

        function showLeaderboard() {
            const lb = loadLeaderboard();
            const container = document.getElementById('lb-content');
            if (lb.length === 0) {
                container.innerHTML = '<div class="lb-empty">📭 暂无记录<br><span style="font-size:13px;color:#555;">开始冒险，成为第一！</span></div>';
            } else {
                let html = '<table id="lb-table"><thead><tr><th>#</th><th>玩家</th><th>职业</th><th>层数</th><th>击杀</th><th>得分</th><th>日期</th></tr></thead><tbody>';
                const currentScore = gameState.isGameOver ? document.getElementById('final-score').textContent.replace('🏆 综合得分: ', '') : null;
                lb.forEach((e, i) => {
                    const rankClass = i === 0 ? 'lb-rank-1' : i === 1 ? 'lb-rank-2' : i === 2 ? 'lb-rank-3' : '';
                    const isCurrent = currentScore && String(e.score) === currentScore && e.name === (gameState.playerName || '') && e.floor === gameState.floor;
                    const clsName = CONFIG.CLASSES[e.class] ? CONFIG.CLASSES[e.class].name : e.class;
                    const clsIcon = CONFIG.CLASSES[e.class] ? CONFIG.CLASSES[e.class].icon : '';
                    html += `<tr${isCurrent ? ' class="lb-current"' : ''}>`;
                    html += `<td class="${rankClass}">${i + 1}</td>`;
                    html += `<td>${escHtml(e.name)}</td>`;
                    html += `<td>${clsIcon} ${clsName}</td>`;
                    html += `<td>${e.floor}F</td>`;
                    html += `<td>${e.kills}</td>`;
                    html += `<td style="color:#ffd700;font-weight:bold;">${e.score}</td>`;
                    html += `<td>${e.date}</td>`;
                    html += '</tr>';
                });
                html += '</tbody></table>';
                container.innerHTML = html;
            }
            document.getElementById('leaderboard-modal').style.display = 'flex';
            // 锁定移动
            gameState.shopOpen = true;
        }

        function closeLeaderboard() {
                    document.getElementById('leaderboard-modal').style.display = 'none';
                    gameState.shopOpen = false;
                }

                // ==================== 工匠工坊 ====================
