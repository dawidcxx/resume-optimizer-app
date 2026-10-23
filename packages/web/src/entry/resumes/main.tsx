import "@/fonts";
import "@/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App";
import { startStorePersistence } from "@/store";
import { ThemeProvider } from "@/ui";

startStorePersistence();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);