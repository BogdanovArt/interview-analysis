import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./store";
import * as serviceWorker from "./serviceWorker";

import "./index.css";

const pkg = require("../package.json");
console.log("current version: ", pkg?.version);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

if ((module as any).hot) {
  (module as any).hot.accept();
}

serviceWorker.unregister();
