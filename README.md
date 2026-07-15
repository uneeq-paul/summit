# Summit

A cooperative climbing board game. A team of climbers ascends a mountain built from hex tiles, revealed one step at a time. The whole game runs on a fixed pool of coloured cubes per player: green is stamina, and everything that goes wrong (hunger, damage, poison, weight, cold) swaps green out for another colour, crowding out the strength you need to climb. Reach the summit together — or lose together.

- **Players:** 2–4, fully cooperative
- **Ages:** 8+
- **Length:** about 45–60 minutes

## This repository is the source of truth

All game files live here. When something changes, it changes here first.

```
rules/
  index.html                  The rulebook, formatted for screen and A4 print
  Summit_Rulebook.docx        Word version of the same rules
  Summit_Rulebook_print.pdf   Ready-to-print A4 PDF (safe printer margins)
design/
  Summit_Design_Notes.docx    Designer-only notes: parked ideas + playtest questions
source/
  build_rulebook.js           Script that generates the .docx rulebook
  build_design_notes.js       Script that generates the .docx design notes
```

## The rulebook

Open `rules/index.html` in any browser to read the rules. It is styled like a
printed board-game manual and is set up to print cleanly on **A4** — the page
margins stay inside the non-printable edge that most home printers leave, so
nothing gets clipped. Use your browser's Print dialog (choose A4, enable
"Background graphics" so the cube colours print).

`rules/Summit_Rulebook_print.pdf` is a pre-generated A4 PDF if you'd rather just
print without opening the HTML.

## Editing the rules

The HTML rulebook in `rules/index.html` is edited directly. The `.docx` files are
generated from the scripts in `source/` (they use the `docx` Node package):

```
cd source
npm install docx
node build_rulebook.js
node build_design_notes.js
```

## Status

The rules are a complete, playable first version. Class stamina values, the
summit distance, card counts, and a few other numbers are settled for now but
expected to shift once the game is played — those open questions are tracked in
`design/Summit_Design_Notes.docx`, not in the player-facing rules.
