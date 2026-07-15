# Summit

A cooperative climbing board game. A team of climbers ascends a mountain built from hex tiles, revealed one step at a time. The whole game runs on a fixed pool of coloured cubes per player: green is stamina, and everything that goes wrong (hunger, damage, poison, weight, cold) swaps green out for another colour, crowding out the strength you need to climb. Reach the summit together — or lose together.

- **Players:** 2–4, fully cooperative
- **Ages:** 8+
- **Length:** about 45–60 minutes

## This repository is the source of truth

All game files live here. When something changes, it changes here first.

```
rules/
  index.html   The rulebook, formatted for screen and A4 print
design/
  README.md    Designer-only notes: parked ideas + playtest questions
```

## The rulebook

`rules/index.html` is the rulebook — the single source of truth for the rules.
Open it in any browser to read them. It is styled like a printed board-game
manual and is set up to print cleanly on **A4** — the page margins stay inside
the non-printable edge that most home printers leave, so nothing gets clipped.
To print, use your browser's Print dialog (choose A4; the cube colours are set
to print without needing "Background graphics").

## Editing the rules

Both files are edited directly — no build step. Edit the rulebook in
`rules/index.html`, and the design notes in `design/README.md`.

## Status

The rules are a complete, playable first version. Class stamina values, the
summit distance, card counts, and a few other numbers are settled for now but
expected to shift once the game is played — those open questions are tracked in
`design/README.md`, not in the player-facing rules.
