// ======== 特效与辅助 ========

                function drawCastleBg() {
    const canvas = document.getElementById('start-castle-bg');
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // 深空背景
    const skyGrad = ctx.createRadialGradient(W*0.5, H*0.4, 0, W*0.5, H*0.5, W*1.1);
    skyGrad.addColorStop(0, '#0a0a2e');
    skyGrad.addColorStop(0.5, '#06061a');
    skyGrad.addColorStop(1, '#02020a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // 繁星
    for (let i = 0; i < 80; i++) {
        const sx = Math.random() * W, sy = Math.random() * H * 0.7;
        const r = 0.5 + Math.random() * 1.5;
        const alpha = 0.3 + Math.random() * 0.7;
        ctx.fillStyle = `rgba(200,220,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
    }
    // 亮星
    for (let i = 0; i < 8; i++) {
        const sx = W*0.1 + Math.random() * W*0.8, sy = H*0.05 + Math.random() * H*0.5;
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 8);
        glow.addColorStop(0, 'rgba(255,255,255,1)');
        glow.addColorStop(0.2, 'rgba(200,220,255,0.6)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(sx - 8, sy - 8, 16, 16);
    }

    const groundY = H * 0.62;
    const cx = W * 0.5;
    const tw = W * 0.5, th = H * 0.38;

    // 圣殿基座
    const baseGrad = ctx.createLinearGradient(0, groundY, 0, groundY + H*0.02);
    baseGrad.addColorStop(0, '#1a1a5a');
    baseGrad.addColorStop(1, '#0a0a2a');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(cx - tw*0.45, groundY - H*0.01, tw*0.9, H*0.03);

    // 中殿5根柱子
    const pillars = [
        { x: cx - tw*0.4, w: tw*0.05, h: th*0.8 },
        { x: cx - tw*0.2, w: tw*0.06, h: th*0.9 },
        { x: cx - tw*0.03, w: tw*0.06, h: th*1.0 },
        { x: cx + tw*0.14, w: tw*0.06, h: th*0.9 },
        { x: cx + tw*0.35, w: tw*0.05, h: th*0.8 },
    ];
    pillars.forEach(p => {
        const pGrad = ctx.createLinearGradient(p.x, 0, p.x + p.w, 0);
        pGrad.addColorStop(0, '#1a1a4a');
        pGrad.addColorStop(0.3, '#2a2a6a');
        pGrad.addColorStop(0.7, '#1a1a4a');
        pGrad.addColorStop(1, '#0a0a2a');
        ctx.fillStyle = pGrad;
        ctx.fillRect(p.x, groundY - p.h, p.w, p.h);
        // 柱顶发光
        const topGlow = ctx.createRadialGradient(p.x + p.w/2, groundY - p.h, 0, p.x + p.w/2, groundY - p.h, tw*0.04);
        topGlow.addColorStop(0, 'rgba(100,180,255,0.4)');
        topGlow.addColorStop(0.5, 'rgba(60,120,220,0.1)');
        topGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = topGlow;
        ctx.fillRect(p.x - tw*0.03, groundY - p.h - H*0.02, p.w + tw*0.06, H*0.04);
    });

    // 穹顶三角形
    const domeGrad = ctx.createLinearGradient(0, 0, 0, groundY - th*0.9);
    domeGrad.addColorStop(0, 'rgba(20,20,60,0.8)');
    domeGrad.addColorStop(0.5, 'rgba(30,30,80,0.4)');
    domeGrad.addColorStop(1, 'rgba(10,10,40,0)');
    ctx.fillStyle = domeGrad;
    ctx.beginPath();
    ctx.moveTo(cx - tw*0.42, groundY - th*0.9);
    ctx.lineTo(cx, groundY - th*1.15);
    ctx.lineTo(cx + tw*0.42, groundY - th*0.9);
    ctx.closePath();
    ctx.fill();

    // 中央发光球体
    const orbGrad = ctx.createRadialGradient(cx, groundY - th*0.55, 0, cx, groundY - th*0.55, tw*0.08);
    orbGrad.addColorStop(0, 'rgba(200,240,255,0.9)');
    orbGrad.addColorStop(0.3, 'rgba(100,180,255,0.5)');
    orbGrad.addColorStop(0.7, 'rgba(40,100,200,0.1)');
    orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = orbGrad;
    ctx.fillRect(cx - tw*0.2, groundY - th*0.75, tw*0.4, th*0.5);

    // 魔法阵光环
    ctx.strokeStyle = 'rgba(100,180,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, groundY - th*0.3, tw*0.12, H*0.02, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, groundY - th*0.3, tw*0.18, H*0.025, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 地面
    const floorGrad = ctx.createLinearGradient(0, groundY, 0, H);
    floorGrad.addColorStop(0, '#0a0a2a');
    floorGrad.addColorStop(0.3, '#06061a');
    floorGrad.addColorStop(1, '#020210');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, groundY, W, H - groundY);

    // 前景雾
    const mistGrad = ctx.createLinearGradient(0, groundY - H*0.03, 0, H);
    mistGrad.addColorStop(0, 'rgba(6,6,26,0)');
    mistGrad.addColorStop(0.3, 'rgba(6,6,26,0.6)');
    mistGrad.addColorStop(1, 'rgba(2,2,10,0.95)');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, groundY - H*0.05, W, H - groundY + H*0.1);
}

        function refreshStartScreen() {
                    // 历史最佳
                    const brText = document.getElementById('br-text');
                    const best = getBestRecord();
                    if (best) {
                        const clsIcon = CONFIG.CLASSES[best.class] ? CONFIG.CLASSES[best.class].icon : '';
                        brText.innerHTML = `🏆 最佳: ${clsIcon} ${escHtml(best.name)} · 第<span class="br-score">${best.floor}</span>层 · <span class="br-score">${best.score}</span>分`;
                    } else {
                        brText.textContent = '🏆 暂无记录 · 开始你的第一次冒险吧';
                    }
                    // 继续游戏按钮
                    const contBtn = document.getElementById('continue-btn');
                    const contInfo = document.getElementById('cont-info');
                    if (hasSaveData()) {
                        const save = loadGame();
                        contBtn.style.display = 'block';
                        contInfo.textContent = `第 ${save.floor} 层 · ${save.playerName} · Lv.${save.player.level}`;
                    } else {
                        contBtn.style.display = 'none';
                    }
                                        // 音效按钮状态
                    const sfxBtn = document.getElementById('sfx-btn-start');
                    if (sfxBtn) {
                        sfxBtn.textContent = sfx.enabled ? '🔊 音效' : '🔇 静音';
                    }
                }

                function showKeyHelp() {
                            document.getElementById('keyhelp-modal').style.display = 'flex';
                            gameState.shopOpen = true;
                        }

                        function closeKeyHelp() {
                            document.getElementById('keyhelp-modal').style.display = 'none';
                            gameState.shopOpen = false;
                        }

                        function showEventEffect(good) {
                            const count = 14;
                            const chars = good
                                ? ['🎆','🎇','✨','🌟','💫','⭐','🎉']
                                : ['💀','☠️','🦴','👻','😈','💥','🖤'];
                            const color = good ? '#ffd700' : '#800';
                            for (let i = 0; i < count; i++) {
                                setTimeout(() => {
                                    const p = document.createElement('span');
                                    p.textContent = chars[Math.floor(Math.random() * chars.length)];
                                    p.style.cssText = `
                                        position:fixed; z-index:5000; pointer-events:none;
                                        left:${10 + Math.random() * 80}%;
                                        top:${10 + Math.random() * 70}%;
                                        font-size:${24 + Math.random() * 40}px;
                                        opacity:1;
transition: all ${0.8 + Math.random() * 1.2}s ease-out;
            `;
                                    document.body.appendChild(p);
                                    requestAnimationFrame(() => {
                                        p.style.opacity = '0';
                                        p.style.transform = `translateY(${-60 - Math.random() * 100}px) rotate(${(Math.random()-0.5)*60}deg) scale(${0.5 + Math.random()})`;
                                    });
                                    setTimeout(() => p.remove(), 2500);
                                }, i * 60);
                            }
                            // 背景闪色
                            const flash = document.createElement('div');
                            flash.style.cssText = `
                                position:fixed;top:0;left:0;width:100%;height:100%;
                                z-index:4999;pointer-events:none;
                                background:${good ? 'rgba(255,215,0,' : 'rgba(180,0,0,'}0.25);
                                transition:opacity 0.8s ease-out;
                            `;
                            document.body.appendChild(flash);
                            requestAnimationFrame(() => { flash.style.opacity = '0'; });
                            setTimeout(() => flash.remove(), 1000);
                        }

function combatCritFlash() {
    const gv = document.getElementById('game-view');
    if (!gv) return;
    gv.style.transition = 'box-shadow 0.1s ease-out';
    gv.style.boxShadow = '0 0 30px rgba(255,200,0,0.6), 0 0 60px rgba(255,150,0,0.3)';
    setTimeout(() => { gv.style.boxShadow = ''; }, 150);
}

function combatBossShake() {
    const gv = document.getElementById('game-view');
    if (!gv) return;
    gv.classList.add('death-shaking');
    setTimeout(() => gv.classList.remove('death-shaking'), 600);
}
