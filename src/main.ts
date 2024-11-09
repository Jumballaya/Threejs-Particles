import * as THREE from "three";
import { Pane } from "tweakpane";
import { App } from "./App";
import "./style.css";

class ParticleSystemApp extends App {
  constructor() {
    super();
  }

  async onSetupProject(pane: Pane) {
    this.loadRGBE("/skybox/moonless_golf_2k.hdr");

    this.createPointsParticleSystem();
  }

  onStep(delta: number, elapse: number) {}

  private createPointsParticleSystem() {
    const loader = new THREE.TextureLoader();
    const starTexture = loader.load("./textures/star.png");

    const geo = new THREE.BufferGeometry();

    const positions = [];

    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() * 2 - 1) * 100;
      const y = (Math.random() * 2 - 1) * 100;
      const z = (Math.random() * 2 - 1) * 100;
      positions.push(x, y, z);
    }

    positions.push(0, 0, 0);

    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 10,
      sizeAttenuation: true,
      map: starTexture,
      depthWrite: false,
      depthTest: true,
      transparent: true,
      blending: THREE.NormalBlending,
    });
    const particles = new THREE.Points(geo, material);

    this.Scene.add(particles);
  }
}

async function main() {
  const app = new ParticleSystemApp();
  await app.initialize();

  const loop = () => {
    app.step();
    requestAnimationFrame(loop);
  };
  loop();
}
main();
