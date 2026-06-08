# Rogue (深渊文字迷宫) — Agent Instructions

## Build & Run
- Edit files under `src/` → run `python3 build.py` → refresh `abyss-labyrinth.html` in browser
- Build script: `src/css/` (11 files) + `src/html/` (2) + `src/js/` (17) + `src/templates/` (3) → single `abyss-labyrinth.html`
- Version controlled by `VERSION` file, injected into HTML title during build

## Architecture (key files)
| Module | File | What |
|--------|------|------|
| Config | `01-config.js` | All CONFIG constants + `gameState` init + `restartGame()` |
| Map | `03-map.js` | Dungeon generation, castle, shop, rendering |
| Special rooms | `03b-specialrooms.js` | 8 special room types |
| Player move | `04a-move.js` | Movement, potion system, floor transition |
| Combat | `04b-fight.js` | All combat (Boss/Elite manual, normal auto), damage, effects |
| Mutations | `04c-mutations.js` | Monster mutation helpers |
| Equipment | `05-equipment.js` | Generate/compare gear, chests, shop, event NPC |
| Talents | `06-talents.js` | 18 talents × 3 levels, active skills (Q key) |
| UI | `07-ui.js` | Game over, char sheet, level-up modal, restartGame() |
| Leaderboard | `07b-leaderboard.js` | localStorage rankings |
| Save | `07c-save.js` | Auto-save / continue / delete |
| Workshop | `07d-workshop.js` | Permanent upgrade UI |
| Effects | `07e-effects.js` | Castle canvas, event effects |
| Init | `08-init.js` | Opening animation, class select, achievements |
| Keyboard | `08b-keyboard.js` | All key handlers, debug keys |
| Meta | `09-meta.js` | Curse gear, legendary gear, workshop data |

## Critical Rules (easy to miss)

### gameState must be initialized in TWO places
Top-level `let gameState = {...}` in `01-config.js` AND `restartGame()` in `07-ui.js`. New fields must appear in **both**. Same for `achievementStats` / `achievements`.

### autoAttack combat flow (04b-fight.js)
- Normal enemies + autoAttack=true → `autoCombatRound()` loop
- `autoCombatRound` is defined **inside** `combat()` — any call to it must be inside `combat()`'s closing `}`
- On enemy death in auto-combat, always `gameState.enemies.splice(enemyIndex, 1)` before rendering
- The Boss/Elite/manual branch and auto-combat branch are parallel code paths — changes to damage/death logic may need to be synced in both

### Key/door system
- Keys only exist on **normal dungeon floors** (not Boss/shop/special rooms)
- Controlled by `gameState.exitLocked` (set in `03-map.js` line ~399) and `gameState.keyPicked`
- Last normal enemy in a floor **always** drops a key (100% on remaining=0)
- Walking onto the locked exit cell auto-unlocks if key is held

### Special rooms
- `generateMap()` sets up special room then returns — generic exit placement must check `!gameState.specialRoom`
- Each special room type needs: map setup, exit placement, render marker, movePlayer interaction
- Arena clears via `checkArenaClear()` in `afterKillEffects()`
- Training mode: `gameState.isTrainingMode` — all damage paths go through `takeDamage()` which returns early

### Theme system
- Castle layer uses `gameState.castleTheme` (not in `CONFIG.THEMES`)
- Always fallback: `CONFIG.THEMES[theme] || gameState.castleTheme || { icon:'🏰', name:'城堡' }`

### Healing上限
All healing capped at `player.maxHp + sumEquipHp()`, including potions, shop, floor restore, lifesteal, level-up, bloodlust.

###诅咒装备 (cursed gear)
Side effects touch 4 places: `sumEquipAtk()`, `sumEquipDef()`, `movePlayer()` HP drain, `showEquipCompare()` block replace. New curse types must update all 4.

### DOM safety
- `introEl` and `startScr` in keyboard handler must null-check (else full key system breaks)
- Always null-check enemy/object before accessing properties in combat animations

### `let round = 0` scope in autoCombatRound
Don't accidentally declare `round` or `keyDropChance` multiple times — causes shadowing bugs.

### Brace balance (frequent source of `Unexpected token` errors)
After editing `04b-fight.js`, always verify `combat()` brace depth:
```bash
# Run from Rogue directory: depth should print 0 at combat's closing }
python3 -c "
lines = open('abyss-labyrinth.html').readlines()
depth = 0; start = False
for i, l in enumerate(lines, 1):
    if 'function combat(enemyIndex)' in l: start = True; depth = 0
    if start:
        depth += l.count('{') - l.count('}')
        if depth == 0 and i > 6000: print(f'Line {i}: closes combat'); break
"
```
Never leave orphan `}` blocks — the old fix added a stray `}` after `autoCombatRound()` that broke syntax.

### Key system
- Keys only exist on **normal dungeon floors** (not Boss/shop/special rooms)
- Controlled by `gameState.exitLocked` (set in `03-map.js` line ~399) and `gameState.keyPicked`
- Last normal enemy in a floor **always** drops a key (100% when remaining=0)
- Walking onto the locked exit cell auto-unlocks if key is held
- Three code paths need key logic: manual combat (04b-fight.js ~636), autoCombatRound start (~1015), autoCombatRound setTimeout callback (~1137)
- Browser F12 Console is the fastest way: look for red errors with file:line
- Quick state inspection:
  ```js
  console.log('ATK:', gameState.player.atk + sumEquipAtk());
  Object.entries(gameState.player.equipment).forEach(([k,v]) => { if(v) console.log(k, v.name, v.quality, v.atk, v.def); });
  ```
- Debug keys: `0` god mode, `5` one-hit kill, `6` full heal, `7` +500 gold, `8` shop floor, `9` boss floor, `space` next floor

## Maintenance

### Document structure (4 docs + VERSION)
- `VERSION` — single line, `python3 build.py` syncs version number to all docs
- `CHANGELOG.md` — ONLY version update log. Every code change gets a new version entry here.
- `GUIDE.md` — player-facing docs (gameplay, systems, FAQ, stats, builds, tips)
- `README.md` — minimal: intro, run method, file structure. NO version numbers or change history.
- `DEVELOPMENT.md` — developer-facing (architecture, traps, process, module line counts)
- `AGENTS.md` — this file. Agent-specific rules and critical traps.
- **VERSION numbers are auto-synced by `build.py` via regex placeholders. Change history is CHANGELOG.md ONLY.**

### When to update each document

| Scenario | README | CHANGELOG | GUIDE | DEVELOPMENT |
|----------|--------|-----------|-------|-------------|
| Bug fix (no new systems) | ❌ | ✅ new entry | ❌ | ⚠️ if trap changed |
| New feature / system | ❌ | ✅ new entry | ✅ document it | ✅ add architecture entry |
| Balance tweak / numbers | ❌ | ✅ note it | ✅ if visible | ❌ |
| Refactor (no player-visible change) | ❌ | ✅ note it | ❌ | ✅ update modules/traps |
| New content (enemies/items/rooms) | ❌ | ✅ new entry | ✅ add content | ❌ |
| Cosmetic (themes/animations) | ❌ | ✅ note it | ❌ | ❌ |
| VERSION bump only | ✅ date sync | ❌ new entry | ✅ date/version sync | ✅ date/version sync |

### Rules
1. **Always edit `src/` files first, never the built `abyss-labyrinth.html`**
2. **Always bump VERSION and add CHANGELOG entry when code changes**
3. **`build.py` handles version number sync** — it uses regex to replace version placeholders in README/GUIDE/DEVELOPMENT/CHANGELOG
4. **CHANGELOG format**: `## [version] - YYYY-MM-DD` heading, then categorized bullets under `### 🐛 Bug 修复` / `### ✨ New` / `### ⚙️ Changes` / `### ⚠️ Breaking`
5. **When in doubt about whether to update a doc, update it** — stale docs are worse than unnecessary ones
6. **Never put version numbers or change history in README.md** — it stays minimal
