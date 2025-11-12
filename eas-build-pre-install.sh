#!/usr/bin/env bash

# This script runs during EAS build before dependencies are installed
echo "[EAS Pre-Install] Preparing for clean build..."

# Ensure patch-package will run
if [ -f "package.json" ]; then
    echo "[EAS Pre-Install] package.json found"
fi

echo "[EAS Pre-Install] Setup complete"
