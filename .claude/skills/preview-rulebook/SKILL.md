---
name: preview-rulebook
description: Serve rules/index.html on a local webserver and open it in Chrome so the user can view and print the Summit rulebook on A4. Use when the user wants to preview, view, render, or print the rulebook.
---

# Preview the Summit rulebook

Serve the repo over HTTP and open the rulebook in Chrome so the user can read it
and print it on A4.

## Fastest path

From the repo root, run the helper script and tell the user it's up:

```
./serve.sh
```

It starts `python3 -m http.server` in the repo root, opens
`http://localhost:8000/rules/index.html` in Chrome (falling back to the default
browser), and stops the server on Ctrl-C. Use `PORT=8080 ./serve.sh` if 8000 is
taken.

## If you want to drive/verify it yourself

1. Start a static server from the repo root in the background:
   `python3 -m http.server 8000`
   (python3 ships with macOS and most Linux distros.)
2. Open `http://localhost:8000/rules/index.html`:
   - Use the in-app browser (`preview_start` with that URL, then `navigate`) if
     you want to screenshot or check the render.
   - Or open the user's own Chrome: macOS `open -a "Google Chrome" <url>`;
     Linux `google-chrome <url>` (fallback `xdg-open <url>`).
3. Tell the user: **print with Cmd/Ctrl-P and choose A4.** The page's CSS already
   forces the cube colours to print, so "Background graphics" does not need to be
   enabled.
4. When finished, stop the server (kill the `http.server` process).

## Notes

- `rules/index.html` is self-contained (inline CSS/SVG), so it also opens fine
  straight from `file://` — but serving over HTTP avoids any browser file://
  quirks and matches how it will be hosted.
- Print margins are set in the HTML's `@page` rule (A4, safe printer margins);
  don't add extra margins in the print dialog.
