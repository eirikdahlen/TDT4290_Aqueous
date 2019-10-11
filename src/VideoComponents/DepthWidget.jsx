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
    this.componentDidUpdate();
  }

  // Redraw widget
  componentDidUpdate() {
    drawDepth(
      this.ctx,
      this.props.depth,
      this.props.isLocked,
      this.props.lockedValue, // Do not perform .toFixed on this :)
    );
  }

  render() {
    const canvas = super.render();

    return (
      <div>
        {canvas}
        <LockWidget
          id="LockWidgetDepth"
          value={this.props.lockedValue.toFixed(2) + ' m'}
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
