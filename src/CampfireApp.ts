import * as THREE from "three";
import { App } from "./App";
import { ParticleSystem } from "./particlesystem/ParticleSystem";
import { FolderApi } from "tweakpane";
import { groundMaterial } from "./materials";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class CampfireApp extends App {
  private particleSystem: ParticleSystem | null = null;

  private campfireLight = new THREE.PointLight(0xf8b867, 100);

  constructor() {
    super();
    this.Camera.position.set(5, 5, 5);
    this.Camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.Scene.environmentIntensity = 0.05;
  }

  async onSetupProject(_: FolderApi) {
    this.loadRGBE("/skybox/moonless_golf_2k.hdr");
    this.createScene();
  }

  onStep(delta: number, elapsed: number) {
    if (!this.particleSystem) return;

    this.particleSystem.step(delta, elapsed);
    if (!this.particleSystem.active) {
      this.particleSystem.dispose();
      this.particleSystem = null;
    }
  }

  private createScene() {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial());
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    this.Scene.add(groundMesh);

    const glbLoader = new GLTFLoader();
    glbLoader.load("/models/tree1.glb", (gltf) => {
      gltf.scene.traverse((c) => {
        c.castShadow = true;
        c.receiveShadow = true;
        if (c instanceof THREE.Mesh) {
          c.material.side = THREE.BackSide;
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

    const helper = new THREE.PointLightHelper(this.campfireLight);
    this.Scene.add(helper);
  }
}
