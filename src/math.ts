import * as THREE from "three";

import {
  ColorInterpolant,
  FloatInterpolant,
  Vec3Interpolant,
} from "./math/Interpolant";
import { random } from "./math/random";

const G = new THREE.Vector3(0, -9.8, 0);

export const math = {
  random,
  ColorInterpolant,
  Vec3Interpolant,
  FloatInterpolant,

  G,
};
