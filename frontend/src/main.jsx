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
            background: "rgba(255, 255, 255, 0.96)",
            color: "#1F2937",
            border: "1px solid rgba(209, 213, 219, 0.8)",
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
