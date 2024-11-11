
attribute vec2 particleData; // [ id, life ]

varying vec4 v_color;
varying float v_angle;

uniform float time;
uniform sampler2D sizeOverLife;
uniform sampler2D colorOverLife;
uniform sampler2D twinkleOverLife;
uniform float spinSpeed;

void main() {
  float id = particleData.x;
  float life = particleData.y;
  float size = texture2D(sizeOverLife, vec2(life, 0.5)).x;
  vec4 color = texture2D(colorOverLife, vec2(life, 0.5));
  float twinkle = texture2D(twinkleOverLife, vec2(life, 0.5)).x;
  twinkle = mix(1.0, sin(time * 20.0 + id * 6.28) * 0.5 + 0.5, twinkle);
  
  vec3 mvPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * vec4(mvPosition, 1.0);
  gl_PointSize = size * 300.0 / -mvPosition.z;

  v_color = color;
  v_color.a *= twinkle;
  v_angle = spinSpeed * time + id * 6.28;
}