#!/bin/bash
set -e

DAEMON_PATH="target/release/daemon"
TARGET_DIR="dist"

echo "[INFO] Starting daemon compilation"

cd "daemon"
cargo build --release
cd ".."

if [! -e $DAEMON_PATH]; then
  echo "[ERROR] The daemon binary was not found in: $DAEMON_PATH"
  exit 1
fi

if [ ! -e $TARGET_DIR ]; then
  echo "[INFO] Creating the dist folder"
  mkdir -p $TARGET_DIR
fi

echo "[INFO] Copying the binary to: $TARGET_DIR"
cp $DAEMON_PATH $TARGET_DIR

echo "[INFO] Successfully completed"
