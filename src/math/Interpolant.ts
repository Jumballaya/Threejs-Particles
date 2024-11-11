import * as THREE from "three";

type InterpolantFrame<T> = {
  time: number;
  value: T;
};

function isIterator(v: any): v is Iterable<any> {
  return typeof v[Symbol.iterator] === "function";
}

class Interpolant<T = number> {
  protected frames: InterpolantFrame<T>[];
  private interpolant: THREE.Interpolant;
  private resultBuffer: Float32Array;

  constructor(frames: InterpolantFrame<T>[], stride: number) {
    const times: number[] = [];
    const values: number[] = [];

    for (let i = 0; i < frames.length; i++) {
      times.push(frames[i].time);
      const value = frames[i].value;
      if (typeof value === "number") {
        values.push(value);
      } else if (isIterator(value)) {
        values.push(...value);
      }
    }

    this.resultBuffer = new Float32Array(stride);

    this.frames = frames;
    this.interpolant = new THREE.LinearInterpolant(
      times,
      values,
      stride,
      this.resultBuffer
    );
  }

  public get Frames() {
    return this.frames;
  }

  public evaluate(time: number) {
    this.interpolant.evaluate(time);
    return this.onEvaluate(this.resultBuffer);
  }

  public toTexture(_: FloatInterpolant): THREE.DataTexture {
    return new THREE.DataTexture();
  }

  protected onEvaluate(_: Float32Array): T {
    return this.frames[0].value;
  }
}

export class Vec3Interpolant extends Interpolant<THREE.Vector3> {
  constructor(frames: InterpolantFrame<THREE.Vector3>[]) {
    super(frames, 3);
  }

  onEvaluate(result: Float32Array): THREE.Vector3 {
    return new THREE.Vector3(result[0], result[1], result[2]);
  }
}

export class FloatInterpolant extends Interpolant<number> {
  constructor(frames: InterpolantFrame<number>[]) {
    super(frames, 1);
  }

  protected override onEvaluate(result: Float32Array): number {
    return result[0];
  }

  public override toTexture(): THREE.DataTexture {
    const frames = this.frames;
    const maxFrameTime = frames[frames.length - 1].time;

    let smallestStep = 0.5;
    for (let i = 1; i < frames.length; i++) {
      const stepSize = (frames[i].time - frames[i - 1].time) / maxFrameTime;
      smallestStep = Math.min(smallestStep, stepSize);
    }

    const width = Math.ceil(1 / smallestStep) + 1;
    const data = new Float32Array(width);

    for (let i = 0; i < width; i++) {
      const t = i / (width - 1);
      const value = this.evaluate(t * maxFrameTime);
      data[i] = value;
    }

    const texture = new THREE.DataTexture(
      data,
      width,
      1,
      THREE.RedFormat,
      THREE.FloatType
    );
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }
}

export class ColorInterpolant extends Interpolant<THREE.Color> {
  constructor(frames: InterpolantFrame<THREE.Color>[]) {
    super(frames, 3);
  }

  onEvaluate(result: Float32Array): THREE.Color {
    return new THREE.Color(result[0], result[1], result[2]);
  }

  public override toTexture(
    alphaInterpolant: FloatInterpolant
  ): THREE.DataTexture {
    const frames = this.frames;
    const alphaFrames = alphaInterpolant.Frames;

    const maxFrameTime = Math.max(
      frames[frames.length - 1].time,
      alphaFrames[alphaFrames.length - 1].time
    );

    let smallestStep = 0.5;
    for (let i = 1; i < frames.length; i++) {
      const stepSize = (frames[i].time - frames[i - 1].time) / maxFrameTime;
      smallestStep = Math.min(smallestStep, stepSize);
    }

    for (let i = 1; i < alphaFrames.length; i++) {
      const stepSize =
        (alphaFrames[i].time - alphaFrames[i - 1].time) / maxFrameTime;
      smallestStep = Math.min(smallestStep, stepSize);
    }

    const stride = 4;
    const width = Math.ceil(1 / smallestStep) + 1;
    const data = new Float32Array(width * stride); // width * stride

    for (let i = 0; i < width; i++) {
      const t = i / (width - 1);
      const color = this.evaluate(t * maxFrameTime);
      const alpha = alphaInterpolant.evaluate(t * maxFrameTime);
      data[i * stride + 0] = color.r;
      data[i * stride + 1] = color.g;
      data[i * stride + 2] = color.b;
      data[i * stride + 3] = alpha;
    }

    const texture = new THREE.DataTexture(
      data,
      width,
      1,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }
}
