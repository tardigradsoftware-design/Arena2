import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const StudioIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const reveal = spring({
    frame: frame - 5,
    fps,
    config: {damping: 20, stiffness: 110, mass: 0.9},
  });
  const titleOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const drift = Math.sin((frame / fps) * Math.PI * 2) * 14;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#080D19',
        color: '#F4F1E8',
        fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 76% 42%, rgba(35, 93, 116, 0.34), transparent 42%), radial-gradient(ellipse at 16% 88%, rgba(118, 74, 175, 0.23), transparent 42%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 84,
          left: 112,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: 4,
          color: '#B6C7CE',
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor: '#8DE1CC',
            boxShadow: '0 0 24px rgba(141, 225, 204, 0.8)',
          }}
        />
        <span>ARENA MOTION LAB</span>
        <span style={{color: '#657783', fontWeight: 400}}> / 01</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 300,
          width: 1110,
          opacity: titleOpacity,
          transform: `translateY(${interpolate(reveal, [0, 1], [52, 0])}px)`,
        }}
      >
        <h1
          aria-label="Görseli harekete geçir."
          style={{
            margin: 0,
            fontSize: 112,
            lineHeight: 1.02,
            letterSpacing: -6,
            fontWeight: 650,
          }}
        >
          Görseli
          <br />
          <span style={{color: '#8DE1CC'}}>harekete geçir.</span>
        </h1>
        <p
          style={{
            margin: '34px 0 0',
            color: '#B2BEC5',
            fontSize: 28,
            lineHeight: 1.5,
            letterSpacing: 0.2,
          }}
        >
          Görsel, ses ve hareket tek bir zaman çizelgesinde.
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 230,
          top: 300,
          width: 350,
          height: 350,
          borderRadius: '50%',
          border: '1px solid rgba(141, 225, 204, 0.38)',
          transform: `translateY(${drift}px) rotate(${frame * 0.18}deg) scale(${interpolate(reveal, [0, 1], [0.78, 1])})`,
          boxShadow: '0 0 90px rgba(63, 195, 174, 0.12), inset 0 0 75px rgba(63, 195, 174, 0.08)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 29,
            borderRadius: '50%',
            border: '1px solid rgba(210, 232, 226, 0.2)',
            transform: `rotate(${-frame * 0.32}deg)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 76,
            height: 76,
            left: 58,
            top: 62,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #B4F4DE 0%, #4EAFB6 100%)',
            boxShadow: '0 0 52px rgba(110, 223, 201, 0.56)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 19,
            height: 19,
            right: 37,
            bottom: 94,
            borderRadius: '50%',
            backgroundColor: '#F3B778',
            boxShadow: '0 0 28px rgba(243, 183, 120, 0.72)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 1,
            height: 92,
            left: 177,
            top: -45,
            background: 'linear-gradient(transparent, rgba(141, 225, 204, 0.8), transparent)',
            transform: `rotate(${frame * 0.5}deg)`,
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 112,
          right: 112,
          bottom: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#788993',
          fontSize: 18,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        <span>REACT · REMOTION · FFMPEG</span>
        <span>30 FPS&nbsp;&nbsp; / &nbsp;&nbsp;1920 × 1080</span>
      </div>
    </AbsoluteFill>
  );
};
