// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppContextProvider } from "./context/AppContextProvider";
import { Toaster } from "react-hot-toast";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AppContextProvider>
    <App />
    <Toaster />
  </AppContextProvider>
  // </StrictMode>
);
