#!/usr/bin/env bash
# =============================================================================
# HireHub – Render Backend Build Script
# Location: backend/build.sh
# This script runs during every Render deployment of the Django backend.
# =============================================================================

set -o errexit   # Exit immediately if a command fails
set -o nounset   # Treat unset variables as errors
set -o pipefail  # Fail the pipeline if any command fails

echo "=== [HireHub Build] Installing Python dependencies ==="
pip install --upgrade pip
pip install -r requirements.txt

echo "=== [HireHub Build] Collecting static files ==="
python manage.py collectstatic --no-input

echo "=== [HireHub Build] Running database migrations ==="
python manage.py migrate --no-input

echo "=== [HireHub Build] Done ==="
