#!/bin/bash
# ═══════════════════════════════════════════════
# ThatNewAI — One-command deploy to Hostinger
# ═══════════════════════════════════════════════
# Usage: ./deploy.sh
#
# One-time setup:
#   1. Copy your SSH public key to Hostinger:
#      ssh-copy-id -p 65002 u996602862@in-mum-web1086
#
#   2. Or add your public key in hPanel → Advanced → SSH Access
# ═══════════════════════════════════════════════

set -e

SSH_USER="u996602862"
SSH_HOST="147.93.101.192"
SSH_PORT="65002"
REMOTE_DIR="/home/${SSH_USER}/domains/thatnewai.com/public_html"

echo "🔨 Building..."
npm run build

echo ""
echo "🚀 Deploying to Hostinger..."
echo "   → ${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}"
echo ""

# Sync dist/ contents to remote, delete old files
rsync -avz --delete \
  -e "ssh -p ${SSH_PORT}" \
  dist/ \
  "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"

# Copy .htaccess (dotfiles may be skipped by rsync --delete)
rsync -avz \
  -e "ssh -p ${SSH_PORT}" \
  .htaccess \
  "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/.htaccess"

echo ""
echo "✅ Deployed successfully!"
echo "   🌐 https://thatnewai.com"
