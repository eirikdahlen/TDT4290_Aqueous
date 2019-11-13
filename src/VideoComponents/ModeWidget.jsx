import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NetFollowingWidget from './NetFollowingWidget';
import './css/ModeWidget.css';
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

    this.state = this.calculateDimensions();

    // Initial variable values
    this.modeLabel = 'INVALID';
    this.widget = null;
  }

  componentDidMount() {
    // Add an event listener to be able to scale the widget along with the window
    window.addEventListener('resize', this.updateDimensions);

    this.componentDidUpdate();
    this.updateDimensions();
  }

  componentDidUpdate() {
    const { currentMode } = this.props;
    // Get the correct label for the current mode
    this.modeLabel = modeToLabel[currentMode];

    if (currentMode === ModeEnum.DYNAMICPOSITIONING) {
      this.widget = <DynPosWidget />;
    } else if (currentMode === ModeEnum.NETFOLLOWING) {
      // Show the net following widget
      const dataNF = remote.getGlobal('netfollowing');
      this.widget = (
        <NetFollowingWidget
          distance={dataNF.distance}
          velocity={dataNF.velocity}
        />
      );
    } else {
      // Don't show the net following widget
      this.widget = null;
    }
  }

  componentWillUnmount() {
    // Unregister event listener
    window.removeEventListener('resize', this.updateDimensions);
  }

  calculateDimensions() {
    const width = window.innerWidth;

    return {
      fontSizeMode: clamp(mapRange(width, 1000, 1500, 12, 20), 12, 20),
      fontSizeNFAvail: clamp(mapRange(width, 1000, 1500, 12, 14), 12, 14),
      sizeImgNFAvail: clamp(mapRange(width, 1000, 1500, 15, 25), 15, 25),
      divWidth: clamp(mapRange(width, 1000, 1500, 200, 250), 200, 250),
    };
  }

  updateDimensions = () => {
    // Scale text of the mode label
    this.setState(this.calculateDimensions());
  };

  static get propTypes() {
    return {
      currentMode: PropTypes.number,
    };
  }

  render() {
    return (
      <div
        className="ModeWidget"
        style={{
          fontSize: this.state.fontSizeMode + 'px',
          width: this.state.divWidth,
        }}
        onLoad={this.updateDimensions}
      >
        <p>{this.modeLabel}</p>
        {this.widget}
      </div>
    );
  }
}

export default ModeWidget;
export { ModeEnum };
