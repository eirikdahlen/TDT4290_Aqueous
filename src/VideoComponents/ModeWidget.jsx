import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './css/ModeWidget.css';

const ModeEnum = {
  MANUAL: 0,
  NETFOLLOWING: 1,
  DYNAMICPOSITIONING: 2,
};

class ModeWidget extends Component {
  constructor(props) {
    super(props);

    switch (props.mode) {
      case ModeEnum.MANUAL:
        this.modeLabel = 'MANUAL';
        break;
      case ModeEnum.NETFOLLOWING:
        this.modeLabel = 'NET FOLLOWING';
        break;
      case ModeEnum.DYNAMICPOSITIONING:
        this.modeLabel = 'DYN. POS.';
        break;
      default:
        this.modeLabel = 'INVALID';
        break;
    }
  }

  static get propTypes() {
    return {
      mode: PropTypes.number,
    };
  }

  render() {
    return (
      <div className="ModeWidget">
        <canvas width={150} height={150}></canvas>
        <p>{this.modeLabel}</p>
      </div>
    );
  }
}

export default ModeWidget;
export { ModeEnum };
