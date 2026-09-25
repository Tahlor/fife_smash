#!/usr/bin/env bash
set -euo pipefail

ARCHIMEDES_DIR="${ARCHIMEDES_DIR:-/var/www/fife_smash}"
BRANCH="${BRANCH:-main}"
DEPLOY_MODE="${1:-host}" # 'host' or 'docker'

echo "============================================="
echo "=== Deploying fife_smash to Archimedes   ==="
echo "============================================="
echo "Target Directory: $ARCHIMEDES_DIR"
echo "Target Branch:    $BRANCH"
echo "Deployment Mode:  $DEPLOY_MODE"
echo "Timestamp:        $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "---------------------------------------------"

if [ -d "$ARCHIMEDES_DIR" ]; then
  cd "$ARCHIMEDES_DIR"
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Updating repository from origin/$BRANCH..."
    git fetch origin "$BRANCH"
    git reset --hard "origin/$BRANCH"
  fi
else
  echo "Notice: $ARCHIMEDES_DIR does not exist. Running in current working directory: $(pwd)"
fi

if [ "$DEPLOY_MODE" = "docker" ]; then
  echo "Building and launching Docker container on Archimedes..."
  docker build -t fife_smash:latest -f docker/Dockerfile .
  docker stop fife_smash_prod 2>/dev/null || true
  docker rm fife_smash_prod 2>/dev/null || true
  docker run -d --name fife_smash_prod -p 80:80 --restart unless-stopped fife_smash:latest
  echo "Docker container fife_smash_prod is running on port 80."
else
  echo "Installing dependencies..."
  npm ci

  echo "Building optimized production bundle..."
  npm run build

  echo "Reloading Nginx web server..."
  if command -v systemctl >/dev/null 2>&1; then
    sudo systemctl reload nginx
  elif command -v service >/dev/null 2>&1; then
    sudo service nginx reload
  fi
fi

echo "============================================="
echo "=== Deployment to Archimedes Complete!   ==="
echo "============================================="
