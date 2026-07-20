# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A prototype browser game (town builder / turn-based resource management), built with **Svelte 5 (runes) + Vite**, deployed as a static site to **GitHub Pages**. Portrait-first, designed to feel like a mobile game inside a centered "phone frame" that also works on landscape/tablet/desktop. There are no tests or linters configured.

## Commands

```bash
npm install
npm run dev       # local dev server (Vite)
npm run build     # production build to dist/
npm run preview   # serve the built dist/ locally
```

### Deploy (manual — there is no CI)

The git remote's token lacks `workflow` scope, so GitHub Actions cannot be used. `main` holds source; the built site is published to the **`gh-pages`** branch, which GitHub Pages serves at `https://grigorysolomatov.github.io/hermes-town-game/`. After `npm run build`:

```bash
touch dist/.nojekyll && git worktree prune && rm -rf /tmp/ghpages
git worktree add -q /tmp/ghpages gh-pages
cd /tmp/ghpages && find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +
cp -r /path/to/repo/dist/. /tmp/ghpages/
git add -A && git commit -q -m "Deploy: <what>" && git push origin gh-pages
cd /path/to/repo && git worktree remove /tmp/ghpages --force
```

Pages' CDN caches ~1 min; verify a deploy went live by polling the served JS hash in the page HTML against the freshly built `dist/assets/index-*.js` filename.

`vite.config.js` sets `base: '/hermes-town-game/'` — this **must** match the repo name or all asset URLs 404 on Pages.

### Branches

- `main` — current turn-based game (source of truth).
- `gh-pages` — built artifact only; do not develop here.
- `timer-based-gameplay` — snapshot of the earlier real-time (timer-driven) version before the turn-based rewrite. Keep as history.

## Architecture

### Reactive state lives in `.svelte.js` rune modules

State is not held in components. Three singleton stores use Svelte 5 runes in `*.svelte.js` files (the `.svelte.js` suffix is what enables runes outside components):

- `src/lib/game.svelte.js` — the board: `game.grid` is a flat 25-cell array (5×5). Each cell is `null` or `{ uid, type, stored }`. `newUid()` gives stable identities. `justMoved` is a transient uid used to suppress one FLIP animation (see drag).
- `src/lib/worker.svelte.js` — turn engine. Holds `worker.{ running, index, turn, speed, flashing }` and `startRun()`.
- `src/lib/drag.svelte.js` — pointer-drag controller and drop rules.

Components import these modules and read/mutate them directly; deep reactivity means mutating `game.grid[i].stored` etc. just works.

`src/lib/grid.js` is the **single source of truth for board geometry** — `GRID_SIZE`, `CELL_COUNT`, `CELL_PCT`, the `SNAKE_PATH`, and index↔row/col helpers (`cellLeft/cellTop/cellAbove`). All index math and positioning derive from it (the Grid CSS is driven by `--n`/`--cell` vars), so changing the board size is a one-line change here.

### Data-driven content

Buildings and resources are pure config — **adding one is a data change, not new code**:

- `src/lib/buildings.js` — `BUILDINGS` map (`emoji`, `image` [null = emoji fallback, but `<img>` path exists], `tint`, `produces` [resource key | null], optional `special`, optional `startStored`) and `PALETTE` (order in the panel).
- `src/lib/resources.js` — `RESOURCES` map (`icon`, `name`, `tint`). Icons double as the on-tile badge glyph.

### Turn loop (the core mechanic)

It is **turn-based**, not real-time. Pressing "Start Turn" calls `startRun()`, which steps a **worker** cell-by-cell through `PATH` (a snake / zig-zag: row 0 L→R, row 1 R→L, … — always adjacent cells, so movement glides). On each cell:

- A **producer** (`def.produces`) fires *every* time it's hit, incrementing that building's own `stored` (resources are stored on the producing tile, not a global counter). A `+1` floats up and the tile pulses.
- **Coffee** (`special: 'lift'`) is a charge tile: `startStored: 1`, recharged at the start of each turn. If it has charge, it spends one (`stored -= 1`, shows `−1`) and lifts the worker up one row (resume from `cellAbove(cell)`) so producers below get re-swept — this is the combo engine. At 0 charge it's inert (grayed), which is what guarantees a run terminates. Add more `special` behaviors by branching in the `startRun` step loop.

Production feedback (`flash`, `+1`/`−1` floats, badge bump) is keyed off `worker.flashing` (uids currently pulsing).

### Custom pointer drag (not HTML5 DnD)

`drag.svelte.js` implements dragging with pointer events so it works identically on touch and mouse. Key behaviors:

- A movement threshold distinguishes tap from drag; the dragged item shows a **ghost** (`DragLayer.svelte`, `position: fixed`) following the pointer.
- **Palette drags are direction-aware**: a mostly-horizontal swipe is ceded to the browser to scroll the panel (items use `touch-action: pan-x`); a vertical pull becomes a building pickup. Grid pieces claim the gesture immediately.
- Drop targets are found with `document.elementFromPoint` + `[data-cell]` attributes; the pieces layer sets `pointer-events: none` while dragging so hit-testing reaches the cells beneath.
- Palette → grid places a new building; grid → grid moves or swaps; dropping outside the grid cancels (snap back). `game.justMoved` is set so the moved piece doesn't double-animate (the ghost already showed the motion) while a swapped-out piece still FLIPs.

### Grid rendering (`Grid.svelte`)

Background is a CSS-grid of 25 `.cell`s (with `[data-cell]`). Buildings are a **separate absolutely-positioned layer** keyed by `uid`, placed via `left/top: (index%5)*20% / floor(index/5)*20%`. Because they're keyed and only their position changes, `animate:flip` glides them between cells. The worker is another absolute overlay animated with a CSS transition. Emoji/badge sizes use container-query units (`cqmin`) against tiles that set `container-type: size`, so they scale with cell size.

### Layout

`App.svelte` composes: `Grid` (board), `RunControls` (Start Turn), `Palette` (collapsible, horizontally-scrollable building tray), `Settings` (gear, top-right, opens a modal containing worker speed), and `DragLayer`. `app.css` defines the `.stage` phone-frame (portrait-first, `100dvh`, capped width, centered on wide screens) and theme CSS variables. There is intentionally no global resource panel — resources live on tiles.
