import * as THREE from "three";
import { math } from "../math";
import { ParticleEmitter } from "./ParticleEmitter";
export type Particle = {
  id: number;
  life: number;
  maxLife: number;
  angle: number;
  size: number;
  alpha: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  attachedEmitter?: ParticleEmitter;
};

export const defaultParticle: () => Particle = () => ({
  id: math.random(),
  life: 0,
  maxLife: 5,
  angle: 0,
  size: 1,
  alpha: 1,
  position: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  color: new THREE.Color(1, 1, 1),
  attachedEmitter: undefined,
});
