//index.js is the file that is loaded when the app is loaded.
//Its component - ViewManager - handles which of Control.js and Video.js to load.

import React from "react";
import ReactDOM from "react-dom";
import ViewManager from "./ViewManager";

ReactDOM.render(<ViewManager />, document.getElementById("root"));
