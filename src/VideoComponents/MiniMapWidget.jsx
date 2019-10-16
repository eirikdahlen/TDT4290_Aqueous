import React from 'react';
import { CanvasWidget, PureCanvas } from './CanvasWidget';
import drawMinimap, { initMinimap, scaleMinimap } from './js/minimap.js';
import './css/MiniMapWidget.css';

const initialWidth = 200;
const initialHeight = 200;

class MiniMapWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureCanvasMinimap);
    this.scaleFunction = scaleMinimap;
    this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;
  }

  componentDidMount() {
    initMinimap(0);
    super.componentDidMount();
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    drawMinimap(
      this.ctx,
      this.props.north,
      this.props.east,
      this.props.yaw,
      this.props.boatHeading,
      this.props.maxDistance,
      initialWidth,
      initialHeight,
    );
  }

  zoomOut() {
    if (this.props.maxDistance < 1000) {
      // Maximum 1000 meters
      this.props.maxDistance += 1;
    }
  }

  zoomIn() {
    if (this.props.maxDistance > 1) {
      // Minimum 1 meter
      this.props.maxDistance -= 1;
    }
  }

  render() {
    const canvas = super.render();

    return (
      <div className="MiniMapWidget">
        <div className="MiniMap">{canvas}</div>
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
