
uniform sampler2D map;
uniform float lightFactor;
uniform float lightIntesity;

varying float v_angle;
varying vec4 v_color;
varying vec3 v_worldPosition;

void main() {
  vec2 uv = gl_PointCoord.xy;

  float x = uv.x - 0.5;
  float y = uv.y - 0.5;
  float z = sqrt(1.0 - x * x - y * y);
  vec3 normal = normalize(vec3(x, y, z * 0.5));

  // lighting
  vec3 lightPos = vec3(0.0, 4.0, 0.0);
  lightPos = (viewMatrix * vec4(lightPos, 1.0)).xyz;
  vec3 viewPos = (viewMatrix * vec4(v_worldPosition, 1.0)).xyz;
  vec3 lightDir = normalize(lightPos - viewPos);
  lightDir.y = -lightDir.y;
  float lightDP = max(dot(normal, lightDir), 0.0);

  // light falloff
  float falloff = smoothstep(8.0, 12.0, length(lightPos - viewPos));
  vec3 lightColorMix = mix(vec3(1.0, 0.6, 0.2), vec3(1.0), falloff);

  float c = cos(v_angle);
  float s = sin(v_angle);
  mat2 r = mat2(c, s, -s, c);

  uv = (uv - 0.5) * r + 0.5;
  vec4 texel = texture2D(map, uv);
  vec4 finalColor = v_color * texel;
  finalColor.rgb *= mix(vec3(1.0), lightDP * lightColorMix * lightIntesity, lightFactor);
  finalColor.rgb *= finalColor.a;
  finalColor.a *= mix(0.0, falloff, lightFactor);

  gl_FragColor = finalColor;
}