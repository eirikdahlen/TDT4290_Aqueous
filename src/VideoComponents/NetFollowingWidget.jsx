import React from 'react';
import { CanvasWidget, PureCanvas } from './CanvasWidget';
import drawNetFollowing from './js/netfollowing';
import ImageSpeedArrow from './images/circularArrow.png';
import { clamp } from './js/tools';

class NetFollowingWidget extends CanvasWidget {
  constructor(props) {
    super(props, PureNetFollowingWidget);
  }

  componentDidMount() {
    drawNetFollowing(
      this.ctx,
      this.props.distance,
      this.props.depth,
      this.props.velocity,
    );
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  render() {
    const animationID = this.props.velocity > 0 ? 'rotationCW' : 'rotationCCW';
    const animationSpeed = clamp(
      (1 / Math.abs(this.props.velocity)) * 5,
      1,
      50,
    ).toString();
    return (
      <div>
        <img
          src={ImageSpeedArrow}
          alt=""
          style={{
            animation: animationID + ' ' + animationSpeed + 's infinite linear',
          }}
        />
        {super.render()}
      </div>
    );
  }
}

class PureNetFollowingWidget extends PureCanvas {
  constructor(props) {
    super(props, 'NetFollowingWidget', 195, 170);
  }
}

export default NetFollowingWidget;
