import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image, ScrollControls, useScroll } from "@react-three/drei";

export default function OrbitGallery() {
  return (
    <Canvas
      dpr={[1, 2]}
      className="orbit-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      camera={{ position: [0, 0, 10], fov: 50 }}
    >
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={1} />
      <ScrollControls pages={6} damping={0.3} distance={1}>
        <ImageGallery />
      </ScrollControls>
    </Canvas>
  );
}

function ImageGallery() {
  const scroll = useScroll();
  const [hovered, setHovered] = useState<number | null>(null);

  const totalImages = 12;
  const radius = 12;
  const arcLength = Math.PI * 2;
  const spacing = arcLength / totalImages;

  // Define verticalShift here to pass down or use in lookAt target
  const verticalShift = -10; // Adjusted shift, depends on desired look

  // Use scroll offset to determine starting angle
  const scrollRotation = useRef(0);

  useFrame(() => {
    // Update rotation based on scroll - endless scrolling
    // Multiply by total angle covered over scroll distance (e.g., 2 full circles over 6 pages)
    scrollRotation.current = scroll.offset * (Math.PI * 2 * 2);
  });

  return (
    <>
      {Array.from({ length: totalImages }, (_, i) => {
        const angle = i * spacing;

        return (
          <RotatingImage
            key={i}
            radius={radius}
            baseAngle={angle}
            scrollRotation={scrollRotation}
            url={`/img${Math.floor(i % 10) + 1}.jpg`} // Assuming 10 images named img1.jpg to img10.jpg in public/
            isHovered={hovered === i}
            onHover={() => setHovered(i)}
            onLeave={() => setHovered(null)}
            verticalShift={verticalShift} // Pass down shift
          />
        );
      })}
    </>
  );
}

type RotatingImageProps = {
  radius: number;
  baseAngle: number;
  scrollRotation: React.MutableRefObject<number>;
  url: string;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  verticalShift: number;
};

function RotatingImage({
  radius,
  baseAngle,
  scrollRotation,
  url,
  isHovered,
  onHover,
  onLeave,
  verticalShift,
}: RotatingImageProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Calculate current angle based on base angle and scroll rotation
      const currentAngle = baseAngle + scrollRotation.current;

      // Calculate x and y on the circle, applying vertical shift to y
      const x = Math.sin(currentAngle) * radius;
      const y = Math.cos(currentAngle) * radius + verticalShift;

      // Update position - keeping z constant at 0 (flat plane relative to world Z=0)
      groupRef.current.position.set(x, y, 0);

      // Make images face the camera instead of the center point
      groupRef.current.quaternion.copy(state.camera.quaternion);

      // Apply hover effect (smoothly)
      const targetScale = isHovered ? 1.2 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
    }
  });

  return (
    <group ref={groupRef}>
      <Image
        url={url}
        transparent
        // @ts-expect-error - Drei's Image scale prop can accept array
        scale={[4.0, 4.0, 1]}
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover();
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onLeave();
        }}
        side={THREE.DoubleSide}
      />
    </group>
  );
}
