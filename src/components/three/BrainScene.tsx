"use client";

/**
 * Forged ingot — dark hammered metal block with cracked ember veins.
 * Single mesh, fully procedural. Voronoi cracks via triplanar fragment shader,
 * subtle hammer-mark displacement in the vertex shader, view-dependent rim light.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, RoundedBox } from "@react-three/drei";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────
   Shaders
   ──────────────────────────────────────────────────────────────────────── */

const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vObjectPos;
  uniform float uTime;

  vec3 hash33(vec3 p) {
    p = vec3(
      dot(p, vec3(127.1, 311.7, 74.7)),
      dot(p, vec3(269.5, 183.3, 246.1)),
      dot(p, vec3(113.5, 271.9, 124.6))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash33(i).x;
    float n100 = hash33(i + vec3(1.0, 0.0, 0.0)).x;
    float n010 = hash33(i + vec3(0.0, 1.0, 0.0)).x;
    float n110 = hash33(i + vec3(1.0, 1.0, 0.0)).x;
    float n001 = hash33(i + vec3(0.0, 0.0, 1.0)).x;
    float n101 = hash33(i + vec3(1.0, 0.0, 1.0)).x;
    float n011 = hash33(i + vec3(0.0, 1.0, 1.0)).x;
    float n111 = hash33(i + vec3(1.0, 1.0, 1.0)).x;
    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z
    );
  }

  void main() {
    vec3 pos = position;
    // Hammer-mark displacement — small, multi-frequency
    float n1 = vnoise(position * 9.0);
    float n2 = vnoise(position * 22.0);
    float disp = n1 * 0.018 + n2 * 0.006;
    pos += normal * disp;

    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPosition.xyz;
    vObjectPos = position;
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vObjectPos;
  uniform float uTime;
  uniform vec3 uEmberHot;
  uniform vec3 uEmberDim;
  uniform vec3 uMetal;

  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453123);
  }

  // Voronoi F2 - F1 edge distance — sharp seams between cells
  float voronoiEdge(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float d1 = 8.0;
    float d2 = 8.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 g = vec2(float(x), float(y));
        vec2 o = hash22(i + g);
        vec2 r = g + o - f;
        float d = dot(r, r);
        if (d < d1) { d2 = d1; d1 = d; }
        else if (d < d2) { d2 = d; }
      }
    }
    return sqrt(d2) - sqrt(d1);
  }

  // Per-cell random for asymmetric pulse
  float voronoiCellID(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float d1 = 8.0;
    vec2 closest = vec2(0.0);
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 g = vec2(float(x), float(y));
        vec2 o = hash22(i + g);
        vec2 r = g + o - f;
        float d = dot(r, r);
        if (d < d1) { d1 = d; closest = i + g; }
      }
    }
    return fract(sin(dot(closest, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    // Triplanar projection — soft-blended so the cracks wrap continuously
    vec3 p = vObjectPos * 4.2;
    vec3 absN = abs(vNormal);
    vec3 weights = absN * absN * absN; // sharpen
    weights /= max(weights.x + weights.y + weights.z, 0.001);

    // Fine cracks
    float ex = voronoiEdge(p.zy);
    float ey = voronoiEdge(p.xz);
    float ez = voronoiEdge(p.xy);
    float edge = ex * weights.x + ey * weights.y + ez * weights.z;
    float fineMask = 1.0 - smoothstep(0.0, 0.07, edge);

    // Larger structural fissures
    float bx = voronoiEdge(p.zy * 0.32);
    float by = voronoiEdge(p.xz * 0.32);
    float bz = voronoiEdge(p.xy * 0.32);
    float bigEdge = bx * weights.x + by * weights.y + bz * weights.z;
    float bigMask = 1.0 - smoothstep(0.0, 0.13, bigEdge);

    // Heat field — distributes warmth across the surface unevenly
    float heatField = 0.45 + 0.55 * sin(p.x * 0.55 + uTime * 0.22)
                                 * cos(p.y * 0.42 + uTime * 0.18)
                                 * sin(p.z * 0.38 - uTime * 0.15);
    heatField = clamp(heatField, 0.0, 1.0);

    // Per-cell pulse — different cells throb out of phase
    float cell = voronoiCellID(p.xy + p.zy * 0.3);
    float pulse = 0.55 + 0.45 * sin(uTime * 0.6 + cell * 6.283);

    // Combine crack layers; big fissures dominate, fine cracks add detail
    float combined = max(fineMask * 0.55, bigMask);
    combined *= (0.55 + 0.45 * heatField);

    // Rim light — silvery on the silhouette of cooled metal
    float rim = pow(1.0 - max(0.0, dot(vNormal, vViewDir)), 3.2);
    vec3 rimColor = vec3(0.58, 0.6, 0.66) * rim * 0.55;

    // Base metal — very dark cool gray
    vec3 metalColor = uMetal + rimColor;

    // Crack color — hotter in dense zones, dim at the periphery
    vec3 crackColor = mix(uEmberDim, uEmberHot, combined * pulse);

    // Blend cracks onto metal
    vec3 baseFinal = mix(metalColor, crackColor, combined);

    // Additive glow inside cracks (sells the heat)
    vec3 final = baseFinal + crackColor * combined * combined * pulse * 0.85;

    // Subtle global heat haze on cracks
    final += uEmberHot * combined * 0.08 * (0.5 + 0.5 * sin(uTime * 1.2 + cell * 12.0));

    gl_FragColor = vec4(final, 1.0);
  }
`;

/* ────────────────────────────────────────────────────────────────────────
   Mesh component
   ──────────────────────────────────────────────────────────────────────── */

function Ingot({ pointerInfluence }: { pointerInfluence: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const pointer = useRef({ x: 0, y: 0, smX: 0, smY: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEmberHot: { value: new THREE.Color("#ff6b3a") },
      uEmberDim: { value: new THREE.Color("#5a1607") },
      uMetal: { value: new THREE.Color("#0d0f13") },
    }),
    []
  );

  useEffect(() => {
    if (pointerInfluence === 0) return;
    const handler = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", handler, { passive: true });
    return () => window.removeEventListener("pointermove", handler);
  }, [pointerInfluence]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    pointer.current.smX += (pointer.current.x - pointer.current.smX) * 0.04;
    pointer.current.smY += (pointer.current.y - pointer.current.smY) * 0.04;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }

    if (groupRef.current) {
      // 3/4 resting pose — right face + top + front all visible.
      // Oscillates gently around this pose instead of spinning, so it
      // reads as "cooling on the anvil," not "showroom turntable."
      groupRef.current.rotation.y =
        0.55 +
        Math.sin(t * 0.08) * 0.22 +
        pointer.current.smX * 0.3 * pointerInfluence;
      groupRef.current.rotation.x =
        -0.32 +
        Math.sin(t * 0.06) * 0.04 -
        pointer.current.smY * 0.14 * pointerInfluence;
      groupRef.current.rotation.z = 0.06 + Math.sin(t * 0.05) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[1.75, 0.85, 1.05]} radius={0.09} smoothness={5}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </RoundedBox>
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Scene wrapper
   ──────────────────────────────────────────────────────────────────────── */

export default function BrainScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2];
  const pointerInfluence = isMobile ? 0 : 1;

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.3, 4.8], fov: 36 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
      }}
      style={{ background: "transparent" }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Ingot pointerInfluence={pointerInfluence} />
    </Canvas>
  );
}
