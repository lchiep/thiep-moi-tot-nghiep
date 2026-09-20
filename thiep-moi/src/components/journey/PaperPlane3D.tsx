"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Screen-space waypoints (percent of viewport), reused from the old 2D
// flight path so the 3D plane follows the same familiar route across
// the card -- just genuinely in 3D now, with real banking and depth.
const FLIGHT_WAYPOINTS: [number, number][] = [
  [38, 58],
  [49, 50],
  [67, 35],
  [88, 39],
  [76, 53],
  [56, 57],
  [50, 61],
];

const LAND_POINT: [number, number] = [50, 61];

// The model's nose points along local +Z, which is straight down the
// camera's viewing axis at rotation (0,0,0) -- that's what made it look
// like a flat diamond instead of a plane. This yaws/pitches/banks it
// into a classic 3/4 "flying up and to the right" pose, so the long
// body and both wings are always visible in silhouette.
const BASE_ROTATION = { x: -0.25, y: -0.75, z: -0.2 };

function percentToWorld(
  point: [number, number],
  viewport: { width: number; height: number },
): THREE.Vector3 {
  const x = (point[0] / 100 - 0.5) * viewport.width;
  const y = -(point[1] / 100 - 0.5) * viewport.height;
  return new THREE.Vector3(x, y, 0);
}

// Warm gold-to-peach gradient, nose to tail -- matches the site's warm
// golden-light theme and reads as a glossy, colorful icon-style paper
// plane instead of a flat off-white cutout.
const NOSE_COLOR = new THREE.Color("#f0a84a");
const TAIL_COLOR = new THREE.Color("#fde3bf");

function colorForZ(z: number): THREE.Color {
  const t = THREE.MathUtils.clamp((z + 0.95) / (1.15 + 0.95), 0, 1);
  return TAIL_COLOR.clone().lerp(NOSE_COLOR, t);
}

// A folded paper-dart: exactly two triangular wing planes meeting at a
// raised center spine -- nothing else. The earlier version also had a
// pair of thin "tail notch" sliver triangles meant to echo the classic
// paper-plane notch, but at this scale/angle their edges sat almost flush
// against the main wing edges and read as messy crossing lines instead
// of a clean fold. A real 3D mesh (proper normals, catches light as it
// banks) rather than a flat cutout, but kept to the simplest shape that
// still reads unmistakably as a paper plane.
function PlaneMesh() {
  const { geometry, edges } = useMemo(() => {
    const nose = new THREE.Vector3(0, 0.03, 1.2);
    const ridge = new THREE.Vector3(0, 0.18, -0.7);
    const leftBack = new THREE.Vector3(-0.9, -0.05, -0.9);
    const rightBack = new THREE.Vector3(0.9, -0.05, -0.9);

    const verts = [
      nose, ridge, leftBack, // left wing
      nose, rightBack, ridge, // right wing
    ];

    const positions = new Float32Array(verts.length * 3);
    const colors = new Float32Array(verts.length * 3);
    verts.forEach((v, i) => {
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
      const c = colorForZ(v.z);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    return { geometry: geo, edges: new THREE.EdgesGeometry(geo, 1) };
  }, []);

  return (
    <group>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.35}
          metalness={0.06}
          envMapIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Crisp dark edge along the fold + silhouette, matching the clean
          line-art look of the reference icons instead of a flat-shaded
          blob with no defined boundary. */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#5a3c1a" transparent opacity={0.55} />
      </lineSegments>
    </group>
  );
}

// A short, fading dashed trail behind the plane while it flies -- traces
// the curve it has already travelled, like the swirl behind a thrown
// paper plane in the reference art. Reads progress from a ref (not a
// prop) since the plane's position is driven imperatively every frame,
// not through React state/re-renders.
function FlightTrail({
  curve,
  easedRef,
}: {
  curve: THREE.CatmullRomCurve3;
  easedRef: RefObject<number>;
}) {
  // R3F's lowercase `<line>` intrinsic collides with the DOM/SVG `line`
  // element in TypeScript's JSX namespace resolution here, so the THREE
  // object is built once and mounted via <primitive> instead.
  const line = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const material = new THREE.LineDashedMaterial({
      color: "#f0a84a",
      dashSize: 0.08,
      gapSize: 0.06,
      transparent: true,
      opacity: 0.55,
    });
    return new THREE.Line(geo, material);
  }, []);

  useFrame(() => {
    const eased = easedRef.current;
    const trailStart = Math.max(0, eased - 0.35);
    const segments = 24;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = trailStart + ((eased - trailStart) * i) / segments;
      points.push(curve.getPointAt(THREE.MathUtils.clamp(t, 0, 0.999)));
    }
    const geo = line.geometry;
    geo.setFromPoints(points);
    geo.computeBoundingSphere();
    line.computeLineDistances();
  });

  return <primitive object={line} />;
}

function FlyingPlane({
  phase,
  clicked,
  onLandedClick,
}: {
  phase: "flight" | "landed";
  clicked: boolean;
  onLandedClick: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const startTime = useRef<number | null>(null);
  const bobPhase = useRef(0);
  const easedRef = useRef(0);

  const curve = useMemo(() => {
    const points = FLIGHT_WAYPOINTS.map((p) => percentToWorld(p, viewport));
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.4);
  }, [viewport]);

  const landPos = useMemo(() => percentToWorld(LAND_POINT, viewport), [viewport]);

  useFrame((state, delta) => {
    if (!group.current) return;

    if (phase === "flight") {
      if (startTime.current === null) startTime.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - startTime.current;
      const duration = 2.6;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
      easedRef.current = eased;

      const pos = curve.getPointAt(Math.min(eased, 0.999));
      const ahead = curve.getPointAt(Math.min(eased + 0.02, 1));
      group.current.position.copy(pos);

      // Fully re-orienting the plane to face its literal travel direction
      // meant that whenever it flew mostly sideways (which is most of the
      // time, since the path runs left-to-right across the screen), its
      // nose swung to point toward the camera and the wings -- which are
      // spread along the model's local X axis -- foreshortened almost to
      // nothing. Result: a flat diamond instead of a recognizable plane.
      // Keep a fixed, camera-facing "flying" pose (nose up-right, wings
      // spread across the view) at all times, and only wobble gently
      // around it based on direction, so it always reads as a paper
      // plane first and a physically-accurate glider a distant second.
      const dir = ahead.clone().sub(pos);
      const turnLean = THREE.MathUtils.clamp(-dir.x * 0.5, -0.2, 0.2);
      const climbLean = THREE.MathUtils.clamp(-dir.y * 0.4, -0.15, 0.15);
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        BASE_ROTATION.x + climbLean,
        0.12,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        BASE_ROTATION.y + turnLean * 0.6,
        0.12,
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        BASE_ROTATION.z + turnLean,
        0.12,
      );
    } else {
      // landed: settle at rest position, gentle idle bob around the same
      // base pose (not rotation 0 -- that was the other place the flat
      // top-down silhouette showed up).
      bobPhase.current += delta;
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, landPos.x, 0.12);
      group.current.position.y = landPos.y + Math.sin(bobPhase.current * 1.6) * 0.015;
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, landPos.z, 0.12);
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        BASE_ROTATION.x,
        0.1,
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        BASE_ROTATION.z + Math.sin(bobPhase.current * 1.3) * 0.05,
        0.1,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        BASE_ROTATION.y + Math.sin(bobPhase.current * 0.9) * 0.06,
        0.05,
      );
    }

    const targetScale = clicked ? 0.62 * 1.12 : 0.62;
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.25));
  });

  return (
    <>
      {phase === "flight" && <FlightTrail curve={curve} easedRef={easedRef} />}
      <group ref={group} scale={0.62} onClick={phase === "landed" ? onLandedClick : undefined}>
        <PlaneMesh />
      </group>
    </>
  );
}

export default function PaperPlane3D({
  phase,
  clicked = false,
  onLandedClick,
}: {
  phase: "flight" | "landed";
  clicked?: boolean;
  onLandedClick: () => void;
}) {
  return (
    <div className="plane-3d-canvas">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[2, 3, 4]} intensity={1.1} />
        <directionalLight position={[-2, -1, -3]} intensity={0.35} color="#8899aa" />
        <FlyingPlane phase={phase} clicked={clicked} onLandedClick={onLandedClick} />
      </Canvas>
    </div>
  );
}
