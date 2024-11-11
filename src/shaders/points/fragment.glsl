
uniform sampler2D map;

varying float v_angle;
varying vec4 v_color;

void main() {
  vec2 uv = gl_PointCoord.xy;
  float c = cos(v_angle);
  float s = sin(v_angle);
  mat2 r = mat2(c, s, -s, c);

  uv = (uv - 0.5) * r + 0.5;

  vec4 texel = texture2D(map, uv);
  gl_FragColor = texel * v_color;
}