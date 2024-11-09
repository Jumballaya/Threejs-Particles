import pointsVertex from "./shaders/points/vertex.glsl?raw";
import pointsFragment from "./shaders/points/fragment.glsl?raw";

export const shaders: Record<string, { vertex: string; fragment: string }> = {
  points: {
    vertex: pointsVertex,
    fragment: pointsFragment,
  },
};
