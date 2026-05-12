#!/bin/sh
set -e

MATUGEN_PATH="$CARGO_HOME/bin/matugen"
TARGET_DIR="dist"

echo "[INFO] Installing Matugen"
cargo install matugen

if [ ! -e $MATUGEN_PATH ]; then
  echo "[ERROR] Matugen doesn't exist in: $MATUGEN_PATH"
  exit 1
fi

if [ ! -e $TARGET_DIR ]; then
  echo "[INFO] Creating the dist folder"
  mkdir -p $TARGET_DIR
fi

echo "[INFO] Copying the binary to: $TARGET_DIR"
cp $MATUGEN_PATH $TARGET_DIR

echo "[INFO] Successfully completed"
