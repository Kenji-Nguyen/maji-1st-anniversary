import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { extend, Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, DepthOfField, ToneMapping } from "@react-three/postprocessing";
import { easing } from "maath";
import { useControls } from "leva";

extend({ MeshLineGeometry, MeshLineMaterial });

export default function App() {
  // const { dash, count, radius } = useControls({
  //   dash: { value: 0.9, min: 0, max: 0.99, step: 0.01 },
  //   count: { value: 50, min: 0, max: 200, step: 1 },
  //   radius: { value: 50, min: 1, max: 100, step: 1 },
  // });

  return (
    <div className="relative w-full h-full canvas-container opacity-50">
      <Canvas
        shadows
        flat
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 80], fov: 32.5, near: 1, far: 200 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
      >
        {/* <color attach="background" args={['#101020']} /> */}
        <Lines dash={0.96} count={60} radius={50} colors={["#8416D9", "#EF0044", "#EF6000", "#FFA302"]} />
        <Rig />
      </Canvas>
    </div>
  );
}

function Lines({ dash, count, colors, radius = 50, rand = THREE.MathUtils.randFloatSpread }) {
  const lines = useMemo(() => {
    return Array.from({ length: count }, () => {
      const pos = new THREE.Vector3(rand(radius), rand(radius), rand(radius));
      const points = Array.from({ length: 10 }, () =>
        pos.add(new THREE.Vector3(rand(radius), rand(radius), rand(radius))).clone()
      );
      const curve = new THREE.CatmullRomCurve3(points).getPoints(300);
      return {
        color: colors[Math.floor(colors.length * Math.random())],
        width: Math.max(radius / 100, (radius / 50) * Math.random()),
        speed: Math.max(0.1, 1 * Math.random()),
        curve: curve.flatMap((point) => point.toArray()),
      };
    });
  }, [colors, count, radius, rand]);
  return lines.map((props, index) => <Fatline key={index} dash={dash} {...props} />);
}

function Fatline({ curve, width, color, speed, dash }) {
  const ref = useRef(null);

  useFrame((state, delta) => {
    if (!ref.current?.material) return;
    ref.current.material.dashOffset -= (delta * speed) / 10;
  });

  return (
    <mesh ref={ref}>
      <meshLineGeometry points={curve} />
      <meshLineMaterial
        transparent
        lineWidth={width}
        color={color}
        depthWrite={false}
        dashArray={0.25}
        dashRatio={dash}
        toneMapped={false}
      />
    </mesh>
  );
}

function Rig({ radius = 50 }) {
  const { camera } = useThree();
  const initialPos = useRef([0, 0, 500]);
  const targetPos = useRef([0, 0, 0]);
  const targetRotation = useRef(new THREE.Quaternion());

  useEffect(() => {
    camera.position.set(...initialPos.current);
  }, [camera]);

  useFrame((state, dt) => {
    const targetX = Math.sin(state.pointer.x) * radius;
    const targetY = Math.atan(state.pointer.y) * radius;
    const targetZ = Math.cos(state.pointer.x) * radius;

    targetPos.current = [targetX, targetY, 80 + targetZ / 2];

    easing.damp3(camera.position, targetPos.current, 0.4, dt);

    const lookAtPoint = new THREE.Vector3(state.pointer.x * 10, state.pointer.y * 10, 0);

    const lookAtMatrix = new THREE.Matrix4();
    lookAtMatrix.lookAt(camera.position, lookAtPoint, camera.up);
    targetRotation.current.setFromRotationMatrix(lookAtMatrix);

    easing.dampQ(camera.quaternion, targetRotation.current, 0.4, dt);
  });

  return null;
}
