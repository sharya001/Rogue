// ==================== 工匠工坊 - 永久升级系统 ====================
        const META = {
            POINTS_KEY: 'rogue_meta_points',
            UPGRADES_KEY: 'rogue_meta_upgrades',
            UPGRADES: {
                hp:       { name:'铁匠的锤子', icon:'🔨', desc:'初始生命值',   costBase:10, costInc:10, max:10, effect: l => ({ hp: l*8 }) },
                atk:      { name:'强攻',       icon:'⚔️', desc:'初始攻击力',   costBase:15, costInc:10, max:10, effect: l => ({ atk: l*2 }) },
                def:      { name:'防御',       icon:'🛡️', desc:'初始防御力',   costBase:10, costInc:8,  max:10, effect: l => ({ def: l*1 }) },
                shield:   { name:'护盾',       icon:'🔰', desc:'初始护盾值',   costBase:12, costInc:8,  max:10, effect: l => ({ shield: l*5 }) },
                crit:     { name:'暴击',       icon:'💥', desc:'暴击率',       costBase:15, costInc:12, max:10, effect: l => ({ critRate: l*1 }) },
                lifesteal:{ name:'吸血',       icon:'🩸', desc:'生命偷取',     costBase:18, costInc:10, max:10, effect: l => ({ lifestealRate: Math.floor(l*0.5) }) },
                luck:     { name:'幸运',       icon:'🍀', desc:'经验获取',     costBase:15, costInc:10, max:10, effect: l => ({ expBonus: l*2 }) },
                greed:    { name:'贪婪',       icon:'💎', desc:'金币掉落',     costBase:12, costInc:6,  max:10, effect: l => ({ goldBonus: l*2 }) },
                discount: { name:'幸运硬币',   icon:'🪙', desc:'商店折扣%',    costBase:15, costInc:5,  max:10, effect: l => ({ discount: l*2 }) },
                talent:   { name:'天赋',       icon:'⭐', desc:'初始天赋点',   costBase:30, costInc:25, max:5,  effect: l => ({ talentPoints: l*1 }) },
                revive:   { name:'再生',       icon:'🔄', desc:'死亡后复活1次',costBase:80, costInc:0,  max:1,  effect: l => ({ revive: l }) },
                speed:    { name:'极速',       icon:'👟', desc:'移动速度%',    costBase:12, costInc:8,  max:10, effect: l => ({ speed: l*1 }) },
            },
            getPoints() {
                try { return parseInt(localStorage.getItem(this.POINTS_KEY)) || 0; } catch(e) { return 0; }
            },
            setPoints(n) {
                try { localStorage.setItem(this.POINTS_KEY, String(Math.max(0, Math.floor(n)))); } catch(e) {}
            },
            addPoints(n) { this.setPoints(this.getPoints() + n); },
            getUpgrades() {
                try { const raw = localStorage.getItem(this.UPGRADES_KEY); return raw ? JSON.parse(raw) : {}; } catch(e) { return {}; }
            },
            setUpgrades(obj) {
                try { localStorage.setItem(this.UPGRADES_KEY, JSON.stringify(obj)); } catch(e) {}
            },
            getLevel(id) { const ups = this.getUpgrades(); return ups[id] || 0; },
            buy(id) {
                const ups = this.getUpgrades(); const cfg = this.UPGRADES[id];
                if (!cfg) return false; const lvl = ups[id] || 0;
                if (lvl >= cfg.max) return false;
                const cost = cfg.costBase + lvl * cfg.costInc;
                if (this.getPoints() < cost) return false;
                this.setPoints(this.getPoints() - cost); ups[id] = lvl + 1;
                this.setUpgrades(ups); return true;
            },
            sumEffects() {
                const ups = this.getUpgrades(); const eff = {};
                for (const [id, lvl] of Object.entries(ups)) {
                    const cfg = this.UPGRADES[id]; if (!cfg || !cfg.effect) continue;
                    const e = cfg.effect(lvl);
                    for (const [k, v] of Object.entries(e)) { eff[k] = (eff[k] || 0) + v; }
                }
                return eff;
            },
            applyToPlayer(player) {
                const eff = this.sumEffects();
                if (eff.hp) { player.maxHp += eff.hp; player.hp += eff.hp; }
                if (eff.atk) player.atk += eff.atk;
                if (eff.def) player.def += eff.def;
                if (eff.shield) { player.maxShield += eff.shield; player.shield = player.maxShield; }
                if (eff.critRate) player.critRate += eff.critRate;
                if (eff.lifestealRate) player.lifestealRate += eff.lifestealRate;
                if (eff.talentPoints) gameState.talentPoints += eff.talentPoints;
            },
            reset() {
                const ups = this.getUpgrades(); let refund = 0;
                for (const [id, lvl] of Object.entries(ups)) {
                    const cfg = this.UPGRADES[id]; if (!cfg || lvl <= 0) continue;
                    for (let i = 0; i < lvl; i++) { refund += cfg.costBase + i * cfg.costInc; }
                }
                this.setUpgrades({}); this.addPoints(refund); return refund;
            },
        };

        // ==================== 诅咒装备系统 ====================
        const CURSE = {
            TYPES: [
                { id:'blood', name:'血咒', icon:'🩸', desc:'攻击+40%，每回合损失3%HP',
                  bonus:{ atkPct:40 }, penalty:{ hpDrainPct:3 } },
                { id:'greed', name:'贪咒', icon:'💎', desc:'金币+60%，防御-30%',
                  bonus:{ goldPct:60 }, penalty:{ defPct:-30 } },
                { id:'power', name:'力咒', icon:'💪', desc:'攻击+50%，无法用药水',
                  bonus:{ atkPct:50 }, penalty:{ noPotion:true } },
                { id:'shield', name:'盾咒', icon:'🛡️', desc:'防御+40%，速度-40%',
                  bonus:{ defPct:40 }, penalty:{ speedPct:-40 } },
                { id:'soul', name:'魂咒', icon:'👻', desc:'全属性+25%，承伤+25%',
                  bonus:{ allPct:25 }, penalty:{ dmgTakenPct:25 } },
                { id:'fury', name:'狂咒', icon:'🔥', desc:'暴击+20%，每回合损失5%HP',
                  bonus:{ critRate:20 }, penalty:{ hpDrainPct:5 } },
            ],
            random() { return this.TYPES[Math.floor(Math.random() * this.TYPES.length)]; },
            apply(equip) {
                const curse = this.random();
                equip.cursed = true; equip.curseType = curse.id;
                equip.curseName = curse.name; equip.curseIcon = curse.icon;
                equip.curseDesc = curse.desc;
                equip.curseBonus = curse.bonus; equip.cursePenalty = curse.penalty;
                equip.name = `💀${curse.icon} ${equip.name}`;
                equip.curseColor = '#c6f'; return equip;
            },
            hasCursed(player) {
                return Object.values(player.equipment).some(eq => eq && eq.cursed);
            },
            cleanse(player) {
                            let count = 0;
                            for (const slot of Object.keys(player.equipment)) {
                                const eq = player.equipment[slot];
                                if (eq && eq.cursed) {
                                    eq.cursed = false; eq.curseType = null; eq.curseName = null;
                                    eq.curseIcon = null; eq.curseDesc = null;
                                    eq.curseBonus = null; eq.cursePenalty = null; eq.curseColor = null;
                                    eq.name = eq.name.replace(/^💀.\s*/, ''); count++;
                                }
                            }
                            return count;
                        },
                    };

                    // ==================== 传奇装备系统 ====================
                    const LEGENDARY = {
                        KEY: 'rogue_legendary',
                        ITEMS: [
                            { id:'dragonBlade', name:'龙息之刃', slot:'mainHand', atk:25, def:0, hp:0, icon:'🗡️', lore:'火山层火龙王烈焰淬炼', fx:'ignite30' },
                            { id:'frostHeart', name:'冰霜之心', slot:'offHand', atk:0, def:20, hp:0, icon:'🛡️', lore:'冰原万年冰川核心', fx:'frostReflect' },
                            { id:'shadowCloak', name:'暗影斗篷', slot:'chest', atk:0, def:0, hp:60, icon:'👕', lore:'盗贼公会取影魔之皮', fx:'dodge15' },
                            { id:'sageCrown', name:'贤者之冠', slot:'helmet', atk:10, def:0, hp:0, icon:'🎩', lore:'禁书区献祭知识获得', fx:'exp30' },
                            { id:'galeBoots', name:'疾风之靴', slot:'boots', atk:0, def:8, hp:0, icon:'👢', lore:'风元素领主羽毛编织', fx:'bonusStep' },
                            { id:'tyrantGrasp', name:'暴君之握', slot:'gloves', atk:18, def:0, hp:0, icon:'🧤', lore:'上代迷宫霸主护手', fx:'critDouble' },
                            { id:'eternalRing', name:'永恒之戒', slot:'ring1', atk:5, def:5, hp:5, icon:'💍', lore:'祭坛感悟时空法则', fx:'floorHeal' },
                            { id:'charmAllure', name:'魅惑项链', slot:'necklace', atk:15, def:0, hp:0, icon:'🧿', lore:'宝藏室最华丽宝箱', fx:'killHeal20' },
                            { id:'thunderHammer', name:'雷霆战锤', slot:'mainHand', atk:30, def:0, hp:0, icon:'🗡️', lore:'铁匠铺封印雷云', fx:'stun20' },
                            { id:'phoenixRobe', name:'凤凰羽衣', slot:'chest', atk:0, def:0, hp:80, icon:'👕', lore:'不死鸟涅槃羽毛编织', fx:'revive' },
                            { id:'holyShield', name:'圣光之盾', slot:'offHand', atk:0, def:25, hp:0, icon:'🛡️', lore:'圣骑士团遗物', fx:'startShield30' },
                            { id:'abyssEye', name:'深渊之眼', slot:'ring2', atk:0, def:0, hp:0, icon:'💍', lore:'被诅咒宝石镶嵌', fx:'reveal5' },
                        ],
                        random() { return this.ITEMS[Math.floor(Math.random() * this.ITEMS.length)]; },
                        generate() {
                            const tmpl = this.random();
                            const equip = {
                                type: tmpl.slot, name: `✨${tmpl.name}`, quality: 8,
                                atk: tmpl.atk, def: tmpl.def, maxHp: tmpl.hp,
                                affixes: [], setId: null, setName: null,
                                legendary: true, legendaryId: tmpl.id,
                                legendaryFx: tmpl.fx, legendaryLore: tmpl.lore,
                                legendaryIcon: tmpl.icon,
                            };
                            return equip;
                        },
                        // 图鉴存取
                        getCodex() {
                            try { const raw = localStorage.getItem(this.KEY); return raw ? JSON.parse(raw) : {}; } catch(e) { return {}; }
                        },
                        unlock(id) {
                            const codex = this.getCodex();
                            if (codex[id]) return false;
                            codex[id] = true;
                            try { localStorage.setItem(this.KEY, JSON.stringify(codex)); } catch(e) {}
                            // 集齐检查
                            if (Object.keys(codex).length >= this.ITEMS.length) unlockAchievement('legendaryHunter');
                            return true;
                        },
                    };