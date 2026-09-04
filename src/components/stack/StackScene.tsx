'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { edges, MONOGRAM, nodes, toWorld, type Category } from '@/data/stack';
import { logos, LOGO_VIEWBOX } from '@/data/logos';
import type { ThemeColors } from '@/lib/useThemeColors';

const FOV = 42;
/** World radius per unit of a node's `r`. Tuned so the largest node reads at
 *  roughly 45px across — the same optical weight as the 2D reference. */
const NODE_SCALE = 0.021;

type Props = {
  colors: ThemeColors;
  focusCat: Category | null;
  hoverId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
  /** Coarse pointers get drift only — orbit controls would trap page scroll. */
  allowOrbit: boolean;
  active: boolean;
  /**
   * Narrow viewports. 25 labels at 11.5px collide badly once the graph is
   * scaled to ~390px, so labels become on-demand: the brand glyphs carry
   * recognition, and tapping a node names it in the detail panel below.
   */
  compact: boolean;
};

const WORLD = nodes.map(toWorld);
const RADIUS = nodes.map((n) => n.r * NODE_SCALE);
const INDEX = new Map(nodes.map((n, i) => [n.id, i]));
const TAN_HALF_FOV = Math.tan((FOV / 2) * (Math.PI / 180));

/**
 * Camera distance that keeps every node — including its radius and the label
 * hanging beneath it — inside the frustum.
 *
 * A flat "fit the bounding box" calculation is wrong here, because nodes carry
 * a z offset: a node pushed toward the camera projects larger and further from
 * centre, and was getting clipped at the top of the frame. So solve the
 * perspective requirement per node and take the worst case.
 */
function fitDistance(aspect: number) {
  let d = 0;
  for (let i = 0; i < WORLD.length; i++) {
    const [x, y, z] = WORLD[i];
    const rad = RADIUS[i];
    // 0.5 world units of slack under the node for its DOM label
    const needY = z + (Math.abs(y) + rad + 0.5) / TAN_HALF_FOV;
    const needX = z + (Math.abs(x) + rad + 0.3) / (TAN_HALF_FOV * aspect);
    d = Math.max(d, needY, needX);
  }
  return d * 1.02; // headroom for the idle drift
}

/** Edge endpoints trimmed back to each sphere's surface. Drawing centre-to-centre
 *  buried the last stretch of every line inside a node and z-fought with its
 *  silhouette, which showed up as a dark seam across the sphere. */
function edgePositions(filter?: (a: string, b: string) => boolean) {
  const pos: number[] = [];
  const A = new THREE.Vector3();
  const B = new THREE.Vector3();
  const dir = new THREE.Vector3();
  for (const [a, b] of edges) {
    if (filter && !filter(a, b)) continue;
    const ia = INDEX.get(a);
    const ib = INDEX.get(b);
    if (ia === undefined || ib === undefined) continue;
    A.fromArray(WORLD[ia]);
    B.fromArray(WORLD[ib]);
    dir.subVectors(B, A).normalize();
    pos.push(
      A.x + dir.x * (RADIUS[ia] + 0.07),
      A.y + dir.y * (RADIUS[ia] + 0.07),
      A.z + dir.z * (RADIUS[ia] + 0.07),
      B.x - dir.x * (RADIUS[ib] + 0.07),
      B.y - dir.y * (RADIUS[ib] + 0.07),
      B.z - dir.z * (RADIUS[ib] + 0.07),
    );
  }
  return pos;
}

/** Which nodes are lit, given the current filter / hover / selection. */
function litSet(focusCat: Category | null, hoverId: string | null, selectedId: string | null) {
  const key = selectedId ?? hoverId;
  if (key) {
    const set = new Set<string>([key]);
    for (const [a, b] of edges) {
      if (a === key) set.add(b);
      else if (b === key) set.add(a);
    }
    return set;
  }
  if (focusCat) return new Set(nodes.filter((n) => n.cat === focusCat).map((n) => n.id));
  return null; // everything lit
}

/* ------------------------------------------------------------------ camera */

function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    cam.position.z = fitDistance(aspect);
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

/** Blend a hex colour toward another. Used to fade unfocused edges into the
 *  page rather than making them transparent — see the render-order note below. */
function mix(a: string, b: string, t: number) {
  const A = new THREE.Color(a);
  const B = new THREE.Color(b);
  return A.lerp(B, t).getStyle();
}

/* ------------------------------------------------------------------- edges */

/**
 * Edges are drawn OPAQUE with `depthWrite` off and a negative `renderOrder`, so
 * they always paint before the nodes and are then covered by them.
 *
 * Depth-correct lines are technically more honest — a node behind a link really
 * should be crossed by it — but on a still frame it reads as a scratch through
 * the sphere. Depth is already carried by node size, shading, label fade and
 * the idle drift, so legibility wins here.
 *
 * Because they are opaque, "dimming" is a colour lerp toward the page rather
 * than an opacity change.
 */
function Edges({
  color,
  hot,
  paper,
  lit,
}: {
  color: string;
  hot: string;
  paper: string;
  lit: Set<string> | null;
}) {
  const dim = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions(), 3));
    return g;
  }, []);

  // Rebuilt on hover/selection — 39 edges, so this is trivial work.
  const bright = useMemo(() => {
    if (!lit) return null;
    const pos = edgePositions((a, b) => lit.has(a) && lit.has(b));
    if (!pos.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, [lit]);

  useEffect(() => () => dim.dispose(), [dim]);
  useEffect(() => () => bright?.dispose(), [bright]);

  return (
    <>
      <lineSegments geometry={dim} renderOrder={-2}>
        <lineBasicMaterial color={lit ? mix(color, paper, 0.68) : color} depthWrite={false} />
      </lineSegments>
      {bright && (
        <lineSegments geometry={bright} renderOrder={-1}>
          {/* the traced path uses the accent, so "what connects to what" is
              legible at a glance rather than a subtle opacity difference */}
          <lineBasicMaterial color={hot} depthWrite={false} />
        </lineSegments>
      )}
    </>
  );
}

/* ------------------------------------------------------------------- nodes */

function Nodes({
  colors,
  lit,
  hoverId,
  selectedId,
  onHover,
  onSelect,
}: {
  colors: ThemeColors;
  lit: Set<string> | null;
  hoverId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
}) {
  const geo = useMemo(() => new THREE.SphereGeometry(1, 28, 20), []);
  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <>
      {nodes.map((n, i) => {
        const isLit = !lit || lit.has(n.id);
        const isKey = hoverId === n.id || selectedId === n.id;
        const scale = n.r * NODE_SCALE * (isKey ? 1.25 : 1);
        return (
          <mesh
            key={n.id}
            geometry={geo}
            position={WORLD[i]}
            scale={scale}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(n.id);
            }}
            onPointerOut={() => onHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(selectedId === n.id ? null : n.id);
            }}
          >
            <meshStandardMaterial
              color={colors[n.cat] || '#888'}
              roughness={0.62}
              metalness={0}
              // Always transparent, varying only opacity. Toggling `transparent`
              // at runtime needs material.needsUpdate to recompile the program,
              // so the dim state silently never applied to the spheres.
              // Safe to leave on: the edges render opaque at a negative
              // renderOrder with depthWrite off, so nodes still cover them.
              transparent
              opacity={isLit ? 1 : 0.16}
              emissive={colors[n.cat] || '#888'}
              emissiveIntensity={isKey ? 0.45 : 0}
            />
          </mesh>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ labels */

/**
 * Labels live in the DOM, not in WebGL. That keeps them in the site's real
 * typefaces, theme-aware, and crisp at any DPI — and avoids drei's <Text>,
 * which fetches a font from a CDN by default.
 *
 * The frame loop writes only `transform` and a `--d` (depth) custom property.
 * React owns `--m` (the dim multiplier), and CSS multiplies the two. So hover
 * state never causes a re-render inside the loop.
 */
function Labels({
  layer,
  group,
}: {
  layer: React.RefObject<HTMLDivElement | null>;
  group: React.RefObject<THREE.Group | null>;
}) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const host = layer.current;
    const g = group.current;
    if (!host || !g) return;
    const kids = host.children;

    for (let i = 0; i < WORLD.length; i++) {
      const el = kids[i] as HTMLElement | undefined;
      if (!el) continue;
      v.set(WORLD[i][0], WORLD[i][1], WORLD[i][2]).applyMatrix4(g.matrixWorld);
      const dist = v.distanceTo(camera.position);
      v.project(camera);

      // behind the camera — hide with `visibility`, never `opacity`, which
      // belongs to the .graph-node CSS rule
      if (v.z > 1) {
        el.style.visibility = 'hidden';
        continue;
      }
      el.style.visibility = '';

      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;

      // Offset the label by the sphere's ACTUAL projected radius, not a guess,
      // so it clears the node at any camera distance instead of sitting on it.
      const visibleH = 2 * dist * TAN_HALF_FOV;
      const pxPerWorld = size.height / visibleH;
      const screenR = RADIUS[i] * pxPerWorld;

      // The anchor sits exactly on the node centre; its children offset
      // themselves from there, so only one transform is written per node.
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      // nearer nodes read brighter; range tuned to the fitted camera distance
      const depth = THREE.MathUtils.clamp(1.3 - (dist - 10) / 16, 0.4, 1);
      el.style.setProperty('--d', depth.toFixed(3));
      el.style.setProperty('--g', `${(screenR * 1.08).toFixed(1)}px`);
      el.style.setProperty('--lo', `${(screenR + 7).toFixed(1)}px`);
    }
  });

  return null;
}

/* ------------------------------------------------------------------- drift */

function Drift({ group, enabled }: { group: React.RefObject<THREE.Group | null>; enabled: boolean }) {
  useFrame((state) => {
    const g = group.current;
    if (!g || !enabled) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = Math.sin(t * 0.085) * 0.1;
    g.rotation.x = Math.sin(t * 0.062) * 0.05;
  });
  return null;
}

/* -------------------------------------------------------------------- root */

export default function StackScene({
  colors,
  focusCat,
  hoverId,
  selectedId,
  onHover,
  onSelect,
  allowOrbit,
  active,
  compact,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const layer = useRef<HTMLDivElement>(null);
  const lit = useMemo(() => litSet(focusCat, hoverId, selectedId), [focusCat, hoverId, selectedId]);

  return (
    <div className="absolute inset-0">
      <Canvas
        // 'never' while offscreen: the section keeps its state but burns no frames
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 17], fov: FOV, near: 0.1, far: 100 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        onPointerMissed={() => onSelect(null)}
        style={{ touchAction: 'pan-y' }}
      >
        <FitCamera />
        {/* soft and mostly ambient: these should read as matte solids, not
            glossy toy spheres */}
        <ambientLight intensity={colors.theme === 'dark' ? 1.9 : 2.1} />
        <directionalLight position={[4, 9, 10]} intensity={colors.theme === 'dark' ? 0.75 : 0.5} />
        <directionalLight position={[-8, -4, 6]} intensity={0.2} />

        <group ref={group}>
          <Edges
            color={colors['--graph-edge'] || '#ccc'}
            hot={colors['--accent'] || '#1f3a5f'}
            paper={colors['--paper'] || '#fafaf8'}
            lit={lit}
          />
          <Nodes
            colors={colors}
            lit={lit}
            hoverId={hoverId}
            selectedId={selectedId}
            onHover={onHover}
            onSelect={onSelect}
          />
        </group>

        <Drift group={group} enabled={active} />
        <Labels layer={layer} group={group} />

        {allowOrbit && (
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={9}
            maxDistance={30}
            rotateSpeed={0.45}
            zoomSpeed={0.5}
            enableDamping
            dampingFactor={0.08}
            minPolarAngle={Math.PI * 0.26}
            maxPolarAngle={Math.PI * 0.74}
            minAzimuthAngle={-Math.PI * 0.32}
            maxAzimuthAngle={Math.PI * 0.32}
          />
        )}
      </Canvas>

      {/* Glyph + label overlay. Lives in the DOM so brand marks stay vector-crisp
          at any DPI and the labels use the site's real typefaces. */}
      <div ref={layer} className="pointer-events-none absolute inset-0 overflow-clip" aria-hidden>
        {nodes.map((n) => {
          const isLit = !lit || lit.has(n.id);
          const isKey = hoverId === n.id || selectedId === n.id;
          const showLabel = !compact || (lit ? lit.has(n.id) : false);
          const logo = logos[n.id];
          return (
            <div
              key={n.id}
              className="graph-node absolute left-0 top-0 transition-opacity duration-300"
              style={{ ['--m' as string]: isLit ? 1 : 0.14 }}
            >
              {logo ? (
                <svg
                  viewBox={LOGO_VIEWBOX}
                  className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
                  style={{ width: 'var(--g, 0px)', height: 'var(--g, 0px)', fill: 'var(--paper)' }}
                >
                  <path d={logo.d} />
                </svg>
              ) : (
                <span
                  className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 font-display leading-none"
                  style={{ fontSize: 'calc(var(--g, 0px) * 1.15)', color: 'var(--paper)' }}
                >
                  {MONOGRAM[n.id] ?? n.label[0]}
                </span>
              )}

              {showLabel && (
                <span
                  className="absolute left-0 -translate-x-1/2 whitespace-nowrap text-[11.5px] font-medium transition-colors duration-300"
                  style={{ top: 'var(--lo, 14px)', color: isKey ? 'var(--ink)' : 'var(--ink-2)' }}
                >
                  {n.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
