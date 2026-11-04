import {execFileSync} from 'node:child_process';
import path from 'node:path';

const input = process.argv[2] ?? 'out/sfx/chime.wav';
const file = path.resolve(input);

try {
  const stdout = execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'stream=codec_type,codec_name,sample_rate,channels:format=duration,format_name',
      '-of',
      'json',
      file,
    ],
    {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']},
  );
  const metadata = JSON.parse(stdout);
  const audio = metadata.streams?.find((stream) => stream.codec_type === 'audio');
  if (!audio || !audio.sample_rate || !audio.channels) {
    throw new Error('No valid audio stream was found.');
  }

  const duration = Number(metadata.format?.duration);
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error('The audio has no positive duration.');
  }

  console.log(
    `Audio OK: ${file} — ${audio.codec_name}, ${audio.sample_rate} Hz, ${audio.channels} channel(s), ${duration.toFixed(2)}s.`,
  );
} catch (error) {
  console.error(`Audio validation failed for ${file}:`, error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
