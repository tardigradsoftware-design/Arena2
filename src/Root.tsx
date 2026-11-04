import {Composition} from 'remotion';
import {StudioIntro} from './compositions/StudioIntro';
import {getVid001DurationInFrames, VID001_FPS, Vid001MirrorCheck} from './compositions/Vid001MirrorCheck';
import {INTRO_SPEC} from './compositions/metadata';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={INTRO_SPEC.id}
        component={StudioIntro}
        durationInFrames={INTRO_SPEC.durationInFrames}
        fps={INTRO_SPEC.fps}
        width={INTRO_SPEC.width}
        height={INTRO_SPEC.height}
      />
      <Composition
        id="VID001MirrorCheck"
        component={Vid001MirrorCheck}
        durationInFrames={900}
        fps={VID001_FPS}
        width={1080}
        height={1920}
        calculateMetadata={async () => ({
          durationInFrames: await getVid001DurationInFrames(),
        })}
      />
    </>
  );
};
