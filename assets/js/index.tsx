import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './src/stores/configureStore';
import LpassApp from "./app";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  const store = configureStore();
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
