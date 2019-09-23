import { Canvas, PureCanvas } from './canvas_base.js';
import { depth_init, drawDepth } from '../js/depth.js';

class CanvasDepth extends Canvas {
  constructor(props) {
    super(props, PureCanvasDepth);
  }

  componentDidMount() {
    // This widget takes depth as a property
    const { depth } = this.props;
    depth_init(this.ctx);
    drawDepth(this.ctx, depth);
  }
}

class PureCanvasDepth extends PureCanvas {
  constructor(props) {
    super(props, 'canvasDepth', 120, 800);
  }
}

export { CanvasDepth };
