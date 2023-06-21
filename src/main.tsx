import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserCommentsProvider } from "./context/UserCommentsContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserCommentsProvider>
        <App />
      </UserCommentsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
