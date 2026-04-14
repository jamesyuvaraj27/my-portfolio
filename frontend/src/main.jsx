import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(17, 24, 39, 0.96)",
            color: "#e5e7eb",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 24px 40px rgba(6, 10, 26, 0.35)",
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
