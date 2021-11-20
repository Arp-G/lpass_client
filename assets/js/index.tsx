import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { store, history } from './src/stores/store';
import LpassApp from "./app";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  if (!container) return;

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <React.StrictMode>
          <LpassApp />
        </React.StrictMode>
      </ConnectedRouter>
    </Provider>,
    container);
});
