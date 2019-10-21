import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NetFollowingWidget from './NetFollowingWidget';
import './css/ModeWidget.css';
import redX from './images/redX.png';
import greenCheckmark from './images/greenCheckmark.png';
import ModeEnum from '../constants/modeEnum';
import { clamp, mapRange } from './js/tools.js';
import DynPosWidget from './DynPosWidget';

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
    // Add an event listener to be able to scale the widget along with the window
    window.addEventListener('resize', this.updateDimensions);

    const { currentMode } = this.props;
    // Get the correct label for the current mode
    this.modeLabel = modeToLabel[currentMode];

    if (currentMode === ModeEnum.DYNAMICPOSITIONING) {
      this.widget = (
        <DynPosWidget currentNorth={3} currentEast={2} currentDown={5} />
      );
    } else if (currentMode === ModeEnum.NETFOLLOWING) {
      // Show the net following widget
      const dataNF = remote.getGlobal('netfollowing');
      this.widget = (
        <NetFollowingWidget
          distance={dataNF['distance']}
          velocity={dataNF['velocity']}
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

    if (this.props.currentMode === ModeEnum.MANUAL) {
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
