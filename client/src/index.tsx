import "regenerator-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { MaterialUIControllerProvider, SearchContextProvider } from "./context";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <AlertProvider template={AlertTemplate} {...options}>
      <SearchContextProvider>
        <MaterialUIControllerProvider>
          <App />
        </MaterialUIControllerProvider>
      </SearchContextProvider>
    </AlertProvider>
  </BrowserRouter>
);
