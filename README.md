# Summit

A cooperative climbing board game. A team of climbers ascends a mountain built from hex tiles, revealed one step at a time. The whole game runs on a fixed pool of coloured cubes per player: green is stamina, and everything that goes wrong (hunger, damage, poison, weight, cold) swaps green out for another colour, crowding out the strength you need to climb. Reach the summit together — or lose together.

- **Players:** 2–6, fully cooperative
- **Ages:** 8+
- **Length:** about 45–60 minutes

## This repository is the source of truth

All game files live here. When something changes, it changes here first.

```
rules/
  index.html    The rulebook — the rules content (source of truth)
  rulebook.css  All styling: screen, mobile, and A4 print
design/
  README.md     Designer-only notes: parked ideas + playtest questions
serve.sh        Serve the rulebook locally and open it in Chrome to view / print
```

## The rulebook

`rules/index.html` is the rulebook — the single source of truth for the rules.
It holds just the rules content; all styling lives in `rules/rulebook.css`, so
the HTML stays clean and easy to edit.

Open `index.html` in any browser to read it. The page is **mobile-responsive**
and styled like a printed board-game manual, and it prints cleanly on **A4** —
the margins stay inside the non-printable edge that most home printers leave, so
nothing gets clipped. To print, use your browser's Print dialog (choose A4; the
cube colours are set to print without needing "Background graphics").

## Viewing & printing

The quickest way to view and print it (Linux or macOS):

```
./serve.sh
```

This serves the repo with `python3 -m http.server` and opens
`http://localhost:8000/rules/index.html` in Chrome (falling back to your default
browser). Then print with **Cmd/Ctrl-P → A4**. Press Ctrl-C to stop the server.
Use `PORT=8080 ./serve.sh` if port 8000 is in use.

If you use Claude Code in this repo, the `/preview-rulebook` skill
(`.claude/skills/preview-rulebook/`) does the same thing on request.

## Editing the rules

Everything is edited directly — no build step. Edit the rules in
`rules/index.html`, the styling in `rules/rulebook.css`, and the design notes in
`design/README.md`.

## Status

The rules are a complete, playable first version. Class stamina values, the
summit distance, card counts, and a few other numbers are settled for now but
expected to shift once the game is played — those open questions are tracked in
`design/README.md`, not in the player-facing rules.
