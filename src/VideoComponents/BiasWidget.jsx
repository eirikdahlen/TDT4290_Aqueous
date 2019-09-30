import { CanvasWidget, PureCanvas } from './CanvasWidget';
import drawBias from './js/bias.js';
import { mapRange } from './js/tools.js';
import './css/BiasWidget.css';

class BiasWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureCanvasBias);
  }

  componentDidMount() {
    // This widget takes u, v, w as properties
    var { u, v, w } = this.props;

    // Normalize bias values
    u = mapRange(u, -400.0, 400.0, -1.0, 1.0);
    v = mapRange(v, -400.0, 400.0, -1.0, 1.0);
    w = mapRange(w, -400.0, 400.0, -1.0, 1.0);

    drawBias(this.ctx, u, v, w);
  }

  // Redraw widget
  componentDidUpdate() {
    this.componentDidMount();
  }
}

class PureCanvasBias extends PureCanvas {
  constructor(props) {
    super(props, 'BiasWidget', 360, 360);
  }
}

export default BiasWidget;
