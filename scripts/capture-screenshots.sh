#!/usr/bin/env bash
# Capture every app screen into docs/screenshots via deep-link shot tour.
# Prerequisites: Expo running, iOS Simulator booted with the app open, API on :4000.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/docs/screenshots"
mkdir -p "$OUT"

EXPO_HOST="${EXPO_HOST:-172.20.10.2}"
EXPO_PORT="${EXPO_PORT:-8081}"
WAIT_SEC="${WAIT_SEC:-12}"

SHOTS=(
  onboarding
  welcome
  passenger-login
  passenger-signup
  driver-login
  driver-signup
  passenger-home
  book-trip
  enter-driver
  scan-qr
  confirm-trip
  payment-success
  trip-history
  passenger-profile
  passenger-edit-profile
  passenger-settings
  passenger-notifications
  driver-home
  driver-txns
  driver-wallet
  driver-profile
  driver-qr
  driver-edit-profile
  driver-settings
  driver-notifications
)

open_shot() {
  local id="$1"
  local url="exp://${EXPO_HOST}:${EXPO_PORT}/--/shot/${id}"
  echo "→ $id"
  xcrun simctl openurl booted "$url" >/dev/null
  sleep "$WAIT_SEC"
  xcrun simctl io booted screenshot "$OUT/${id}.png" >/dev/null
  # Shrink for README (keep readable on GitHub)
  sips -Z 900 "$OUT/${id}.png" >/dev/null 2>&1 || true
}

echo "Capturing ${#SHOTS[@]} screens → $OUT"
for id in "${SHOTS[@]}"; do
  open_shot "$id"
done

echo "Done. Files in $OUT"
ls -1 "$OUT"
