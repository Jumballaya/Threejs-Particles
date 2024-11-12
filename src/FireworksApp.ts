import * as THREE from "three";
import { App } from "./App";
import { ParticleSystem } from "./particlesystem/ParticleSystem";
import { ParticleEmitter } from "./particlesystem/ParticleEmitter";
import { PointEmitterShape } from "./particlesystem/EmitterShape";
import { FolderApi } from "tweakpane";
import { Particle } from "./particlesystem/Particle";
import { createPopMaterial, createTrailMaterial } from "./materials";
import { ParticleRenderer } from "./particlesystem/ParticleRenderer";

export class FireworksApp extends App {
  private particleSystem: ParticleSystem | null = null;

  private popMaterial: THREE.ShaderMaterial;
  private trailMaterial: THREE.ShaderMaterial;

  constructor() {
    super();
    this.popMaterial = createPopMaterial();
    this.trailMaterial = createTrailMaterial();
    this.Camera.position.set(100, 0, 100);
    this.Camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  async onSetupProject(_: FolderApi) {
    this.loadRGBE("/skybox/moonless_golf_2k.hdr");
    this.createTrailParticleSystem();
  }

  createTrailParticleSystem() {
    this.particleSystem = new ParticleSystem();
    const trailEmitterParams = {
      maxLife: 4,
      maxEmission: 5000,
      maxParticles: 5000,
      emissionRate: 1,
      gravity: true,
      shape: new PointEmitterShape(),

      velocityMagnitude: 150,
      velocityVariance: 10,
      rotation: new THREE.Quaternion(),
      angularVariance: Math.PI / 8,
      drag: 0.1,
      spinSpeed: Math.PI,
      attractors: [],
    };
    const trailEmitter = new ParticleEmitter(trailEmitterParams);

    trailEmitter.addEventListener("onCreated", (p: Particle) => {
      const smokeEmitterGroup = new THREE.Group();
      const smokeEmitterParams = {
        maxLife: 2,
        maxEmission: Number.MAX_SAFE_INTEGER,
        maxParticles: 500,
        emissionRate: 50,
        gravity: false,
        shape: new PointEmitterShape(),
        velocityMagnitude: 0,
        velocityVariance: 0,
        rotation: new THREE.Quaternion(),
        angularVariance: 0,
        drag: 0.1,
        spinSpeed: Math.PI / 8,
        attractors: [],
      };
      const smokeEmitter = new ParticleEmitter(
        smokeEmitterParams,
        new ParticleRenderer({
          group: smokeEmitterGroup,
          material: this.trailMaterial,
          emitter: smokeEmitterParams,
        })
      );
      this.particleSystem?.addEmitter(smokeEmitter);

      this.Scene.add(smokeEmitterGroup);

      p.attachedEmitter = smokeEmitter;
    });

    trailEmitter.addEventListener("onStep", (p: Particle) => {
      p.attachedEmitter?.shape.position.copy(p.position);
    });

    trailEmitter.addEventListener("onDestroy", (p: Particle) => {
      p.attachedEmitter?.stop();
      this.createPopParticleSystem(p.position);
    });

    this.particleSystem.addEmitter(trailEmitter);
  }

  createPopParticleSystem(position: THREE.Vector3) {
    if (!this.particleSystem) {
      this.particleSystem = new ParticleSystem();
    }
    const popEmitterGroup = new THREE.Group();
    const popEmitterParams = {
      maxLife: 5,
      maxEmission: 500,
      maxParticles: 500,
      emissionRate: 2000,
      gravity: true,
      shape: new PointEmitterShape(),

      velocityMagnitude: 100,
      velocityVariance: 10,
      rotation: new THREE.Quaternion(),
      angularVariance: 2 * Math.PI,
      drag: 1,
      spinSpeed: Math.PI,
      attractors: [],
    };
    const popEmitter = new ParticleEmitter(
      popEmitterParams,
      new ParticleRenderer({
        group: popEmitterGroup,
        emitter: popEmitterParams,
        material: this.popMaterial,
      })
    );
    popEmitter.shape.position.copy(position);
    this.particleSystem.addEmitter(popEmitter);
    this.Scene.add(popEmitterGroup);
  }

  onStep(delta: number, elapsed: number) {
    if (!this.particleSystem) return;

    this.particleSystem.step(delta, elapsed);
    if (!this.particleSystem.active) {
      this.particleSystem.dispose();
      this.particleSystem = null;
    }
  }
}
