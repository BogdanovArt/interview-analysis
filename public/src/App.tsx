import React from "react";
import { StylesProvider } from "@mui/styles";

import Layout from "./components/layout/Default";
import { Router } from "./routes";

import "assets/scss/main.scss";

function App() {
  return (
    <StylesProvider injectFirst>
      <div id="App" className={"app theme--light"}>
        <Layout main={<Router />} />
        <div id="portal"></div>
      </div>
    </StylesProvider>
  );
}

export default App;
