import * as THREE from "three";
import { math } from "../math";
import { Particle } from "./Particle";
import { ParticleRenderer } from "./ParticleRenderer";
import { EmitterShape, PointEmitterShape } from "./EmitterShape";
import { ParticleAttractor } from "./ParticleAttractor";

export type EmitterParams = {
  maxParticles: number;
  maxLife: number;
  maxEmission: number;
  emissionRate: number;
  velocityMagnitude: number;
  rotation: THREE.Quaternion;
  angularVariance: number;
  velocityVariance: number;
  gravity: boolean;
  drag: number;
  spinSpeed: number;
  shape: EmitterShape;
  attractors: ParticleAttractor[];
};

export const defaultEmitterParams: () => EmitterParams = () => ({
  maxLife: 5,
  maxParticles: 100,
  maxEmission: 100,
  emissionRate: 1,
  velocityMagnitude: 10,
  rotation: new THREE.Quaternion(),
  angularVariance: 0,
  gravity: false,
  drag: 0.1,
  spinSpeed: 0,
  velocityVariance: 0,
  shape: new PointEmitterShape(),
  attractors: [],
});

type EmitterCallback = (p: Particle) => void;
type EmitterCallbackMap = {
  onCreated: Array<EmitterCallback>;
  onStep: Array<EmitterCallback>;
  onDestroy: Array<EmitterCallback>;
};

export class ParticleEmitter {
  private particles: Particle[] = [];
  private emissionTime = 0;
  private numParticlesEmitted = 0;

  private params: EmitterParams;
  private renderer?: ParticleRenderer;

  private dead = false;

  private callbacks: EmitterCallbackMap = {
    onCreated: [],
    onStep: [],
    onDestroy: [],
  };

  constructor(params = defaultEmitterParams(), renderer?: ParticleRenderer) {
    this.params = params;
    if (renderer) {
      this.renderer = renderer;
    }
  }

  public get shape(): EmitterShape {
    return this.params.shape;
  }

  public get active(): boolean {
    const stillCanEmit = this.numParticlesEmitted < this.params.maxEmission;
    const stillHasLiveParticles = this.particles.length > 0;
    const notDead = !this.dead;
    return (stillCanEmit || stillHasLiveParticles) && notDead;
  }

  public kill(): void {
    this.dead = true;
  }

  public stop(): void {
    this.params.maxEmission = 0;
  }

  public step(deltaTime: number, elapsed: number): void {
    this.updateEmission(deltaTime);
    this.updateParticles(deltaTime);

    this.renderer?.updateFromParticles(this.particles, elapsed);
  }

  public dispose() {
    for (const p of this.particles) {
      this.emitEvent("onDestroy", p);
    }
    this.particles = [];
    this.renderer?.dispose();
  }

  public addEventListener(
    type: keyof EmitterCallbackMap,
    listener: EmitterCallback
  ) {
    this.callbacks[type].push(listener);
  }

  private updateEmission(deltaTime: number): void {
    if (this.dead) return;

    this.emissionTime += deltaTime;
    const secondsPerParticle = 1 / this.params.emissionRate;

    while (this.canCreateParticle()) {
      this.emissionTime -= secondsPerParticle;
      this.numParticlesEmitted++;
      const particle = this.emitParticle();
      this.particles.push(particle);
    }
  }

  private updateParticles(deltaTime: number): void {
    const livingParticles: Particle[] = [];
    for (const p of this.particles) {
      this.updateParticle(p, deltaTime);
      if (p.life < p.maxLife && !this.dead) {
        livingParticles.push(p);
      } else {
        this.emitEvent("onDestroy", p);
      }
    }

    this.particles = livingParticles;
  }

  private updateParticle(p: Particle, deltaTime: number): void {
    p.life += deltaTime;
    p.life = Math.min(p.life, p.maxLife);

    // physics update

    const forces = p.velocity.clone().multiplyScalar(-this.params.drag);
    if (this.params.gravity) {
      forces.add(math.G);
    }
    forces.add(p.velocity.clone().multiplyScalar(-this.params.drag));

    for (const attractor of this.params.attractors) {
      const dir = attractor.position.clone().sub(p.position);
      const dist = dir.length();
      dir.normalize();
      const attractorForce =
        attractor.intensity / (1 + (dist / attractor.radius) ** 2);
      forces.add(dir.multiplyScalar(attractorForce));
    }

    p.velocity.add(forces.multiplyScalar(deltaTime));
    const displacement = p.velocity.clone().multiplyScalar(deltaTime);
    p.position.add(displacement);
    this.emitEvent("onStep", p);
  }

  private canCreateParticle(): boolean {
    const secondsPerParticle = 1 / this.params.emissionRate;
    const haveTime = this.emissionTime >= secondsPerParticle;
    const haveCapacity = this.particles.length < this.params.maxParticles;
    const haveParticles = this.numParticlesEmitted < this.params.maxEmission;
    const notDead = !this.dead;

    return haveTime && haveCapacity && haveParticles && notDead;
  }

  private emitParticle(): Particle {
    const p = this.params.shape.emit();
    p.maxLife = this.params.maxLife;

    const phi = math.random() * Math.PI * 2;
    const theta = math.random() * this.params.angularVariance;
    p.velocity.set(
      Math.sin(theta) * Math.cos(phi),
      Math.cos(theta),
      Math.sin(theta) * Math.sin(phi)
    );

    const velocity =
      this.params.velocityMagnitude +
      (math.random() * 2 - 1) * this.params.velocityVariance;

    p.velocity.multiplyScalar(velocity);
    p.velocity.applyQuaternion(this.params.rotation);

    this.emitEvent("onCreated", p);

    return p;
  }

  private emitEvent(type: keyof EmitterCallbackMap, particle: Particle) {
    for (const listener of this.callbacks[type]) {
      listener(particle);
    }
  }
}
