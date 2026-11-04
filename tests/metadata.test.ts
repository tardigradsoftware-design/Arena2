import {describe, expect, it} from 'vitest';
import {INTRO_SPEC} from '../src/compositions/metadata';

describe('Starter composition profile', () => {
  it('is an exact 16:9 HD composition', () => {
    expect(INTRO_SPEC.width).toBe(1920);
    expect(INTRO_SPEC.height).toBe(1080);
    expect(INTRO_SPEC.width / INTRO_SPEC.height).toBeCloseTo(16 / 9);
  });

  it('is five seconds long at 30 frames per second', () => {
    expect(INTRO_SPEC.fps).toBe(30);
    expect(INTRO_SPEC.durationInFrames / INTRO_SPEC.fps).toBe(5);
  });
});
