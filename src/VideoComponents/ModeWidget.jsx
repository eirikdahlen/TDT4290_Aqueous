import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NetFollowingWidget from './NetFollowingWidget';
import './css/ModeWidget.css';

const ModeEnum = {
  MANUAL: 0,
  NETFOLLOWING: 1,
  DYNAMICPOSITIONING: 2,
};

class ModeWidget extends Component {
  constructor(props) {
    super(props);
    this.modeLabel = 'INVALID';
    this.canvas = <canvas width={195} height={195}></canvas>;
    this.componentDidMount();
  }

  componentDidMount() {
    switch (this.props.mode) {
      case ModeEnum.MANUAL:
        this.modeLabel = 'MANUAL';
        break;
      case ModeEnum.NETFOLLOWING:
        this.modeLabel = 'NET FOLLOWING';
        this.canvas = (
          <NetFollowingWidget distance={7} depth={9} velocity={2} />
        );
        break;
      case ModeEnum.DYNAMICPOSITIONING:
        this.modeLabel = 'DYN. POS.';
        break;
      default:
        this.modeLabel = 'INVALID';
        break;
    }
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  static get propTypes() {
    return {
      mode: PropTypes.number,
    };
  }

  render() {
    return (
      <div className="ModeWidget">
        {this.canvas}
        <p>{this.modeLabel}</p>
      </div>
    );
  }
}

export default ModeWidget;
export { ModeEnum };
