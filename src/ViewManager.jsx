// Returns the view specified by the search parameter, ex. localhost:3000/?controlWindow loads Control.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ControlApp from './ControlComponents/ControlApp';
import VideoApp from './VideoComponents/VideoApp';
import ROVMockUp from './MockupComponents/ROVMockUp';
import SettingsApp from './ControlComponents/SettingsApp';

class ViewManager extends Component {
  static Views() {
    return {
      controlWindow: <ControlApp />,
      videoWindow: <VideoApp />,
      mockupWindow: <ROVMockUp />,
      settingsWindow: <SettingsApp />,
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
        <Route path="/" component={ViewManager.View} />
      </Router>
    );
  }
}

export default ViewManager;
