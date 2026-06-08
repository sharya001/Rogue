# 开发规范 (Development Guidelines)

## 项目结构

```
Rogue/
├── src/                     # 源文件（开发编辑这里）
│   ├── css/                 # 10 CSS 文件
│   ├── html/                # 2 HTML 片段
│   ├── js/                  # 8 JS 模块
│   └── templates/           # 3 HTML 模板
├── abyss-labyrinth.html     # 构建产物（python build.py）
├── build.py                 # 构建脚本
├── assets/bgm/              # BGM 音频（当前禁用）
├── backups/                 # 版本备份
└── temp/                    # 临时文件
```

## 开发流程

### 构建流程
```
编辑 src/ → python build.py → 浏览器刷新 abyss-labyrinth.html
```

构建脚本功能：
1. 拼接 CSS/HTML/JS 源文件
2. 从 `VERSION` 文件读取版本号，注入标题
3. 检测空文件（<10字节）并警告
4. JS 语法验证
5. 输出 `abyss-labyrinth.html`

版本号管理：只改 `VERSION` 文件，构建时自动同步到 HTML 标题。

---

## 代码架构（17 模块）

```
MODULE 1: 核心配置与状态 (01-config.js, ~636行)
  - CONFIG: 地图/敌人/装备/品质/词缀/套装/职业/天赋/精英/升级选项/成就
  - CONFIG: 药水类型/赌博奖池/许愿井/怪物突变/稀有Boss
  - gameState: 初始状态 + 排行榜/成就配置

MODULE 2: 音频引擎 (02-audio.js, ~168行)
  - SFX 18种音效 / BGM 已禁用

MODULE 3: 地图系统 (03-map.js, ~897行)
  - 城堡大厅 / 地城生成 / 铁匠铺 / 渲染 / 缩放

MODULE 3b: 特殊房间 (03b-specialrooms.js, ~434行)
  - 8种特殊房间生成器+交互（宝藏/竞技场/祭坛/图书馆/赌博/裂缝/训练/许愿井）

MODULE 4a: 移动与状态 (04a-move.js, ~678行)
  - updateStatusBar / updateFloorInfo / movePlayer / 药水系统

MODULE 4b: 战斗与升级 (04b-fight.js, ~1297行)
  - combat(Boss+普通) / afterKillEffects / 战斗特效(5种) / Dot / 升级 / Boss技能

MODULE 4c: 怪物突变 (04c-mutations.js, ~53行)
  - 狙击/闪避/灼烧/冰冻/召唤/迅捷/铁壁 辅助函数

MODULE 5: 装备与商店 (05-equipment.js, ~698行)
  - 装备生成/比较/宝箱/商店/事件NPC/enterDungeon

MODULE 6: 天赋系统 (06-talents.js, ~265行)
  - 18天赋 + Q键主动技能 + tickSkillTurns

MODULE 7: UI核心 (07-ui.js, ~610行)
  - 游戏结束/重新开始/角色面板/装备详情/升级弹窗

MODULE 7b: 排行榜 (07b-leaderboard.js, ~75行)
  - calcScore / loadLeaderboard / saveToLeaderboard / showLeaderboard

MODULE 7c: 存档系统 (07c-save.js, ~150行)
  - autosaveGame / hasSaveData / continueGame / deleteSave

MODULE 7d: 工匠工坊 (07d-workshop.js, ~80行)
  - showWorkshop / closeWorkshop / buyUpgrade

MODULE 7e: 特效辅助 (07e-effects.js, ~283行)
  - drawCastleBg / refreshStartScreen / showEventEffect / showKeyHelp

MODULE 8: 初始化 (08-init.js, ~375行)
  - 开场动画/职业选择/头像/随机名/成就系统

MODULE 8b: 键盘控制 (08b-keyboard.js, ~233行)
  - keydown handler / 调试键 / 移动/技能/药水键

MODULE 9: 元升级/诅咒/传奇 (09-meta.js, ~156行)
  - 工匠永久升级数据+存取+购买+重置
  - 诅咒装备系统（CURSE）：6种诅咒类型+净化
  - 传奇装备系统（LEGENDARY）：12件+图鉴+成就
```
---

## 开发流程

### 每次改动必须同步
1. **备份当前版本** — 大改动（≥50行或涉及新系统）前先备份：
   - 游戏文件 + 4份文档（README/CHANGELOG/DEVELOPMENT/GUIDE）→ `backups/`
   - 命名：`{文件名}_v{版本号}_{YYYYMMDD_HHMMSS}.{扩展名}`
2. **更新代码** — 修改 HTML/CSS/JS
3. **语法验证** — `node -e "..."` 检查或 `python build.py` 自带
4. **更新 5 份文件**：
   - VERSION: 新版本号
   - CHANGELOG.md: 新版本号 + 分类记录改动
   - README.md: 版本号 + 修改历史 + 相关功能说明
   - DEVELOPMENT.md: 版本号 + 架构/陷阱更新
   - GUIDE.md: 版本号 + 日期 + 玩家指南同步（新功能/新机制/FAQ）
5. **构建** — `python build.py`
6. **备份** — 游戏产物 + 4份文档 → `backups/`
7. **版本号统一推进** — Bug修复用修订号(+0.0.1)，新功能用次版本号(+0.1.0)，重大重构用主版本号(+1.0.0)

### AI 助手自动执行清单
每次代码改动后，AI 助手必须自动执行以下全部步骤，不得遗漏：
- [ ] 更新 `VERSION` 版本号
- [ ] 更新 `CHANGELOG.md`（新版本章节 + 改动分类）
- [ ] 更新 `README.md`（版本号 + 修改历史表）
- [ ] 更新 `DEVELOPMENT.md`（版本号）
- [ ] 更新 `GUIDE.md`（版本号 + 日期）
- [ ] 运行 `python build.py` 构建
- [ ] 备份全部 5 份文件到 `backups/`

### 新增功能标准流程
1. CONFIG 区 — 添加配置常量
2. gameState + restartGame — 两处添加字段
3. CSS — 按功能块添加样式
4. HTML — 添加 UI 结构
5. JS 逻辑 — 对应 MODULE 区添加函数
6. 集成 — 挂接到现有系统
7. 验证 — node 语法检查

---

## 常见陷阱

### 1. gameState 两处声明
新字段必须在 `let gameState = {...}` 和 `restartGame()` 两处添加。

### 2. 变量作用域：else 块内的变量外部不可访问
`generateMap()` 中 `enemyPool` 在 `else` 块内定义。精英/商店/药水等代码若需访问 `enemyPool`，必须放在同一个 else 块内，不能放在 `}` 之后。

### 3. 战斗函数多分支
`combat()` 内 Boss(单回合) 和普通敌人(auto/manual) 有三段平行代码。改攻击/防御/死亡逻辑时需全部同步。

### 4. 手动模式(✋)下普通敌人走 Boss 路径
当 `autoAttack=false` 时，普通敌人进入 Boss 单回合代码块。必须在死亡检查处用 `if (!enemy.isBoss)` 分支处理普通敌人（含精英怪装备掉落）。

### 5. 弹窗回调异步
`showEquipCompare` 和 `showLevelUpModal` 是异步的（用户点击才回调）。传送门揭示/afterKillEffects/tickSkillTurns 必须放在回调内，不能放在弹窗调用之后。

### 6. 装备 HP 与治疗上限
所有治疗/恢复上限用 `player.maxHp + sumEquipHp()`，包括：药水/商店药水/楼层恢复/嗜血/吸血/升级满血。

### 8. TALENT_TREES 结构：树对象 ≠ 天赋数组
`CONFIG.TALENT_TREES` 的值是 `{name, icon, talents:[...]}` 对象，不是直接数组。遍历天赋时用 `tree.talents` 或 `tree.talents || []`，不可直接 `for (const t of tree)`。

### 9. 城堡层 theme='castle' 不在 CONFIG.THEMES 中
城堡使用独立的 `gameState.castleTheme` 对象。进入地城前必须重置 `gameState.theme = 'abyss'`，否则 `generateMap()` 访问 `CONFIG.THEMES['castle']` 返回 undefined 导致崩溃。同理，`openCharSheet` 等处取主题需用 `CONFIG.THEMES[theme] || gameState.castleTheme` 兜底。

### 10. 特殊事件 triggerEventNPC 需手动追踪 action
随机事件NPC的特殊事件（楼层跳转、精英怪生成等）需用 `specialAction` 变量追踪，在函数末尾统一处理地图重生成（楼层变更）和渲染刷新。

### 12. 成就系统 localStorage 命名空间
成就数据存储在 `localStorage['rogue_achievements']`，包含 `achievements`（已解锁id映射）和 `stats`（计数器）。重启游戏时 `initAchievements()` 恢复。避免与其他 localStorage key 冲突。

### 11. 精灵模式 inline style 与 CSS `!important` 的优先级
地图格子有内联 `style="color:#xxx"`，精灵模式的 `.sprite-cell { color:transparent !important }` 无法覆盖。需在 `spriteStyle` 末尾追加 `color:transparent;`。另外 `font-size:0` 会让 `width:1.3em` 变0，需改固定像素。

### 7. DOM null 检查
keydown 处理器中 `introEl` 和 `startScr` 必须 null-check，否则元素缺失时整个按键系统崩溃。

### 13. 特殊房间状态管理
特殊房间使用 `gameState.specialRoom = { type, state: {...} }`。新增特殊房间类型时：
- `generateMap()` 中判定后调用专用生成器并 return
- `renderMap()` 中渲染房间标记（金币/祭坛/图书馆/竞技场出口）
- `movePlayer()` 中添加交互逻辑（金币拾取/祭坛弹窗/图书馆弹窗）
- 竞技场通过 `afterKillEffects()` 中的 `checkArenaClear()` 检查波次
- 祭坛/图书馆弹窗需同步在 keyboard 守卫 + gameOver 清理 + ESC 处理三处添加

### 14. 环境效果范围
环境效果（毒雾/黑暗/魔力紊乱）仅出现在普通层。Boss层/商店层/特殊房间不会触发。
- 毒雾：每步伤害必须放在 `movePlayer()` 成功移动之后、`sfx.play('walk')` 之前，且需检查 HP≤0 → gameOver
- 黑暗：`renderMap()` 中曼哈顿距离>4的格子设为 dark-fog。注意保留墙壁可见
- 魔力紊乱：`tickSkillCooldown()` 中用 `Math.max(0, cd - ticks)` 防止负数
- 环境效果在 `generateMap()` 的 `isShopFloor` 判定之后设置，在下一层时 `generateMap()` 会重新判定并覆盖

### 15. 城堡装饰物碰撞
装饰物（火炬🔥/石柱🏛️/旗帜🚩/王座👑/吊灯🕯️）存储在 `gameState.castleDecorations` 数组中。`movePlayer()` 城堡段在 NPC 检查之前遍历装饰物数组做碰撞检测。注意此检查必须在墙壁检查之后、NPC交互之前，因为装饰物虽不可穿越但不影响 NPC 交互的优先级。红毯 ◆ 走 `castleCarpet` 数组，仅影响渲染不阻挡移动。

### 16. 排行榜 runKills 追踪
排行榜计分使用 `gameState.runKills`（本局击杀数），与 `gameState.achievementStats.kills`（跨局累计）分离。两者在 `afterKillEffects` 中同步递增。新增 gameState 字段时必须在 `let gameState = {...}` 和 `restartGame()` 两处添加。排行榜 ESC 键关闭需在键盘 handler 中单独处理；开始界面显示时按 ESC 若排行榜打开应关闭排行榜（不应被开始界面守卫拦截）。

### 17. gameState 初始值缺失导致静默崩溃
部分字段（如 `achievements`、`achievementStats`）只在 `restartGame()` 中初始化，但页面刷新后 `gameState` 使用顶层声明初始值。若顶层声明未包含这些字段，直接访问 `gameState.achievements[id]` 会报 `Cannot read properties of undefined`。**所有 gameState 字段必须在顶层声明 + restartGame 两处都初始化**。

### 18. 城堡 theme='castle' 不在 CONFIG.THEMES 中
`generateMap()` 切换主题时，旧主题可能是 'castle'。访问 `CONFIG.THEMES['castle']` 返回 undefined。需用 `CONFIG.THEMES[oldTheme] || gameState.castleTheme || { icon:'🏰', name:'城堡' }` 兜底。

### 19. 诅咒装备副作用需在多处同步
诅咒效果涉及：`sumEquipAtk()`(攻击加成)、`sumEquipDef()`(防御加成/惩罚)、`movePlayer()`(HP流失)、`showEquipCompare()`(禁止替换)。新增诅咒类型时需检查这4处是否都需要更新。

### 20. Boss技能临时Debuff处理
Boss技能使用临时属性标记（`_atkDebuff`/`_defBuff`/`_skipTurn`/`_curseTurns`），这些标记在 combat 双段代码中均需处理。Debuff 在计算伤害前应用、计算后清除（单回合效果）。

### 21. 传奇装备在双战斗段中都需要处理
Boss击杀传奇掉落逻辑在 `04b-fight.js` 的自动战斗和手动战斗两段中都需要加入。传奇装备使用 `quality:8` 固定品质，`legendary:true` 标记。

---

## 调试技巧

### 语法验证
```bash
node -e "const m=require('fs').readFileSync('/Users/xiaoyu/Desktop/Rogue/abyss-labyrinth.html','utf8').match(/<script>([\\s\\S]*?)<\\/script>/);new Function(m[1]);console.log('OK')"
```

### 浏览器控制台（F12）
UI 交互无反应时，优先打开浏览器 F12 → Console 查看红色报错：
- 报错包含文件名、行号、错误类型
- 复制完整报错信息给我，能直接定位根因
- 比 alert 逐行排查快得多

```javascript
console.log(gameState.player);
console.log('总攻击:', gameState.player.atk + sumEquipAtk());
// 查看 9 槽装备
Object.entries(gameState.player.equipment).forEach(([k,v]) => {
    if (v) console.log(k, v.name, v.quality, v.atk, v.def);
});
```

---

## 版本发布

- **主版本**: 重大重构或破坏性变更
- **次版本**: 新功能或较大改进
- **修订号**: Bug 修复或小调整

发布步骤:
1. 确认所有修改测试通过
2. 运行语法验证
3. 更新 3 份文档（CHANGELOG / README / DEVELOPMENT）
4. 浏览器 Ctrl+F5 强制刷新测试

---

## 维护信息

**开发者**: 傻妞
**项目起始**: 2026-05-27
**当前版本**: v3.30.0
**项目路径**: `/Users/xiaoyu/Desktop/Rogue/`