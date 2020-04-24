import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import AuthContextProvider from "./components/context/auth-context";

ReactDOM.render(
  <AuthContextProvider>
    <p
      style={{
        color: "#fff",
        border: "1px solid #ff2058",
        background: "#ff2058",
        display: "block",
        padding: "2%",
        borderRadius: "0%",
        margin: "auto",
        width: "30%",
        textAlign: "center",
        fontWeight: "bold",
      }}
    >
      You can delete an item by clicking on it!
    </p>
    <App />
  </AuthContextProvider>,
  document.getElementById("root")
);
