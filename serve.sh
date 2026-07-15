#!/usr/bin/env bash
# Serve the Summit rulebook locally and open it in Chrome to view / print on A4.
# Works on Linux and macOS. Needs python3 (preinstalled on macOS and most Linux).
#
#   ./serve.sh            # serve on port 8000
#   PORT=8080 ./serve.sh  # serve on a different port
#
# Press Ctrl-C to stop the server.
set -u

PORT="${PORT:-8000}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
URL="http://localhost:${PORT}/rules/index.html"

cd "$ROOT"

python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null' EXIT INT TERM

# Wait for the server to accept connections (best effort).
for _ in $(seq 1 25); do
  curl -sf -o /dev/null "$URL" && break
  sleep 0.2
done

echo "Summit rulebook: $URL"
echo "Print with Cmd/Ctrl-P and choose A4 — cube colours are already set to print."
echo "Press Ctrl-C to stop."

# Open in Chrome, falling back to the system default browser.
case "$(uname -s)" in
  Darwin)
    open -a "Google Chrome" "$URL" 2>/dev/null || open "$URL"
    ;;
  *)
    { google-chrome "$URL" \
        || google-chrome-stable "$URL" \
        || chromium "$URL" \
        || chromium-browser "$URL" \
        || xdg-open "$URL"; } >/dev/null 2>&1 &
    ;;
esac

wait "$SERVER_PID"
