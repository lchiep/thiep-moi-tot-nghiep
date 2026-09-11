import * as THREE from "three";

/**
 * A rectangular plane with a gentle outward curl along the bottom edge,
 * so the "unrolled" invitation paper still reads as paper that was just
 * taken out of a rolled tube rather than a perfectly flat card.
 */
export function createCurvedPlaneGeometry(
  width: number,
  height: number,
  segmentsX = 24,
  segmentsY = 24,
  curl = 0.16
): THREE.PlaneGeometry {
  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
  const pos = geometry.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i); // -height/2 .. height/2
    const t = (y + height / 2) / height; // 0 at bottom .. 1 at top
    const falloff = Math.pow(1 - t, 2.2); // strongest curl near the bottom
    const z = Math.sin(t * Math.PI * 0.5) * curl * falloff * -1;
    pos.setZ(i, z);
  }

  geometry.computeVertexNormals();
  return geometry;
}
