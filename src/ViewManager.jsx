// Returns the view specified by the search parameter, ex. localhost:3000/?controlWindow loads Control.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ControlApp from './Control';
import VideoApp from './Video';

class ViewManager extends Component {
  static Views() {
    return {
      controlWindow: <ControlApp />,
      videoWindow: <VideoApp />,
    };
  }

  static View(props) {
    let name = props.location.search.substr(1);
    let view = ViewManager.Views()[name];
    if (view == null) throw new Error("View '" + name + "' is undefined");
    return view;
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={ViewManager.View} />
        </div>
      </Router>
    );
  }
}

export default ViewManager;
