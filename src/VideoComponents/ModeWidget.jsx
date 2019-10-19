import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NetFollowingWidget from './NetFollowingWidget';
import './css/ModeWidget.css';
import redX from './images/redX.png';
import greenCheckmark from './images/greenCheckmark.png';
import ModeEnum from '../constants/modeEnum';
import { clamp, mapRange } from './js/tools.js';

const { remote } = window.require('electron');

// Defining this the shorthand way did not work for some reason?
// Adding elements one by one instead
const modeToLabel = {};
modeToLabel[ModeEnum.MANUAL] = 'MANUAL';
modeToLabel[ModeEnum.DYNAMICPOSITIONING] = 'DYN. POS.';
modeToLabel[ModeEnum.NETFOLLOWING] = 'NET FOLLOWING';

class ModeWidget extends Component {
  constructor(props) {
    super(props);

    // Initial variable values
    this.modeLabel = 'INVALID';
    this.imgsrc = null;
    this.opacityStyle = null;
    this.widget = null;

    if (this.props.nfAvailable) {
      // Net following available
      this.nfLabel = 'NET FOLLOWING AVAILABLE';
      this.imgsrc = greenCheckmark;
      this.opacityStyle = 'NFAvailable';
    } else {
      // Net following unavailable
      this.nfLabel = 'NET FOLLOWING UNAVAILABLE';
      this.imgsrc = redX;
      this.opacityStyle = 'NFUnavailable';
    }

    this.componentDidMount();
  }

  componentDidMount() {
<<<<<<< 2b11f6bcbaf24caad20de6153a9ad4c1ca546c8e
    // Add an event listener to be able to scale the widget along with the window
    window.addEventListener('resize', this.updateDimensions);

    // Get the correct label for the current mode
    this.modeLabel = modeToLabel[this.props.globalMode];

    if (this.props.globalMode === ModeEnum.NETFOLLOWING) {
      // Show the net following widget
      this.widget = (
        <NetFollowingWidget
          distance={remote.getGlobal('netfollowing')['distance']}
          velocity={remote.getGlobal('netfollowing')['velocity']}
        />
      );
    } else {
      // Show the NF availability widget
      this.widget = (
        <div className={'NFAvailability ' + this.opacityStyle}>
          <img id="ImgNFAvailable" src={this.imgsrc} alt=""></img>
          <div>{this.nfLabel}</div>
        </div>
      );
=======
    switch (this.props.currentMode) {
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
        if (remote.getGlobal('mode')['currentMode'] === ModeEnum.NETFOLLOWING) {
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
>>>>>>> #122 fix: fix bug in modewidget from refactoring global variable
    }
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  componentWillUnmount() {
    // Unregister event listener
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    // Scale text of the mode label
    var sizeMode = mapRange(window.innerWidth, 1000, 1500, 12, 20);
    sizeMode = clamp(sizeMode, 12, 20);
    document.getElementsByClassName('ModeWidget')[0].style.fontSize =
      sizeMode + 'px';

    if (this.props.globalMode !== ModeEnum.NETFOLLOWING) {
      // Scale the NF availability text
      var sizeNF = mapRange(window.innerWidth, 1000, 1500, 12, 14);
      sizeNF = clamp(sizeNF, 12, 14);
      document.getElementsByClassName('NFAvailable')[0].style.fontSize =
        sizeNF + 'px';

      // Scale the NF availability icon
      var sizeImg = mapRange(window.innerWidth, 1000, 1500, 15, 25);
      sizeImg = clamp(sizeImg, 15, 25);
      document.getElementById('ImgNFAvailable').style.width = sizeImg + 'px';
      this.componentDidUpdate();
    }
  };

  static get propTypes() {
    return {
      currentMode: PropTypes.number,
      nfAvailable: PropTypes.bool,
    };
  }

  render() {
    return (
      <div className="ModeWidget">
        {this.widget}
        <p>{this.modeLabel}</p>
      </div>
    );
  }
}

export default ModeWidget;
export { ModeEnum };
