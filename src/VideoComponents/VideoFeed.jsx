import Webcam from 'react-webcam';
import React, { Component } from 'react';
import './css/VideoFeed.css';
import PropTypes from 'prop-types';

class VideoFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: {},
      currentID: '',
      currentLabel: '',
      width: 0,
      height: 0,
    };
    this.loaded = false;
  }

  // Function for updating size - is called when window is resized to make webcam fit window properly
  updateDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Switches feed when a feed-button is clicked
  switchFeed = event => {
    const btnClicked = event.target;
    const clickedLabel = btnClicked.innerHTML;
    const clickedID = this.state.devices[clickedLabel];
    this.setState({ currentID: clickedID, currentLabel: clickedLabel });
    // Adds selected-styling only to the button recently clicked
    const buttons = document.querySelectorAll('.videoButton');
    buttons.forEach(btn => {
      btn.classList.remove('selectedFeed');
    });
    btnClicked.classList.add('selectedFeed');
  };

  // Takes in a list of devices and sets the state to the data needed
  setVideoObject = devices => {
    let feeds = {};
    devices.forEach(feed => {
      let { label } = feed;
      label = label.substr(0, label.indexOf('(') - 1);
      if (!label) {
        label = 'Unlabeled Video Input';
      }
      feeds[label] = feed.deviceId;
    });
    this.setState({ devices: feeds });
  };

  // Sets Cam Link as default cam to use, but if it is not connected we use the first cam
  setDefaultID = () => {
    let { devices } = this.state;
    const keys = Object.keys(devices);
    let ID = devices[keys[0]].currentID;
    let label = keys[0];
    keys.forEach(key => {
      if (key.includes('Cam Link')) {
        ID = devices[key];
        label = key;
      }
    });
    this.setState({ currentID: ID, currentLabel: label });
  };

  init = () => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const feeds = devices.filter(feed => {
        return feed.kind === 'videoinput';
      });
      this.setVideoObject(feeds);
      if (!this.loaded) {
        this.setDefaultID();
      }
      this.populateDropdown();
      this.loaded = true;
    });
  };

  // Creates buttons inside the dropdown menu based on the devices-state
  populateDropdown = () => {
    const dropdown = document.getElementById('video-dropdown-content');
    dropdown.innerHTML = '';
    Object.keys(this.state.devices).forEach(key => {
      const btn = document.createElement('button');
      btn.onclick = this.switchFeed;
      btn.innerHTML = key;
      btn.classList.add('videoButton');
      if (key === this.state.currentLabel) {
        btn.classList.add('selectedFeed');
      }
      dropdown.appendChild(btn);
    });
  };

  // componentDidMount is built-in function that is called after the inital rendering of the component
  // Adds eventlistener on resizing window, and updates width and height in state accordingly.
  componentDidMount() {
    navigator.mediaDevices.ondevicechange = this.init;
    this.updateDimensions();
    window.addEventListener('resize', e => {
      e.preventDefault();
      this.updateDimensions();
    });
  }

  // Built in function for when component is removed
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    return (
      <div className={this.props.hidden ? 'hideVideoFeed' : 'VideoFeed'}>
        <div className="dropdown">
          <button className="dropbtn"></button>
          <div id="video-dropdown-content"></div>
        </div>
        <Webcam
          videoConstraints={{ deviceId: this.state.currentID }}
          height={this.state.height}
          width={this.state.width}
        />
      </div>
    );
  }
}

VideoFeed.propTypes = {
  hidden: PropTypes.bool,
};

export default VideoFeed;
