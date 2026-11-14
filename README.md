# OL

**One app that replaces the stack — and it cannot claim what it has not proven.**

The site is French at the root (Bill 96), English under `/en/`.

| | |
|---|---|
| French | <https://ol-projects.github.io/ol-control/> |
| English | <https://ol-projects.github.io/ol-control/en/> |
| Services (the only thing for sale today) | <https://ol-projects.github.io/ol-services/> |

## What the page says

OL is one persistent organism: the coding power of Claude Code, Codex, Cline and Cursor; the runtime
of Hermes; the computer use of OpenClaw; the orchestration of Dots and Herdr. One memory, one
identity, one authority and verification spine — and a core that builds what is missing.

The page states five divisions (one live), the 2.7 % platform fee (not open yet), what it is not, and
what is proven versus not yet proven. There is no subscription tier on this site: only OL Services is
for sale, at fixed prices.

## Repository

- `index.html` — French parent page (root). `en/index.html` — English.
- `start.html`, `download.html` and their `en/` mirrors.
- `assets/site.css`, `assets/site.js` — the design system and the page's own checks.
- `status.json` — figures the page reads at runtime (roadmap legs, checks). Nothing is typed into the HTML.
- `proof.json` + `proof.py` — a sha256 receipt for every served file. `python3 proof.py --check`
  runs in CI and the deploy fails if one line disagrees.
- `ol-control-30s.mp4` + `ol-control-30s.vtt` — the 30 s film and its captions.

## Company

OL — Optimization and Logistics · Montréal, Québec · NEQ 2270669312 · GST 81902 9992 RT0001 · QST 4024451921 TQ0002
