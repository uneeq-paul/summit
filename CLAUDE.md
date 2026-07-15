# Summit — repo conventions

## Rulebook versioning (important)

`rules/index.html` carries a **semantic version**, shown in two places — on the
cover and in the footer colophon — each in a `.version` span:

```html
<span class="version">v1.0.0</span>
```

Those spans are the version (currently v1.0.0). **Keep them in sync** — both
must always show the same value.

**Whenever you change the rulebook, bump the version in every `.version` span
before you commit** — and mention the new version in the commit message. Choose
the bump by the size of the change:

- **Patch** (`0.0.Z` → `0.0.Z+1`) — wording tweaks, fixes, small rule
  adjustments. This is the default.
- **Minor** (`0.Y.0`) — a new section, a new rule, or a class/mechanic change.
- **Major** (`X.0.0`) — a full revision or new edition.

Non-rulebook changes (README, tooling, this file) don't bump the version.
