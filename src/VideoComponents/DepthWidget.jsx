import React from 'react';
import { CanvasWidget, PureCanvas } from './CanvasWidget';
import { depth_init, drawDepth } from './js/depth.js';
import './css/DepthWidget.css';
import LockWidget from './LockWidget';

class DepthWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureCanvasDepth);
  }

  componentDidMount() {
    // Convert from radians to degrees
    depth_init(this.ctx);
    drawDepth(
      this.ctx,
      this.props.depth,
      this.props.isLocked,
      this.props.lockedValue,
    );
  }

  // Redraw widget
  componentDidUpdate() {
    drawDepth(
      this.ctx,
      this.props.depth,
      this.props.isLocked,
      this.props.lockedValue,
    );
  }

  render() {
    const canvas = super.render();

    return (
      <div>
        {canvas}
        <LockWidget
          id="LockWidgetDepth"
          value={this.props.lockedValue}
          isLocked={this.props.isLocked}
        />
      </div>
    );
  }
}

class PureCanvasDepth extends PureCanvas {
  constructor(props) {
    super(props, 'DepthWidget', 120, 800);
  }
}

export default DepthWidget;
