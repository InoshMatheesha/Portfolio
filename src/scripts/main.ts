// main.ts - Entry point: wires up every interactive behaviour once the DOM is ready.
import { initStack } from './stack';
import { initTilt } from './tilt';
import { initButtons } from './buttons';
import { initPalette } from './palette';
import { initFilter } from './filter';
import { initMeters } from './meters';
import { initClock } from './clock';
import { initCopy } from './copy';
import { initNavSpy } from './navspy';

const env = {
  finePointer: matchMedia('(hover: hover) and (pointer: fine)').matches,
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
};

export type Env = typeof env;

initStack(env);
initTilt(env);
initButtons(env);
initPalette();
initFilter(env);
initMeters(env);
initClock();
initCopy();
initNavSpy();
