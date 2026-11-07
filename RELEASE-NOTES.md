# OL 0.17.0 — generation a9ec0b05

Private beta build. macOS 12 or later, Apple Silicon (arm64).

## What this is
OL is a personal agent that runs on your own Mac. Every unit of work carries a proof tier and closes
only when its own verifier passes. This build is the harness, the local runtime and the app UI.

## Install
1. Download `OL-0.17.0-gen0387.zip` and unzip it.
2. Drag **OL.app** to `/Applications`.
3. **This build is signed but not notarised by Apple.** On first launch macOS will refuse it. Either:
   - right-click (or Control-click) OL.app → **Open** → **Open** again, or
   - run once in Terminal: `xattr -dr com.apple.quarantine /Applications/OL.app`
4. Bring your own model key (BYOK). OL does not ship with credits.

## Verify the download
```
shasum -a 256 OL-0.17.0-gen0387.zip
```
Expected: printed below and on the download page.

## What is in this build
- Generation `a9ec0b05` — the wave-1 batch (context and pricing fixes, data-layer handlers off the event
  loop, Vision passes 53–97, the 54 confirmed UI defects).
- The proof gate: documents are rendered to pixels and measured, arithmetic is recomputed to the cent, a
  deploy counts only when the served bytes hash-match the built bytes.
- Local runtime, scheduler, memory and the seven-tier proof ladder.

## What is not in it
- No licence server, no payments, no auto-update: access is by invitation during the beta.
- No notarisation yet (needs an Apple Developer credential the owner must supply).
- Windows and Intel builds do not exist.

## Known limits
- A build this size (318 MB compressed, 864 MB installed) is larger than it should be; the next pass prunes the bundled virtualenv.
- The app requires Accessibility/Screen Recording only for the features that use them; everything else
  runs without those permissions.
