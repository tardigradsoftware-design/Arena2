#!/usr/bin/env bash
set -euo pipefail

TEXT="${1:-}"
if [[ -z "$TEXT" ]]; then
  echo 'Usage: VOICE=tr RATE=155 npm run tts:espeak -- "Text to speak" [output.wav]' >&2
  exit 2
fi

OUTPUT="${2:-out/audio/espeak-draft.wav}"
VOICE="${VOICE:-tr}"
RATE="${RATE:-155}"
mkdir -p "$(dirname "$OUTPUT")"

if ! command -v espeak-ng >/dev/null 2>&1; then
  echo 'espeak-ng is required. Install it with your OS package manager (GitHub Actions installs it in CI).' >&2
  exit 127
fi

# eSpeak NG is a lightweight scratch-voice fallback, not a natural-sounding final narrator.
espeak-ng -v "$VOICE" -s "$RATE" -w "$OUTPUT" "$TEXT"
echo "Created draft voice track: $OUTPUT (voice=$VOICE, rate=$RATE)"
