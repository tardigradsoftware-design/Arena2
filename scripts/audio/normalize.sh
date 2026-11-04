#!/usr/bin/env bash
set -euo pipefail

INPUT="${1:-}"
if [[ -z "$INPUT" ]]; then
  echo 'Usage: npm run audio:normalize -- <input-audio> [output.wav]' >&2
  exit 2
fi
if [[ ! -f "$INPUT" ]]; then
  echo "Input audio not found: $INPUT" >&2
  exit 2
fi

OUTPUT="${2:-out/audio/normalized.wav}"
mkdir -p "$(dirname "$OUTPUT")"

# A practical narration target; review loudness and dynamics for the actual platform.
ffmpeg -hide_banner -nostdin -y \
  -i "$INPUT" \
  -af 'loudnorm=I=-16:LRA=11:TP=-1.5,aresample=48000' \
  -ac 2 \
  -c:a pcm_s24le \
  "$OUTPUT"

echo "Normalized audio: $OUTPUT"
