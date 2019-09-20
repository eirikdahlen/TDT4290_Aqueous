import { Canvas, PureCanvas } from './canvas_base.js';
import drawBias from '../js/bias.js';

class CanvasBias extends Canvas {
  constructor(props) {
    super(props, PureCanvasBias);
  }

  componentDidMount() {
    // This widget takes u, v, w as properties
    const { u, v, w } = this.props;
    drawBias(this.ctx, u, v, w);
  }
}

class PureCanvasBias extends PureCanvas {
  constructor(props) {
    super(props, 'canvasBias', 500, 500);
  }
}

export { CanvasBias };
