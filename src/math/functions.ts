export function saturate(v: number): number {
  return clamp(v, 0, 1);
}

export function inverseLerp(a: number, b: number, v: number): number {
  return saturate((v - a) / (b - a));
}

export function remap(
  a: number,
  b: number,
  c: number,
  d: number,
  v: number
): number {
  return c + (d - c) * inverseLerp(a, b, v);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}
