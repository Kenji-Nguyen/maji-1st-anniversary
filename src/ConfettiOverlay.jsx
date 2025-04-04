import { useState, useEffect } from "react";

export default function ConfettiOverlay() {
  const [confettiParticles, setConfettiParticles] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    function checkIfMobile() {
      const mobileBreakpoint = 768;
      setIsMobile(window.innerWidth < mobileBreakpoint);
    }

    // Check initially
    checkIfMobile();

    // Add resize listener
    window.addEventListener("resize", checkIfMobile);

    // Update cursor visibility for mobile
    if (isMobile) {
      document.documentElement.style.cursor = "auto";
    } else {
      document.documentElement.style.cursor = "none";
    }

    return () => {
      window.removeEventListener("resize", checkIfMobile);
      // Reset cursor on unmount
      document.documentElement.style.cursor = "auto";
    };
  }, [isMobile]);

  // Handle click to create confetti
  function handleConfettiClick(e) {
    // Only handle left click (primary button)
    if (e.button !== 0) return;

    const emojis = ["🎉", "🎊", "✨", "🎈", "🥳", "🍰", "🎂"];
    const newParticles = [];

    // Create fewer particles on mobile
    const particleCount = isMobile ? 8 : 20;

    // Create particles per click
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: `${Date.now()}-${i}`,
        x: e.clientX,
        y: e.clientY,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: Math.random() * 20 + 10, // 10-30px
        speedX: (Math.random() - 0.5) * 10, // -5 to 5
        speedY: (Math.random() - 0.5) * 10 - 8, // -10 to 0 (upward bias)
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        opacity: 1,
      });
    }

    setConfettiParticles((prev) => [...prev, ...newParticles]);

    // Clean up particles after animation completes
    setTimeout(() => {
      setConfettiParticles((prev) => prev.filter((particle) => !newParticles.some((p) => p.id === particle.id)));
    }, 3000);
  }

  // Update particle positions
  useEffect(() => {
    if (confettiParticles.length === 0) return;

    const animationFrame = requestAnimationFrame(() => {
      setConfettiParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: particle.x + particle.speedX,
          y: particle.y + particle.speedY,
          speedY: particle.speedY + 0.2, // Gravity
          rotation: particle.rotation + particle.rotationSpeed,
          opacity: particle.opacity - 0.01, // Fade out
        }))
      );
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [confettiParticles]);

  // Use event listeners directly to allow mouse moves to pass through
  useEffect(() => {
    // Handle document click
    const handleDocumentClick = (e) => {
      handleConfettiClick(e);
    };

    // Add document-level click listener
    document.addEventListener("click", handleDocumentClick);

    // Cleanup
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none">
      {/* Render confetti particles */}
      {confettiParticles.map((particle) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            fontSize: `${particle.size}px`,
            transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
            opacity: particle.opacity,
            transition: "opacity 0.3s ease",
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
}
