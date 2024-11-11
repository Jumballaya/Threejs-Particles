import * as THREE from "three";
import { defaultParticle } from "./Particle";

export class EmitterShape {
  public position = new THREE.Vector3();

  constructor() {}

  public emit() {
    return defaultParticle();
  }
}

export class PointEmitterShape extends EmitterShape {
  constructor() {
    super();
  }

  public emit() {
    const p = defaultParticle();
    p.position.copy(this.position);
    return p;
  }
}
