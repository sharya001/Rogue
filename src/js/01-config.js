/* ╔══════════════════════════════════════════╗
        ║  MODULE 1: 核心配置与状态              ║
        ╚══════════════════════════════════════════╝ */
        
// ==================== 游戏配置 ====================
        const CONFIG = {
MAP_WIDTH: 27,
            MAP_HEIGHT: 15,
            MAX_LOG_ENTRIES: 20,
            BASE_ENEMY_HP: 35,
                        BASE_ENEMY_ATK: 15,
                        BASE_ENEMY_DEF: 6,
            EXP_BASE: 50,
            HP_PER_LEVEL: 20,
            ATK_PER_LEVEL: 3,
                        DEF_PER_LEVEL: 1,
            
                        // 升级选项池（每次随机 3 选 1）
                        LEVEL_UP_OPTIONS: [
                                                                                                    { name: '力量训练', icon: '🗡️', hp: 0,  atk: 3, def: 0,  gold: 0,  desc: '伤害 +3' },
                                                                                                        { name: '铁壁防御', icon: '🛡️', hp: 5,  atk: 0, def: 3,  gold: 0,  desc: '生命上限 +5 · 伤害减免 +3' },
                                                                                                        { name: '生命源泉', icon: '❤️', hp: 30, atk: 0, def: 0,  gold: 0,  desc: '最大生命值 +30' },
                                                                                                        { name: '全能修炼', icon: '💪', hp: 10, atk: 1, def: 1,  gold: 0,  desc: '生命上限 +10 · 每击伤害 +1 · 伤害减免 +1' },
                                                                                                        { name: '狂暴之力', icon: '🔥', hp: 0,  atk: 4, def: -2, gold: 0,  desc: '每击伤害 +4 · 防御降低 2 点（高风险高回报）' },
                                                                                                        { name: '金运亨通', icon: '💰', hp: 8,  atk: 1, def: 0,  gold: 35, desc: '立即获得 35 金币 · 生命上限 +8 · 伤害 +1' },
                                                                                                        { name: '强健体魄', icon: '🏋️', hp: 25, atk: 1, def: 0,  gold: 0,  desc: '生命上限 +25 · 每击伤害 +1' },
                                                                                                        { name: '圣光庇护', icon: '✨', hp: 20, atk: 0, def: 2,  gold: 0,  desc: '生命上限 +20 · 伤害减免 +2' },
                                                                                                        { name: '精准打击', icon: '🎯', hp: 5, atk: 2, def: 0,  gold: 0,  critRateBonus: 3, doubleHitBonus: 5, desc: '生命 +5 · 伤害 +2 · 暴击率永久+3% · 连击率永久+5%（概率再攻击一次）' },
                                                                                                        { name: '寒冰之力', icon: '❄️', hp: 10, atk: 1, def: 0,  gold: 0,  freezeBonus: 6, penetrationBonus: 2, desc: '冰冻敌人几率+6%（冻结1回合） · 穿透+2（无视防御的真实伤害） · 生命+10 · 伤害+1' },
                                                                                                        { name: '雷霆之怒', icon: '⚡', hp: 5, atk: 3, def: 0,  gold: 0,  stunBonus: 5, igniteBonus: 5, desc: '眩晕几率+5%（跳过敌人回合） · 点燃几率+5%（持续3回合掉血） · 生命+5 · 伤害+3' },
                                                                                                        { name: '钢铁意志', icon: '🗿', hp: 12, atk: 0, def: 2,  gold: 0,  damageReduceBonus: 3, shieldBonus: 12, desc: '减伤+3%（所有伤害降低） · 护盾+12（战斗开始额外生命） · 生命+12 · 防御+2' },
                                                                                                        { name: '嗜血本能', icon: '🩸', hp: 8, atk: 2, def: 0,  gold: 0,  lifestealBonus: 4, killHealBonus: 3, desc: '偷取+4%（攻击回血） · 击杀回血+3% · 生命+8 · 伤害+2' },
                                                                                                        { name: '弱点洞察', icon: '👁️', hp: 5, atk: 2, def: 0,  gold: 0,  vulnerableBonus: 8, penetrationBonus: 1, desc: '脆弱+8%（敌人承伤+20%持续2回合） · 穿透+1（真实伤害） · 生命+5 · 伤害+2' },
                                                                                                        { name: '战场急救', icon: '💉', hp: 15, atk: 1, def: 1,  gold: 0,  shieldBonus: 16, killHealBonus: 4, desc: '护盾+16（战斗开始额外生命） · 击杀回血+4% · 生命+15 · 伤害+1 · 防御+1' },
                                                                                                        { name: '点燃斗志', icon: '🔥', hp: 8, atk: 2, def: -1, gold: 0,  igniteBonus: 8, doubleHitBonus: 3, desc: '点燃几率+8%（持续3回合掉血） · 连击率+3%（再攻击一次） · 生命+8 · 伤害+2 · 防御-1' },
                                                ],
// 装备配置（9槽位）
            EQUIPMENT_SLOTS: {
                mainHand:  { name: '主手武器', icon: '🗡️', stat: 'atk', baseVal: 5, randVal: 4, tierMult: 1 },
                offHand:   { name: '副手',     icon: '🛡️', stat: 'def', baseVal: 2, randVal: 2, tierMult: 0.6 },
                helmet:    { name: '头盔',     icon: '🎩', stat: 'def', baseVal: 3, randVal: 2, tierMult: 0.8 },
                chest:     { name: '胸甲',     icon: '👕', stat: 'def', baseVal: 5, randVal: 3, tierMult: 1 },
                gloves:    { name: '护手',     icon: '🧤', stat: 'atk', baseVal: 2, randVal: 2, tierMult: 0.5 },
                boots:     { name: '靴子',     icon: '👢', stat: 'def', baseVal: 2, randVal: 2, tierMult: 0.5 },
                ring1:     { name: '戒指Ⅰ',   icon: '💍', stat: 'both', baseVal: 1, randVal: 2, tierMult: 0.4 },
                ring2:     { name: '戒指Ⅱ',   icon: '💍', stat: 'both', baseVal: 1, randVal: 2, tierMult: 0.4 },
                necklace:  { name: '项链',     icon: '🧿', stat: 'both', baseVal: 2, randVal: 3, tierMult: 0.7 },
},
// 品质系统
            QUALITY_CONFIG: [
                { name: '破烂的', color: '#999', affixCount: 0, atkR: [1,2], defR: [1,1], hpR: [3,5] },
                { name: '平凡的', color: '#fff', affixCount: 0, atkR: [2,4], defR: [1,3], hpR: [5,10] },
                { name: '坚固的', color: '#6f6', affixCount: 1, atkR: [4,6], defR: [3,5], hpR: [10,15] },
                { name: '精良的', color: '#6cf', affixCount: 2, atkR: [6,9], defR: [5,7], hpR: [15,20] },
                { name: '稀有的', color: '#96f', affixCount: 2, atkR: [7,10], defR: [6,8], hpR: [18,25] },
                { name: '神圣的', color: '#f6f', affixCount: 3, atkR: [9,13], defR: [7,10], hpR: [20,30] },
                { name: '王者的', color: '#fc6', affixCount: 3, atkR: [12,16], defR: [9,13], hpR: [25,35] },
                { name: '远古的', color: '#f93', affixCount: 4, atkR: [15,20], defR: [12,16], hpR: [30,40] },
                { name: '神话的', color: '#f3c', affixCount: 4, atkR: [18,25], defR: [15,20], hpR: [35,50] },
            ],
            QUALITY_WEIGHT: [15,25,20,15,10,8,4,2,1],  // 掉落权重
            
            // 丰富名称库（按部位类型）
            EQUIP_NAME_POOL: {
                weapon: ['铁剑','钢斧','匕首','长剑','弯刀','战刃','巨剑','斩马刀','骨刃','炎刃','冰锋','暗影之刃','破甲剑','锯齿刃','龙牙刃','深渊之刃','破晓','裁决','噬魂','斩魔','光铸之刃','暗蚀剑','符文剑','星辰剑'],
                offhand: ['圆盾','铁盾','钢盾','骨盾','法典','护腕','短刃','圣契','暗影盾','符文盾','荆棘盾','光盾','魔典','血盾','冰盾','火盾','深渊盾','守护者盾','复仇盾','泰坦盾'],
                head: ['布帽','皮盔','铁盔','战盔','王冠','骨盔','轻盔','重盔','暗影兜帽','符文盔','龙鳞盔','天使冠','恶魔角盔','冰盔','火盔','深渊盔','星辰盔','远古盔','神话冠'],
                body: ['布甲','皮甲','锁甲','板甲','魔甲','骨甲','龙鳞甲','暗影甲','符文甲','光铸甲','烈焰甲','冰霜甲','深渊甲','泰坦甲','天使甲','恶魔甲','星辰甲','远古魔甲','神话战甲'],
                hand: ['布手套','铁护手','钢护手','皮手套','骨护手','暗影护手','符文护手','光铸护手','烈焰护手','冰霜护手','深渊护手','龙鳞护手','天使护手','恶魔护手','星辰护手'],
                foot: ['布鞋','皮靴','铁靴','战靴','魔靴','骨靴','暗影靴','符文靴','光铸靴','烈焰靴','冰霜靴','深渊靴','龙鳞靴','天使靴','恶魔靴','星辰靴'],
                ring: ['铜戒','银戒','金戒','铁戒','骨戒','暗影戒','符文戒','光戒','烈焰戒','冰霜戒','深渊戒','龙戒','天使戒','恶魔戒','星辰戒','远古戒','神话戒'],
                neck: ['项链','吊坠','护符','宝珠','圣徽','骨坠','暗影坠','符文坠','光坠','烈焰坠','冰霜坠','深渊坠','龙坠','天使徽','恶魔徽','星辰坠','远古宝珠','神话圣物']
            },
            
            // 词缀系统（按品质自动分配）
            AFFIX_POOL: {
                            universal: [
                                { id:'maxHp', name:'生命', desc:'HP+', vals:[5,10,15,20,25,30,35,40,50] },
                                { id:'allAtk', name:'强攻', desc:'攻击+', vals:[1,2,3,4,5,6,7,8,10] },
                                { id:'allDef', name:'坚韧', desc:'防御+', vals:[1,2,3,4,5,6,7,8,10] },
                                { id:'penetration', name:'穿透', desc:'穿透+', vals:[1,2,3,4,5,6,8,10,12] },
                                { id:'damageReduce', name:'减伤', desc:'免伤+', vals_pct:[2,3,4,5,6,8,10,12,15] },
                            ],
            weapon: [
                                { id:'critRate', name:'锋利', desc:'暴击率+', vals_pct:[2,3,4,5,6,8,10,12,15] },
                                { id:'bossDmg', name:'破阵', desc:'Boss伤害+', vals_pct:[10,15,20,25,30,35,40,45,50] },
                                { id:'poisonHit', name:'剧毒', desc:'攻击15%中毒', vals:[15] },
                                { id:'bleedHit', name:'撕裂', desc:'攻击15%流血', vals:[15] },
                                { id:'doubleHit', name:'连击', desc:'连击率+', vals_pct:[5,7,10,12,15,18,22,25,30] },
                                { id:'freezeRate', name:'冰霜', desc:'冰冻率+', vals_pct:[5,7,10,12,15,18,22,25,30] },
                                { id:'stunRate', name:'眩晕', desc:'眩晕率+', vals_pct:[4,6,8,10,12,15,18,20,25] },
                                { id:'igniteRate', name:'点燃', desc:'点燃率+', vals_pct:[5,7,10,12,15,18,22,25,30] },
                                { id:'vulnerableRate', name:'脆弱', desc:'脆弱率+', vals_pct:[8,10,12,15,18,22,25,30,35] },
                            ],
                            defense: [
                                { id:'block', name:'格挡', desc:'格挡率+', vals_pct:[5,7,10,12,15,18,20,25,30] },
                                { id:'regen', name:'再生', desc:'每层回血+', vals:[2,3,4,5,6,7,8,10,12] },
                                { id:'maxShield', name:'护盾', desc:'护盾+', vals:[10,15,20,25,30,40,50,60,80] },
                            ],
                            explore: [
                                { id:'gold', name:'财富', desc:'金币+', vals_pct:[10,15,20,25,30,35,40,45,50] },
                                { id:'luck', name:'幸运', desc:'宝箱率+', vals_pct:[5,7,10,12,15,18,20,25,30] },
                                { id:'heal', name:'治愈', desc:'药水+', vals_pct:[10,20,30,40,50,60,70,80,100] },
                                { id:'lifesteal', name:'吸血', desc:'击杀回血+', vals:[3,4,5,6,7,8,10,12,15] },
                                { id:'killHeal', name:'嗜血', desc:'击杀回血%', vals_pct:[2,3,4,5,6,7,8,10,12] },
                            ]
                        },
            
            // 套装系统
            SET_SYSTEM: {
                dragon:  { name:'龙鳞', parts:['head','body','hand','foot','ring1','necklace'], bonus:['防御+10','每层回血+8','免疫中毒/流血，受伤-20%'] },
                shadow:  { name:'暗影', parts:['mainHand','offHand','head','body','ring1','necklace'], bonus:['暴击率+10%','暴击伤害+50%','击杀20%回满血'] },
                brave:   { name:'勇者', parts:['mainHand','body','head','foot','ring2','necklace'], bonus:['攻+15 防+10','经验+30%','全伤害+30%'] },
                flame:   { name:'烈焰', parts:['mainHand','offHand','body','gloves','ring1','necklace'], bonus:['攻击+20','10%点燃敌人','暴击秒杀普通怪'] },
                frost:   { name:'冰霜', parts:['offHand','head','body','foot','ring1','ring2'], bonus:['防御+15','受伤-20%','冻结敌人1回合'] },
                abyss:   { name:'深渊', parts:['mainHand','head','body','gloves','boots','necklace'], bonus:['全属性+20','伤害+50%','低血高伤'] },
                angel:   { name:'天使', parts:['offHand','head','body','ring1','ring2','necklace'], bonus:['HP+50','药水翻倍','每层免死1次'] },
                demon:   { name:'恶魔', parts:['mainHand','offHand','gloves','boots','ring1','necklace'], bonus:['击杀回血+10','金币+50%','攻击100%中毒'] },
                star:    { name:'星辰', parts:['head','body','gloves','boots','ring2','necklace'], bonus:['金币经验+50%','宝箱2件装备','每层升级1次'] },
            },
            SPECIAL_WEAPONS: [
                { name: '毒液匕首', tier: 2, atk: 9, effect: 'poison', chance: 0.15 },
                { name: '锯齿长剑', tier: 3, atk: 13, effect: 'bleed', chance: 0.2 },
                { name: '暗影之刃', tier: 4, atk: 17, effect: 'poison', chance: 0.25 }
            ],
            // Boss 配置
            BOSS_FLOOR_INTERVAL: 5,
            BOSS_NAMES: ['哥布林王', '骷髅领主', '恶魔统领', '暗影魔王', '深渊巨龙'],
            BOSS_HP_MULTIPLIER: 5,    // Boss HP = 基础HP × 5
            BOSS_ATK_MULTIPLIER: 2,
            BOSS_EXP_MULTIPLIER: 10,
            BOSS_GOLD_MULTIPLIER: 5,
            // 精英怪配置
            ELITE_CHANCE: 0.25,           // 每层 25% 几率出精英怪
            ELITE_HP_MULTIPLIER: 2,       // 2×HP
            ELITE_ATK_MULTIPLIER: 1.5,    // 1.5×ATK
            ELITE_EXP_MULTIPLIER: 3,      // 3×经验
            ELITE_ABILITIES: [
                                        { name: '剧毒', id: 'poison', desc: '攻击附带中毒' },
                                        { name: '撕裂', id: 'bleed', desc: '攻击附带流血' },
                                        { name: '连击', id: 'doubleHit', desc: '概率二连击' },
                                        { name: '冰冻', id: 'freeze', desc: '概率冰冻玩家' },
                                        { name: '眩晕', id: 'stun', desc: '概率眩晕玩家' },
                                        { name: '点燃', id: 'ignite', desc: '攻击点燃玩家' },
                                        { name: '穿透', id: 'penetration', desc: '额外真实伤害' },
                                        { name: '硬化', id: 'dmgReduce', desc: '承受伤害 -30%' },
                                        { name: '吸血', id: 'lifesteal', desc: '攻击回复生命' },
                                        { name: '护盾', id: 'shield', desc: '战斗开始额外生命' },
                                    ],
                                    // 怪物突变能力 (v3.29.0) — ~15%概率普通怪物获得随机能力
                                    MONSTER_MUTATIONS: [
                                        { id:'sniper', name:'狙击', icon:'🎯', desc:'无视护盾' },
                                        { id:'burn', name:'灼烧', icon:'🔥', desc:'攻击附加点燃(2回合)' },
                                        { id:'freeze', name:'冰冻', icon:'❄️', desc:'攻击附加冰冻(1回合)' },
                                        { id:'dodge', name:'闪避', icon:'💨', desc:'20%概率闪避攻击' },
                                        { id:'summon', name:'召唤', icon:'📡', desc:'死亡时召唤同层怪物' },
                                        { id:'ironWall', name:'铁壁', icon:'🛡️', desc:'防御×1.5' },
                                        { id:'swift', name:'迅捷', icon:'⚡', desc:'首回合先制攻击' },
                                    ],
                                    MONSTER_MUTATION_CHANCE: 0.15,
                                    // 稀有Boss (v3.29.0) — 每15层替换普通Boss
                                    RARE_BOSS_FLOOR_INTERVAL: 15,
                                    RARE_BOSSES: [
                                        { id:'fireDragon', name:'炎龙', icon:'🐲🔥', desc:'龙息+点燃', skills:['dragonBreath','burn'] },
                                        { id:'iceDragon', name:'冰龙', icon:'🐲❄️', desc:'冰冻光环+暴风雪', skills:['freezeAura','blizzard'] },
                                        { id:'boneDragon', name:'骨龙', icon:'🐲💀', desc:'召唤骷髅+死亡诅咒', skills:['summonSkeleton','deathCurse'] },
                                        { id:'thunderDragon', name:'雷龙', icon:'🐲⚡', desc:'雷暴+眩晕', skills:['thunder','stun'] },
                                    ],
                                    // 商店配置
            SHOP_FLOOR_INTERVAL: 3,
            SHOP_NPCS: [
                { type: 'general_store', icon: '🏪', name: '杂货商人', color: '#ffd700' }
            ],
SHOP_ITEMS: [
                // 武器
                { type: 'mainHand', name: '铁剑', price: 50, atk: 8, def: 0, desc: '攻击+8' },
                { type: 'mainHand', name: '钢斧', price: 80, atk: 12, def: 0, desc: '攻击+12' },
                { type: 'mainHand', name: '毒液匕首', price: 120, atk: 9, def: 0, desc: '攻击+9, 15%中毒', effect: 'poison', effectChance: 0.15 },
                // 防具
                { type: 'chest', name: '锁子胸甲', price: 60, atk: 0, def: 8, desc: '防御+8' },
                { type: 'chest', name: '板金胸甲', price: 100, atk: 0, def: 12, desc: '防御+12' },
                { type: 'helmet', name: '铁盔', price: 40, atk: 0, def: 5, desc: '防御+5' },
                { type: 'gloves', name: '力量护手', price: 35, atk: 4, def: 0, desc: '攻击+4' },
                { type: 'boots', name: '旅行靴', price: 35, atk: 0, def: 4, desc: '防御+4' },
                { type: 'necklace', name: '守护项链', price: 70, atk: 3, def: 3, desc: '攻击+3 防御+3' },
                // 药水
                { type: 'potion', name: '生命药水', price: 20, heal: 50, desc: '恢复50HP' },
                { type: 'potion', name: '高级药水', price: 40, heal: 100, desc: '恢复100HP' },
                { type: 'potion', name: '超级药水', price: 80, heal: 200, desc: '恢复200HP' }
            ],
            // 状态效果配置
            CRIT_MULTIPLIER: 1.5,  // 1.5 倍暴击伤害
            POISON_DAMAGE: 5,  // 中毒每回合伤害
            BLEED_PERCENT: 0.05,  // 流血 5% 最大 HP 伤害
            
            // 地图主题配置
            THEMES: {
abyss: {
                    name: '深渊',
                    icon: '🌑',
                    wall: '🧱',
                    wallColor: '#666',
                    floor: '·',
                    floorColor: '#444',
                    exit: '🌀',
                                        bgColor: '#0a0a0a',
                                        borderColor: '#0f0',
                                        accentColor: '#0f0'
                                    },
                                    forest: {
                                        name: '森林',
                                        icon: '🌲',
                                        wall: '🌳', wallColor: '#4a5',
                                        floor: '🍃',
                                        floorColor: '#3a4',
                                        exit: '🌀',
                                        bgColor: '#0a1a0a',
                                        borderColor: '#4a5',
                                        accentColor: '#6c6'
                                    },
                                    cave: {
                                        name: '洞穴',
                                        icon: '🕳️',
                                        wall: '🪨',
                                        wallColor: '#765',
                                        floor: '⚫',
                                        floorColor: '#554',
                                        exit: '🌀',
                                        bgColor: '#15100a',
                                        borderColor: '#876',
                                        accentColor: '#ba8'
                                    },
                                    volcano: {
                                        name: '火山',
                                        icon: '🌋',
                                        wall: '🔥',
                                        wallColor: '#f62',
                                        floor: '🌑',
                                        floorColor: '#842',
                                        exit: '🌀',
                                        bgColor: '#1a0800',
                                        borderColor: '#f62',
                                        accentColor: '#fa4'
                                    },
ice: {
                                        name: '冰原',
                                        icon: '❄️',
                                        wall: '🧊',
                                        wallColor: '#8bf',
                                        floor: '❄️',
                                        floorColor: '#569',
                                        exit: '🌀',
                                        bgColor: '#050a15',
                                        borderColor: '#8bf',
                                        accentColor: '#adf'
                                    },
                                    graveyard: {
                                        name: '墓地',
                                        icon: '🪦',
                                        wall: '🪦',
                                        wallColor: '#7a6',
                                        floor: '🍂',
                                        floorColor: '#542',
                                        exit: '🌀',
                                        bgColor: '#0a0a08',
                                        borderColor: '#9a8',
                                        accentColor: '#ca4'
                                    },
                                    voidzone: {
                                        name: '虚空',
                                        icon: '🌀',
                                        wall: '⬛',
                                        wallColor: '#336',
                                        floor: '·',
                                        floorColor: '#448',
                                        exit: '🌀',
                                        bgColor: '#020210',
                                        borderColor: '#44f',
                                        accentColor: '#88f'
                                    },
                                    swamp: {
                                        name: '沼泽',
                                        icon: '🐊',
                                        wall: '🌿',
                                        wallColor: '#484',
                                        floor: '🟢',
                                        floorColor: '#363',
                                        exit: '🌀',
                                        bgColor: '#080a04',
                                        borderColor: '#6a6',
                                        accentColor: '#8c8'
                                    }
            },
            THEME_ORDER: ['abyss', 'forest', 'cave', 'volcano', 'ice', 'graveyard', 'voidzone', 'swamp'],

            // 主题怪物配置（每个主题5种怪物）
            THEME_ENEMIES: {
                abyss: [
                    { name: '幽灵',   emoji: '👻', hpMod: 0.8, atkMod: 1.1, defMod: 0.7, expMod: 1.0 },
                    { name: '骷髅',   emoji: '💀', hpMod: 1.0, atkMod: 1.0, defMod: 1.0, expMod: 1.0 },
                    { name: '暗影',   emoji: '👤', hpMod: 0.9, atkMod: 1.2, defMod: 0.8, expMod: 1.2 },
                    { name: '怨灵',   emoji: '👿', hpMod: 0.7, atkMod: 1.3, defMod: 0.6, expMod: 1.3 },
                    { name: '石像鬼', emoji: '🗿', hpMod: 1.2, atkMod: 1.0, defMod: 1.3, expMod: 1.4 },
                ],
                forest: [
                    { name: '野狼',   emoji: '🐺', hpMod: 0.9, atkMod: 1.2, defMod: 0.8, expMod: 1.1 },
                    { name: '毒蛛',   emoji: '🕷️', hpMod: 0.7, atkMod: 1.0, defMod: 0.9, expMod: 1.0 },
                    { name: '树精',   emoji: '👹', hpMod: 1.3, atkMod: 0.8, defMod: 1.2, expMod: 1.2 },
                    { name: '精灵',   emoji: '🧚', hpMod: 0.6, atkMod: 1.4, defMod: 0.5, expMod: 1.5 },
                    { name: '食人花', emoji: '🌺', hpMod: 1.1, atkMod: 1.0, defMod: 1.1, expMod: 1.1 },
                ],
                cave: [
                    { name: '蝙蝠',   emoji: '🦇', hpMod: 0.7, atkMod: 1.1, defMod: 0.6, expMod: 0.9 },
                    { name: '巨虫',   emoji: '🐛', hpMod: 1.0, atkMod: 1.0, defMod: 1.0, expMod: 1.0 },
                    { name: '石魔',   emoji: '🗿', hpMod: 1.4, atkMod: 0.9, defMod: 1.3, expMod: 1.3 },
                    { name: '岩蛇',   emoji: '🐍', hpMod: 0.8, atkMod: 1.2, defMod: 0.9, expMod: 1.1 },
                    { name: '蝎子',   emoji: '🦂', hpMod: 1.0, atkMod: 1.1, defMod: 1.0, expMod: 1.2 },
                ],
                volcano: [
                    { name: '火灵',   emoji: '💥', hpMod: 0.8, atkMod: 1.3, defMod: 0.8, expMod: 1.1 },
                    { name: '熔岩兽', emoji: '🦎', hpMod: 1.1, atkMod: 1.0, defMod: 1.0, expMod: 1.0 },
                    { name: '小鬼',   emoji: '👺', hpMod: 0.9, atkMod: 1.1, defMod: 0.9, expMod: 1.0 },
                    { name: '灰烬兽', emoji: '🌫️', hpMod: 0.7, atkMod: 1.0, defMod: 0.7, expMod: 1.0 },
                    { name: '炎魔',   emoji: '👿', hpMod: 1.5, atkMod: 1.2, defMod: 1.1, expMod: 1.5 },
                ],
                ice: [
                    { name: '冰灵',   emoji: '💠', hpMod: 0.9, atkMod: 1.0, defMod: 1.2, expMod: 1.1 },
                    { name: '雪怪',   emoji: '👣', hpMod: 1.3, atkMod: 1.1, defMod: 1.0, expMod: 1.3 },
                    { name: '寒冰兽', emoji: '🦌', hpMod: 1.0, atkMod: 0.9, defMod: 1.1, expMod: 1.0 },
                    { name: '霜巨人', emoji: '🧊', hpMod: 1.6, atkMod: 1.0, defMod: 1.3, expMod: 1.5 },
                    { name: '冰魔',   emoji: '⛄', hpMod: 1.1, atkMod: 1.1, defMod: 1.0, expMod: 1.2 },
                ],
                graveyard: [
                    { name: '僵尸',   emoji: '🧟', hpMod: 1.2, atkMod: 0.9, defMod: 1.1, expMod: 1.2 },
                    { name: '幽灵',   emoji: '👻', hpMod: 0.7, atkMod: 1.3, defMod: 0.5, expMod: 1.3 },
                    { name: '死灵',   emoji: '💀', hpMod: 1.0, atkMod: 1.2, defMod: 0.8, expMod: 1.2 },
                    { name: '食尸鬼', emoji: '👹', hpMod: 0.9, atkMod: 1.1, defMod: 0.9, expMod: 1.1 },
                    { name: '巫妖',   emoji: '🧙', hpMod: 1.0, atkMod: 1.4, defMod: 1.0, expMod: 1.6 },
                ],
                voidzone: [
                    { name: '虚空行者',emoji: '👤', hpMod: 0.8, atkMod: 1.2, defMod: 0.8, expMod: 1.2 },
                    { name: '星界虫',  emoji: '🐛', hpMod: 1.0, atkMod: 1.1, defMod: 0.7, expMod: 1.1 },
                    { name: '跃迁兽',  emoji: '🦑', hpMod: 1.1, atkMod: 1.3, defMod: 0.6, expMod: 1.4 },
                    { name: '裂隙魔',  emoji: '😈', hpMod: 1.4, atkMod: 1.2, defMod: 1.0, expMod: 1.5 },
                    { name: '虚空之眼',emoji: '👁️', hpMod: 0.9, atkMod: 1.5, defMod: 0.9, expMod: 1.6 },
                ],
                swamp: [
                    { name: '泥怪',   emoji: '🟤', hpMod: 1.1, atkMod: 0.8, defMod: 1.2, expMod: 1.0 },
                    { name: '毒蛙',   emoji: '🐸', hpMod: 0.7, atkMod: 1.2, defMod: 0.6, expMod: 1.2 },
                    { name: '水蛭',   emoji: '🪱', hpMod: 0.8, atkMod: 0.9, defMod: 0.5, expMod: 0.8 },
                    { name: '沼泽巨鳄',emoji: '🐊', hpMod: 1.5, atkMod: 1.2, defMod: 1.1, expMod: 1.6 },
                    { name: '藤蔓怪', emoji: '🌿', hpMod: 1.0, atkMod: 0.9, defMod: 1.3, expMod: 1.2 },
                ]
            },

                        // 排行榜评分公式
                        SCORE_FLOOR_BASE: 100,
                        SCORE_KILL_BONUS: 10,
                        SCORE_GOLD_BONUS: 1,
                        CLASS_SCORE_MULT: { warrior: 1.0, mage: 1.1, rogue: 1.2, cleric: 1.0 },
                        LEADERBOARD_MAX: 100,
                        LEADERBOARD_KEY: 'rogue_leaderboard',

                        // 职业配置
            CLASSES: {
                warrior: {
                    name: '战士',
                    icon: '🗡️',
                    playerIcon: '🤺',
                    desc: '近战专精，高防高血，暴击率提升，Boss战有伤害加成',
                    color: '#f66',
                    hpBonus: 20,
                    atkBonus: 2,
                    defBonus: 3,
                    critBonus: 0.05,    // 额外 +5% 暴击率
                    bossDmgBonus: 0.2,  // Boss 战伤害 +20%
                },
                mage: {
                    name: '法师',
                    icon: '🔮',
                    playerIcon: '🧙',
                    desc: '法术穿透无视部分防御，药水效果翻倍，但体质较弱',
                    color: '#6af',
                    hpBonus: -20,
                    atkBonus: 5,
                    defBonus: -2,
                    penPercent: 0.3,     // 无视 30% 敌人防御
                    potionBonus: 1.0,   // 药水效果 +100%
                },
                rogue: {
                    name: '盗贼',
                    icon: '🗡️',
                    playerIcon: '🥷',
                    desc: '高闪避，宝箱掉落提升，商店有折扣，灵活机动',
                    color: '#ff0',
                    hpBonus: 0,
                    atkBonus: 3,
                    defBonus: 0,
                    dodgeChance: 0.1,   // 10% 闪避
                    chestBonus: 0.1,    // 宝箱装备率 60%→70%
                    shopDiscount: 0.2,  // 商店 8 折
                },
                priest: {
                    name: '牧师',
                    icon: '✨',
                    playerIcon: '🧝',
                    desc: '治疗强化，异常状态抗性，每层自动恢复生命',
                    color: '#fff',
                    hpBonus: 10,
                    atkBonus: -1,
                    defBonus: 1,
                    healBonus: 0.5,         // 治疗 +50%
                    dotResist: 0.5,         // 中毒/流血 50% 抵抗
                    floorHealPercent: 0.05, // 每层恢复 5% HP
                }
            },
            DEFAULT_CLASS: 'warrior',
            
            // 战斗特效类型
            ATTACK_TYPES: ['fireball', 'lightning', 'hurricane', 'sword', 'fist'],
            
            // 天赋系统配置 — 3级进阶
            TALENT_LEVEL_COST: [1, 2, 3],  // Lv1=1点, Lv2额外2点, Lv3额外3点
            TALENT_TREES: {
                combat: {
                    name: '战斗',
                    icon: '🗡️',
                    color: '#f66',
                    talents: [
                        { id: 'c1', name: '嗜血', desc: 'Lv1: 击杀恢复10%HP | Lv2: 恢复20% | Lv3: 恢复30%+额外5HP', icon: '🩸', maxLevel: 3 },
                        { id: 'c2', name: '重击', desc: 'Lv1: 攻击+3 | Lv2: 攻击+6 | Lv3: 攻击+10+5%双倍攻击', icon: '💪', maxLevel: 3 },
                        { id: 'c3', name: '铁壁', desc: 'Lv1: 防御+3 | Lv2: 防御+6 | Lv3: 防御+10+10%格挡', icon: '🛡️', maxLevel: 3 },
                        { id: 'c4', name: '精准', desc: 'Lv1: 暴击率+3% | Lv2: +6% | Lv3: +9%+暴击3.0x', icon: '🎯', maxLevel: 3 },
                        { id: 'c5', name: '狂暴', desc: 'Lv1: 暴击2.0x | Lv2: 暴击2.5x/率-2% | Lv3: 暴击3.0x/无惩罚', icon: '💥', maxLevel: 3 },
                        { id: 'c6', name: '反击', desc: 'Lv1: 15%反击50% | Lv2: 20%反击60% | Lv3: 25%反击80%穿透', icon: '↩️', maxLevel: 3 },
                    ]
                },
                explore: {
                    name: '探索',
                    icon: '🧭',
                    color: '#ff0',
                    talents: [
                        { id: 'e1', name: '寻宝', desc: 'Lv1: 宝箱金币+50% | Lv2: +100%/宝箱率+20% | Lv3: +150%/率+40%/10%双装', icon: '💰', maxLevel: 3 },
                        { id: 'e2', name: '幸运', desc: 'Lv1: 宝箱装率+5% | Lv2: +12%/稀有+10% | Lv3: +20%/稀有+25%/品+1', icon: '🍀', maxLevel: 3 },
                        { id: 'e3', name: '商人', desc: 'Lv1: 折扣+10% | Lv2: +18%/刷新+2 | Lv3: +25%/刷新+4/药水半价', icon: '🤝', maxLevel: 3 },
                        { id: 'e4', name: '贪婪', desc: 'Lv1: 杀金+30% | Lv2: +60%/精英+100% | Lv3: +100%/精英+200%/Boss+50%', icon: '💎', maxLevel: 3 },
                        { id: 'e5', name: '捷径', desc: 'Lv1: 出口-15% | Lv2: -30%/每3层方向标记 | Lv3: -50%/显路径', icon: '🚪', maxLevel: 3 },
                        { id: 'e6', name: '探知', desc: 'Lv1: 揭示3x3冷却3 | Lv2: 5x5/显怪距/冷却2 | Lv3: 全图情报/冷却2', icon: '👁️', maxLevel: 3, active: true, cooldown: 3 },
                    ]
                },
                survive: {
                    name: '生存',
                    icon: '❤️',
                    color: '#6f6',
                    talents: [
                        { id: 's1', name: '坚韧', desc: 'Lv1: HP+15 | Lv2: +30 | Lv3: +50/<20%回5%', icon: '💚', maxLevel: 3 },
                        { id: 's2', name: '再生', desc: 'Lv1: 每层+3% | Lv2: +6%/战后+10% | Lv3: +10%/战后+25%/免DOT', icon: '♻️', maxLevel: 3 },
                        { id: 's3', name: '抗毒', desc: 'Lv1: 毒伤减半 | Lv2: 减75%/持续-50% | Lv3: 完全免疫', icon: '🛡️', maxLevel: 3 },
                        { id: 's4', name: '铁胃', desc: 'Lv1: 药水+20% | Lv2: +40%/背包+1 | Lv3: +60%/包+2/盲盒必稀有', icon: '🧪', maxLevel: 3 },
                        { id: 's5', name: '顽强', desc: 'Lv1: <30%防翻倍 | Lv2: 攻+50% | Lv3: <20%/攻防+灼烧', icon: '🔥', maxLevel: 3 },
                        { id: 's6', name: '圣盾', desc: 'Lv1: 3回合无敌冷却8 | Lv2: 5回合+后回30% | Lv3: 7回合+满血/冷却5', icon: '✨', maxLevel: 3, active: true, cooldown: 8 },
                    ]
                }
            },
            TALENT_PER_LEVEL: 5,  // 每 N 级获得 1 个天赋点
                        SKILL_KEY: 'q',  // 主动技能快捷键
                        // === 成就系统 ===
                        ACHIEVEMENTS: [
                                                    { id:'firstKill', name:'初次击杀', desc:'击败第一只怪物', icon:'⚔️' },
                                                    { id:'kill10', name:'小试牛刀', desc:'累计击败10只怪物', icon:'💀' },
                                                    { id:'kill50', name:'屠戮者', desc:'累计击败50只怪物', icon:'☠️' },
                                                    { id:'kill100', name:'深渊猎手', desc:'累计击败100只怪物', icon:'👹' },
                                                    { id:'firstElite', name:'精英杀手', desc:'击败第一只精英怪', icon:'👑' },
                                                    { id:'firstBoss', name:'Boss终结者', desc:'击败第一个Boss', icon:'🐲' },
                                                    { id:'floor5', name:'初入迷宫', desc:'到达第5层', icon:'🏰' },
                                                    { id:'floor10', name:'深入深渊', desc:'到达第10层', icon:'⬇️' },
                                                    { id:'floor15', name:'中层探险', desc:'到达第15层', icon:'🕳️' },
                                                    { id:'floor20', name:'深渊旅者', desc:'到达第20层', icon:'🌀' },
                                                    { id:'collect10', name:'装备收集者', desc:'累计获得10件装备', icon:'🎒' },
                                                    { id:'collect30', name:'装备狂人', desc:'累计获得30件装备', icon:'👔' },
                                                    { id:'level5', name:'初露锋芒', desc:'升到5级', icon:'⭐' },
                                                    { id:'level10', name:'身经百战', desc:'升到10级', icon:'🌟' },
                                                    { id:'level15', name:'登峰造极', desc:'升到15级', icon:'💫' },
                                                    { id:'rich', name:'财大气粗', desc:'拥有200金币', icon:'💰' },
                                                    { id:'gold500', name:'金库充盈', desc:'累计获得500金币', icon:'💎' },
                                                    { id:'walk500', name:'步数达人', desc:'累计行走500步', icon:'👣' },
                                                    { id:'walk2000', name:'远行者', desc:'累计行走2000步', icon:'🏃' },
                                                    { id:'afk', name:'挂机大师', desc:'在游戏中发呆30分钟', icon:'😴' },
                                                    { id:'chest10', name:'寻宝者', desc:'打开10个宝箱', icon:'🎁' },
                                                    { id:'fullClear', name:'完美清扫', desc:'一层中击杀所有敌人', icon:'🧹' },
                                                    { id:'fullClear3', name:'清道夫', desc:'完成3次完美清扫', icon:'✨' },
                                                    { id:'perfectBoss', name:'无伤屠龙', desc:'Boss战中不掉血击败Boss', icon:'🛡️' },
                                                    { id:'skill20', name:'技能大师', desc:'使用主动技能20次', icon:'🔮' },
                                                                                { id:'die5', name:'屡败屡战', desc:'累计死亡5次', icon:'💀' },
                                                                                // 隐藏成就
                                                                                { id:'trashKing', name:'破烂王', desc:'穿着全套破烂装备击败Boss', icon:'👑', hidden:true },
                                                                                { id:'poisonLover', name:'毒雾行者', desc:'在毒雾中使用5次药水', icon:'☠️', hidden:true },
                                                                                { id:'oneLife', name:'一命通关', desc:'不死亡到达第10层', icon:'💫', hidden:true },
                                                                                { id:'pacifist', name:'和平主义者', desc:'一层中不击杀任何敌人到达出口', icon:'🕊️', hidden:true },
                                                                                { id:'hoarder', name:'囤积狂', desc:'同时拥有500金币', icon:'💎', hidden:true },
                                                                                { id:'speedrun', name:'速通达人', desc:'100步内到达第5层', icon:'⚡', hidden:true },
                                                                                { id:'legendaryHunter', name:'传奇猎人', desc:'集齐全部12件传奇装备', icon:'🏆', hidden:true },
                                                ],

            // ==================== 配置系统 (v3.36.0) ====================
            SETTINGS: {
                enemyInfoPanel: true,
                damageNumbers:  true,
                // enemyList:      false,  // 已屏蔽 (v3.43.1)
            },

            // 药水背包最大格数
            POTION_BELT_MAX: 4,

            // 特殊房间类型
            SPECIAL_ROOM_CHANCE: 0.15,  // 非Boss/非商店层 ~15% 概率出现特殊房间
            SPECIAL_ROOMS: [
                { id: 'treasure', icon: '💰', name: '宝藏室', color: '#fc6', desc: '满地的金币等你来捡！' },
                { id: 'arena',    icon: '⚔️', name: '竞技场', color: '#f44', desc: '连打3波怪物，赢取丰厚奖励！' },
                { id: 'altar',    icon: '⛓️', name: '祭坛',   color: '#c6f', desc: '献祭一件装备，换取永久属性加成' },
                { id: 'library',  icon: '📚', name: '图书馆', color: '#6cf', desc: '免费学习一个天赋！' },
                { id: 'gamble',   icon: '🎰', name: '赌博商人', color: '#fa0', desc: '消耗金币转动轮盘，赢取随机奖励！' },
                { id: 'rift',     icon: '🕳️', name: '时空裂缝', color: '#f0f', desc: '红色门跳层，蓝色门回退——选择你的命运！' },
                { id: 'training', icon: '🏋️', name: '训练场', color: '#6f6', desc: '与幻影安全对战，不消耗HP，纯经验奖励！' },
                { id: 'well',     icon: '🌟', name: '许愿井', color: '#ff0', desc: '投入金币，许愿获得装备！' },
            ],

            // 环境效果：某些楼层带全局debuff
            ENV_EFFECT_CHANCE: 0.2,   // 非特殊层 ~20% 概率
            ENV_EFFECTS: [
                { id: 'poisonMist',  icon: '☠️', name: '毒雾',   color: '#5f5', desc: '每步移动受到 5% 最大生命值的毒素伤害' },
                { id: 'darkness',    icon: '🌑', name: '黑暗',   color: '#222', desc: '视野缩小至 4 格范围，外围一片漆黑' },
                { id: 'magicChaos',  icon: '🌀', name: '魔力紊乱', color: '#f6f', desc: '主动技能冷却时间翻倍' },
            ],

            // 赌博商人
            GAMBLE_POOL: [
                { type:'nothing', weight:40, msg:'什么也没发生...' },
                { type:'gold', weight:25, amount:50, msg:'获得了50金币！' },
                { type:'potion', weight:15, msg:'获得了一瓶随机药水！' },
                { type:'equipment', weight:10, msg:'获得了一件装备！' },
                { type:'talent', weight:8, msg:'天赋点+1！' },
                { type:'skipBoss', weight:2, msg:'🌟 获得Boss直通令牌！' },
            ],
            GAMBLE_COST: 20,
            GAMBLE_MAX_PER_FLOOR: 3,

            // 许愿井
            WELL_TIERS: [
                { cost: 10, name:'铜币', equipChance: 0.20, qualityMin: 0, qualityMax: 2 },
                { cost: 50, name:'银币', equipChance: 1.0, qualityMin: 3, qualityMax: 5 },
                { cost: 200, name:'金币', equipChance: 1.0, legendary: true },
            ],

        };

        function loadSettings() {
            try {
                const saved = localStorage.getItem('rogue_settings');
                if (saved) {
                    const data = JSON.parse(saved);
                    CONFIG.SETTINGS.enemyInfoPanel = data.enemyInfoPanel !== undefined ? data.enemyInfoPanel : true;
                    CONFIG.SETTINGS.damageNumbers  = data.damageNumbers  !== undefined ? data.damageNumbers  : true;
                    // CONFIG.SETTINGS.enemyList      = data.enemyList      !== undefined ? data.enemyList      : true;  // 已屏蔽
                }
            } catch(e) { /* ignore */ }
        }

        function saveSettings() {
            try {
                localStorage.setItem('rogue_settings', JSON.stringify({
                enemyInfoPanel: CONFIG.SETTINGS.enemyInfoPanel,
                damageNumbers:  CONFIG.SETTINGS.damageNumbers,
                // enemyList:      CONFIG.SETTINGS.enemyList,  // 已屏蔽
                }));
            } catch(e) { /* ignore */ }
        }
        
const SPRITES = {
    wall: [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAD1BMVEXAy9y9bEpSYHyLm7QmK0SQ+jXFAAAAf0lEQVR4nH2NTQoCMQxGXzpZS3sB0e4FFx5hrj9Q8AKDF2gvkKlIVCg4BgLvIz9Pcjjhta1yi2+GHr4IaKQ3qkRIMkwCvTrVhoIk0mcyrA3BFqeloNsje8is+zcazs0pSfz3es8TXh7DCvk4ehSwu02XcgCZe0tWmK71h8eKN0+FbihKHwJbrgAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYAgMAAACdGdVrAAAADFBMVEXAy9xSYHyLm7QmK0R+3zEEAAAAhUlEQVR4nGMMZQABllCGD2lcCUxgDgMTA2vq/w8MUB7D/v//////x/j/rwqH+AHGf3uedbUKQOVYGB7Gy6vdYmH4v4HhmRRUkPH/nytfdAQY9r/+///VP7iZAgwMrDAzWd78VeVg380YvnwNg+g0mEVMIJsYmFY8YGD4vQpuw+/V/w86AAA1rC/aT4n+NwAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAFVBMVEXAy9x2Oza9bEpSYHyLm7Q/JjEmK0TMgR2IAAAAmUlEQVR4nH1PSw6CMBScfvZ9hbhvPAFNL6CJx2aBNyDxAOIFbBu2QE0BjaJxNu+9mUnmDXOiwoKxlaVZdwjL8QZpMHXwjIA9/1QwXQtopOA7I4FZZMWsAMOZ+iPdV/oJjqFhymsV6gZyvOQPUiSHdmObwVTIh7AEuBRJl9Uf2zYH0CnSK6feEX7n6MPSR9gb2CkT3Hzbcqk8H1iNKhJnhEFeAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAFVBMVEXAy9xSYHy9bEqLm7R2OzY/JjEmK0Rt3U9hAAAAkElEQVR4nI2OQQ6CMBBFX6ewMjF4AaON7puQeAIPYDwp7j2DaTwAIR4ADkAKpNAYkI1/9Trtn1e1S29MaQt1sZHByxeBxOIdpRwg18sb/OuEAZ7aSjiPuU7U1xVyzGDREbzrPsbsKxzSPrI43xQ/z+ae9P6OeA6e+Q9CGrVddYInoiMZPaavV5644C9PV4IGBuX7I1FwHK6NAAAAAElFTkSuQmCC",
    ],
    floor: [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAeElEQVR4nGM83xTynwEKCpbchTEZfEqbGUgBW7pr4ewJMcpwNhMuDcePniDa8ON41OK0gFqABZfE22NbGbYc20qxBTT3ARMyBxQ5yBFEDkDXz/hqaQ48FdECMNHScBAYtYAgGA0igmA0iAiC0SAiCEaDiCCgeRABANJ3GDvWZjo+AAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAASElEQVR4nGM83xTyn4GGgImWhoPAqAUDH0Qs0soSGIJP774gSrM0Fr0YFpCrkVgwmooIgtEgIghGg4ggGA0igmA0iAgCmgcRAJBaBoRvIE7ZAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAeklEQVR4nGM83xTyn4GGgImWhoPAqAUDH0Qs0soSGIJP774gSrM0Fr0YFpCrERmIqBjA2W/uXKBzEDEgBQkulz9FCjJSfceCTRPIQFIMeoMWLPQPInSA7nppND4sUvG5HK8FhMAbIgyGgdGyiCAYDSKCYDSICAKaBxEAU8YbvgcbmM4AAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAYUlEQVR4nGM83xTyn4GGgImWhoPAqAUDH0Qs0soSWCWe3n1BHQsYcAB0i5+SaSHtg4iBSCCN5CNSfEOWD6SVJTCCkKoWkAIGtwXSRATV4PYBMWDUAjDAF9GjQUQQDP0gAgA9HQ2IgeeYngAAAABJRU5ErkJggg==",
    ],
    chest: [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAARklEQVR4nO3NQREAIBDDwKN6sYU5TMBgoK/MfegKSMZe81Qjdc6eDHHik16GOPFJL0Oc+KSXIU580ssQJz7pZYgTn6zPhxcrCgMyhzMs1gAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcAQMAAABIw03XAAAABlBMVEXPglTqpWz5kV4AAAAAHElEQVR4nGNk/MfwkYmBgYEBnWCDs35gkaUFAQCA1gMm63/kcQAAAABJRU5ErkJggg==",
    ],
    potion: [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAD1BMVEUAAABp/9QllWpD4bM/JjEYfDU1AAAAAXRSTlMAQObYZgAAAHZJREFUeJyNkNEJhEAMRF8kBexZgVjJfli2HzYg2MFdB24B6sqwCJ76YSCQMJPJJPAqDPAILANUZ0SNALw0zjqOE11Bcir5PyMqVXsIeMSwIJ2b9E/FJgce+QZJ1ixXWoZPgPnB23mpNUmUcEFMt+UkC/27d8AOPUkW8Ck9yEkAAAAASUVORK5CYII=",
    ],
    exit: [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcBAMAAACAI8KnAAAAD1BMVEUAAABaaYjAy9yLm7QmK0TP0ezVAAAAAXRSTlMAQObYZgAAAG9JREFUeJyVj90JgDAMhL+WLNANxBVcoA8dvCM4gTiCA9QfUhGplkLzEDjuS46D1hhd4oEUAVu69jHJ20CAY4VR+R8cXiHfV5IPjYMFO9SCKGAlAaehbbh6u88wVdy7wrnpZ1LU+uKz1P5dQV2yPRdecRQpmUZ6/QAAAABJRU5ErkJggg==",
    ],
    player: [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABGCAYAAADW81R/AAABiElEQVR4nO1WvWrDMBDWCb9E36BDCB3cqWuhQ5cOJU+QLUPo0ofoUjp0yxOUDl06FLp6ioZgNOQN8hgpDhiErPtRsSNk/IEX6bjPd/ed7pSawACoy4/X9ZFzsHh6I30A5fzmes75V9W2Jkm0Ghg6OcHvz/fp88+kKDiD27t70VmyFAEmR4mCXCW5cFUFUjnGoCVsiNKrKD+Calt3isaBsh9hivqGVqk7uUIK6DYn1cmFf4BNsQVjw022CSMGUJeb5wd2L1q+fP1vL2qcz+ZXnH9l6x1Jkv9ToSUpsPWuc9bbXjQL1EFSm/O+ppuAHGP+0nopc1UFUjnGoCVsiNKrKD8CG9A9B8p+hCk6e6NZJL9u71CNNngEhc+ITbElY8NNtgnpANTl6rFk15b3TwPpGw37+/LyQnEw+wMZRf5vkZakwOwPnbPe9qIyUAdJbVoAJscYJ8aLyC368DJdCeUYgzaiJpL0KsqPwAR0z4GyH2GK+gZwnWyQ/Lq9k7STT4+dy4iNSc4GGzp/pRe1zLD1tbAAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABCCAYAAABNYhZpAAABhklEQVR4nGNgGAUEACM+yVX9+f/xyYcVTmQkywKYwdameng1Hz19iaAlTAw0BkwDbsGenVvx8im2wMXdGy+fEGDEllrQI3ffhFY426mgGiOikQF6pNM8DhhBrieUHEkB6El34FPR0LPgKFqqIAQIqR/6QcRIKKMdxRIE+OTpntFY0G3FVsmEkSA/CgYfYMQnOacsAG+rIqVrA3mtCpjBOnoGeDVfuXSBoCVDv6hgIqTgyqULePkUW6CDFg+E4oVkCygFjNiSI7orb29YBGerBsThDTL0VMUIMpxUb5OSdAc+FQ09C66QmM6vEFA/DIOI7hntCpYwxiePntFY0AWxVTIpJMjTPYhGwcADRnyS2SEmeJstU9ecIa/ZAjPYREMSr+YzN54TtGTgi4ozN57j5VNsAaWAoAUmaPFAKF7QASO21IJuCMuNq3D2Hw1tvEGGHumMIMNJdRUpKWvg42DoWXCGxHR+hoD6YRhE1AaMhDLaGSxhjE8ePaPRZzAE2VZslQwp8ugAAPabsDI7Hj/QAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABGCAYAAADW81R/AAAArUlEQVR4nO3WIQ7DMAwFUGcaD94BhofLcoiA3SFsBxnLHQZyiLDh4R1gOCfIZDDJlaK2rlS1nf5DMbBjG5kIAADgHxgZOOeqtVZVoJRCOedeHelACzuOddeimXLwAybH5xVOrgwAAACbYmRwu3b1cj6pCrzeH7o/nmbWVcHJLZom1j28mByfV/h7AwAAwL4YGcQYq/deVSClRCGEeXcRJ7domlj/LpLj8wq1H3wB2bMqImTsVA4AAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABGCAYAAADW81R/AAAAcUlEQVR4nO3KoQ2AMBCF4esE1QyARuM6BnMwCK47MEYdGs0ApLITlNQ0lwrQwP8ll8vLeyIAAOAXjA7OuWytrTmlJCEEo/vy7zYAAAAvZXSYpzEPfVfzfpyyrJvRffl3GwAAgC/w3ucYY72S2/5p07oA5vVAFZkoIZ0AAAAASUVORK5CYII=",
    ],
    monster: {
        ghost: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACaUlEQVR4nO2WPWhUQRDH//s+7pIYE0UrCwmaQlEEQdSAARvRwsI2BKtouoAIpjLEE0Et0vhZGLHQIBaCRbQTLRTBwkIDFxIRYhCJicmdd7n3dndmVu6iEQTxnjmDSGarZXfmt7M7/2HVwROHsZzmLSsNK8C/YN5/DwySOtw8de/F+nXhXh2xmfpEbT3XO14l8VdJdHg3c9+tqvtxKcY6zM4xinnaenKwY7SaGIkyrAsBEQelFuaRdvB8BaM5Wz58TYEDx253OXEoD+UtxBYBdMywJFUfOqh2Y3OjGixFBN9XUEqBGQA7zE5rFPNm6cDeA7e27GxryBpNiGILJoeoSAj8heyIAWsIpSLBaMHx3ZeP3HjZ8+CPZbGrfXWWicCW4EigjUUmcwXGCIaHH2Pk9TjYOFgjiDVBa3u1mgx/WaXXuoccfAIxw5QMFHyICLJjo9ixbTtyuRzq65sw85kwl7fYs68ZqTCAJqB7oFMlznBifL594k0Rn8bnUcwzrCbYmKAkwMjIGOpSDTAxQwkhCAQ+AN8HmhpDXDh6xyV+w4tPup99L/XThy45A0EQetjc0lJZtzGDBWAWpMJyEQnEKTAUCjO0tCplQ7CiwOShrAhxgLCAyIEsUPhCmJsySKeBMO1gSHJLAuYKERrTAfzAXwQSKwgzSAP5ksXT5x/xaPLMb8VfFTCK6K2z0ppOeRUdMjt8kyFiLSBbY+GvWZtuDT2HQs4sdpgKlB0iC5BUmkFfNbESNe/e/ee7mN1Zz1MbynosdxtDwIdp6ns42X+u5sCfrXNT/8ahd5n3SXzUyjex1ubVPOK/BvwKccs/qZKTkZkAAAAASUVORK5CYII=",
        skeleton: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACdUlEQVR4nO2Vu2vTURTHP/f+HkmaptJSsQ4taIWCBWsJEXWodFEQ3QQHHTpHWl38F1ycKpYiaHWoILo6isXJLrGDDkWsQmqfhqRpXr/3lQTtFCTpIzj0wL1czr18P5x77jlXXLl3jVaabCmNQ+D/kMOZ0ZEbyfah7t0C9WYOP04knivHHosPhXjKORQCxwu+fV30bk7mFz41otFUhBFTjoGqrUVtKEK6PNV9TEs1qiEbPTg5ODzFDurvShAAqxvO/l+p5gdJK2chJUhdoIV1hCb5smjheWr/gUE1sgBUoHA9wKpOYNsgZONPQa/nHD8Sb0skYiWnUsYtlfAcBxUY3J5+x2xyFMvymHiT4smtBEgDTci9AYVmdGfTRaxiHt8p13w/MhazycvVEDENyVZuG6V0pBCYOm8bBcp6zkfZ+bTjBjgBuK6gtG2RLxbfI3WUqObO4NX4VdwAQqYkn8uWJwdOqumzg2pm5MKfx1XfRDO/xYPTF9Xamo0sbFHxfQLl46MhdG3+RMw+b0QitB/toKOni9R8Jl6vNpsq/O2faYRxnFAkSqAUobYwhUKFXGb1uh9t+1W9kkLWIV8o4oXa0/U0mgL2DfQSjRksfJbg2HTILSrS5HU0myGfFXf1/r5uPRiXpjc3tfkxs2dgZmmFrJT0mAYibBBE2imsb+3sT3pLada5/y+NpoCekmyu21hhk5hfRmo2phmCxhsNTfXS/uE+4pf66e3tgmgM13XQApc7nfGHjWrozQD9cgUNWF7OMzrSA3TW/HMf1jgQ4PLiyoTj+OUX3sazM99VrYGmlmxeaul/5m3XdbgfJltK4xB4ANbyHP4GNBb1VgM7p/cAAAAASUVORK5CYII=",
        zombie: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACYElEQVR4nO2WS2gTQRjH/7vZZpNNrJiYFPNQoWAVSqVG2oM9FnMpBFRE9FQ8eLBVDx7Fu3jz6EG8FC/Vm9CDF0HwognUQxWh9ZnGNI/dbLKvmdmRpOhFWjdt2oP2f5j5GIb/75sH34yQvTWF3ZS4qzTsAXdA4j8PlLqZbOUpF31/5kgpX1QyvpNePLpaoejzgbvr8a9+PeYjnj3gUdpr5zK1LHBKQBwXhkEBCB2waTLvScOjpOzRXLu3TApi2hAYgWPY0HUCo+X0/gxV2X/Rzg7BZS5EwhH+UAI+N9CSZURzY0B9afvAUmx4wnVo5W7mxqzkN3G2cRNzahoP1mRMTSYwX0sB+TJsbiHaHFXscMHYMjCUO8P3qybqdRcHIn2o1xp4tBxHSZEQHVBwjb7F88Aw6FASP2o2oh5gmwKtT83FZqU5knRiWKVlNPQ6FhJpTIiHMYMIpi0RkX6OjDGJaCyIU+OD/GF+4bG2/HQam0j42/MkN0eVc6fPt1S1jGrVgtwXBJMYKrESBqwUmt9qOHb8CLR9IubYPJR+GfwjiSnFd5UtXZr2uTx5XxDa8VjgAlc1X2c8pCmwJP33vJXVFQg+G+GwDCPlv48iprddaS75X0CLx/GmlcRXOwRGgUO2DuIkcZCnwBiHU7FRLbJ7iQ08ugLWyjooU5E2l3DCL4K4wBcdeBZ42dmBWLv5DmwE6xoYkAOglIEQAUGZIsBdhJx27SCePaRugLcLGsKSCL/FcGc8Atd1UXPYzgHVav1KQxCvNlrs+swrs1Na1qpEHUxFPXsIe7+2XkvsuSP+d+BPr9wDNltcIgMAAAAASUVORK5CYII=",
        vampire: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACe0lEQVR4nO2VT2gTURDGv327ySZN0iQNSasQqzUeBKUVD62KVaylgiIV1Es9eao9FbSC14IHIx5EQW/x4ikoHqwgVRBFWivFaoKBtkgDbUjTpc1/s5vdt5JselAQs22ag/SDYfct781vZ4aZx/QNn0M9RepKwzZwC0T+eyCnZ3NuWhZZAiOl2lpVNRML6lPXccOVanzoirAEKx8iAMsCHKeZXJQHqvVBqt2Y/Vx8u/7OqJqVJIolk2ufUhbqKQKmQtQesgwU8sWqYVUD/b4Dg1nbKq6Pzf72PZXTwry414Mj86x635et/MomgHII6tDUl0l/Tysedu/Bh9UM7DyLHVYeQsaE13NLuHC2A9L7yOZqGDjdo3Zn7CqlFJyB6crAgKVQBifbfdiXZGBXDGDNRihKEaKQKOX5cDXAv0aYWkzhVSgOSlXIsozpWBIThTRigXcY7O1E5y4bjAIQSSu49iwMp4ufVuIE5kPrFdYZ4cfxb26FEiiK1nTPpxYgqRT3+rs0mNmEOy8nYWQVNNoJCCG43O4q13tDEQa9kmD38gzAl9fL4yt3hXT2xtc3c3AyRjzIraAoAwYOkHKA9BM4f8wHzmJ9hPnwY90R/qnmXvfIravDaHM4YeQYUFrqPQmEM4FWenItJiIezddutEULFhSP9oMQFgPEgkSSojUeQtPSBG7Hkpab0Zl8TUdbo70FDlszOHjA8wxsFgZr+888CRyUmJ19Df+E6QaeKIyhg1uGM+yH1eSBtaEFuyOjelxAV0oXv3+SxOyM0OZUhhwLoy9mEwrSOTKCpi0C+m0sD5s2qC/9UN1BryzAWacLOOiVhI2cI6izyDYQNdYvGt7g96+4VkIAAAAASUVORK5CYII=",
    },
    boss: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAEPElEQVR4nM2XW2gcVRjH/+fMbTez2Ww2tyZqQ2ijSYwQW2hT0WAj4oMFtfoiBDFEROKDfahEX7yAD9L6IKIVJGjxRRB8EH0IhbYkkWJLa4pWSZNo2pibyWZ3szu7O7dzjsxsRKyCaTaX+cHHnLlwzo9v5nznDHns2BEEGYqAQxFwKAIORcChCDgUAYci4FAEHIqAI5faQWLEvjdcRq95bccWSe+oQCwKmWRAkI8aopcfVmd2TDBSXpTzkMIkXmyROOfFVlLDWAyo2vZX7GXOHHPFrdcJKYYkFc9zhhOfGcpVb7tgKEw++E85UQwuZDgOwBjb6BClCUoQ3YQzv4O/whPzEAKwcxbMvOOfDzTEPtt2wZDgsAoMzOUQnPnB1oIzDtPmcNe+ANeVjhy7ETm7bZPkxN72l4zyJK4vruKTK3/86z4XgGUV5Z7ZUwsYAsJF95YL5i6LjzSN9PdfGvv+xCONaAlH8GFXGUaTWVRoEiKajHJFQkiV8cXVFeRNF0893oHx8QXEl9LYMsHTh7ve9Y49P430c86hqKQzCwVywQVLF/BAe43/nJQyAS976t/dmhkDrGBvSG5dgp6c42AglU7BMW0Qmfrfm6KFUNtegeW5VTS27EIuxTAxUiyJu7p3o6nWgpPNYHliEcb4Kt48aJMtEcyusDorm8VCIgPmsH9kg0oKbA2YnEwjqqko318HJ2f7NbB59124+Ms0zl5dSic5H0xf4Ee1kNQW3kff2VTBG79lX66p5M+7Lgfnwp8AQnAMfHkR3a0NeLJjD85PzeDK1AqePtCEjtYGuA7DW59f8GtgTa0aI1Q6HpEV5HIu8qOspeohpWe9guR2/upSI6YQ3IbgnqwLQiQQQtCn1yImAx8vL6O6TsdsxkQmYyKiy5BlGYRSyGEVn/Z1QgtLoGF9qu/cueZNr4OVXSESfzhKqrpjhAvxnhDMF7WEBXut5o0vGH6Gb8UpMF9ODYdAKdm75ZuFukdrXn224+3jenIS2plvIRwTB20VZwpZMJdC1spAZQouXFBv50AlpOYtyIqL6XR4e3YzqaUVuOWNiL/4OqiRwoHELHbP3sTg0Fd44ugbcI0EMqOncN11YUD42fYWyTsblFYktkFQU9UX0qnE4PLyHCiVIFEdqG7Dcz33Y3pxBW3pacRjMRwCwcn5lP7a79fytztGSYKURxPRCh3MNrGYlhDVDGga8dfjqsp6pOrvPv11fLjXe7bhvrKNjVGKYKd0uSUkRxBWo6iM6ADXoSoRqLIOWSlDvTGBUikpg87NoQcPRc+DMY4fZyzsb6mFwfdhTm1D5OdTMFfn87hjBwVXs2aCcAGHMSQyDpz8KsqsYdwjfYdhIwvLdn7w/lB2TPCkTnsBpxfe9r5RQvOv9vuKbr3icIA7oZpvmpR1ztVNWkl2AoqAQxFwKAIORcChCDgUAYfutMD/8SfSKc8fiOGfCQAAAABJRU5ErkJggg==",
        // 特殊房间类型
        SPECIAL_ROOM_CHANCE: 0.15,  // 非Boss/非商店层 ~15% 概率出现特殊房间
            SPECIAL_ROOMS: [
                            { id: 'treasure', icon: '💰', name: '宝藏室', color: '#fc6', desc: '满地的金币等你来捡！' },
                            { id: 'arena',    icon: '⚔️', name: '竞技场', color: '#f44', desc: '连打3波怪物，赢取丰厚奖励！' },
                            { id: 'altar',    icon: '⛓️', name: '祭坛',   color: '#c6f', desc: '献祭一件装备，换取永久属性加成' },
                            { id: 'library',  icon: '📚', name: '图书馆', color: '#6cf', desc: '免费学习一个天赋！' },
                            { id: 'gamble',   icon: '🎰', name: '赌博商人', color: '#fa0', desc: '消耗金币转动轮盘，赢取随机奖励！' },
                            { id: 'rift',     icon: '🕳️', name: '时空裂缝', color: '#f0f', desc: '红色门跳层，蓝色门回退——选择你的命运！' },
                            { id: 'training', icon: '🏋️', name: '训练场', color: '#6f6', desc: '与幻影安全对战，不消耗HP，纯经验奖励！' },
                            { id: 'well',     icon: '🌟', name: '许愿井', color: '#ff0', desc: '投入金币，许愿获得装备！' },
                        ],
            // 环境效果：某些楼层带全局debuff
            ENV_EFFECT_CHANCE: 0.2,   // 非特殊层 ~20% 概率
            ENV_EFFECTS: [
                            { id: 'poisonMist',  icon: '☠️', name: '毒雾',   color: '#5f5', desc: '每步移动受到 5% 最大生命值的毒素伤害' },
                            { id: 'darkness',    icon: '🌑', name: '黑暗',   color: '#222', desc: '视野缩小至 4 格范围，外围一片漆黑' },
                            { id: 'magicChaos',  icon: '🌀', name: '魔力紊乱', color: '#f6f', desc: '主动技能冷却时间翻倍' },
                        ],
                        // 药水系统（v3.26.0）
                                    POTION_TYPES: [
                                        { id:'health',  name:'生命药水',     icon:'❤️', mapIcon:'🧪', color:'#f44', desc:'恢复30%最大HP', rarity:'common' },
                                        { id:'mana',    name:'法力药水',     icon:'💙', mapIcon:'💙', color:'#44f', desc:'主动技能冷却-2', rarity:'common' },
                                        { id:'shield',  name:'护盾药水',     icon:'🛡️', mapIcon:'🛡️', color:'#ff0', desc:'获得20护盾（可叠加）', rarity:'common' },
                                        { id:'speed',   name:'速度药水',     icon:'⚡', mapIcon:'⚡', color:'#0ff', desc:'本层无视碰撞3回合', rarity:'uncommon' },
                                        { id:'power',   name:'力量药水',     icon:'💪', mapIcon:'💪', color:'#f80', desc:'本层攻击力+30%', rarity:'uncommon' },
                                        { id:'aoePoison',name:'毒药',        icon:'☠️', mapIcon:'☠️', color:'#c0f', desc:'全图敌人追加中毒', rarity:'uncommon' },
                                        { id:'greedLure',name:'贪婪诱饵',    icon:'🎣', mapIcon:'🎣', color:'#fc6', desc:'本层掉落+200% 怪物攻击+30%', rarity:'rare' },
                                        { id:'chronos',  name:'时空凝滞药水', icon:'🕰️', mapIcon:'🕰️', color:'#faf', desc:'下次致命伤害保留1HP', rarity:'rare' },
                                        { id:'berserker',name:'狂战士之血',   icon:'🩸', mapIcon:'🩸', color:'#f33', desc:'攻击+50%暴击+20% 攻击扣5%HP', rarity:'rare' },
                                        { id:'thorns',   name:'荆棘反伤药剂', icon:'🛡️', mapIcon:'🛡️', color:'#6f6', desc:'5回合反弹50%伤害+等额护盾', rarity:'epic' },
                                        { id:'gamble',   name:'炼金师的盲盒', icon:'📦', mapIcon:'📦', color:'#fa0', desc:'随机生成一瓶未知效果药水', rarity:'epic' },
                                    ],
                                    POTION_BELT_MAX: 4,
                                                // 赌博商人奖池 (v3.28.0)
                                                GAMBLE_POOL: [
                                                    { type:'nothing', weight:40, msg:'什么也没发生...' },
                                                    { type:'gold', weight:25, amount:50, msg:'获得了50金币！' },
                                                    { type:'potion', weight:15, msg:'获得了一瓶随机药水！' },
                                                    { type:'equipment', weight:10, msg:'获得了一件装备！' },
                                                    { type:'talent', weight:8, msg:'天赋点+1！' },
                                                    { type:'skipBoss', weight:2, msg:'🌟 获得Boss直通令牌！' },
                                                ],
                                                GAMBLE_COST: 20,
                                                GAMBLE_MAX_PER_FLOOR: 3,
                                                // 许愿井配置 (v3.28.0)
                                                WELL_TIERS: [
                                                    { cost: 10, name:'铜币', equipChance: 0.20, qualityMin: 0, qualityMax: 2 },
                                                    { cost: 50, name:'银币', equipChance: 1.0, qualityMin: 3, qualityMax: 5 },
                                                    { cost: 200, name:'金币', equipChance: 1.0, legendary: true },
                                                ],
                                            };
let spriteMode = false;
        
        // ==================== 游戏状态 ====================
        let gameState = {
            player: null,
            map: [],
            enemies: [],
            potions: [],
                                    potionBelt: [null, null, null, null],
                                    chests: [],
                        exit: { x: 0, y: 0 },
            floor: 0,
            gold: 0,
            isGameOver: false,
            autoAttack: true,
            savedFloor: 0,
            isBossFloor: false,
            bossDefeated: false,    // Boss 层是否已击败 Boss（击败后传送门出现）
            isShopFloor: false,
            shopNPCs: [],
            shopOpen: false,
            currentNPC: null,
            playerName: '无名勇者',
            playerAvatar: null,  // base64 data URL or null
            playerClass: CONFIG.DEFAULT_CLASS,  // 当前职业
            talentPoints: 0,         // 可用天赋点
            unlockedTalents: {},      // { talentId: level }
            stats: { kills:0, deaths:0, steps:0, farthestFloor:0, startTime:0 }, // 全局统计
            skillCooldown: 0,         // 主动技能剩余冷却层数
            skillActive: false,       // 主动技能是否激活中
            skillTurns: 0,            // 主动技能剩余回合
                        theme: 'abyss',  // 当前地图主题
                                    levelUpChoices: [], // 升级时随机出的 3 个选项
                                    specialRoom: null,  // 特殊房间 {type, state, ...}
            envEffect: null,  // 环境效果 {id, icon, name, color}
                        runKills: 0,   // 本局击杀数（用于排行榜计分）
                                    floorStartKills: 0,  // 本层起始击杀数（隐藏成就用）
                                    rareMonster: null,  // 稀有怪 {x, y, turnsLeft, emoji, name}
                                                                        gambleCount: 0,   // 赌博商人本层已用次数 (v3.28.0)
                                                                        wellUsed: false,  // 许愿井本层是否已使用 (v3.28.0)
                                                                        isTrainingMode: false,  // 训练场模式 (v3.28.0)
                                                                        achievements: {},
                                    achievementStats: { kills:0, equipCollected:0, eliteKills:0, bossKills:0, steps:0, chestsOpened:0, fullClearCount:0, goldTotal:0, skillUses:0, deathCount:0, poisonPotionUses:0 },
                                };
        
        
        /* ╔══════════════════════════════════════════╗
        ║  MODULE 2: 音频引擎 (SFX + BGM)        ║
        ╚══════════════════════════════════════════╝ */
        
// ==================== 音效引擎 (Web Audio API) ====================
        const sfx = {
            ctx: null,
            muted: false,
            
            init() {
                if (this.ctx) return;
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            },
            
            // 基础音色生成器
            tone(freq, type, duration, vol = 0.3, delay = 0) {
                if (this.muted || !this.ctx) return;
                const ctx = this.ctx;
                const t = ctx.currentTime + delay;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(vol, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + duration);
            },
            
            // 噪声生成器
            noise(duration, vol = 0.1, delay = 0) {
                if (this.muted || !this.ctx) return;
                const ctx = this.ctx;
                const t = ctx.currentTime + delay;
                const bufferSize = ctx.sampleRate * duration;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
                const src = ctx.createBufferSource();
                const gain = ctx.createGain();
                src.buffer = buffer;
                gain.gain.setValueAtTime(vol, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
                src.connect(gain);
                gain.connect(ctx.destination);
                src.start(t);
            },
            
            // 频率滑动
            sweep(freqStart, freqEnd, type, duration, vol = 0.3, delay = 0) {
                if (this.muted || !this.ctx) return;
                const ctx = this.ctx;
                const t = ctx.currentTime + delay;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freqStart, t);
                osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration);
                gain.gain.setValueAtTime(vol, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + duration);
            },
