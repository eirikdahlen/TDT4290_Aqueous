import React from 'react';
import { CanvasWidget, PureCanvas } from './CanvasWidget';
import { heading_init, drawHeading } from './js/heading.js';
import LockWidget from './LockWidget';
import './css/HeadingWidget.css';

import { radiansToDegrees } from './js/tools.js';

class HeadingWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureCanvasHeading);
  }

  componentDidMount() {
    // This widget takes heading as a property

    const heading_degrees = radiansToDegrees(this.props.heading);

    heading_init(this.ctx);
    drawHeading(
      this.ctx,
      heading_degrees,
      this.props.isLocked,
      this.props.lockedValue,
    );
  }

  // Redraw widget
  componentDidUpdate() {
    const heading_degrees = radiansToDegrees(this.props.heading);

    drawHeading(
      this.ctx,
      heading_degrees,
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
          id="LockWidgetHeading"
          value={this.props.lockedValue}
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
