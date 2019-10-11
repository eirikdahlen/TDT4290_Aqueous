import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NetFollowingWidget from './NetFollowingWidget';
import './css/ModeWidget.css';
import redX from './images/redX.png';
import greenCheckmark from './images/greenCheckmark.png';
import ModeEnum from '../constants/modeEnum';

const { remote } = window.require('electron');

class ModeWidget extends Component {
  constructor(props) {
    super(props);
    this.modeLabel = 'INVALID';
    this.imgsrc = null;
    this.opacityStyle = null;

    if (this.props.nfAvailable) {
      this.nfLabel = 'NET FOLLOWING AVAILABLE';
      this.imgsrc = greenCheckmark;
      this.opacityStyle = 'NFAvailable';
    } else {
      this.nfLabel = 'NET FOLLOWING UNAVAILABLE';
      this.imgsrc = redX;
      this.opacityStyle = 'NFUnavailable';
    }
    this.canvas = (
      <div className={'NFAvailability ' + this.opacityStyle}>
        <img src={this.imgsrc} alt=""></img>
        <div>{this.nfLabel}</div>
      </div>
    );
    this.componentDidMount();
  }

  componentDidMount() {
    switch (this.props.globalMode) {
      case ModeEnum.MANUAL:
        this.modeLabel = 'MANUAL';
        this.canvas = (
          <div className={'NFAvailability ' + this.opacityStyle}>
            <img src={this.imgsrc} alt=""></img>
            <div>{this.nfLabel}</div>
          </div>
        );
        break;
      case ModeEnum.NETFOLLOWING:
        if (remote.getGlobal('mode')['globalMode'] === ModeEnum.NETFOLLOWING) {
          this.modeLabel = 'NET FOLLOWING';
          this.canvas = (
            <NetFollowingWidget
              distance={remote.getGlobal('netfollowing')['distance']}
              velocity={remote.getGlobal('netfollowing')['velocity']}
            />
          );
        }
        break;
      case ModeEnum.DYNAMICPOSITIONING:
        this.modeLabel = 'DYN. POS.';
        this.canvas = (
          <div className={'NFAvailability ' + this.opacityStyle}>
            <img src={this.imgsrc} alt=""></img>
            <div>{this.nfLabel}</div>
          </div>
        );
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
      globalMode: PropTypes.number,
      nfAvailable: PropTypes.bool,
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
