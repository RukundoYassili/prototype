import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import React from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router";
import "./system/tokens.css";
import "./system/components.css";
import "./styles.css";
import "./site.css";
import "./support/support.css";
import "./blog/blog.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
