import { Canvas, PureCanvas } from './canvas_base.js';
import { heading_init, drawHeading } from '../js/heading.js';

class CanvasHeading extends Canvas {
  constructor(props) {
    super(props, PureCanvasHeading);
  }

  componentDidMount() {
    // This widget takes heading as a property
    const { heading } = this.props;
    heading_init(this.ctx);
    drawHeading(this.ctx, heading);
  }
}

class PureCanvasHeading extends PureCanvas {
  constructor(props) {
    super(props, 'canvasHeading', 800, 75);
  }
}

export { CanvasHeading };
