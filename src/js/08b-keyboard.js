// ==================== 键盘控制 ====================

// 安全触发 onclick（替代 eval）(v3.43.3)
function triggerOnClick(el) {
    const onclick = el.getAttribute('onclick');
    if (onclick) {
        try {
            eval(onclick);
        } catch(e) { /* ignore */ }
    }
}

document.addEventListener('keydown', (e) => {
    // 开场动画中：空格/回车/ESC 跳过
    const introEl = document.getElementById('intro-animation');
    if (introEl && introEl.classList.contains('active') && !introFinished) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); skipIntro(); }
        return;
    }

    // === 开始界面 ===
    const startScr = document.getElementById('start-screen');
    if (startScr && startScr.style.display !== 'none' && startScr.style.display !== '') {
        if (e.key === 'Escape') {
            const lbModal = document.getElementById('leaderboard-modal');
            if (lbModal && lbModal.style.display === 'flex') { e.preventDefault(); closeLeaderboard(); return; }
            const wsModal = document.getElementById('workshop-modal');
            if (wsModal && wsModal.style.display === 'flex') { e.preventDefault(); closeWorkshop(); return; }
            const achPanel = document.getElementById('achieve-panel');
            if (achPanel && achPanel.style.display === 'flex') { e.preventDefault(); achPanel.style.display = 'none'; return; }
        }
        if (e.key === 'Enter') { e.preventDefault(); startGame(); return; }
        // 职业选择快捷键 1/2/3/4
        if (['1','2','3','4'].includes(e.key)) {
            e.preventDefault();
            const keys = ['warrior', 'mage', 'rogue', 'priest'];
            selectClass(keys[parseInt(e.key)-1]);
            return;
        }
        return;
    }

    // === 全局 ESC 关闭弹窗 ===
    if (e.key === 'Escape') {
        // 中断自动战斗 (v3.43.0)
        if (gameState.autoAttack && gameState.enemies.length > 0 && !gameState.shopOpen) {
            gameState.autoAttack = false;
            const btn = document.getElementById('auto-attack-toggle');
            if (btn) { btn.textContent = '✋'; btn.classList.add('off'); }
            addLog('⚠️ 自动攻击已中断', 'log-system');
            updateStatusBar();
            return;
        }
        if (gameState.shopOpen && gameState.currentNPC) { closeShop(); }
        else if (gameState.shopOpen && document.getElementById('talent-modal').style.display === 'flex') { closeTalentModal(); }
        else if (document.getElementById('levelup-modal').style.display === 'flex') { /* 不允许 */ }
        else if (document.getElementById('char-sheet-modal').style.display === 'flex') { closeCharSheet(); }
        else if (document.getElementById('well-modal').style.display === 'flex') { document.getElementById('well-modal').style.display = 'none'; gameState.shopOpen = false; }
        else if (document.getElementById('equip-detail-modal').style.display === 'flex') { closeEquipDetail(); }
        else if (document.getElementById('altar-modal').style.display === 'flex') { closeAltar(); }
        else if (document.getElementById('library-modal').style.display === 'flex') { closeLibrary(); }
        else if (document.getElementById('blacksmith-modal').style.display === 'flex') { closeBlacksmith(); }
        else if (document.getElementById('leaderboard-modal').style.display === 'flex') { closeLeaderboard(); }
        else if (document.getElementById('workshop-modal').style.display === 'flex') { closeWorkshop(); }
        else if (document.getElementById('achieve-panel').style.display === 'flex') { document.getElementById('achieve-panel').style.display = 'none'; }
        else if (document.getElementById('keyhelp-modal').style.display === 'flex') { closeKeyHelp(); }
        else if (document.getElementById('potion-pickup-modal').style.display === 'flex') { choosePotionAction('discard'); }
        else if (document.getElementById('codex-modal').style.display === 'flex') { closeCodex(); }
        else if (document.getElementById('stats-modal').style.display === 'flex') { closeStats(); }
        else if (document.getElementById('settings-modal').style.display === 'flex') { closeSettings(); }
        return;
    }

    // === 装备对比弹窗 Y=替换 N=放弃 ===
    if (document.getElementById('equip-compare-modal').style.display === 'flex') {
        if (e.key === 'y' || e.key === 'Y') { e.preventDefault(); equipCompareChoose(true); }
        else if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') { e.preventDefault(); equipCompareChoose(false); }
        return;
    }

    // === 升级弹窗 1/2/3 ===
    if (document.getElementById('levelup-modal').style.display === 'flex') {
        if (['1','2','3'].includes(e.key)) { e.preventDefault(); applyLevelUpChoice(parseInt(e.key)-1); }
        return;
    }

    // === 药水拾取弹窗 D=喝 B=背包 X=丢弃 ===
    const ppModal = document.getElementById('potion-pickup-modal');
    if (ppModal && ppModal.style.display === 'flex') {
        if (e.key === 'd' || e.key === 'D') { e.preventDefault(); choosePotionAction('drink'); }
        else if (e.key === 'b' || e.key === 'B') { e.preventDefault(); choosePotionAction('belt'); }
        else if (e.key === 'x' || e.key === 'X') { e.preventDefault(); choosePotionAction('discard'); }
        else if (['1','2','3','4'].includes(e.key)) { e.preventDefault(); choosePotionAction('replace', parseInt(e.key)-1); }
        return;
    }

    // === 商店弹窗 1-9 购买 ===
    if (gameState.shopOpen && gameState.currentNPC) {
        if (['1','2','3','4','5','6','7','8','9'].includes(e.key)) { e.preventDefault(); buyItem(parseInt(e.key)-1); }
        return;
    }

    // === 天赋弹窗 数字选择 / T键关闭 / ESC关闭 ===
    if (document.getElementById('talent-modal') && document.getElementById('talent-modal').style.display === 'flex') {
        if (e.key === 't' || e.key === 'T') { e.preventDefault(); closeTalentModal(); return; }
        const talentItems = document.querySelectorAll('#talent-trees-container .talent-item');
        const num = parseInt(e.key);
        if (num >= 1 && num <= talentItems.length) {
            e.preventDefault(); triggerOnClick(talentItems[num-1]);
        }
        return;
    }

    // === 祭坛弹窗 数字选装备 ===
    if (document.getElementById('altar-modal').style.display === 'flex') {
        const altarBtns = document.querySelectorAll('#altar-content div[onclick*="sacrificeEquip"]');
        const num = parseInt(e.key);
        if (num >= 1 && num <= altarBtns.length) {
            e.preventDefault(); triggerOnClick(altarBtns[num-1]);
        }
        return;
    }

    // === 图书馆弹窗 数字选天赋 ===
    if (document.getElementById('library-modal').style.display === 'flex') {
        const libBtns = document.querySelectorAll('#library-content div[onclick*="learnLibraryTalent"]');
        const num = parseInt(e.key);
        if (num >= 1 && num <= libBtns.length) {
            e.preventDefault(); triggerOnClick(libBtns[num-1]);
        }
        return;
    }

    // === 铁匠铺弹窗 Tab切换 / 数字=== 
    const bsm = document.getElementById('blacksmith-modal');
    if (bsm && bsm.style.display === 'flex') {
        if (e.key === '1') { e.preventDefault(); switchBlacksmithTab('enhance'); }
        else if (e.key === '2') { e.preventDefault(); switchBlacksmithTab('synth'); }
        return;
    }

    // === 许愿井弹窗 1/2/3 ===
    const wm = document.getElementById('well-modal');
    if (wm && wm.style.display === 'flex') {
        if (['1','2','3'].includes(e.key)) {
            e.preventDefault();
            // 点击对应按钮
            const btns = wm.querySelectorAll('#well-content button:not([onclick*="ESC"])');
            if (btns[parseInt(e.key)-1] && !btns[parseInt(e.key)-1].disabled) {
                btns[parseInt(e.key)-1].click();
            }
        }
        return;
    }

    // === 工坊弹窗 数字买升级 ===
    const wsk = document.getElementById('workshop-modal');
    if (wsk && wsk.style.display === 'flex') {
        const wsBtns = wsk.querySelectorAll('.ws-buy-btn');
        const num = parseInt(e.key);
        if (num >= 1 && num <= wsBtns.length && !wsBtns[num-1].disabled) {
            e.preventDefault(); wsBtns[num-1].click();
        }
        return;
    }

    // === 游戏结束界面 Enter 重新开始 ===
    if (gameState.isGameOver) {
        if (e.key === 'Enter') { e.preventDefault(); restartGame(); }
        return;
    }

    // === ` 切换精灵模式 ===
    if (e.key === '`') { e.preventDefault(); spriteMode = !spriteMode; renderMap(); return; }

    // === Tab 装备详情 ===
    if (e.key === 'Tab') {
        e.preventDefault();
        if (document.getElementById('equip-detail-modal').style.display === 'flex') { closeEquipDetail(); }
        else if (!gameState.shopOpen || !gameState.currentNPC) { toggleEquipDetail(); }
        return;
    }

    // === C 角色面板 ===
    if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        if (document.getElementById('equip-detail-modal').style.display === 'flex') { closeEquipDetail(); }
        toggleCharSheet();
        return;
    }

    // === H/? 按键帮助 ===
    if (e.key === 'h' || e.key === 'H' || e.key === '?') {
        e.preventDefault();
        if (document.getElementById('keyhelp-modal').style.display === 'flex') { closeKeyHelp(); }
        else { showKeyHelp(); }
        return;
    }

    // === V 统计面板 ===
    if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        showStats();
        return;
    }

    // === P 成就面板 ===
    if (e.key === 'p' || e.key === 'P') { e.preventDefault(); showAchievePanel(); return; }

    // === T 天赋面板 ===
    if (e.key === 't' || e.key === 'T') { e.preventDefault(); openTalentModal(); return; }

    if (gameState.isGameOver) return;

    // 商店/弹窗打开时阻止移动
    if (gameState.shopOpen) return;

    // 调试键
    if (handleDebugKey(e.key)) return;

    // 药水快捷键 1/2/3/4
    if (['1','2','3','4'].includes(e.key)) { e.preventDefault(); usePotionFromBelt(parseInt(e.key)-1); return; }

    // 移动 + 技能
    switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': case 'S': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': movePlayer(1, 0); break;
        case 'q': case 'Q': useActiveSkill(); break;
    }
});

// ==================== 调试键处理 ====================
function handleDebugKey(key) {
    switch (key) {
        case '0': gameState.godMode = !gameState.godMode; addLog(gameState.godMode ? '🛡️ [0] 无敌' : '🛡️ [0] 无敌关闭', 'log-system'); updateStatusBar(); return true;
        case '5': gameState.oneHitKill = !gameState.oneHitKill; addLog(gameState.oneHitKill ? '💀 [5] 秒杀' : '💀 [5] 秒杀关闭', 'log-system'); return true;
        case '9': gameState.floor = 5; addLog('⏩ [9] Boss层', 'log-system'); generateMap(); renderMap(); updateStatusBar(); return true;
        case '8': gameState.floor = 3; addLog('⏩ [8] 商店层', 'log-system'); generateMap(); renderMap(); updateStatusBar(); return true;
        case '7': gameState.gold += 500; addLog('💰 [7] +500G', 'log-system'); updateStatusBar(); return true;
        case '6': gameState.player.hp = gameState.player.maxHp + sumEquipHp(); addLog('❤️ [6] 满血', 'log-system'); updateStatusBar(); return true;
        case ' ': gameState.floor += 1; addLog('⏩ [空格] 第' + gameState.floor + '层', 'log-system'); generateMap(); renderMap(); updateStatusBar(); return true;
    }
    return false;
}