# SpyWorld (InfiniteQuest) - Deployment & Production Guide

SpyWorld is engineered as a unified, zero-configuration full-stack application. The frontend (React + Tailwind + Neumorphism) and backend (Spring Boot 3 + Gemini AI) are compiled into a single self-contained, executable JAR file or container.

---

## 🚀 Quick Start (Local Production)

### Option 1: Automated Script (Recommended)
- **Windows**: Double-click or run:
  ```cmd
  build-and-run.bat
  ```
- **Linux / macOS**:
  ```bash
  chmod +x build-and-run.sh
  ./build-and-run.sh
  ```
This builds the Vite frontend, places the static assets in Spring Boot, packages the executable JAR, and launches the application at `http://localhost:8080`.

---

### Option 2: Run the Pre-Packaged Standalone JAR
If you already built the project:
```bash
java -jar backend/target/infinitequest-0.0.1-SNAPSHOT.jar
```
Visit `http://localhost:8080` in any desktop or mobile browser.

---

## 🐳 Docker Deployment

A multi-stage `Dockerfile` is provided in the repository root. It compiles both frontend and backend within isolated build stages, generating a minimal, secure Eclipse Temurin Alpine image.

### Using Docker CLI
```bash
# 1. Build Docker image
docker build -t spyworld:latest .

# 2. Run container
docker run -d -p 8080:8080 --name spyworld -e PORT=8080 spyworld:latest
```

### Using Docker Compose
```bash
docker compose up --build -d
```
Access the application at `http://localhost:8080`.

---

## ☁️ Cloud Deployment Options

### 1. Google Cloud Run (Container)
Google Cloud Run can build and deploy the container in one command:
```bash
gcloud run deploy spyworld \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

### 2. Railway / Render / Fly.io
1. Push this repository to GitHub/GitLab.
2. Link your repository in [Railway](https://railway.app) or [Render](https://render.com).
3. The platform will automatically detect the root `Dockerfile`.
4. (Optional) Set the `GEMINI_API_KEY` environment variable in the dashboard.
5. Deploy! Railway and Render provide automated SSL (`https://`) and public domains.

### 3. VPS / AWS EC2 / DigitalOcean Droplet
1. Clone the repository on the server.
2. Run `docker compose up --build -d` or run the standalone `.jar` with `systemd` or `supervisord`.
3. Set up Nginx as reverse proxy with Certbot for SSL.

---

## 📱 Mobile & Wi-Fi Party Play
- Devices on the same Wi-Fi network can join instantly by scanning the on-screen QR code or browsing to `http://<YOUR_LAN_IP>:8080`.
- The application automatically discovers your machine's local LAN IP (e.g. `192.168.x.x`) and generates camera-scannable QR codes for phones.
- Viewports are optimized with:
  - iOS safe-area notch insets (`env(safe-area-inset-bottom)`).
  - 16px minimum form font sizing to prevent automatic mobile Safari zooming.
  - Fluid flexbox layout preventing header clipping or vertical scrolling on small screens (down to 320px).
