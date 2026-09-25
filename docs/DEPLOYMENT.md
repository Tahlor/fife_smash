# Deployment Guide: Production Server Archimedes

This document outlines continuous integration, containerization, and production deployment procedures for hosting `fife_smash` on the internal/production server **Archimedes**.

---

## 1. Archimedes Server Specification & Target Topology

- **Host Name:** `Archimedes`
- **Application Root:** `/var/www/fife_smash`
- **Default Port:** `80` (HTTP) / `443` (HTTPS)
- **Node.js Runtime:** Node.js v20 LTS
- **Web Server:** Nginx (Alpine Container or Native Host Service)

---

## 2. Deployment Strategies

You can deploy `fife_smash` to Archimedes via either **Multi-Stage Docker Container** (recommended for isolation) or **Direct Host Deployment**.

### Strategy A: Multi-Stage Docker Container (Recommended)

The container build executes in two isolated stages to ensure zero dev dependencies or source build tools pollute the production image.

#### 1. Build the Production Container
```bash
docker build -t fife_smash:latest -f docker/Dockerfile .
```

#### 2. Run the Container
```bash
docker run -d \
  --name fife_smash_prod \
  -p 80:80 \
  --restart unless-stopped \
  fife_smash:latest
```

#### 3. Health Check
```bash
curl -I http://localhost/healthz
# Returns HTTP 200 OK
```

---

### Strategy B: Direct Host Deployment via `deploy-archimedes.sh`

The repository includes an automated deployment script: [`deploy-archimedes.sh`](file:///mnt/c/Users/taylo/github/fife_smash/deploy-archimedes.sh).

#### Automated Host Execution
```bash
./deploy-archimedes.sh host
```

This script performs the following atomic operations:
1. Verifies the target repository directory at `/var/www/fife_smash`.
2. Synchronizes with `origin/main` via `git reset --hard`.
3. Performs a clean dependency installation with `npm ci`.
4. Builds the production bundle using `npm run build`.
5. Safely reloads the system Nginx daemon (`sudo systemctl reload nginx`).

#### Automated Docker Execution via Script
```bash
./deploy-archimedes.sh docker
```

---

## 3. Nginx Web Server Configuration

When deploying directly to Archimedes' host Nginx service, copy [`docker/nginx.conf`](file:///mnt/c/Users/taylo/github/fife_smash/docker/nginx.conf) to `/etc/nginx/sites-available/fife_smash.conf`:

```nginx
server {
    listen 80;
    server_name archimedes.internal;
    root /var/www/fife_smash/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    # Cache hashed Vite assets permanently
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # SPA Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    location /healthz {
        return 200 "OK\n";
    }
}
```

Enable the configuration and reload:
```bash
sudo ln -sf /etc/nginx/sites-available/fife_smash.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. GitHub Actions CI/CD Pipeline

The `.github/workflows/deploy.yml` workflow automatically builds, tests, and deploys pushes from the `main` branch to Archimedes:

### Required GitHub Repository Secrets
- `ARCHIMEDES_HOST`: IP or domain name of Archimedes.
- `ARCHIMEDES_USER`: Deployment user (e.g., `deploy` or `ubuntu`).
- `ARCHIMEDES_SSH_KEY`: Private SSH key with write permissions to `/var/www/fife_smash`.
- `ARCHIMEDES_PORT`: SSH port (defaults to 22).

---

## 5. Rollback Procedures

If an unexpected regression occurs on Archimedes:

1. Identify the previous stable Git commit hash:
   ```bash
   git log --oneline -n 5
   ```
2. Reset to the target commit:
   ```bash
   git reset --hard <COMMIT_HASH>
   npm ci
   npm run build
   sudo systemctl reload nginx
   ```
