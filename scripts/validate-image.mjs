import path from 'node:path';
import {stat} from 'node:fs/promises';
import sharp from 'sharp';

const [input = 'out/preview.png', ...options] = process.argv.slice(2);
const file = path.resolve(input);
const expectedOption = options.find((option) => option.startsWith('--expect='));

try {
  const image = sharp(file, {failOn: 'error'});
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height || !metadata.format) {
    throw new Error('The file has no readable image dimensions or format.');
  }

  if (expectedOption) {
    const expected = expectedOption.slice('--expect='.length).split('x').map(Number);
    if (expected.length !== 2 || expected.some((number) => !Number.isFinite(number))) {
      throw new Error(`Invalid --expect value: ${expectedOption}`);
    }
    if (metadata.width !== expected[0] || metadata.height !== expected[1]) {
      throw new Error(
        `Expected ${expected[0]}x${expected[1]}, received ${metadata.width}x${metadata.height}.`,
      );
    }
  }

  const [stats, fileInfo] = await Promise.all([image.stats(), stat(file)]);
  const isUniform = stats.channels.every((channel) => channel.stdev < 0.5);
  if (isUniform) {
    console.warn('Warning: image appears almost uniform; inspect it before approving.');
  }

  console.log(
    `Image OK: ${file} — ${metadata.format.toUpperCase()} ${metadata.width}x${metadata.height}, ${fileInfo.size} bytes, entropy ${stats.entropy.toFixed(2)}.`,
  );
} catch (error) {
  console.error(`Image validation failed for ${file}:`, error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
