import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NetFollowingWidget from './NetFollowingWidget';
import './css/ModeWidget.css';
import redX from './images/redX.png';
import greenCheckmark from './images/greenCheckmark.png';
import ModeEnum from '../constants/modeEnum';
import { clamp, mapRange } from './js/tools.js';

const { remote } = window.require('electron');

const modeToLabel = {};
modeToLabel[ModeEnum.MANUAL] = 'MANUAL';
modeToLabel[ModeEnum.DYNAMICPOSITIONING] = 'DYN. POS.';
modeToLabel[ModeEnum.NETFOLLOWING] = 'NET FOLLOWING';

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
    window.addEventListener('resize', this.updateDimensions);

    this.modeLabel = modeToLabel[this.props.globalMode];

    if (this.props.globalMode === ModeEnum.NETFOLLOWING) {
      this.canvas = (
        <NetFollowingWidget
          distance={remote.getGlobal('netfollowing')['distance']}
          velocity={remote.getGlobal('netfollowing')['velocity']}
        />
      );
    } else {
      this.canvas = (
        <div className={'NFAvailability ' + this.opacityStyle}>
          <img id="ImgNFAvailable" src={this.imgsrc} alt=""></img>
          <div>{this.nfLabel}</div>
        </div>
      );
    }
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    var factorMode = mapRange(window.innerWidth, 1000, 1500, 12, 20);
    factorMode = clamp(factorMode, 12, 20);
    document.getElementsByClassName('ModeWidget')[0].style.fontSize =
      factorMode + 'px';

    var factorNF = mapRange(window.innerWidth, 1000, 1500, 12, 14);
    factorNF = clamp(factorNF, 12, 14);
    document.getElementsByClassName('NFAvailable')[0].style.fontSize =
      factorNF + 'px';

    var factorImg = mapRange(window.innerWidth, 1000, 1500, 15, 25);
    factorImg = clamp(factorImg, 15, 25);
    document.getElementById('ImgNFAvailable').style.width = factorImg + 'px';
    this.componentDidUpdate();
  };

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
