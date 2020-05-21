import React from "react";
import ReactDOM from "react-dom";
import WireFrame from "./WireFrame";
import { BrowserRouter, HashRouter } from "react-router-dom";

const App = () => {
  return (
    <WireFrame />
  );
};

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
