import * as THREE from "three";
import { defaultParticle } from "./Particle";
import { math } from "../math";

export class EmitterShape {
  public position = new THREE.Vector3();

  constructor() {}

  public emit() {
    return defaultParticle();
  }
}

export class PointEmitterShape extends EmitterShape {
  public positionRadiusVariance = 0;

  constructor() {
    super();
  }

  public emit() {
    const p = defaultParticle();
    p.position.copy(this.position);

    const phi = math.random() * Math.PI * 2;
    const theta = math.random() * Math.PI;
    const radius = math.random() * this.positionRadiusVariance;

    const dir = new THREE.Vector3(
      Math.sin(theta) * Math.cos(phi),
      Math.cos(theta),
      Math.sin(theta) * Math.sin(phi)
    );
    dir.multiplyScalar(radius);
    p.position.add(dir);

    return p;
  }
}
