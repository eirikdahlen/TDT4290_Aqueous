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

    this.state = {
      fontSizeMode: 14,
    };

    // Initial variable values
    this.modeLabel = 'INVALID';
    this.widget = null;

    this.componentDidMount();
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

  updateDimensions = () => {
    const width = window.innerWidth;

    // Scale text of the mode label
    this.setState({
      fontSizeMode: clamp(mapRange(width, 1000, 1500, 12, 20), 12, 20),
    });
    this.setState({
      fontSizeNFAvail: clamp(mapRange(width, 1000, 1500, 12, 14), 12, 14),
    });
    this.setState({
      sizeImgNFAvail: clamp(mapRange(width, 1000, 1500, 15, 25), 15, 25),
    });
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
        style={{ fontSize: this.state.fontSizeMode + 'px' }}
        onLoad={this.updateDimensions}
      >
        {this.widget}
        <p>{this.modeLabel}</p>
      </div>
    );
  }
}

export default ModeWidget;
export { ModeEnum };
