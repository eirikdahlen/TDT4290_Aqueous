import { CanvasWidget, PureCanvas } from './CanvasWidget';
import drawNetFollowing, { scaleNetFollowing } from './js/netfollowing';

const initialWidth = 195;
const initialHeight = 180;

class NetFollowingWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureNetFollowingWidget);
    this.scaleFunction = scaleNetFollowing;
    this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;
  }

  componentDidUpdate() {
    drawNetFollowing(
      this.ctx,
      this.props.distance,
      this.props.velocity,
      initialWidth,
      initialHeight,
    );
  }
}

class PureNetFollowingWidget extends PureCanvas {
  constructor(props) {
    super(props, 'NetFollowingWidget', initialWidth, initialHeight);
  }
}

export default NetFollowingWidget;
