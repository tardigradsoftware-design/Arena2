import {execFileSync} from 'node:child_process';
import path from 'node:path';

const input = process.argv[2] ?? 'out/studio-intro.mp4';
const file = path.resolve(input);

try {
  const stdout = execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'stream=codec_type,codec_name,width,height,avg_frame_rate,sample_rate,channels:format=duration,format_name',
      '-of',
      'json',
      file,
    ],
    {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']},
  );
  const metadata = JSON.parse(stdout);
  const video = metadata.streams?.find((stream) => stream.codec_type === 'video');
  if (!video || !video.width || !video.height) {
    throw new Error('No valid video stream was found.');
  }

  const duration = Number(metadata.format?.duration);
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error('The video has no positive duration.');
  }

  const audio = metadata.streams?.find((stream) => stream.codec_type === 'audio');
  console.log(
    `Video OK: ${file} — ${video.codec_name} ${video.width}x${video.height} @ ${video.avg_frame_rate}, ${duration.toFixed(2)}s${audio ? `, audio ${audio.codec_name}` : ', no audio track'}.`,
  );
} catch (error) {
  console.error(`Video validation failed for ${file}:`, error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
