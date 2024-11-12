import * as THREE from "three";
import { shaders } from "./shaders";
import { math } from "./math";

export function createPopMaterial() {
  const loader = new THREE.TextureLoader();
  const starTexture = loader.load("./textures/star.png");

  const sizeOverLife = new math.FloatInterpolant([{ time: 0, value: 10 }]);

  const alphaOverLife = new math.FloatInterpolant([
    { time: 0, value: 0 },
    { time: 0.25, value: 1 },
    { time: 4.5, value: 1 },
    { time: 5, value: 0 },
  ]);

  const colorOverLife = new math.ColorInterpolant([
    { time: 0, value: new THREE.Color().setHSL(0, 1, 0.75) },
    { time: 2, value: new THREE.Color().setHSL(0.5, 1, 0.75) },
    { time: 4, value: new THREE.Color().setHSL(1, 1, 0.75) },
  ]);

  const twinkleOverLife = new math.FloatInterpolant([
    { time: 0, value: 0 },
    { time: 3, value: 1 },
    { time: 4, value: 1 },
  ]);

  return new THREE.ShaderMaterial({
    vertexShader: shaders.points.vertex,
    fragmentShader: shaders.points.fragment,
    uniforms: {
      time: {
        value: 0,
      },
      map: {
        value: starTexture,
      },
      sizeOverLife: {
        value: sizeOverLife.toTexture(),
      },
      colorOverLife: {
        value: colorOverLife.toTexture(alphaOverLife),
      },
      twinkleOverLife: {
        value: twinkleOverLife.toTexture(),
      },
      spinSpeed: {
        value: 0,
      },
    },
    depthWrite: false,
    depthTest: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
}

export function createTrailMaterial() {
  const loader = new THREE.TextureLoader();
  const starTexture = loader.load("./textures/smoke.png");

  const sizeOverLife = new math.FloatInterpolant([
    { time: 0, value: 4 },
    { time: 3, value: 8 },
    { time: 5, value: 10 },
  ]);

  const alphaOverLife = new math.FloatInterpolant([
    { time: 0, value: 0 },
    { time: 0.25, value: 1 },
    { time: 4.5, value: 1 },
    { time: 5, value: 0 },
  ]);

  const colorOverLife = new math.ColorInterpolant([
    { time: 0, value: new THREE.Color(0.05, 0.05, 0.05) },
    { time: 2, value: new THREE.Color(0.2, 0.2, 0.2) },
    { time: 4, value: new THREE.Color(0.4, 0.4, 0.4) },
  ]);

  const twinkleOverLife = new math.FloatInterpolant([{ time: 0, value: 0 }]);

  return new THREE.ShaderMaterial({
    vertexShader: shaders.points.vertex,
    fragmentShader: shaders.points.fragment,
    uniforms: {
      time: {
        value: 0,
      },
      map: {
        value: starTexture,
      },
      sizeOverLife: {
        value: sizeOverLife.toTexture(),
      },
      colorOverLife: {
        value: colorOverLife.toTexture(alphaOverLife),
      },
      twinkleOverLife: {
        value: twinkleOverLife.toTexture(),
      },
      spinSpeed: {
        value: 0,
      },
    },
    depthWrite: false,
    depthTest: true,
    transparent: true,
    blending: THREE.NormalBlending,
  });
}

export function createGroundMaterial() {
  const texture = new THREE.TextureLoader().load("/textures/whitesquare.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(500, 500);
  texture.anisotropy = 16;
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: texture,
    metalness: 0.5,
    roughness: 0.6,
  });
  return material;
}

export function createFireMaterial() {
  const loader = new THREE.TextureLoader();
  const starTexture = loader.load("./textures/fire.png");

  const sizeOverLife = new math.FloatInterpolant([
    { time: 0, value: 3 },
    { time: 0.25, value: 10 },
    { time: 2, value: 0 },
  ]);

  const alphaOverLife = new math.FloatInterpolant([
    { time: 0, value: 0 },
    { time: 0.5, value: 0.85 },
    { time: 6, value: 0 },
  ]);

  const colorOverLife = new math.ColorInterpolant([
    { time: 0, value: new THREE.Color(0xf8b867) },
    { time: 6, value: new THREE.Color(0xe8a831) },
  ]);

  const twinkleOverLife = new math.FloatInterpolant([
    { time: 0, value: 0.33 },
    { time: 3, value: 0.15 },
    { time: 4, value: 0.66 },
  ]);

  return new THREE.ShaderMaterial({
    vertexShader: shaders.points.vertex,
    fragmentShader: shaders.points.fragment,
    uniforms: {
      time: {
        value: 0,
      },
      map: {
        value: starTexture,
      },
      sizeOverLife: {
        value: sizeOverLife.toTexture(),
      },
      colorOverLife: {
        value: colorOverLife.toTexture(alphaOverLife),
      },
      twinkleOverLife: {
        value: twinkleOverLife.toTexture(),
      },
      spinSpeed: {
        value: 0,
      },
      lightFactor: { value: 0 },
      lightIntesity: { value: 1 },
    },
    depthWrite: false,
    depthTest: true,
    transparent: true,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
  });
}

export function createSmokeMaterial() {
  const loader = new THREE.TextureLoader();
  const starTexture = loader.load("./textures/smoke.png");

  const sizeOverLife = new math.FloatInterpolant([
    { time: 0, value: 8 },
    { time: 6, value: 24 },
  ]);

  const alphaOverLife = new math.FloatInterpolant([
    { time: 0, value: 0 },
    { time: 1, value: 0.75 },
    { time: 6, value: 0 },
  ]);

  const colorOverLife = new math.ColorInterpolant([
    { time: 0, value: new THREE.Color(0xc0c0c0) },
    { time: 2, value: new THREE.Color(0x404040) },
  ]);

  const twinkleOverLife = new math.FloatInterpolant([{ time: 0, value: 0 }]);

  return new THREE.ShaderMaterial({
    vertexShader: shaders.points.vertex,
    fragmentShader: shaders.points.fragment,
    uniforms: {
      time: {
        value: 0,
      },
      map: {
        value: starTexture,
      },
      sizeOverLife: {
        value: sizeOverLife.toTexture(),
      },
      colorOverLife: {
        value: colorOverLife.toTexture(alphaOverLife),
      },
      twinkleOverLife: {
        value: twinkleOverLife.toTexture(),
      },
      spinSpeed: {
        value: 0,
      },
      lightFactor: { value: 1 },
      lightIntesity: { value: 4 },
    },
    depthWrite: false,
    depthTest: true,
    transparent: true,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
  });
}
