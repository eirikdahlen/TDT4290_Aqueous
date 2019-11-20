import { CanvasWidget, PureCanvas } from './CanvasWidget';
import drawBias, { scaleBias } from './js/bias.js';
import { mapRange } from './js/tools.js';
import './css/BiasWidget.css';

const initialWidth = 360;
const initialHeight = 360;
const maxBias = 200.0;

class BiasWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureCanvasBias);
    this.scaleFunction = scaleBias;
    this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;
  }

  // Redraw widget
  componentDidUpdate() {
    // This widget takes u, v, w as properties
    var { u, v, w } = this.props;

    // Normalize bias values
    u = mapRange(u, -maxBias, maxBias, -1.0, 1.0);
    v = mapRange(v, -maxBias, maxBias, -1.0, 1.0);
    w = mapRange(w, -maxBias, maxBias, -1.0, 1.0);

    drawBias(this.ctx, u, v, w, initialWidth, initialHeight);
  }
}

class PureCanvasBias extends PureCanvas {
  constructor(props) {
    super(props, 'BiasWidget', initialWidth, initialHeight);
  }
}

export default BiasWidget;
