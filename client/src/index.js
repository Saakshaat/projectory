import React from "react";
import ReactDOM from "react-dom";
import WireFrame from "./WireFrame";
import firebase from "firebase";

const App = () => {
  return <WireFrame />;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
