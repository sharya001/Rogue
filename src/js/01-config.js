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
        "img/wall-0.png",
        "img/wall-1.png",
        "img/wall-2.png",
        "img/wall-3.png",
    ],
    floor: [
        "img/floor-0.png",
        "img/floor-1.png",
        "img/floor-2.png",
        "img/floor-3.png",
    ],
    chest: [
        "img/chest.png",
    ],
    potion: [
        "img/potion.png",
    ],
    exit: [
        "img/exit-portal.png",
    ],
    player: [
        "img/player-warrior.png",
        "img/player-mage.png",
        "img/player-rogue.png",
        "img/player-priest.png",
    ],
    monster: {
        skeleton: "img/enemy-skeleton.png",
        ghost: "img/enemy-ghost.png",
        zombie: "img/enemy-zombie.png",
        vampire: "img/enemy-vampire.png",
        demon: "img/enemy-demon.png",
        slime: "img/enemy-slime.png",
        bat: "img/enemy-bat.png",
        goblin: "img/enemy-goblin.png",
        ogre: "img/enemy-ogre.png",
        wizard: "img/enemy-wizard.png",
        spirit: "img/enemy-spirit.png",
        slime2: "img/enemy-slime2.png",
    },
    boss: "img/boss.png",
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
        
const SVG_ICONS = {
    // ── 玩家职业 ──
    '🤺': '<polygon points="9,7 15,7 12,1" fill="currentColor"/><polygon points="9,7 15,7 12,1.5" fill="#fff" opacity=".3"/><circle cx="12" cy="9.5" r="3.5" fill="currentColor"/><polygon points="7,19 17,19 15,23 9,23" fill="currentColor"/><polygon points="17,8 22,2.5 21.4,4 17.4,9.5" fill="currentColor"/><polygon points="9,19.5 12,21.5 15,19.5" fill="#fff" opacity=".2"/>',
    '🧙': '<polygon points="6,7 18,7 12,1" fill="currentColor"/><polygon points="8,7 16,7 12,2" fill="#fff" opacity=".25"/><rect x="5.5" y="7" width="13" height="2.2" rx="1.1" fill="currentColor"/><circle cx="12" cy="11" r="3" fill="currentColor"/><polygon points="6.5,15 17.5,15 19,22 5,22" fill="currentColor"/><rect x="18.2" y="3" width="1.6" height="10" fill="currentColor"/><circle cx="19" cy="3" r="1.7" fill="#fff"/>',
    '🥷': '<polygon points="6,9 18,9 17,5 12,4 7,5" fill="currentColor"/><rect x="8.5" y="8" width="7" height="1.6" fill="#000" opacity=".65"/><polygon points="8,11 16,11 14.5,18 9.5,18" fill="currentColor"/><polygon points="16,14 21,18.5 20.4,20 16,16" fill="currentColor"/><polygon points="8,10 4.5,12.5 8,13" fill="#fff" opacity=".55"/>',
    '🧝': '<circle cx="12" cy="4.5" r="3.3" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="10.5" r="3" fill="currentColor"/><polygon points="6,13 18,13 20.5,22 3.5,22" fill="currentColor"/><rect x="11.3" y="13.5" width="1.4" height="4" fill="#fff" opacity=".92"/><rect x="10.1" y="15" width="3.8" height="1.4" fill="#fff" opacity=".92"/>',
    // ── 敌人 ──
    '🐲': '<polygon points="6,6 8,1.5 10.5,5" fill="currentColor"/><polygon points="14,4 16.5,0.5 18.5,5" fill="currentColor"/><polygon points="4,12 4,5 12,2 20,5 20,13 16,19 12,22 9,22 7,19" fill="currentColor"/><polygon points="7,4 12,2.5 10,6" fill="#fff" opacity=".25"/><circle cx="13" cy="9" r="2" fill="#ff0"/><circle cx="13" cy="9" r="0.7" fill="#000"/><polygon points="20,12 23.5,10.7 23.5,13.2" fill="#f80"/>',
    '👑': '<polygon points="3,17 3,7 8,11 12,4 16,11 21,7 21,17" fill="currentColor"/><rect x="2.5" y="17.5" width="19" height="3.5" rx="1" fill="currentColor"/><polygon points="3,17 3,7 5,8.6 5,17" fill="#fff" opacity=".25"/><circle cx="12" cy="15.5" r="1.5" fill="#fff"/><circle cx="8" cy="16" r="1" fill="#fff" opacity=".8"/><circle cx="16" cy="16" r="1" fill="#fff" opacity=".8"/>',
    '💎': '<polygon points="12,2 19,8 12,9 5,8" fill="currentColor"/><polygon points="5,8 12,22 19,8" fill="currentColor"/><polygon points="5,8 9,8 12,9" fill="#fff" opacity=".35"/><polygon points="12,9 15,8 19,8" fill="#000" opacity=".15"/><polygon points="15,8 19,8 12,22" fill="#fff" opacity=".12"/>',
    '👹': '<polygon points="6,9 4,1 8.5,4" fill="currentColor"/><polygon points="18,9 20,1 15.5,4" fill="currentColor"/><circle cx="12" cy="13" r="8" fill="currentColor"/><circle cx="9" cy="11" r="2.2" fill="#fff"/><circle cx="15" cy="11" r="2.2" fill="#fff"/><circle cx="9.6" cy="11.4" r="1" fill="#000"/><circle cx="15.6" cy="11.4" r="1" fill="#000"/><polygon points="8,17 16,17 15,19 9,19" fill="#fff"/><polygon points="10.5,18 11.8,20.2 13,18.2" fill="#fff"/>',
    // ── 物件 ──
    '🧪': '<path d="M10 3 L14 3 L14 9 L18 16 Q19 22 12 22 Q5 22 6 16 L10 9 Z" fill="currentColor"/><rect x="10.4" y="1.5" width="3.2" height="2" rx="0.6" fill="currentColor"/><rect x="10.8" y="5" width="1" height="8" rx="0.5" fill="#fff" opacity=".3"/><path d="M7 15 Q9.5 13.5 12 15 Q14.5 16.5 17 15 L17 17 Q14.5 18.5 12 17 Q9.5 18.5 7 17 Z" fill="#fff" opacity=".35"/>',
    '📦': '<path d="M3 7 Q3 3.5 12 3.5 Q21 3.5 21 7 L21 10 L3 10 Z" fill="currentColor"/><path d="M3 10 L21 10 L21 19 Q21 21.5 18.5 21.5 L5.5 21.5 Q3 21.5 3 19 Z" fill="currentColor"/><path d="M4 6.5 Q12 4 20 6.5" stroke="#fff" stroke-width="1.1" fill="none" opacity=".4"/><rect x="10.8" y="10" width="2.4" height="3" fill="#fff"/><circle cx="12" cy="10.3" r="0.9" fill="#000"/><rect x="7" y="10" width="1" height="11.5" fill="#000" opacity=".15"/><rect x="16" y="10" width="1" height="11.5" fill="#000" opacity=".15"/>',
    '🔑': '<circle cx="12" cy="4" r="3.6" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="10.5" y="6.5" width="3" height="11" fill="currentColor"/><rect x="12" y="14" width="5" height="1.7" fill="currentColor"/><rect x="12" y="16.6" width="3.4" height="1.6" fill="currentColor"/><rect x="11.1" y="7" width="0.9" height="7" fill="#fff" opacity=".35"/>',
    '💰': '<circle cx="12" cy="12" r="9.5" fill="currentColor"/><circle cx="12" cy="12" r="6.8" fill="none" stroke="#000" stroke-width="1" opacity=".2"/><rect x="9" y="9" width="6" height="6" rx="0.8" fill="#fff" opacity=".88"/><circle cx="7" cy="6.5" r="1.8" fill="#fff" opacity=".35"/>',
    '🌀': '<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M8.5 6.5 A7.5 7.5 0 0 1 15.5 6" stroke="currentColor" stroke-width="1.9" fill="none" stroke-linecap="round"/><path d="M9.5 10 A4.5 4.5 0 0 1 14.5 11" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="12" cy="12.5" r="1.7" fill="currentColor"/>',
    '🔒': '<path d="M8 11 L8 7.5 A4 4 0 0 1 16 7.5 L16 11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><rect x="4.5" y="11" width="15" height="11" rx="2.5" fill="currentColor"/><circle cx="12" cy="16" r="2" fill="#000"/><rect x="11.3" y="16.5" width="1.4" height="2.6" fill="#000"/><rect x="6" y="12" width="3" height="2" rx="1" fill="#fff" opacity=".3"/>',
    '🏰': '<rect x="4" y="15" width="16" height="7" fill="currentColor"/><rect x="4" y="8" width="4" height="8" fill="currentColor"/><rect x="16" y="8" width="4" height="8" fill="currentColor"/><rect x="9" y="5" width="6" height="11" fill="currentColor"/><rect x="9" y="2.5" width="6" height="3" fill="currentColor"/><rect x="4.8" y="8.8" width="1" height="7" fill="#fff" opacity=".25"/><polygon points="10,22 10,19 12,17 14,19 14,22" fill="#0a0a0a"/><circle cx="12" cy="9" r="1" fill="#fff" opacity=".7"/><circle cx="6" cy="11" r="0.8" fill="#fff" opacity=".6"/><circle cx="18" cy="11" r="0.8" fill="#fff" opacity=".6"/>',
    // ── 特殊房间 ──
    '⛓': '<circle cx="6.5" cy="6.5" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="17.5" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="9.5" y1="11.5" x2="14.5" y2="7.5" stroke="currentColor" stroke-width="3"/>',
    '📚': '<polygon points="3,6 12,3.5 21,6 21,19 12,21.5 3,19" fill="currentColor"/><line x1="12" y1="3.5" x2="12" y2="21.5" stroke="#000" stroke-width="0.8" opacity=".3"/><polygon points="4,6.6 12,4.4 12,20.4 4,18" fill="#fff" opacity=".18"/>',
    '🏆': '<rect x="6.5" y="3" width="11" height="2.5" rx="1.2" fill="currentColor"/><polygon points="8,5.5 16,5.5 15,9 13,13 11,13 9,9" fill="currentColor"/><polygon points="8,5.5 9,9 8.4,10.5" fill="#fff" opacity=".25"/><path d="M6.5 6 L4.5 9 L7 9.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M17.5 6 L19.5 9 L17 9.5" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="11" y="13" width="2" height="4" fill="currentColor"/><rect x="8" y="17" width="8" height="2.5" rx="0.8" fill="currentColor"/><rect x="6.5" y="19.5" width="11" height="1.8" rx="0.7" fill="currentColor"/>',
    '🎰': '<rect x="9" y="2.5" width="6" height="2.5" rx="1.2" fill="currentColor"/><rect x="6" y="5" width="12" height="16" rx="2.5" fill="currentColor"/><rect x="8" y="7" width="8" height="5" rx="1" fill="#0a0a0a"/><rect x="8.6" y="7.6" width="2" height="3.8" fill="#fff" opacity=".9"/><rect x="11" y="7.6" width="2" height="3.8" fill="#fff" opacity=".9"/><rect x="13.4" y="7.6" width="2" height="3.8" fill="#fff" opacity=".9"/><line x1="18" y1="6" x2="21" y2="3" stroke="currentColor" stroke-width="2"/><circle cx="21.5" cy="2.5" r="1.6" fill="#f44"/><rect x="9" y="18" width="6" height="1.4" rx="0.7" fill="#000" opacity=".4"/><rect x="7.5" y="5.8" width="1.4" height="6" fill="#fff" opacity=".25"/>',
    '🔴': '<circle cx="12" cy="12" r="8.5" fill="currentColor"/><circle cx="8.5" cy="8" r="2.6" fill="#fff" opacity=".45"/>',
    '🔵': '<circle cx="12" cy="12" r="8.5" fill="currentColor"/><circle cx="8.5" cy="8" r="2.6" fill="#fff" opacity=".45"/>',
    '🏋': '<rect x="10.5" y="11" width="3" height="2" rx="1" fill="currentColor"/><rect x="3.5" y="7" width="4.5" height="10" rx="1.2" fill="currentColor"/><rect x="16" y="7" width="4.5" height="10" rx="1.2" fill="currentColor"/><rect x="4.5" y="8" width="1.2" height="8" fill="#fff" opacity=".3"/><rect x="17" y="8" width="1.2" height="8" fill="#fff" opacity=".3"/>',
    '🌟': '<polygon points="12,1.5 14.6,8.4 22,8.7 16.2,13.4 18.4,20.5 12,16.5 5.6,20.5 7.8,13.4 2,8.7 9.4,8.4" fill="currentColor"/><polygon points="12,1.5 14.6,8.4 9.4,8.4" fill="#fff" opacity=".35"/>',
    // ── 怪物（THEME_ENEMIES 去重）──
    '👻': '<path d="M12 3 Q5.5 3 5.5 10 L5.5 15 Q5.5 17 7.5 17 Q8.5 15.3 9.5 17 Q10.5 18.6 11.5 17 Q12 15.8 12.5 17 Q13.5 18.6 14.5 17 Q15.5 15.3 16.5 17 Q18.5 17 18.5 15 L18.5 10 Q18.5 3 12 3 Z" fill="currentColor"/><ellipse cx="9.4" cy="10" rx="2" ry="2.6" fill="#fff"/><ellipse cx="14.6" cy="10" rx="2" ry="2.6" fill="#fff"/><circle cx="9.8" cy="10.6" r="1.1" fill="#000"/><circle cx="15" cy="10.6" r="1.1" fill="#000"/>',
    '💀': '<path d="M12 2.5 Q6 2.5 6 8 Q6 10 7 11.5 Q4 14 4 18 Q4 21.5 8 21.5 L16 21.5 Q20 21.5 20 18 Q20 14 17 11.5 Q18 10 18 8 Q18 2.5 12 2.5 Z" fill="currentColor"/><circle cx="9.5" cy="12" r="2.4" fill="#000"/><circle cx="14.5" cy="12" r="2.4" fill="#000"/><polygon points="12,14.5 12.7,16.5 11.3,16.5" fill="#000"/><rect x="9" y="17.5" width="1.6" height="3" fill="#000"/><rect x="13.4" y="17.5" width="1.6" height="3" fill="#000"/><rect x="11" y="17.8" width="2" height="1" fill="currentColor"/>',
    '👤': '<circle cx="12" cy="6.5" r="3.5" fill="currentColor"/><path d="M5 21 Q5 14 12 14 Q19 14 19 21 Z" fill="currentColor"/><circle cx="10.6" cy="6.5" r="0.9" fill="#fff" opacity=".85"/><circle cx="13.4" cy="6.5" r="0.9" fill="#fff" opacity=".85"/>',
    '👿': '<circle cx="12" cy="14" r="8" fill="currentColor"/><polygon points="6,9 3,2 8,5" fill="currentColor"/><polygon points="18,9 21,2 16,5" fill="currentColor"/><path d="M6.5 11.5 L10.5 9 L6.5 9 Z" fill="#fff"/><path d="M17.5 11.5 L13.5 9 L17.5 9 Z" fill="#fff"/><circle cx="9" cy="13" r="1" fill="#fff"/><circle cx="15" cy="13" r="1" fill="#fff"/><path d="M8.5 16.5 Q12 19.5 15.5 16.5 Q12 18 8.5 16.5 Z" fill="#fff"/>',
    '🗿': '<path d="M5 21 L5 7 Q5 3 10 3 L14 3 Q19 3 19 7 L19 21 Z" fill="currentColor"/><rect x="6" y="6" width="12" height="2.4" rx="1.2" fill="currentColor"/><rect x="7" y="6.2" width="2.2" height="6.5" fill="#000" opacity=".45"/><rect x="14.8" y="6.2" width="2.2" height="6.5" fill="#000" opacity=".45"/><rect x="11" y="8.5" width="2" height="11" rx="1" fill="currentColor"/><rect x="11.5" y="6" width="1" height="3.5" fill="#fff" opacity=".25"/><rect x="7" y="18" width="10" height="1.2" fill="#000" opacity=".35"/>',
    '🐺': '<polygon points="5,6.5 2,2.5 7,4.5" fill="currentColor"/><polygon points="7,5 5,2.5 9,4" fill="currentColor"/><path d="M4 13 Q4 6 12 6 Q20 6 20 12 L20 15 Q20 18 16 17 Q13 20 10 18.5 L4 17 Q4 16 5 15 Z" fill="currentColor"/><circle cx="14.5" cy="10.5" r="1.5" fill="#fff"/><circle cx="15" cy="10.5" r="0.7" fill="#000"/><polygon points="17,12 20,13 17,14" fill="#fff"/><polygon points="5.5,13.5 8,14.5 5.5,15" fill="#fff"/>',
    '🕷': '<circle cx="12" cy="12" r="4.4" fill="currentColor"/><circle cx="12" cy="9.5" r="2.5" fill="currentColor"/><circle cx="10.8" cy="9" r="0.8" fill="#000"/><circle cx="13.2" cy="9" r="0.8" fill="#000"/><g stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M12 8 L6 3"/><path d="M12 8 L18 3"/><path d="M12 12 L4 10"/><path d="M12 12 L20 10"/><path d="M12 15 L6 21"/><path d="M12 15 L18 21"/><path d="M8 6 L10 14"/><path d="M16 6 L14 14"/></g>',
    '🧚': '<circle cx="12" cy="10.5" r="3" fill="currentColor"/><path d="M6 10 Q3 7 5 4 Q8 5 8 8.5 Z" fill="currentColor"/><path d="M18 10 Q21 7 19 4 Q16 5 16 8.5 Z" fill="currentColor"/><path d="M9 18 Q12 21 15 18 L15 13.5 L9 13.5 Z" fill="currentColor"/><path d="M6 10 Q3 7 5 4 Q8 5 8 8.5" stroke="#fff" stroke-width="0.7" fill="none" opacity=".55"/><circle cx="10.8" cy="10.5" r="0.6" fill="#000"/><circle cx="13.2" cy="10.5" r="0.6" fill="#000"/>',
    '🌺': '<path d="M12 3 Q7 6 7 12 Q7 16 9 18 Q11 20 12 20 Q13 20 15 18 Q17 16 17 12 Q17 6 12 3 Z" fill="currentColor"/><path d="M7 13 Q9 12 12 13.5 Q15 12 17 13 L15.5 16.5 Q13 17 12 16.5 Q11 17 8.5 16.5 Z" fill="#0a0a0a"/><path d="M6.5 11 L5 10 L6.5 12" fill="#fff" opacity=".5"/><path d="M17.5 11 L19 10 L17.5 12" fill="#fff" opacity=".5"/><path d="M12 20 L11 22 L13 22 Z" fill="currentColor"/>',
    '🦇': '<path d="M12 5 Q8 3 4 5 Q2 6.5 3 10 Q5 9 7 8 Q8 11 9 13 L12 20 L15 13 Q16 11 17 8 Q19 9 21 10 Q22 6.5 20 5 Q16 3 12 5 Z" fill="currentColor"/><circle cx="10.5" cy="8" r="0.9" fill="#fff"/><circle cx="13.5" cy="8" r="0.9" fill="#fff"/><polygon points="12,6 11,3 12.4,5.4" fill="currentColor"/><polygon points="12,6 13,3 11.6,5.4" fill="currentColor"/>',
    '🐛': '<circle cx="7" cy="12" r="2.6" fill="currentColor"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/><circle cx="17" cy="12" r="2.6" fill="currentColor"/><circle cx="7" cy="12" r="1" fill="#fff" opacity=".5"/><circle cx="12" cy="12" r="1" fill="#fff" opacity=".5"/><circle cx="17" cy="12" r="1" fill="#fff" opacity=".5"/><path d="M7 9.5 L5 6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M17 9.5 L19 6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>',
    '🐍': '<path d="M18 19 Q18 15 14 15 Q10 15 10 9 Q10 3 5 3" stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="5" cy="3" r="2.6" fill="currentColor"/><circle cx="4.2" cy="2.4" r="0.7" fill="#000"/><path d="M5 3 L2 1 L3.5 3.5" stroke="#f44" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
    '🦂': '<ellipse cx="10" cy="13" rx="3" ry="2.2" fill="currentColor"/><path d="M14 11.5 L18 8.5 L15.5 11 L17.5 13.5 L14 14 Z" fill="currentColor"/><path d="M6 11.5 L2 8.5 L4.5 11 L2.5 13.5 L6 14 Z" fill="currentColor"/><path d="M12 14.5 Q16 16 15.5 20 Q15 21.5 13.5 20.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="15.5" cy="20" r="1.1" fill="#f44"/>',
    '💥': '<polygon points="12,1 14,8 21,6 16,11 23,13 16,15 21,20 13,17 12,23 11,17 3,20 8,15 1,13 8,11 3,6 10,8" fill="currentColor"/><circle cx="12" cy="12.5" r="2.2" fill="#fff"/>',
    '🦎': '<ellipse cx="12" cy="13" rx="5.5" ry="3.5" fill="currentColor"/><circle cx="9" cy="12.5" r="1.2" fill="#fff"/><circle cx="9.4" cy="12.5" r="0.6" fill="#000"/><path d="M17.5 13 Q21 13 21 16 Q21 17.5 19 17.5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M10 16 L8 19.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M14 16 L16 19.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    '👺': '<circle cx="12" cy="14" r="7" fill="currentColor"/><polygon points="8,9 6,4 10.5,7" fill="currentColor"/><polygon points="16,9 18,4 13.5,7" fill="currentColor"/><path d="M12 11 L17 20 Q12 18 7 20 Z" fill="currentColor"/><polygon points="12,11 17,20 12,17" fill="#fff" opacity=".3"/><circle cx="9" cy="13" r="1.1" fill="#fff"/><circle cx="15" cy="13" r="1.1" fill="#fff"/>',
    '🌫': '<path d="M5 15 Q2 15 3 11.5 Q3 9 6 9.5 Q6 6.5 8.5 6.5 Q9.5 4 12 4 Q15.5 4 16 7.5 Q19 7.5 20 10 Q22 10 21 13 Q21 15.5 17 15.5 Z" fill="currentColor"/><circle cx="9" cy="11" r="1" fill="#fff" opacity=".4"/><circle cx="15" cy="9" r="0.9" fill="#fff" opacity=".3"/>',
    '💠': '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" transform="rotate(45 12 12)"/><rect x="7" y="7" width="10" height="10" rx="1.6" fill="none" stroke="#fff" stroke-width="0.8" opacity=".5" transform="rotate(45 12 12)"/><circle cx="12" cy="12" r="2" fill="#fff" opacity=".85"/>',
    '👣': '<ellipse cx="12" cy="18" rx="4.6" ry="5.6" fill="currentColor"/><circle cx="5.3" cy="7.5" r="2.2" fill="currentColor"/><circle cx="9.8" cy="4.8" r="2.4" fill="currentColor"/><circle cx="14.6" cy="4.8" r="2.4" fill="currentColor"/><circle cx="19.1" cy="7.5" r="2.2" fill="currentColor"/><ellipse cx="12" cy="17" rx="2" ry="3" fill="#fff" opacity=".2"/>',
    '🦌': '<path d="M5.5 6 L3 3 L7 4.5 L5.5 6 Z" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M4.5 6.5 L7 2 L10.5 4.5" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round"/><ellipse cx="14" cy="11" rx="5" ry="5.5" fill="currentColor"/><path d="M15 6 L19 4.5 L15.5 7 Z" fill="currentColor"/><circle cx="15" cy="10" r="1.1" fill="#000"/><path d="M19 10 L21.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '🧊': '<path d="M12 2 L20 6 L20 16 L12 20 L4 16 L4 6 Z" fill="currentColor"/><polygon points="12,2 20,6 12,10 4,6" fill="#fff" opacity=".45"/><polygon points="4,6 12,10 12,20 4,16" fill="#000" opacity=".12"/><polygon points="12,10 20,6 20,16 12,20" fill="#000" opacity=".04"/><path d="M10 8 L8 12 L11 14 L9 18" stroke="#fff" stroke-width="0.9" fill="none" opacity=".5"/>',
    '⛄': '<circle cx="12" cy="15" r="5" fill="currentColor"/><circle cx="12" cy="9" r="3.6" fill="currentColor"/><path d="M10 6.5 L10 3.5 L14 3.5 L14 6.5 Z" fill="currentColor"/><circle cx="10.7" cy="8.5" r="0.9" fill="#000"/><circle cx="13.4" cy="8.5" r="0.9" fill="#000"/><polygon points="12,10.2 20,11.5 12,12" fill="#f60"/><circle cx="10.5" cy="15" r="0.9" fill="#000"/><circle cx="13.5" cy="15" r="0.9" fill="#000"/>',
    '🧟': '<circle cx="12" cy="6.5" r="3" fill="currentColor"/><circle cx="11" cy="6.5" r="0.6" fill="#fff"/><circle cx="13.4" cy="6.5" r="0.6" fill="#fff"/><path d="M8 9.5 L6 15 L9.5 15 Z" fill="currentColor"/><path d="M16 9.5 L18 15 L14.5 15 Z" fill="currentColor"/><path d="M7 21 L9 15.5 L15 15.5 L17 21 Z" fill="currentColor"/><path d="M8.5 17.5 L16 17.5" stroke="#000" stroke-width="1" stroke-dasharray="2 2"/>',
    '🦑': '<path d="M12 3 Q6 3 6 9 L6 13 Q6 15 8 15 L12 19 L16 15 Q18 15 18 13 L18 9 Q18 3 12 3 Z" fill="currentColor"/><circle cx="10" cy="8" r="1" fill="#fff"/><circle cx="14" cy="8" r="1" fill="#fff"/><circle cx="10.4" cy="8" r="0.45" fill="#000"/><circle cx="14.4" cy="8" r="0.45" fill="#000"/><g stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M8 15.5 Q7 19 6.5 20.5"/><path d="M10.5 16 Q10 20 9.5 21"/><path d="M13.5 16 Q14 20 14.5 21"/><path d="M16 15.5 Q17 19 17.5 20.5"/></g>',
    '😈': '<circle cx="12" cy="13" r="8" fill="currentColor"/><polygon points="7,7.5 5,2 9,6" fill="currentColor"/><polygon points="17,7.5 19,2 15,6" fill="currentColor"/><path d="M7.5 11 L10.5 13 L7.5 13 Z" fill="#fff"/><path d="M16.5 11 L13.5 13 L16.5 13 Z" fill="#fff"/><circle cx="9" cy="15" r="0.8" fill="#fff"/><circle cx="15" cy="15" r="0.8" fill="#fff"/><path d="M8 17 Q12 20.5 16 17 Q12 18.5 8 17 Z" fill="#fff"/>',
    '👁': '<path d="M3 12 Q12 3 21 12 Q12 21 3 12 Z" fill="currentColor"/><circle cx="12" cy="12" r="5.5" fill="#fff"/><circle cx="12" cy="12" r="3" fill="#0aa"/><ellipse cx="12" cy="12" rx="1.2" ry="2.7" fill="#000"/><circle cx="13.5" cy="9.5" r="0.9" fill="#fff" opacity=".8"/><g stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"><path d="M4 4 L2 2"/><path d="M20 4 L22 2"/><path d="M4 20 L2 22"/><path d="M20 20 L22 22"/></g>',
    '🟤': '<path d="M12 3 Q7 3 6 8 Q4 10 4 14 Q4 19 9 20 Q11 22 15 20 Q20 19 20 14 Q20 8 16 6 Q15 3 12 3 Z" fill="currentColor"/><circle cx="9" cy="11" r="1" fill="#fff" opacity=".7"/><circle cx="15" cy="11" r="1" fill="#fff" opacity=".7"/><circle cx="7" cy="15" r="0.8" fill="#fff" opacity=".4"/><circle cx="17" cy="15" r="0.7" fill="#fff" opacity=".4"/>',
    '🐸': '<path d="M5 14 Q5 8 12 8 Q19 8 19 14 Q19 19.5 12 19.5 Q5 19.5 5 14 Z" fill="currentColor"/><circle cx="8.5" cy="7.5" r="2.3" fill="currentColor"/><circle cx="15.5" cy="7.5" r="2.3" fill="currentColor"/><circle cx="8.5" cy="7.5" r="1" fill="#fff"/><circle cx="15.5" cy="7.5" r="1" fill="#fff"/><circle cx="8.8" cy="7.7" r="0.4" fill="#000"/><circle cx="15.2" cy="7.7" r="0.4" fill="#000"/><path d="M8 15 Q12 17.5 16 15" stroke="#000" stroke-width="1" fill="none"/><path d="M10 11 Q12 12 14 11" stroke="#fff" stroke-width="0.8" fill="none" opacity=".5"/>',
    '🪱': '<path d="M7 6 Q3.5 9 7 12 Q10 15 7.5 18 Q6 20 10 21" stroke="currentColor" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M7 6 Q3.5 9 7 12 Q10 15 7.5 18 Q6 20 10 21" stroke="#000" stroke-width="0.9" fill="none" opacity=".28" stroke-dasharray="2 3"/><circle cx="7" cy="6" r="1.7" fill="currentColor"/>',
    '🐊': '<path d="M3 13 L12 6 L21 13 Q21 15.5 18.5 15.5 L18 20 Q18 21.5 16 21.5 L8 21.5 Q6 21.5 6 20 L5.5 15.5 Q3 15.5 3 13 Z" fill="currentColor"/><circle cx="17" cy="10.5" r="1.2" fill="#fff"/><circle cx="17.3" cy="10.5" r="0.55" fill="#000"/><g fill="#fff"><rect x="12" y="5.8" width="1.1" height="2.4"/><rect x="14.4" y="5" width="1.1" height="3"/><rect x="16.8" y="4.2" width="1.1" height="3.4"/></g>',
    '🌿': '<path d="M12 22 Q11 16 13 12 Q15 8 12 5" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M13 17 Q18 16 17 12 Q16 9 19 8 Q18 6 15 7 Q13 8 14 11 Q15 13 13 14 Z" fill="currentColor"/><path d="M12 10 Q7 11 8 15 Q9 18 6 19 Q5 17 8 16 Q10 15 9 12 Z" fill="currentColor"/><path d="M11.5 5.5 Q10.5 3 12 2.5 Q13.5 4.5 12 5.5 Z" fill="currentColor"/>',
    // ── 主题墙块（8 主题 wall，🧊/🌿 复用怪物）──
    'wall|🧱': '<rect x="1" y="1" width="22" height="22" rx="1.5" fill="currentColor"/><rect x="1" y="11" width="22" height="1.8" fill="#000" opacity=".32"/><rect x="6.5" y="1" width="1.8" height="10" fill="#000" opacity=".32"/><rect x="16" y="12.8" width="1.8" height="9.2" fill="#000" opacity=".32"/><rect x="1" y="1" width="22" height="3.5" rx="1.5" fill="#fff" opacity=".16"/><rect x="1" y="19.5" width="22" height="2.5" rx="1" fill="#000" opacity=".12"/>',
    'wall|🌳': '<circle cx="7.5" cy="7.5" r="4.2" fill="currentColor"/><circle cx="16.5" cy="7.5" r="4.2" fill="currentColor"/><circle cx="12" cy="12.5" r="5" fill="currentColor"/><circle cx="12" cy="17" r="4.2" fill="currentColor"/><circle cx="9" cy="6" r="1.5" fill="#fff" opacity=".22"/><path d="M12 20.5 Q12 23 9.5 21.5" stroke="#000" stroke-width="1" fill="none" opacity=".18"/>',
    'wall|🪨': '<path d="M3 8 L6 3 L14 2.5 L20 5 L21.5 12 L18.5 20 L8 21.5 L3 16 Z" fill="currentColor"/><path d="M7 6 L10 10 L9 14" stroke="#000" stroke-width="1.2" fill="none" opacity=".35"/><path d="M4 9 L8 11 L13 7.5 L15.5 13 L20 10" fill="#fff" opacity=".18"/><path d="M14 4 L15 8 L18 5 Z" fill="#fff" opacity=".15"/>',
    'wall|🔥': '<path d="M12 2 Q17 8 16 13 Q15 19 12 21 Q9 19 8 13 Q7 8 12 2 Z" fill="currentColor"/><path d="M12 3 Q15 8 14.5 12 Q14 16 12 18 Q13 16 14.5 12.5 Q15 8 12 3 Z" fill="#fff" opacity=".32"/><path d="M8.2 13.5 Q9.5 16.5 8 19 Q9.5 15.5 10.2 14 Z" fill="#f80"/>',
    'wall|🪦': '<path d="M5.5 4 L18.5 4 Q20.5 4 20.5 6 L20.5 9.5 L3.5 9.5 L3.5 6 Q3.5 4 5.5 4 Z" fill="currentColor"/><rect x="3.5" y="9.5" width="17" height="13" rx="1.5" fill="currentColor"/><rect x="11.2" y="12" width="1.6" height="5" fill="#000" opacity=".4"/><rect x="9.6" y="13.3" width="4.8" height="1.6" fill="#000" opacity=".4"/><rect x="5" y="20.5" width="14" height="1.5" rx="0.7" fill="#000" opacity=".22"/>',
    'wall|⬛': '<rect x="1.5" y="1.5" width="21" height="21" rx="2" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="#fff" opacity=".55"/><circle cx="17" cy="9" r="0.8" fill="#fff" opacity=".4"/><circle cx="9" cy="17" r="0.9" fill="#fff" opacity=".35"/><circle cx="16" cy="17.5" r="0.7" fill="#fff" opacity=".3"/><rect x="1.5" y="1.5" width="21" height="3" rx="1.5" fill="#fff" opacity=".08"/>',
    // ── 墙版（与怪物分形；🧊/🌿 墙形不同于怪物形）──
    'wall|🧊': '<rect x="1" y="1" width="22" height="22" rx="1.5" fill="currentColor"/><rect x="1" y="1" width="22" height="3.2" rx="1.5" fill="#fff" opacity=".32"/><path d="M6 5 L10 11 L8 17 M14 4 L13 10 L17 15 L15 21 M18 6 L21 12" stroke="#fff" stroke-width="1" fill="none" opacity=".4"/><rect x="1" y="19.5" width="22" height="2.5" fill="#000" opacity=".15"/>',
    'wall|🌿': '<rect x="1" y="1" width="22" height="22" rx="1.5" fill="currentColor"/><path d="M5.5 22 Q5.5 13 3.5 7.5 M9 22 Q9 11 8 5.5 M13.5 22 Q13.5 11 14.5 5.5 M18 22 Q18 13 20 7.5" stroke="#000" stroke-width="1.3" fill="none" opacity=".3"/><path d="M7 22 Q7 13 5 7 L7.5 5 Q9.5 13 9.5 22 Z M15.5 22 Q15.5 13 17.5 7 L20 5 Q18 13 18 22 Z" fill="#fff" opacity=".13"/><rect x="1" y="1" width="22" height="3" rx="1.5" fill="#fff" opacity=".13"/>',
    // ── 地板纹理（floor| 前缀，小而暗）──
    'floor|·': '<rect x="10" y="10" width="4" height="4" rx="1.2" fill="currentColor"/>',
    'floor|🍃': '<path d="M12 4 Q17.5 7 16 15 Q12 19.5 8 14 Q7.5 6.5 12 4 Z" fill="currentColor"/><path d="M12 6 L12 16" stroke="#000" stroke-width="0.8" opacity=".28"/>',
    'floor|⚫': '<path d="M6.5 14 L8.5 9.5 L15 8.5 L18 12 L16 16.5 L8 17 Z" fill="currentColor"/><path d="M8.5 10.5 L13 12 L11 16" stroke="#000" stroke-width="0.8" opacity=".25" fill="none"/>',
    'floor|🌑': '<circle cx="12" cy="12" r="3.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="#f80" opacity=".55"/>',
    'floor|❄': '<path d="M12 4 L12 20 M4 12 L20 12 M6.5 6.5 L17.5 17.5 M17.5 6.5 L6.5 17.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    'floor|🍂': '<path d="M8 5 Q16 6 17 13 Q12 17.5 8 14 Q6 9 8 5 Z" fill="currentColor"/><path d="M8 5.5 L15 12.5" stroke="#000" stroke-width="0.8" opacity=".28"/>',
    'floor|🟢': '<circle cx="12" cy="12" r="4" fill="currentColor" opacity=".85"/><circle cx="18" cy="7" r="1.6" fill="currentColor" opacity=".6"/><circle cx="6" cy="17" r="1.3" fill="currentColor" opacity=".5"/>'
};

// ==================== 图标渲染辅助 ====================
// 把「emoji 字符 / 图标 key」转成 inline SVG 字符串；未命中则原样返回字符（兜底）。
// size 单位 em，默认 1（继承所在 span 的 font-size，自动适配 exit/boss 等放大倍数）。
// ctx 为上下文前缀（如 'wall'/'floor'）：优先查 "ctx|ch"，实现墙/怪物/地板同 emoji 分形；
//   未提供 ctx 变体时回落到裸 emoji key（向后兼容）。
function renderIcon(ch, size, ctx) {
    if (ch === null || ch === undefined) return '';
    const s = String(ch);
    const strip = (t) => (t.indexOf('\uFE0F') >= 0 ? t.replace(/\uFE0F/g, '') : t);
    let body;
    if (ctx) {
        body = SVG_ICONS[ctx + '|' + s] || SVG_ICONS[ctx + '|' + strip(s)];
    }
    if (!body) {
        body = SVG_ICONS[s] || SVG_ICONS[strip(s)];
    }
    if (!body) return s;
    const em = (size === null || size === undefined) ? 1 : size;
    return '<svg class="ic" viewBox="0 0 24 24" style="width:' + em + 'em;height:' + em + 'em;" aria-hidden="true" focusable="false">' + body + '</svg>';
}


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
