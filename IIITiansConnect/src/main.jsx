import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { ThemeModeProvider } from "./hooks/useThemeMode.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeModeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster 
          position="top-right" 
          reverseOrder={false}
          containerStyle={{
            top: 80,
          }}
        />
        <App />
      </BrowserRouter>
    </ThemeModeProvider>
  </StrictMode>
);
