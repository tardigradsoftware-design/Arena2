#!/usr/bin/env bash
set -euo pipefail

OUTPUT="${1:-out/sfx/chime.wav}"
mkdir -p "$(dirname "$OUTPUT")"

# A small, deterministic stereo cue synthesized from a sine wave for pipeline tests.
ffmpeg -hide_banner -loglevel error -nostdin -y \
  -f lavfi \
  -i 'sine=frequency=880:sample_rate=48000:duration=0.75' \
  -af 'volume=0.18,afade=t=in:st=0:d=0.01,afade=t=out:st=0.12:d=0.60' \
  -ac 2 \
  -c:a pcm_s24le \
  "$OUTPUT"

echo "Created test sound: $OUTPUT"
