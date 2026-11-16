// main.ts - Entry point: wires up every interactive behaviour once the DOM is ready.
import { initStack } from './stack';
import { initTilt } from './tilt';
import { initButtons } from './buttons';
import { initPalette } from './palette';
import { initBelt } from './belt';
import { initMeters } from './meters';
import { initClock } from './clock';
import { initCopy } from './copy';
import { initNavSpy } from './navspy';
import { initGithub } from './github';

const env = {
  finePointer: matchMedia('(hover: hover) and (pointer: fine)').matches,
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
};

export type Env = typeof env;

initStack(env);
initBelt(env);
initTilt(env);
initButtons(env);
initPalette();
initMeters(env);
initClock();
initCopy();
initNavSpy();
initGithub(env);
