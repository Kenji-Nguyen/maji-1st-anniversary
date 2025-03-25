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
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={1} />
      <ScrollControls pages={2} damping={0.3} horizontal>
        <ImageGallery />
      </ScrollControls>
    </Canvas>
  );
}

function ImageGallery() {
  const scroll = useScroll();
  const [hovered, setHovered] = useState<number | null>(null);

  const totalImages = 12;
  const radius = 5; // Radius of the circle
  const arcLength = Math.PI * 2; // Full circle
  const spacing = arcLength / totalImages;

  // Use scroll offset to determine starting angle
  const scrollRotation = useRef(0);

  useFrame(() => {
    // Update rotation based on scroll
    scrollRotation.current = scroll.offset * Math.PI * 2;
  });

  return (
    <>
      {Array.from({ length: totalImages }, (_, i) => {
        // Calculate position on a circle - evenly spaced
        const angle = i * spacing;

        return (
          <RotatingImage
            key={i}
            radius={radius}
            baseAngle={angle}
            scrollRotation={scrollRotation}
            url={`/img${Math.floor(i % 10) + 1}.jpg`}
            isHovered={hovered === i}
            onHover={() => setHovered(i)}
            onLeave={() => setHovered(null)}
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
};

function RotatingImage({ radius, baseAngle, scrollRotation, url, isHovered, onHover, onLeave }: RotatingImageProps) {
  const imageRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (imageRef.current) {
      // Calculate current angle based on base angle and scroll rotation
      const currentAngle = baseAngle + scrollRotation.current;

      // Position on a flat 2D circle in the XY plane (all images have z=0)
      const x = Math.sin(currentAngle) * radius;
      const y = Math.cos(currentAngle) * radius;

      // Update position - keeping z constant at 0 (flat plane)
      imageRef.current.position.x = x;
      imageRef.current.position.y = y;

      // Rotate to face forward (no need to face center in 2D circle)
      // Just add slight rotation for aesthetic angle
      const rotationAngle = currentAngle - Math.PI / 2;
      imageRef.current.rotation.z = rotationAngle;

      // Apply hover effect
      const scale = isHovered ? 1.1 : 1;
      imageRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={imageRef} position={[0, 0, 0]}>
      <Image
        url={url}
        transparent
        // @ts-expect-error - The Image component from drei accepts this scale format
        scale={[2.5, 3.2, 1]}
        position={[0, 0, 0]}
        onPointerOver={onHover}
        onPointerOut={onLeave}
        side={THREE.DoubleSide}
        radius={0.05}
      />
    </group>
  );
}
