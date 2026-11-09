# OL 0.17.1 — generation f225595fa9b9

**Notarised.** Apple's notary service returned **Accepted**, the ticket is stapled into the bundle, and
Gatekeeper reports `accepted / Notarized Developer ID` after a full round trip through the zip.

## Install

1. Download `OL-0.17.1-notarized.zip` and unzip it.
2. Drag **OL.app** into `/Applications`.
3. Open it. Gatekeeper accepts this build — no right-click workaround.

## Verify the download

```
shasum -a 256 OL-0.17.1-notarized.zip
961479034168cf09258271d7602982069a34892af0bbda36595c2fb23fbd9c30
```

Then either of:

```
spctl -a -vvv -t exec /Applications/OL.app     # expect: accepted, Notarized Developer ID
xcrun stapler validate /Applications/OL.app    # expect: The validate action worked!
```

## What was wrong with 0.17.0

It was signed but not notarised, so macOS refused it on first launch. The notary run exposed the real
defect: ten nested executables carried no secure timestamp. Every Mach-O in this build is timestamped,
hardened, and sealed — and the same check now runs before a bundle can be uploaded, so a rejected build
can never be published again.

## In this build

- Generation `f225595fa9b9`
- Notarised, timestamped, sealed; 22,718 sealed files
- Apple silicon, macOS 12+
- Bring your own model key; no credits are sold with it
