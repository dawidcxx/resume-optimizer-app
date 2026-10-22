import "@/fonts";
import "@/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DesignApp } from "@/design/DesignApp";
import { ThemeProvider } from "@/ui";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <DesignApp />
    </ThemeProvider>
  </StrictMode>,
);