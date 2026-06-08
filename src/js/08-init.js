/* ╔══════════════════════════════════════════╗
        ║  MODULE 8: 入口与初始化               ║
        ╚══════════════════════════════════════════╝ */

        
        // ==================== 随机名字生成 ====================
        const NAME_PARTS = {
            prefix: ['暗影', '深渊', '星辰', '烈焰', '寒冰', '雷霆', '狂风', '幻影', '血色', '银月',
                     '铁骨', '破晓', '苍穹', '赤焰', '幽冥', '紫电', '玄冰', '青锋', '白骨', '碧落',
                     '孤', '夜', '梦', '雪', '风', '云', '龙', '凤', '天', '地'],
            suffix: ['行者', '猎人', '刺客', '战士', '法师', '游侠', '剑客', '武士', '术士', '骑士',
                     '之刃', '之心', '之怒', '之眼', '之牙', '之魂', '之影', '之光', '之翼', '之手',
                     '浪人', '侠客', '勇者', '王者', '杀手', '先锋', '守卫', '先知', '使者', '霸主']
        };
        
        function generateRandomName() {
            const { prefix, suffix } = NAME_PARTS;
            // 70% 概率组合名(前缀+后缀), 30% 概率单词
            if (Math.random() < 0.7) {
                const p = prefix[Math.floor(Math.random() * prefix.length)];
                const s = suffix[Math.floor(Math.random() * suffix.length)];
                const name = p + s;
                document.getElementById('player-name-input').value = name.slice(0, 8);
            } else {
                // 随机单个词
                const pool = [...prefix, ...suffix];
                document.getElementById('player-name-input').value = pool[Math.floor(Math.random() * pool.length)];
            }
            // 按钮点击动效
            const btn = document.getElementById('random-name-btn');
            btn.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => { btn.style.transform = ''; }, 200);
        }
        
// ==================== 开场动画 ====================
let introTimers = [];
let introFinished = false;

function playIntroAnimation() {
    const intro = document.getElementById('intro-animation');
    intro.classList.add('active');
    introFinished = false;

    const particles = document.getElementById('intro-particles');
    particles.innerHTML = '';
    // 下落符文粒子
    const runes = ['#','▓','▒','░','█','▌','▐','■','◆','◇','○','●','◈','✦','✧','†','‡','ꝏ','⧖','⧗'];
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('span');
        p.className = 'particle rune';
        p.textContent = runes[Math.floor(Math.random() * runes.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.setProperty('--p-opacity', (0.15 + Math.random() * 0.3));
        p.style.setProperty('--p-rotate', (Math.random() - 0.5) * 720 + 'deg');
        p.style.animationDuration = (3 + Math.random() * 5) + 's';
        p.style.animationDelay = Math.random() * 4 + 's';
        particles.appendChild(p);
    }
    // 上升火星
    for (let i = 0; i < 25; i++) {
        const p = document.createElement('span');
        p.className = 'particle ember';
        p.textContent = ['✦','·','*','•','✧'][Math.floor(Math.random() * 5)];
        p.style.left = Math.random() * 100 + '%';
        p.style.bottom = '0px';
        p.style.animationDuration = (2 + Math.random() * 3) + 's';
        p.style.animationDelay = Math.random() * 3 + 's';
        particles.appendChild(p);
    }
    // 漂浮暗影
    for (let i = 0; i < 10; i++) {
        const p = document.createElement('span');
        p.className = 'particle skull';
        p.textContent = ['💀','👁️','🜂','🜃','🝊'][Math.floor(Math.random() * 5)];
        p.style.left = Math.random() * 90 + 5 + '%';
        p.style.setProperty('--p-opacity', '0.12');
        p.style.setProperty('--p-rotate', '20deg');
        p.style.animationDuration = (6 + Math.random() * 6) + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        particles.appendChild(p);
    }

    // 逐行打字机效果
    const lines = ['intro-line-1', 'intro-line-2', 'intro-line-3', 'intro-line-4'];
    const startDelays = [400, 1400, 2400, 3400];

    lines.forEach((id, li) => {
        const t = setTimeout(() => {
            const el = document.getElementById(id);
            const fullText = el.textContent;
            el.textContent = '';
            el.classList.add('show');
            let charIdx = 0;
            const typeIv = setInterval(() => {
                if (charIdx < fullText.length) {
                    el.textContent = fullText.slice(0, charIdx + 1) + '▌';
                    charIdx++;
                } else {
                    clearInterval(typeIv);
                    el.innerHTML = fullText + '<span class="cursor-blink">▌</span>';
                }
            }, 50 + Math.random() * 30);
            introTimers.push(typeIv);
        }, startDelays[li]);
        introTimers.push(t);
    });

    // 标题登场（缩放弹入 + 绿光脉冲）
    introTimers.push(setTimeout(() => {
        document.getElementById('intro-title-wrap').classList.add('show');
        sfx.play('boss');
    }, 4400));

    // 副标题淡入
    introTimers.push(setTimeout(() => {
        document.getElementById('intro-subtitle').classList.add('show');
    }, 5200));

    // 自动结束
    introTimers.push(setTimeout(() => { finishIntro(); }, 8000));
}

function skipIntro() {
    if (introFinished) return;
    finishIntro();
}

function finishIntro() {
    if (introFinished) return;
    introFinished = true;

    introTimers.forEach(t => { try { clearTimeout(t); clearInterval(t); } catch(e) {} });
    introTimers = [];

    initAchievements();

    const intro = document.getElementById('intro-animation');
    intro.style.transition = 'opacity 0.5s ease';
    intro.style.opacity = '0';

    setTimeout(() => {
        intro.classList.remove('active');
        intro.style.opacity = '';
        intro.style.transition = '';
        document.getElementById('start-screen').style.display = 'flex';
        renderClassCards();
        refreshStartScreen();
        drawCastleBg();
        document.getElementById('player-name-input').focus();
    }, 500);
}
        
        // ==================== 头像预览 ====================
        function previewAvatar(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            // 限制文件大小 2MB
            if (file.size > 2 * 1024 * 1024) {
                alert('图片不能超过 2MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const dataUrl = e.target.result;
                // 开始界面预览
                const preview = document.getElementById('avatar-preview');
                const placeholder = document.getElementById('avatar-placeholder');
                preview.src = dataUrl;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
                
                // 保存到临时变量
                gameState.playerAvatar = dataUrl;
            };
            reader.readAsDataURL(file);
        }
        
        // ==================== 职业选择 ====================
        function renderClassCards() {
                    const container = document.getElementById('class-cards');
                    if (!container) return;
                    container.innerHTML = '';
                    const classes = CONFIG.CLASSES;
                    for (const [key, cls] of Object.entries(classes)) {
                        const chip = document.createElement('div');
                        chip.className = 'class-chip' + (key === CONFIG.DEFAULT_CLASS ? ' selected' : '');
                        chip.setAttribute('data-class', key);
                        chip.onclick = () => selectClass(key);
                        chip.innerHTML = `<span class="chip-icon">${cls.icon}</span><span class="chip-name">${cls.name}</span>`;
                        container.appendChild(chip);
                    }
                }
        
function selectClass(classKey) {
            gameState.playerClass = classKey;
            document.querySelectorAll('.class-chip').forEach(c => {
                c.classList.toggle('selected', c.getAttribute('data-class') === classKey);
            });
            switchPxlAvatar(classKey);
        }
        
        // ==================== 像素头像切换 ====================
        function switchPxlAvatar(classKey) {
            const pxlClass = 'pxl-' + classKey;
            document.querySelectorAll('.pxl-avatar').forEach(el => {
                el.className = 'pxl-avatar ' + pxlClass;
            });
        }
        
        // ==================== 像素头像初始化 ====================
        function buildPxlAvatars() {
            document.querySelectorAll('.pxl-avatar').forEach(el => {
                el.innerHTML = '';
                for (let i = 0; i < 64; i++) {
                    const px = document.createElement('div');
                    px.className = 'px p' + i;
                    el.appendChild(px);
                }
            });
        }
        
        // ==================== 开始游戏 ====================
        function startGame() {
            // 读取角色名
            const nameInput = document.getElementById('player-name-input');
            const name = nameInput.value.trim() || '无名勇者';
            gameState.playerName = name;
            
            // 更新侧边栏角色信息
            updateCharInfo();
            
            // 隐藏开始界面
            document.getElementById('start-screen').style.display = 'none';
            
                        // 删除旧存档（新游戏开始）
                        deleteSave();
            
                        // 初始化游戏
            sfx.init();
            sfx.play('start');
            // [BGM 已禁用] bgm.play('abyss');
            restartGame();
                        initAchievements();
                    }
        
                    // ==================== 成就可以系统 ====================
        function initAchievements() {
            // 从 localStorage 加载
            try {
                const saved = localStorage.getItem('rogue_achievements');
                if (saved) {
                    const data = JSON.parse(saved);
                    gameState.achievements = data.achievements || {};
                    gameState.achievementStats = data.stats || { kills:0, equipCollected:0, eliteKills:0, bossKills:0, steps:0, chestsOpened:0, fullClearCount:0, goldTotal:0, skillUses:0, deathCount:0, poisonPotionUses:0 };
                }
            } catch(e) { /* ignore */ }
        }
        
        function saveAchievements() {
            try {
                localStorage.setItem('rogue_achievements', JSON.stringify({
                    achievements: gameState.achievements,
                    stats: gameState.achievementStats
                }));
            } catch(e) { /* ignore */ }
        }
        
        function unlockAchievement(id) {
            if (gameState.achievements[id]) return; // 已解锁
            const ach = CONFIG.ACHIEVEMENTS.find(a => a.id === id);
            if (!ach) return;
            gameState.achievements[id] = true;
            saveAchievements();
            // 显示弹窗
            const toast = document.getElementById('achieve-toast');
            toast.querySelector('.ach-icon').textContent = ach.icon;
            toast.querySelector('.ach-name').textContent = '🏆 ' + ach.name;
            toast.querySelector('.ach-desc').textContent = ach.desc;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3500);
            addLog(`🏆 成就解锁：${ach.icon} ${ach.name} — ${ach.desc}`, 'log-system');
        }
        
        function checkAchievements() {
                    const s = gameState.achievementStats;
                    // 击杀
                    if (s.kills >= 1) unlockAchievement('firstKill');
                    if (s.kills >= 10) unlockAchievement('kill10');
                    if (s.kills >= 50) unlockAchievement('kill50');
                    if (s.kills >= 100) unlockAchievement('kill100');
                    // 精英/Boss
                    if (s.eliteKills >= 1) unlockAchievement('firstElite');
                    if (s.bossKills >= 1) unlockAchievement('firstBoss');
                    // 楼层
                    if (gameState.floor >= 5) unlockAchievement('floor5');
                    if (gameState.floor >= 10) unlockAchievement('floor10');
                    if (gameState.floor >= 15) unlockAchievement('floor15');
                    if (gameState.floor >= 20) unlockAchievement('floor20');
                    // 装备
                    if (s.equipCollected >= 10) unlockAchievement('collect10');
                    if (s.equipCollected >= 30) unlockAchievement('collect30');
                    // 等级
                    if (gameState.player.level >= 5) unlockAchievement('level5');
                    if (gameState.player.level >= 10) unlockAchievement('level10');
                    if (gameState.player.level >= 15) unlockAchievement('level15');
                    // 金币
                    if (gameState.gold >= 200) unlockAchievement('rich');
                    if (s.goldTotal >= 500) unlockAchievement('gold500');
                    // 步数
                    if (s.steps >= 500) unlockAchievement('walk500');
                    if (s.steps >= 2000) unlockAchievement('walk2000');
                    // 宝箱
                    if (s.chestsOpened >= 10) unlockAchievement('chest10');
                    // 完美清扫
                    if (s.fullClearCount >= 3) unlockAchievement('fullClear3');
                    // 技能
                    if (s.skillUses >= 20) unlockAchievement('skill20');
                    // 死亡
                                        if (s.deathCount >= 5) unlockAchievement('die5');
                                        // 隐藏成就
                                        if (s.poisonPotionUses >= 5) unlockAchievement('poisonLover');
                                        if (gameState.gold >= 500) unlockAchievement('hoarder');
                                        if (gameState.floor >= 5 && s.steps <= 100) unlockAchievement('speedrun');
                                        if (gameState.floor >= 10 && s.deathCount === 0) unlockAchievement('oneLife');
                    // 和平主义者：本层无击杀到达出口
                    if (gameState.runKills === gameState.floorStartKills && gameState.floor > 1) unlockAchievement('pacifist');
                    // AFK（由定时器触发，不在此处检查）
                }
        
        function showAchievePanel() {
                            const panel = document.getElementById('achieve-panel');
                            if (!panel) return;
                            // 切换：已打开则关闭
                            if (panel.style.display === 'flex') {
                                panel.style.display = 'none';
                                return;
                            }
                            const list = document.getElementById('achieve-list');
                            const progress = document.getElementById('ach-progress');
                            if (!list || !progress) return;
                            let unlocked = 0;
                            let html = '';
                            CONFIG.ACHIEVEMENTS.forEach(ach => {
                                const isUnlocked = !!gameState.achievements[ach.id];
                                if (isUnlocked) unlocked++;
                                html += `<div class="ach-row ${isUnlocked ? 'unlocked' : 'locked'}">
                                    <span class="ach-icon">${isUnlocked ? ach.icon : '🔒'}</span>
                                    <div>
                                        <div>${ach.name}</div>
                                        <div style="font-size:12px;">${ach.desc}</div>
                                    </div>
                                </div>`;
                            });
                            list.innerHTML = html;
                            progress.textContent = `${unlocked}/${CONFIG.ACHIEVEMENTS.length} 已解锁`;
                            panel.style.display = 'flex';
                            panel.style.alignItems = 'center';
                            panel.style.justifyContent = 'center';
                        }
        
        // ==================== 游戏初始化 ====================
        function initGame() {
                    loadSettings();
                    // 先播放开场动画，结束后进入开始界面
                    playIntroAnimation();
                    // AFK成就定时器：每30秒检查一次，累计30分钟（1800秒）后解锁
                    let afkSeconds = 0;
                    gameState._afkTimer = setInterval(() => {
                        if (gameState.isGameOver) { clearInterval(gameState._afkTimer); return; }
                        if (gameState.floor > 0 && document.getElementById('start-screen').style.display === 'none') {
                            afkSeconds += 30;
                            if (afkSeconds >= 1800) { unlockAchievement('afk'); clearInterval(gameState._afkTimer); }
                        }
                    }, 30000);
                }
        
// 启动游戏
        buildPxlAvatars();
        initGame();

        // 全局错误捕获（防止静默崩溃）
        window.onerror = function(msg, url, line, col, err) {
            const errMsg = err ? err.message : String(msg);
            const stack = err && err.stack ? err.stack.split('\n').slice(1,4).join('\n') : '';
            const display = `⚠️ 游戏出错\n${errMsg}\n行 ${line}:${col}\n${stack}`;
            // 尝试显示在日志中
            try {
                const logDiv = document.getElementById('game-log');
                if (logDiv) {
                    const entry = document.createElement('div');
                    entry.className = 'log-entry log-danger';
                    entry.textContent = display.replace(/\n/g, ' | ');
                    logDiv.appendChild(entry);
                }
            } catch(e) {}
            console.error(display);
            return false; // 让浏览器也记录
        };
        
        // 窗口大小变化时重新缩放地图
        window.addEventListener('resize', scaleMap);
