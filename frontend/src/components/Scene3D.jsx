import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef();
  const count = 120;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#ffffff" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function GridLines() {
  const lines = useMemo(() => {
    const group = [];
    const size = 8;
    const divisions = 10;
    const step = size / divisions;
    for (let i = 0; i <= divisions; i++) {
      const x = -size / 2 + i * step;
      group.push({ start: [x, -size / 2, 0], end: [x, size / 2, 0] });
      group.push({ start: [-size / 2, x, 0], end: [size / 2, x, 0] });
    }
    return group;
  }, []);

  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      {lines.map((line, i) => {
        const points = [new THREE.Vector3(...line.start), new THREE.Vector3(...line.end)];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i} geometry={geo}>
            <lineBasicMaterial color="#1a1a1a" transparent opacity={0.6} />
          </line>
        );
      })}
    </group>
  );
}

function FloatingCube({ position, speed, rotAxis }) {
  const ref = useRef();
  const origin = useRef(position);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = origin.current[1] + Math.sin(t) * 0.3;
    ref.current.rotation[rotAxis] += 0.005;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.18, 0.18, 0.18]} />
      <meshStandardMaterial color="#2a2a2a" metalness={1} roughness={0.1} wireframe />
    </mesh>
  );
}

function FloatingOcta({ position, speed }) {
  const ref = useRef();
  const origin = useRef(position);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = origin.current[1] + Math.cos(t) * 0.25;
    ref.current.rotation.y += 0.008;
    ref.current.rotation.x += 0.004;
  });
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.14]} />
      <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function FloatingTorus({ position, speed }) {
  const ref = useRef();
  const origin = useRef(position);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = origin.current[1] + Math.sin(t + 1) * 0.2;
    ref.current.rotation.x += 0.006;
    ref.current.rotation.z += 0.004;
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.12, 0.04, 8, 24]} />
      <meshStandardMaterial color="#2a2a2a" metalness={1} roughness={0.0} />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 4]} intensity={1} color="#ffffff" />
      <pointLight position={[-4, -2, -4]} intensity={0.3} color="#888888" />

      <ParticleField />
      <GridLines />

      <FloatingCube position={[-2.2, 0.8, 0]} speed={0.6} rotAxis="y" />
      <FloatingCube position={[2.4, -0.5, -1]} speed={0.45} rotAxis="x" />
      <FloatingCube position={[-1.0, -1.4, 0.5]} speed={0.7} rotAxis="z" />

      <FloatingOcta position={[1.8, 1.2, 0]} speed={0.5} />
      <FloatingOcta position={[-2.6, -0.8, -0.5]} speed={0.38} />

      <FloatingTorus position={[0.6, 1.6, 0]} speed={0.55} />
      <FloatingTorus position={[-1.6, 0.2, -1]} speed={0.42} />
    </Canvas>
  );
}
