import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {StudioIntro} from './compositions/StudioIntro';
import {INTRO_SPEC} from './compositions/metadata';
import './preview.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <main className="preview-shell">
      <Player
        component={StudioIntro}
        durationInFrames={INTRO_SPEC.durationInFrames}
        fps={INTRO_SPEC.fps}
        compositionWidth={INTRO_SPEC.width}
        compositionHeight={INTRO_SPEC.height}
        initialFrame={32}
        controls
        loop
        style={{width: '100%', height: '100%'}}
      />
    </main>
  </StrictMode>,
);
