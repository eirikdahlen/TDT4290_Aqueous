import React from 'react';
import ModeEnum from '../constants/modeEnum.js';
import { CanvasWidget, PureCanvas } from './CanvasWidget';
import drawMinimap, { scaleMinimap } from './js/minimap.js';
import './css/MiniMapWidget.css';

const { remote } = window.require('electron');

const initialWidth = 200;
const initialHeight = 200;

class MiniMapWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureCanvasMinimap);
    this.scaleFunction = scaleMinimap;
    this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;

    this.maxDistance = this.props.maxDistance;

    // This is necessary to make 'this' work inside the zoom functions
    this.zoomOut = this.zoomOut.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidUpdate() {
    const down = remote.getGlobal('fromROV').down;
    const dpEnabled =
      remote.getGlobal('mode').currentMode === ModeEnum.DYNAMICPOSITIONING;
    const dpSettings = remote.getGlobal('dynamicpositioning');

    drawMinimap(
      this.ctx,
      this.props.north,
      this.props.east,
      down,
      this.props.yaw,
      this.props.boatHeading,
      this.maxDistance,
      dpEnabled,
      dpSettings.north,
      dpSettings.east,
      dpSettings.down,
      initialWidth,
      initialHeight,
      this.props.mapRotation,
    );
  }

  zoomOut() {
    if (this.maxDistance < 1000) {
      // Maximum 1000 meters
      this.maxDistance += 1;
    }
  }

  zoomIn() {
    if (this.maxDistance > 1) {
      // Minimum 1 meter
      this.maxDistance -= 1;
    }
  }

  render() {
    const canvas = super.render();

    return (
      <div className="MiniMapWidget">
        {canvas}
        {/* These buttons let us increase or decrease the max distance 
        that draws the ROV as a square on the map*/}
        <div className="zoom">
          <button className="zoomButton" onClick={this.zoomIn}>
            +
          </button>
          <button className="zoomButton" onClick={this.zoomOut}>
            -
          </button>
        </div>
      </div>
    );
  }
}

class PureCanvasMinimap extends PureCanvas {
  constructor(props) {
    super(props, 'MinimapWidget', initialWidth, initialHeight);
  }
}

export default MiniMapWidget;
