import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="title-heading-1 font-bold text-black">Let's celebrate!</h1>
      </div>
    </div>
  </StrictMode>
);
