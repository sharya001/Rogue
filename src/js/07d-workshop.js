// ======== 工匠工坊 UI ========
                function showWorkshop() {
                    const pts = META.getPoints();
                    document.getElementById('ws-pts').textContent = pts;
                    const list = document.getElementById('ws-upgrade-list');
                    const ups = META.getUpgrades();
                    let html = '';
                    for (const [id, cfg] of Object.entries(META.UPGRADES)) {
                        const lvl = ups[id] || 0;
                        const maxed = lvl >= cfg.max;
                        const cost = cfg.costBase + lvl * cfg.costInc;
                        const canBuy = !maxed && pts >= cost;
                        html += `<div class="ws-card${maxed ? ' maxed' : ''}">
                            <span class="ws-icon">${cfg.icon}</span>
                            <div class="ws-info">
                                <div class="ws-name">${cfg.name} ${'●'.repeat(lvl)}${'○'.repeat(cfg.max - lvl)}</div>
                                <div class="ws-desc">${cfg.desc} ${cfg.effect ? '+'+Object.values(cfg.effect(1))[0] : ''}/级</div>
                                <div class="ws-lvl">Lv.${lvl}/${cfg.max}</div>
                            </div>
                            <button class="ws-buy-btn" ${canBuy ? '' : 'disabled'} 
                                onclick="buyUpgrade('${id}')">${maxed ? 'MAX' : '🔨'+cost}</button>
                        </div>`;
                    }
                    list.innerHTML = html;
                    document.getElementById('workshop-modal').style.display = 'flex';
                    gameState.shopOpen = true;
                }

                function closeWorkshop() {
                    document.getElementById('workshop-modal').style.display = 'none';
                    gameState.shopOpen = false;
                }

                function buyUpgrade(id) {
                    if (META.buy(id)) {
                        const ptsEl = document.getElementById('ws-pts');
                        const pts = META.getPoints();
                        ptsEl.textContent = pts;
                        ptsEl.style.transition = 'none';
                        ptsEl.style.transform = 'scale(1.4)';
                        ptsEl.style.color = '#ffd700';
                        setTimeout(() => {
                            ptsEl.style.transition = 'all 0.3s ease';
                            ptsEl.style.transform = 'scale(1)';
                            ptsEl.style.color = '#d4a040';
                        }, 50);
                        sfx.play('levelup');
                        showWorkshop();
                    }
                }

                function resetWorkshop() {
                    const refund = META.reset();
                    sfx.play('chest');
                    showWorkshop();
                    alert(`已重置！返还 ${refund} 工匠点数`);
                }

                function showCodex() {
                    const codex = LEGENDARY.getCodex();
                    const count = Object.keys(codex).length;
                    document.getElementById('cx-progress').textContent = `${count}/12`;
                    const grid = document.getElementById('cx-grid');
                    let html = '';
                    LEGENDARY.ITEMS.forEach(item => {
                        const unlocked = !!codex[item.id];
                        html += `<div class="cx-card ${unlocked ? 'unlocked' : 'locked'}">
                            <span class="cx-status">${unlocked ? '✅' : '🔒'}</span>
                            <span class="cx-name">${item.icon} ${item.name}</span>
                            <div class="cx-lore">${unlocked ? item.lore : '???'}</div>
                        </div>`;
                    });
                    grid.innerHTML = html;
                    document.getElementById('codex-modal').style.display = 'flex';
                    gameState.shopOpen = true;
                }

                function closeCodex() {
                    document.getElementById('codex-modal').style.display = 'none';
                    gameState.shopOpen = false;
                }