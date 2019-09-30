import React from 'react';
import { CanvasWidget, PureCanvas } from './CanvasWidget';
import { heading_init, drawHeading } from './js/heading.js';
import LockWidget from './LockWidget';
import './css/HeadingWidget.css';

import { radiansToDegrees } from './js/tools.js';

class HeadingWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureCanvasHeading);
    this.lockedValue = 0;
  }

  componentDidMount() {
    heading_init(this.ctx);
    this.componentDidUpdate();
  }

  // Redraw widget
  componentDidUpdate() {
    const heading_degrees = radiansToDegrees(this.props.heading);
    this.lockedValue = radiansToDegrees(this.props.lockedValue);

    drawHeading(
      this.ctx,
      heading_degrees,
      this.props.isLocked,
      this.lockedValue, // Do not perform .toFixed on this :)
    );
  }

  render() {
    const canvas = super.render();
    return (
      <div>
        {canvas}
        <LockWidget
          id="LockWidgetHeading"
          value={this.lockedValue.toFixed(0)}
          isLocked={this.props.isLocked}
        />
      </div>
    );
  }
}

class PureCanvasHeading extends PureCanvas {
  constructor(props) {
    super(props, 'HeadingWidget', 800, 100);
  }
}

export default HeadingWidget;
