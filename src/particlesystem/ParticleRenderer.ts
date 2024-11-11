import * as THREE from "three";
import { Float32BufferAttribute } from "three";
import { defaultEmitterParams, EmitterParams } from "./ParticleEmitter";
import { Particle } from "./Particle";

export type ParticleRendererParams = {
  material: THREE.ShaderMaterial;
  group: THREE.Group;
  emitter: EmitterParams;
};

export class ParticleRenderer {
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private emitterParams = defaultEmitterParams();
  private group: THREE.Group | null = null;

  constructor(params: ParticleRendererParams) {
    const { material, group, emitter } = params;
    this.geometry = new THREE.BufferGeometry();
    this.material = material;
    this.emitterParams = emitter;

    const pos = new Float32Array(emitter.maxParticles * 3);
    const particleData = new Float32Array(emitter.maxParticles * 2);

    const posAttrib = new Float32BufferAttribute(pos, 3);
    const pDataAttrib = new Float32BufferAttribute(particleData, 2);
    this.geometry.setAttribute("position", posAttrib);
    this.geometry.setAttribute("particleData", pDataAttrib);
    posAttrib.setUsage(THREE.DynamicDrawUsage);
    pDataAttrib.setUsage(THREE.DynamicDrawUsage);

    const particles = new THREE.Points(this.geometry, material);

    group.add(particles);
  }

  public updateFromParticles(particles: Particle[], time: number) {
    if (!this.geometry || !this.material) return;

    const pos = new Float32Array(particles.length * 3);
    const particleData = new Float32Array(particles.length * 2);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      pos[i * 3 + 0] = p.position.x;
      pos[i * 3 + 1] = p.position.y;
      pos[i * 3 + 2] = p.position.z;
      particleData[i * 2 + 0] = p.id;
      particleData[i * 2 + 1] = p.life / p.maxLife;
    }

    const posAttrib = new Float32BufferAttribute(pos, 3);
    const pDataAttrib = new Float32BufferAttribute(particleData, 2);
    this.geometry.setAttribute("position", posAttrib);
    this.geometry.setAttribute("particleData", pDataAttrib);

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.particleData.needsUpdate = true;

    this.geometry.setDrawRange(0, particles.length);

    this.material.uniforms.time.value = time;
    this.material.uniforms.spinSpeed.value = this.emitterParams.spinSpeed;
  }

  public dispose() {
    this.group?.removeFromParent();
    this.geometry?.dispose();
    this.material?.dispose();

    this.group = null;
    this.geometry = null;
    this.material = null;
  }
}
