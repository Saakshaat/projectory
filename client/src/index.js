import React from "react";
import ReactDOM from "react-dom";
import WireFrame from "./WireFrame";
import NavDrawer from "./Components/NavDrawer";
import firebase from "firebase";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <WireFrame />
  );
};

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);
