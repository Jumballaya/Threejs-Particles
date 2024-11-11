import MersenneTwister from "mersennetwister";

const twister = new MersenneTwister();

export function random() {
  return twister.random();
}
