import MersenneTwister from "mersennetwister";
import { createNoise2D } from "simplex-noise";

const twister = new MersenneTwister();

export function random() {
  return twister.random();
}

const n2d_gen = createNoise2D();
export function noise2D(x: number, y: number) {
  return n2d_gen(x, y);
}

export function noise1D(x: number) {
  return n2d_gen(x, x);
}
