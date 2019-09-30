import { CanvasWidget, PureCanvas } from './CanvasWidget';
import { heading_init, drawHeading } from './js/heading.js';
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
    drawHeading(this.ctx, heading_degrees);
  }

  // Redraw widget
  componentDidUpdate() {
    const heading_degrees = radiansToDegrees(this.props.heading);
    drawHeading(this.ctx, heading_degrees);
  }
}

class PureCanvasHeading extends PureCanvas {
  constructor(props) {
    super(props, 'HeadingWidget', 800, 100);
  }
}

export { HeadingWidget };
