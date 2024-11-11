import { ParticleEmitter } from "./ParticleEmitter";

export class ParticleSystem {
  private emitters: ParticleEmitter[] = [];

  constructor() {}

  public get active(): boolean {
    let active = true;
    for (const emitter of this.emitters) {
      active &&= emitter.active;
    }
    return active;
  }

  public addEmitter(emitter: ParticleEmitter) {
    this.emitters.push(emitter);
  }

  public step(deltaTime: number, elapsedTime: number) {
    const emitters: ParticleEmitter[] = [];
    for (const emitter of this.emitters) {
      emitter.step(deltaTime, elapsedTime);
      if (emitter.active) {
        emitters.push(emitter);
      } else {
        emitter.dispose();
      }
    }
    this.emitters = emitters;
  }

  public dispose() {
    for (const emitter of this.emitters) {
      emitter.dispose();
    }
  }
}
