# PomoDoMore

### A Simple Pomodoro Timer

Originally I created this project to practice Vue.js and run the app locally on my network for convenient access from anywhere. I also used this opportunity to learn Docker, enabling me to deploy the app on a mini Intel NUC. Now it's available online for everyone to use.

**Try it out:** [pomodomore.com](https://pomodomore.com/)

---

### Prerequisites

- Node.js (v20.x)
- NPM (v10.x)
- Docker (optional, for containerized deployment)

---

### Tech Stack

- [Vue.js](https://vuejs.org/) — Frontend framework
- [Pinia](https://pinia.vuejs.org/) — State management
- [Vite](https://vite.dev/) — Build tool and dev server
- [TailwindCSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Howler.js](https://howlerjs.com/) — Audio playback (chime & click sounds)
- [Nginx](https://nginx.org/) — Production static file server (Docker)
- [Docker](https://www.docker.com/) — Containerization

---

### Installation

```bash
npm install
```

---

### Development

Start the local dev server:

```bash
npm run dev
```

Expose the dev server on all network interfaces (useful for accessing from other devices on your LAN):

```bash
npm run host
```

---

### Building for Production

Generate a production build in the `dist/` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

### Docker Deployment

The project uses a **multi-stage Docker build** defined in [`Dockerfile`](Dockerfile):

1. **Build stage** — Uses `node:20-alpine` to install dependencies and run `npm run build`.
2. **Serve stage** — Uses `nginx:alpine` to serve the compiled static files.

The [`nginx.conf`](nginx.conf) configures Nginx to listen on **port 2505** and serves the app with SPA-friendly routing (`try_files` falls back to `index.html`).

#### Quick Deploy

The [`build_docker.sh`](build_docker.sh) script builds the image, removes any existing container, and starts a new one:

```bash
# Localhost only (default) — accessible at http://localhost:2505
./build_docker.sh

# Expose to all interfaces — accessible at http://<your-ip>:2505
./build_docker.sh host
```

| Flag     | Bind Address     | Use Case                                  |
| -------- | ---------------- | ----------------------------------------- |
| _(none)_ | `127.0.0.1:2505` | Local development / single-machine access |
| `host`   | `0.0.0.0:2505`   | LAN access from other devices             |

The container is configured with `--restart always`, so it will automatically restart on system reboot.

#### Manual Docker Commands

```bash
# Build the image
docker build -t pomodoro-timer .

# Run the container (localhost only)
docker run -d --name pomodoro --restart always -p 127.0.0.1:2505:2505 pomodoro-timer

# Run the container (all interfaces)
docker run -d --name pomodoro --restart always -p 2505:2505 pomodoro-timer

# Stop & remove the container
docker rm -f pomodoro
```

---

### Code Quality

Format all files with Prettier:

```bash
npm run format
```

Lint with ESLint:

```bash
npm run lint
```
