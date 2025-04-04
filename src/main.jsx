import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";
import ConfettiOverlay from "./ConfettiOverlay.jsx";

function CustomCursor() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");

    // Add text element for "click"
    const cursorText = document.createElement("span");
    cursorText.classList.add("custom-cursor-text");
    cursorText.textContent = "click";
    cursor.appendChild(cursorText);

    document.body.appendChild(cursor);

    let isMoving = false;
    let lastX = 0;
    let lastY = 0;
    let movementTimeout;

    function updateCursorPosition(e) {
      // Update cursor position
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      // Calculate movement
      const deltaX = Math.abs(e.clientX - lastX);
      const deltaY = Math.abs(e.clientY - lastY);
      const hasMovedSignificantly = deltaX > 3 || deltaY > 3;

      // Update last position
      lastX = e.clientX;
      lastY = e.clientY;

      // Add moving class if there's significant movement
      if (hasMovedSignificantly && !isMoving) {
        isMoving = true;
        cursor.classList.add("moving");
      }

      // Clear previous timeout
      clearTimeout(movementTimeout);

      // Set timeout to remove moving class after movement stops
      movementTimeout = setTimeout(() => {
        isMoving = false;
        cursor.classList.remove("moving");
      }, 100);
    }

    // Add event listener
    document.addEventListener("mousemove", updateCursorPosition);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", updateCursorPosition);
      document.body.removeChild(cursor);
    };
  }, []);

  return null;
}

export default function AnniversaryPage() {
  return (
    <>
      <App />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="flex flex-col gap-2 lg:gap-1 items-center justify-center h-full">
          <h1 className="title-heading-1-thin text-[4vh] lg:text-[6vh] text-dark-purple lg:translate-x-[-30%] animated-element animate-delay-1">
            We turned one year old.
          </h1>
          <h1 className="title-heading-1-thin text-[4vh] lg:text-[6vh] text-dark-purple lg:translate-x-[30%] animated-element animate-delay-2">
            No diapers anymore.
          </h1>
          <h1 className="title-heading-1 text-[4vh] lg:text-[6vh] font-bold text-black lg:translate-x-[-5%] animated-element animate-delay-3">
            Time to celebrate!
          </h1>
        </div>
        <svg
          className="absolute right-8 bottom-8 w-[6vh] h-[6vh] animated-element animate-delay-4"
          viewBox="0 0 92 92"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M88.688 3.312H3.312V88.688H88.688V3.312ZM0 0V92H92V0H0Z"
            fill="#0F021A"
          />
          <path
            d="M30.4701 32.2L28.8417 24.5824L28.7037 21.6292H28.2345V37.72H25.2261V18.4H29.8353L31.4913 27.8668L31.5189 29.1916H31.9881L32.0157 27.8668L33.6717 18.4H38.2533V37.72H35.2449V21.6292H34.8033L34.6653 24.5824L33.0369 32.2H30.4701Z"
            fill="#0F021A"
          />
          <path
            d="M54.178 37.72L59.4772 18.4H64.7488L70.0204 37.72H66.46L64.8592 31.3444H59.3668L57.7384 37.72H54.178ZM60.112 28.336H64.0864L62.4856 21.9604L62.3476 20.1388H61.8784L61.7404 21.9604L60.112 28.336Z"
            fill="#0F021A"
          />
          <path
            d="M30.9095 72.2012C26.7971 72.2012 24.5339 69.6896 24.5339 64.9976V61.8788H27.8459V64.9976C27.8459 67.7024 28.8947 69.0824 30.9371 69.0824C33.1175 69.0824 34.0835 67.3988 34.0835 65.0528V52.4396H37.3955V65.0528C37.3955 69.5516 34.9943 72.2012 30.9095 72.2012Z"
            fill="#0F021A"
          />
          <path
            d="M55.7231 71.7596V68.7788H60.4427V55.4204H55.7231V52.4396H68.4743V55.4204H63.7547V68.7788H68.4743V71.7596H55.7231Z"
            fill="#0F021A"
          />
        </svg>
      </div>
      <CustomCursor />
    </>
  );
}

// Create main app root
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AnniversaryPage />
  </StrictMode>
);

// Create a separate container for confetti overlay
const confettiContainer = document.createElement("div");
confettiContainer.id = "confetti-container";
document.body.appendChild(confettiContainer);

// Render confetti in its own isolated container
createRoot(confettiContainer).render(
  <StrictMode>
    <ConfettiOverlay />
  </StrictMode>
);
