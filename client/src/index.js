import React from "react";
import ReactDOM from "react-dom";
import WireFrame from "./WireFrame";
import firebase from "firebase";

const App = () => {
  var firebaseConfig = {
    apiKey: "AIzaSyD7vtvaxLF8ciuAba-nG_k7nNakIDeqW18",
    authDomain: "projectory-5171c.firebaseapp.com",
    databaseURL: "https://projectory-5171c.firebaseio.com",
    projectId: "projectory-5171c",
    storageBucket: "projectory-5171c.appspot.com",
    messagingSenderId: "801698606024",
    appId: "1:801698606024:web:9ab451ab8761e8b7c2aefd",
    measurementId: "G-SXS35RJR2F",
  };
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  return <WireFrame />;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
