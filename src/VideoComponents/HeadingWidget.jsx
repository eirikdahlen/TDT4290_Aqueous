import React from 'react';
import { CanvasWidget, PureCanvas } from './CanvasWidget';
import drawHeading, { scaleHeading } from './js/heading.js';
import LockWidget from './LockWidget';
import { radiansToDegrees, wrapDegrees } from './js/tools.js';
import './css/HeadingWidget.css';

const initialWidth = 800;
const initialHeight = 110;

class HeadingWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureCanvasHeading);
    this.lockedValue = 0;
    this.scaleFunction = scaleHeading;
    this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;
  }

  // Redraw widget
  componentDidUpdate() {
    const headingDegrees = radiansToDegrees(this.props.heading);
    this.lockedValue = wrapDegrees(radiansToDegrees(this.props.lockedValue));

    drawHeading(
      this.ctx,
      headingDegrees,
      this.props.isLocked,
      this.lockedValue, // Do not perform .toFixed on this :)
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
          id="LockWidgetHeading"
          value={this.lockedValue.toFixed(0) + '\xB0'}
          isLocked={this.props.isLocked}
        />
      </div>
    );
  }
}

class PureCanvasHeading extends PureCanvas {
  constructor(props) {
    super(props, 'HeadingWidget', initialWidth, initialHeight);
  }
}

export default HeadingWidget;
