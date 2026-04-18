# PomoDoMore

### A Simple Pomodoro Timer

Originally I created this project to practice Vue.js and run the app locally on my network for convenient access from anywhere. Now it's available online for everyone to use.

**Try it out:** [pomodomore.com](https://pomodomore.com/)

---

### Prerequisites

- [Bun](https://bun.sh/) (v1.x)

---

### Tech Stack

- [Vue.js](https://vuejs.org/) — Frontend framework
- [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- [Pinia](https://pinia.vuejs.org/) — State management
- [Vite](https://vite.dev/) — Build tool and dev server
- [TailwindCSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Howler.js](https://howlerjs.com/) — Audio playback (chime & click sounds)

---

### Installation

```bash
bun install
```

---

### Development

```bash
bun run dev        # start the local dev server
bun run host       # expose the dev server on your LAN
```

---

### Production

```bash
bun run build      # type-check + build to dist/
bun run preview    # preview the production build
```

---

### Code Quality

```bash
bun run format     # format with Prettier
bun run lint       # lint with ESLint
bun run lint:fix   # lint and auto-fix
```

Run lint, format, and build together:

```bash
./scripts/check_and_build.sh
```
