import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NetFollowingWidget from './NetFollowingWidget';
import './css/ModeWidget.css';
import redX from './images/redX.png';
import greenCheckmark from './images/greenCheckmark.png';

const ModeEnum = {
  MANUAL: 0,
  NETFOLLOWING: 1,
  DYNAMICPOSITIONING: 2,
};

class ModeWidget extends Component {
  constructor(props) {
    super(props);
    this.modeLabel = 'INVALID';
    let imgsrc;
    let opacityStyle;

    if (this.props.nfavailable) {
      this.nfLabel = 'NET FOLLOWING AVAILABLE';
      imgsrc = greenCheckmark;
      opacityStyle = 'NFAvailable';
    } else {
      this.nfLabel = 'NET FOLLOWING UNAVAILABLE';
      imgsrc = redX;
      opacityStyle = 'NFUnavailable';
    }
    this.canvas = (
      <div className={'NFAvailability ' + opacityStyle}>
        <img src={imgsrc} alt=""></img>
        <div>{this.nfLabel}</div>
      </div>
    );
    this.componentDidMount();
  }

  componentDidMount() {
    switch (this.props.mode) {
      case ModeEnum.MANUAL:
        this.modeLabel = 'MANUAL';
        break;
      case ModeEnum.NETFOLLOWING:
        this.modeLabel = 'NET FOLLOWING';
        this.canvas = <NetFollowingWidget distance={20} velocity={2.5} />;
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
      nfavailable: PropTypes.bool,
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
