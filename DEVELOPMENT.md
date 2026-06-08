# 开发规范 (Development Guidelines)

## 项目结构

```
Rogue/
├── src/                     # 源文件（开发编辑这里）
│   ├── css/                 # 11 CSS 文件
│   ├── html/                # 2 HTML 片段
│   ├── js/                  # 17 JS 模块
│   └── templates/           # 3 HTML 模板
├── abyss-labyrinth.html     # 构建产物（python3 build.py）
├── build.py                 # 构建脚本 + 版本同步
├── VERSION                  # 版本号（纯文本，构建时注入）
├── CHANGELOG.md             # 版本更新日志
├── GUIDE.md                 # 玩家指南
├── DEVELOPMENT.md           # 开发规范（本文件）
├── README.md                # 项目说明
├── AGENTS.md                # Agent 专用指令
├── backups/                 # 版本备份
└── temp/                    # 临时文件
```

## 文件分类与清理规范

### 📁 项目文件（保留在根目录）

| 文件/目录 | 用途 |
|-----------|------|
| `src/` | 源代码（CSS/HTML/JS/模板） |
| `abyss-labyrinth.html` | 构建产物 |
| `build.py` | 构建脚本 |
| `VERSION` | 版本号 |
| `CHANGELOG.md` / `README.md` / `GUIDE.md` / `DEVELOPMENT.md` / `AGENTS.md` | 文档 |

### 📁 临时文件（全部放入 `temp/`）

| 类型 | 规则 |
|------|------|
| 企划书/方案文档 | 开发讨论文件 |
| 调试中间文件 | 调试后保留在 temp/，确认无价值后删除 |
| 编辑器缓存 | 工具缓存 |
| 草稿/笔记 | 开发过程中的草稿 |

### ⚙️ 执行规范
1. 任何与核心游戏运行无关的文件统一放入 `temp/` 目录
2. 提交或打包前：确保 `src/` 下只有源代码文件
3. 清理原则：`temp/` 中的文件确认无价值后删除，不保留在根目录

---

## 构建流程

```
编辑 src/ → python3 build.py → 浏览器刷新 abyss-labyrinth.html
```

构建脚本功能：
1. 拼接 CSS/HTML/JS 源文件
2. 从 `VERSION` 文件读取版本号，注入 HTML 标题和所有文档
3. 检测空文件（<10字节）并警告
4. JS 语法验证
5. 输出 `abyss-labyrinth.html`

版本号管理：只改 `VERSION` 文件，构建时自动同步到 HTML 标题和所有文档。

---

## 代码架构（17 模块）

```
MODULE 1: 核心配置与状态 (01-config.js, ~780行)
  - CONFIG: 地图/敌人/装备/品质/词缀/套装/职业/天赋/精英/升级/成就/药水/赌博/许愿井/突变/Boss
  - gameState: 初始状态 + restartGame() 双处初始化

MODULE 2: 音频引擎 (02-audio.js, ~170行)
  - SFX 18种音效 / BGM 已禁用

MODULE 3: 地图系统 (03-map.js, ~950行)
  - 城堡大厅 / 地城生成（随机漫步法）/ 铁匠铺 / 渲染 / 缩放 / 钥匙系统

MODULE 3b: 特殊房间 (03b-specialrooms.js, ~435行)
  - 8种特殊房间生成器+交互（宝藏/竞技场/祭坛/图书馆/赌博/裂缝/训练/许愿井）

MODULE 4a: 移动与状态 (04a-move.js, ~770行)
  - updateStatusBar / updateFloorInfo / movePlayer / 药水系统 / 钥匙拾取/解锁

MODULE 4b: 战斗与升级 (04b-fight.js, ~1610行)
   - combat(Boss+精英手动 / 普通自动) / afterKillEffects / 战斗特效(5种) / DoT / 升级 / Boss技能
   - 钥匙掉落（三处路径：手动战斗 / autoCombatRound开头 / autoCombatRound setTimeout回调）
   - autoCombatRound 中断机制（检查 gameState.autoAttack，ESC/按钮可中断）

MODULE 4c: 怪物突变 (04c-mutations.js, ~53行)
  - 狙击/闪避/灼烧/冰冻/召唤/迅捷/铁壁 辅助函数

MODULE 5: 装备与商店 (05-equipment.js, ~700行)
  - 装备生成/比较/宝箱/商店/事件NPC/enterDungeon

MODULE 6: 天赋系统 (06-talents.js, ~365行)
  - 18天赋 3级进阶(Lv1→Lv2→Lv3) + Q键主动技能 + tickSkillTurns

MODULE 7: UI核心 (07-ui.js, ~610行)
  - 游戏结束/重新开始/角色面板/装备详情/升级弹窗 / restartGame()

MODULE 7b: 排行榜 (07b-leaderboard.js, ~75行)
MODULE 7c: 存档系统 (07c-save.js, ~150行)
MODULE 7d: 工匠工坊 (07d-workshop.js, ~80行)
MODULE 7e: 特效辅助 (07e-effects.js, ~285行)

MODULE 8: 初始化 (08-init.js, ~375行)
MODULE 8b: 键盘控制 (08b-keyboard.js, ~230行)
MODULE 9: 元升级/诅咒/传奇 (09-meta.js, ~160行)
  - 工匠永久升级 + 诅咒装备(6种) + 传奇装备(12件)
```

---

## 开发流程

### 版本号推进规则
- **修订号** (+0.0.1)：Bug 修复或小调整
- **次版本号** (+0.1.0)：新功能或较大改进
- **主版本** (+1.0.0)：重大重构或破坏性变更

### 每次改动必须同步
1. **编辑代码** — 修改 `src/` 下的 HTML/CSS/JS
2. **语法验证** — `python3 build.py` 自带 JS 语法检查
3. **构建** — `python3 build.py` 自动同步 VERSION 到所有文档
4. **测试** — 浏览器 Ctrl+F5 强制刷新

### 文档维护规则

| 文档 | 维护时机 | 更新内容 |
|------|----------|----------|
| `README.md` | 仅版本同步时 | `build.py` 自动更新日期，绝不手动加版本/历史 |
| `CHANGELOG.md` | 每次代码改动 | 新增版本条目，分类记录改动 |
| `GUIDE.md` | 玩家可见改动 | 新系统/新内容/数值变更，自动同步版本号和日期 |
| `DEVELOPMENT.md` | 架构/流程变动 | 模块行数更新、陷阱更新、流程更新，自动同步日期 |

- **CHANGELOG.md 是唯一修改历史记录**，README/GUIDE/DEVELOPMENT 不包含变更历史
- **版本号由 `build.py` 自动同步**，手动改 VERSION 后 `build.py` 正则替换所有文档中的版本占位符
- **不确定是否要更时，优先更新**，过期文档比多余更新更糟糕

### 新增功能标准流程
1. CONFIG 区 — 添加配置常量
2. gameState + restartGame — 两处添加字段
3. CSS — 按功能块添加样式
4. HTML — 添加 UI 结构（`src/html/body.html`）
5. JS 逻辑 — 对应 MODULE 区添加函数
6. 集成 — 挂接到现有系统
7. 验证 — `python3 build.py` 语法检查
8. 文档 — 更新 CHANGELOG.md，必要时更新 GUIDE.md 和 DEVELOPMENT.md

---

## 常见陷阱

### 1. gameState 两处声明
新字段必须在 `let gameState = {...}`（01-config.js）和 `restartGame()`（07-ui.js）两处添加。`achievements`、`achievementStats` 等也必须在两处都初始化。

### 2. 变量作用域
`generateMap()` 中 `enemyPool` 在 `else` 块内定义。精英/商店/药水等代码若需访问 `enemyPool`，必须放在同一个 else 块内。

### 3. 战斗函数多分支
`combat()` 内 Boss/精英(手动单回合) 和普通敌人(auto逐回合) 是两段平行代码。改攻击/防御/死亡逻辑时需同步修改两处。

### 4. 弹窗回调异步
`showEquipCompare` 和 `showLevelUpModal` 是异步的（用户点击才回调）。传送门揭示/afterKillEffects/tickSkillTurns 必须放在回调内。

### 5. 装备 HP 与治疗上限
所有治疗/恢复上限用 `player.maxHp + sumEquipHp()`，包括：药水/商店药水/楼层恢复/嗜血/吸血/升级满血。

### 6. TALENT_TREES 结构
`CONFIG.TALENT_TREES` 的值是 `{name, icon, talents:[...]}` 对象，不是直接数组。遍历用 `tree.talents` 或 `tree.talents || []`。

### 7. 城堡层 theme='castle' 不在 CONFIG.THEMES 中
城堡使用独立的 `gameState.castleTheme`。进入地城前重置 `gameState.theme = 'abyss'`。访问主题时用 `CONFIG.THEMES[theme] || gameState.castleTheme || { icon:'🏰', name:'城堡' }` 兜底。

### 8. 特殊房间
- `generateMap()` 中特殊房间 generator 设置 exit，通用出口代码需跳过（`if (!gameState.specialRoom)`）
- 新增特殊房间需：地图生成 → exit 放置 → renderMap 标记 → movePlayer 交互
- 竞技场通过 `afterKillEffects()` 中的 `checkArenaClear()` 检查波次

### 9. 环境效果范围
仅出现在普通层。毒雾伤害在 `movePlayer()` 成功移动之后，黑暗在 `renderMap()` 中曼哈顿距离>4处理。

### 10. 城堡装饰物碰撞
装饰物（火炬🔥/石柱🏛️/旗帜🚩/王座👑/吊灯🕯️）存储在 `gameState.castleDecorations`。`movePlayer()` 城堡段在 NPC 检查之前遍历做碰撞检测。

### 11. DOM null 检查
keydown 处理器中 `introEl` 和 `startScr` 必须 null-check，否则元素缺失时整个按键系统崩溃。

### 12. 成就系统 localStorage 命名空间
成就数据存储在 `localStorage['rogue_achievements']`。避免与其他 localStorage key 冲突。

### 13. 排行榜 runKills 追踪
排行榜使用 `gameState.runKills`（本局击杀），与 `gameState.achievementStats.kills`（跨局累计）分离。

### 14. 诅咒装备副作用
涉及 4 处：`sumEquipAtk()`、`sumEquipDef()`、`movePlayer()` HP流失、`showEquipCompare()` 禁止替换。新增诅咒类型需全部更新。

### 15. Boss技能临时Debuff
使用 `_atkDebuff`/`_defBuff`/`_skipTurn`/`_curseTurns`，combat 双段代码中均需处理。

### 16. 传奇装备
双战斗段（自动/手动）中都需要处理传奇掉落。`quality:8` 固定品质，`legendary:true` 标记。

### 17. autoCombatRound 函数定义（⚠️ 高频错误）
- `autoCombatRound()` 定义在 `combat()` 函数内部
- **调用必须在 `combat()` 闭合 `}` 之前**
- 敌人死亡分支（setTimeout 回调内）必须有钥匙掉落逻辑和 `gameState.enemies.splice()`
- `keyDropChance` 必须在 `autoCombatRound()` 开头声明 `let keyDropChance = 0`
- 每次编辑后验证 brace balance：`python3 -c "...{...-...}..."` 输出 0

### 18. 钥匙系统
- 仅普通层（`gameState.exitLocked === true`）掉落钥匙
- 掉落：`1/totalEnemies` 概率，最后一只保底 100%
- 三处路径需要钥匙逻辑：手动战斗、autoCombatRound开头、autoCombatRound setTimeout回调
- 传送门图标：`exitLocked=true` 时显示🔒，走到传送门格子设置 `exitLocked=false` 后才变为🌀

### 19. 自动战斗中断 (v3.43.0)
- ESC 键中断：在 `08b-keyboard.js` ESC 处理中，检查 `gameState.autoAttack && gameState.enemies.length > 0` 时中断
- 按钮切换：`toggleAutoAttack()` 在 `02-audio.js` 中，切换后加日志提示
- `autoCombatRound()` 开头检查 `gameState.autoAttack`，为 false 时渲染/更新状态后 return
- 中断时按钮图标切换为 ✋，显示 "⚠️ 自动攻击已中断" 日志
- 注意：ESC 中断后玩家可手动移动/攻击，`gameState.autoAttack = false` 保持状态

---

## 调试技巧

### 语法验证
```bash
python3 build.py  # 自带 JS 语法检查
```

### 括号平衡检查
```bash
# 验证 JS 文件括号配对（输出应为 0）
python3 -c "
lines = open('src/js/04b-fight.js').readlines()
print(sum(l.count('{') for l in lines) - sum(l.count('}') for l in lines))
"
```

### 浏览器控制台（F12）
UI 交互无反应时，优先打开浏览器 F12 → Console 查看红色报错。复制完整报错信息，包含文件名、行号、错误类型。

```javascript
console.log(gameState.player);
console.log('总攻击:', gameState.player.atk + sumEquipAtk());
Object.entries(gameState.player.equipment).forEach(([k,v]) => {
    if (v) console.log(k, v.name, v.quality, v.atk, v.def);
});
```

---

## 版本发布

1. 确认所有修改测试通过
2. 运行 `python3 build.py` 语法检查
3. 编辑 `VERSION` 文件（推进版本号）
4. 更新 `CHANGELOG.md`（新版本章节 + 改动分类）
5. 必要时更新 `GUIDE.md`（玩家文档）和 `DEVELOPMENT.md`（架构/陷阱更新）
6. 浏览器 Ctrl+F5 强制刷新最终测试
