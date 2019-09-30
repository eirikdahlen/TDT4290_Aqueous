import { CanvasWidget, PureCanvas } from './CanvasWidget';
import { depth_init, drawDepth } from './js/depth.js';
import './css/DepthWidget.css';

class DepthWidget extends CanvasWidget {
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
    super(props, 'DepthWidget', 120, 800);
  }
}

export default DepthWidget;
