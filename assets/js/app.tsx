import React from "react";
import ReactDOM from "react-dom";
import FlexPlaylistApp from "./LpassApp";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  if (!container) return;
  ReactDOM.render(<FlexPlaylistApp />, container);
});
