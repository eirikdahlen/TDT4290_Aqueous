import { CanvasWidget, PureCanvas } from './CanvasWidget';
import drawNetFollowing from './js/netfollowing';

class NetFollowingWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureNetFollowingWidget);
  }

  componentDidMount() {
    drawNetFollowing(this.ctx, this.props.distance, this.props.velocity);
  }

  componentDidUpdate() {
    this.componentDidMount();
  }
}

class PureNetFollowingWidget extends PureCanvas {
  constructor(props) {
    super(props, 'NetFollowingWidget', 195, 180);
  }
}

export default NetFollowingWidget;
