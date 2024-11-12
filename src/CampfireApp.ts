import * as THREE from "three";
import { App } from "./App";
import { ParticleSystem } from "./particlesystem/ParticleSystem";
import { FolderApi } from "tweakpane";
import {
  createFireMaterial,
  createGroundMaterial,
  createSmokeMaterial,
} from "./materials";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import {
  EmitterParams,
  ParticleEmitter,
} from "./particlesystem/ParticleEmitter";
import { PointEmitterShape } from "./particlesystem/EmitterShape";
import { ParticleRenderer } from "./particlesystem/ParticleRenderer";
import { ParticleAttractor } from "./particlesystem/ParticleAttractor";
import { math } from "./math";
import { noise1D } from "./math/random";

export class CampfireApp extends App {
  private particleSystem: ParticleSystem | null = null;

  private campfireLight = new THREE.PointLight(0xf8b867, 100);

  private smokeMaterial?: THREE.ShaderMaterial;

  constructor() {
    super();
    this.Camera.position.set(5, 5, 5);
    this.Camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.Scene.environmentIntensity = 0.05;
    this.Scene.backgroundIntensity = 0.05;
  }

  async onSetupProject(_: FolderApi) {
    this.loadRGBE("/skybox/moonless_golf_2k.hdr");
    this.createScene();
    this.createParticleSystem();
  }

  onStep(delta: number, elapsed: number) {
    if (!this.particleSystem) return;

    this.particleSystem.step(delta, elapsed);
    if (!this.particleSystem.active) {
      this.particleSystem.dispose();
      this.particleSystem = null;
    }

    if (this.campfireLight && this.smokeMaterial) {
      const noise = noise1D(elapsed * 1.5);
      const flicker = math.remap(-1, 1, 15, 25, noise);
      this.campfireLight.intensity = flicker;
      this.smokeMaterial.uniforms.lightIntesity.value = math.remap(
        -1,
        1,
        0.75,
        2,
        noise
      );
    }
  }

  private createParticleSystem() {
    this.particleSystem = new ParticleSystem();

    // Fire
    const fireEmitterGroup = new THREE.Group();
    const fireEmitterShape = new PointEmitterShape();
    fireEmitterShape.positionRadiusVariance = 1;
    const fireEmitterParams: EmitterParams = {
      maxLife: 2,
      maxEmission: Number.MAX_SAFE_INTEGER,
      maxParticles: 100,
      emissionRate: 30,
      gravity: false,
      shape: fireEmitterShape,
      velocityMagnitude: 4,
      velocityVariance: 3,
      rotation: new THREE.Quaternion(),
      angularVariance: Math.PI / 6,
      drag: 0.1,
      spinSpeed: 0,
      attractors: [],
    };
    const fireRenderer = new ParticleRenderer({
      group: fireEmitterGroup,
      material: createFireMaterial(),
      emitter: fireEmitterParams,
    });
    const fireAttractor = new ParticleAttractor();
    fireAttractor.position.set(0, 8, 0);
    fireAttractor.intensity = 15;
    fireAttractor.radius = 4;
    fireEmitterParams.attractors.push(fireAttractor);

    const fireEmitter = new ParticleEmitter(fireEmitterParams, fireRenderer);
    this.particleSystem.addEmitter(fireEmitter);
    this.Scene.add(fireEmitterGroup);

    // Smoke
    const smokeEmitterGroup = new THREE.Group();
    const smokeEmitterShape = new PointEmitterShape();
    smokeEmitterShape.positionRadiusVariance = 1;
    smokeEmitterShape.position.set(0, 8, 0);
    const smokeEmitterParams: EmitterParams = {
      maxLife: 6,
      maxEmission: Number.MAX_SAFE_INTEGER,
      maxParticles: 200,
      emissionRate: 20,
      gravity: false,
      shape: smokeEmitterShape,
      velocityMagnitude: 4,
      velocityVariance: 0,
      rotation: new THREE.Quaternion(),
      angularVariance: Math.PI / 8,
      drag: 0.25,
      spinSpeed: 0,
      attractors: [],
    };
    const smokeMaterial = createSmokeMaterial();
    const smokeRenderer = new ParticleRenderer({
      group: smokeEmitterGroup,
      material: smokeMaterial,
      emitter: smokeEmitterParams,
    });

    const smokeEmitter = new ParticleEmitter(smokeEmitterParams, smokeRenderer);
    this.particleSystem.addEmitter(smokeEmitter);
    this.Scene.add(smokeEmitterGroup);
    this.smokeMaterial = smokeMaterial;
  }

  private createScene() {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMesh = new THREE.Mesh(groundGeometry, createGroundMaterial());
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    this.Scene.add(groundMesh);

    const glbLoader = new GLTFLoader();
    glbLoader.load("/models/tree1.glb", (gltf) => {
      gltf.scene.traverse((c) => {
        c.castShadow = true;
        c.receiveShadow = true;
        if (c instanceof THREE.Mesh) {
          c.material.side = THREE.FrontSide;
        }
      });
      gltf.scene.scale.setScalar(0.25);

      const positions = [
        new THREE.Vector3(-15, 0, 0),
        new THREE.Vector3(-20, 0, 10),
      ];
      for (const pos of positions) {
        const tree = gltf.scene.clone();
        tree.position.copy(pos);
        this.Scene.add(tree);
      }
    });

    glbLoader.load("/models/tree2.glb", (gltf) => {
      gltf.scene.traverse((c) => {
        c.castShadow = true;
        c.receiveShadow = true;
        if (c instanceof THREE.Mesh) {
          c.material.side = THREE.FrontSide;
        }
      });
      gltf.scene.scale.setScalar(0.25);

      const positions = [
        new THREE.Vector3(-15, 0, 12),
        new THREE.Vector3(20, 0, 15),
      ];
      for (const pos of positions) {
        const tree = gltf.scene.clone();
        tree.position.copy(pos);
        this.Scene.add(tree);
      }
    });

    glbLoader.load("/models/campfire-logs.glb", (gltf) => {
      gltf.scene.traverse((c) => {
        c.castShadow = true;
        c.receiveShadow = true;
        if (c instanceof THREE.Mesh) {
          c.material.side = THREE.FrontSide;
        }
      });
      gltf.scene.position.y += 0.225;
      this.Scene.add(gltf.scene);
    });

    this.campfireLight.position.set(0, 4, 0);
    this.campfireLight.castShadow = true;
    this.campfireLight.shadow.mapSize.set(1024, 1024);
    this.Scene.add(this.campfireLight);
  }
}
