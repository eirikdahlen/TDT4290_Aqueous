import { Canvas, PureCanvas } from './canvas_base.js';
import { depth_init, drawDepth } from '../js/depth.js';

class CanvasDepth extends Canvas {
  constructor(props) {
    super(props, PureCanvasDepth);
  }

  componentDidMount() {
    // Convert from radians to degrees
    depth_init(this.ctx);
    drawDepth(this.ctx, this.props.depth);
  }

  // Redraw widget
  componentDidUpdate() {
    drawDepth(this.ctx, this.props.depth);
  }
}

class PureCanvasDepth extends PureCanvas {
  constructor(props) {
    super(props, 'canvasDepth', 120, 800);
  }
}

export { CanvasDepth };
