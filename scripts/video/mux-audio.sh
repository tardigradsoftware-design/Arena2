#!/usr/bin/env bash
set -euo pipefail

VIDEO="${1:-}"
AUDIO="${2:-}"
OUTPUT="${3:-out/final-with-audio.mp4}"
if [[ -z "$VIDEO" || -z "$AUDIO" ]]; then
  echo 'Usage: bash scripts/video/mux-audio.sh <video.mp4> <narration.wav> [output.mp4]' >&2
  exit 2
fi
if [[ ! -f "$VIDEO" || ! -f "$AUDIO" ]]; then
  echo 'Both input video and audio files must exist.' >&2
  exit 2
fi

mkdir -p "$(dirname "$OUTPUT")"
# Keep the already-rendered video stream untouched; encode only the incoming audio.
ffmpeg -hide_banner -nostdin -y \
  -i "$VIDEO" -i "$AUDIO" \
  -map 0:v:0 -map 1:a:0 \
  -c:v copy -c:a aac -b:a 192k \
  -shortest -movflags +faststart \
  "$OUTPUT"

echo "Muxed video and audio: $OUTPUT"
