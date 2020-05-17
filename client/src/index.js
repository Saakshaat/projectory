import React from "react";
import ReactDOM from "react-dom";
import WireFrame from "./WireFrame";
import NavDrawer from "./Components/NavDrawer";

const App = () => {
  return (
    <NavDrawer />
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
