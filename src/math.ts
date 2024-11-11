import * as THREE from "three";

import {
  ColorInterpolant,
  FloatInterpolant,
  Vec3Interpolant,
} from "./math/Interpolant";
import { random } from "./math/random";
import { clamp, inverseLerp, lerp, remap, saturate } from "./math/functions";

const G = new THREE.Vector3(0, -9.8, 0);

export const math = {
  random,
  ColorInterpolant,
  Vec3Interpolant,
  FloatInterpolant,

  saturate,
  inverseLerp,
  remap,
  lerp,
  clamp,

  G,
};
