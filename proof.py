#!/usr/bin/env python3
"""Publish and check the site's own receipt.

proof.json carries a sha256 for every file the site serves. The page recomputes
those hashes in the visitor's browser; this script recomputes them in CI. If one
line disagrees, the deploy fails -- the site cannot go live with a stale receipt.

  python3 proof.py            # write proof.json from the files as they are
  python3 proof.py --check    # recompute and exit 1 on any drift (used by CI)
"""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

SITE = Path(__file__).resolve().parent
PROOF = SITE / "proof.json"

# Served, but not part of the receipt: the receipt cannot contain its own hash,
# and the rest are build plumbing rather than page bytes.
SKIP = {"proof.json", ".nojekyll"}


def served_files() -> list[Path]:
    out = []
    for p in sorted(SITE.rglob("*")):
        if not p.is_file():
            continue
        rel = p.relative_to(SITE)
        if rel.parts[0] in {".git", ".github"}:
            continue
        if rel.as_posix() in SKIP:
            continue
        out.append(p)
    return out


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def build_id() -> str:
    try:
        return subprocess.run(
            ["git", "-C", str(SITE), "rev-parse", "--short=12", "HEAD"],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
    except Exception:
        return "uncommitted"


def receipt() -> dict:
    files = [{"path": p.relative_to(SITE).as_posix(), "sha256": sha256(p), "bytes": p.stat().st_size}
             for p in served_files()]
    return {
        "schema": "ol.control.proof/1",
        "build": build_id(),
        "generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "algorithm": "sha256",
        "note": "Recomputed in the visitor's browser and in CI. A mismatch is a refusal, not a warning.",
        "files": files,
    }


def main() -> int:
    check = "--check" in sys.argv
    new = receipt()

    if check:
        if not PROOF.exists():
            print("REFUSED: proof.json is missing; run python3 proof.py", file=sys.stderr)
            return 1
        old = json.loads(PROOF.read_text(encoding="utf-8"))
        a = {f["path"]: f["sha256"] for f in old.get("files", [])}
        b = {f["path"]: f["sha256"] for f in new["files"]}
        drift = [f"{k}: {a.get(k, 'missing')[:12]} -> {b.get(k, 'missing')[:12]}"
                 for k in sorted(set(a) | set(b)) if a.get(k) != b.get(k)]
        if drift:
            print("REFUSED: the published receipt does not match the files:", file=sys.stderr)
            for line in drift:
                print("  " + line, file=sys.stderr)
            print("run python3 proof.py and commit proof.json", file=sys.stderr)
            return 1
        print(f"VERIFIED: {len(b)} files match the published receipt")
        return 0

    PROOF.write_text(json.dumps(new, indent=1) + "\n", encoding="utf-8")
    total = sum(f["bytes"] for f in new["files"])
    print(f"wrote proof.json: {len(new['files'])} files, {total} bytes, build {new['build']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
