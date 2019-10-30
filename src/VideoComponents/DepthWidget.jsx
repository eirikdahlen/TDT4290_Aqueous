import React from 'react';
import { CanvasWidget, PureCanvas } from './CanvasWidget';
import drawDepth, { scaleDepth } from './js/depth.js';
import './css/DepthWidget.css';
import LockWidget from './LockWidget';

const initialWidth = 150;
const initialHeight = 800;

class DepthWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureCanvasDepth);
    this.scaleFunction = scaleDepth;
    this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;
  }

  // Redraw widget
  componentDidUpdate() {
    drawDepth(
      this.ctx,
      this.props.depth,
      this.props.isLocked,
      this.props.lockedValue, // Do not perform .toFixed on this :)
      initialWidth,
      initialHeight,
    );
  }

  render() {
    const canvas = super.render();

    // Add a lock widget
    return (
      <div>
        {canvas}
        <LockWidget
          id="LockWidgetDepth"
          value={this.props.lockedValue + ' m' || ''}
          isLocked={this.props.isLocked}
        />
      </div>
    );
  }
}

class PureCanvasDepth extends PureCanvas {
  constructor(props) {
    super(props, 'DepthWidget', 150, 800);
  }
}

export default DepthWidget;
