import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import AuthContextProvider from "./components/context/auth-context";

ReactDOM.render(
  <AuthContextProvider>
    <p
      style={{
        textAlign: "center",
        color: "#fff",
        border: "1px solid #ff2058",
        background: "#ff2058",
        marginLeft: "35%",
        display: "inline-block",
        padding: "2%",
        borderRadius: "0%",
      }}
    >
      You can delete an item by clicking on it!
    </p>
    <App />
  </AuthContextProvider>,
  document.getElementById("root")
);
