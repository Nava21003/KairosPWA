import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { router } from "./pages/routes.jsx";
import { RouterProvider } from "react-router-dom";
import ReloadPrompt from "./ReloadPrompt.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ReloadPrompt />
  </StrictMode>
);
