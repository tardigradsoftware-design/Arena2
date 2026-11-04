import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const VID001_FPS = 30;
export const VID001_PLAYBACK_RATE = 1.1;
export const VID001_NARRATION = 'audio/vid-001-narration.mp3';

const SCENES = [
  {
    image: 'assets/vid-001-scene-01.png',
    caption:
      'Girdiğiniz soyunma kabinindeki aynaya tırnağınızı dayadığınızda parmağınızla yansımanız arasında boşluk yoksa hemen oradan çıkın!',
  },
  {
    image: 'assets/vid-001-scene-02.png',
    caption:
      'Gerçek aynalarda cam kalınlığından dolayı milimetrik bir boşluk kalır; boşluk olmaması arkadan izlenen çift taraflı bir cam olduğunu gösterir.',
  },
  {
    image: 'assets/vid-001-scene-03.png',
    caption: 'Peki sen kabine girdiğinde ilk neyi kontrol edersin?',
  },
  {
    image: 'assets/vid-001-scene-04.png',
    caption:
      'Yorumlara yaz ki herkes öğrensin ve bu videoyu arkadaşlarına göndermeyi unutma.',
  },
] as const;

export const getVid001DurationInFrames = async (): Promise<number> => {
  const audioDuration = await getAudioDurationInSeconds(staticFile(VID001_NARRATION));
  if (!Number.isFinite(audioDuration) || audioDuration <= 0) {
    throw new Error(`Could not read narration duration: ${VID001_NARRATION}`);
  }

  // Keep a short visual tail after the faster narration ends.
  return Math.ceil((audioDuration / VID001_PLAYBACK_RATE + 0.55) * VID001_FPS);
};

const Scene: React.FC<{
  image: string;
  caption: string;
  index: number;
}> = ({image, caption, index}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const entrance = spring({frame: frame - 3, fps, config: {damping: 18, stiffness: 120}});
  const zoom = interpolate(progress, [0, 1], [1.015, 1.095]);
  const pan = interpolate(progress, [0, 1], [index % 2 === 0 ? -0.8 : 0.8, index % 2 === 0 ? 0.8 : -0.8]);

  return (
    <AbsoluteFill style={{backgroundColor: '#08100F', overflow: 'hidden'}}>
      <Img
        src={staticFile(image)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${zoom}) translateX(${pan}%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(5, 11, 12, 0.03) 35%, rgba(5, 11, 12, 0.22) 56%, rgba(5, 11, 12, 0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          bottom: 205,
          color: '#FFFFFF',
          fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
          fontSize: 55,
          fontWeight: 750,
          lineHeight: 1.18,
          letterSpacing: -1.1,
          textShadow: '0 3px 22px rgba(0, 0, 0, 0.65)',
          opacity: interpolate(entrance, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(entrance, [0, 1], [22, 0])}px)`,
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
};

export const Vid001MirrorCheck: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const totalWeight = SCENES.reduce((sum, scene) => sum + scene.caption.length, 0);
  let consumedWeight = 0;

  const sequences = SCENES.map((scene, index) => {
    const from = Math.round((consumedWeight / totalWeight) * durationInFrames);
    consumedWeight += scene.caption.length;
    const to =
      index === SCENES.length - 1
        ? durationInFrames
        : Math.round((consumedWeight / totalWeight) * durationInFrames);

    return (
      <Sequence key={scene.image} from={from} durationInFrames={Math.max(1, to - from)}>
        <Scene image={scene.image} caption={scene.caption} index={index} />
      </Sequence>
    );
  });

  const overallProgress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#08100F'}}>
      <Audio src={staticFile(VID001_NARRATION)} playbackRate={VID001_PLAYBACK_RATE} />
      {sequences}
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          bottom: 112,
          height: 6,
          borderRadius: 999,
          backgroundColor: 'rgba(255, 255, 255, 0.28)',
        }}
      >
        <div
          style={{
            width: `${overallProgress}%`,
            height: '100%',
            borderRadius: 999,
            backgroundColor: '#91E2CC',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
