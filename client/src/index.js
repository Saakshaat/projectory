import React from "react";
import ReactDOM from "react-dom";
import WireFrame from "./WireFrame";

const App = () => {
  return <WireFrame />;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
