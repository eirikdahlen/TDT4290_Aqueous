import Webcam from 'react-webcam';
import React, { Component } from 'react';
import './css/VideoFeed.css';

class VideoFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoFeeds: {},
      deviceId: '',
      deviceLabel: '',
      width: 0,
      height: 0,
    };
  }
  // Function for updating size - is called when window is resized to make webcam fit window properly
  updateDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  switchFeed = event => {
    const label = event.target.innerHTML;
    const clickedFeed = this.state.videoFeeds[label];
    this.setState({ deviceId: clickedFeed, deviceLabel: label });
    var buttons = document.querySelectorAll('.videoButton');
    buttons.forEach(btn => {
      btn.classList.remove('selectedFeed');
    });
    event.target.classList.add('selectedFeed');
  };

  setVideoObject = videoFeeds => {
    let feeds = {};
    videoFeeds.forEach(feed => {
      let { label } = feed;
      label = label.substr(0, label.indexOf('(') - 1);
      feeds[label] = feed.deviceId;
    });
    this.setState({ videoFeeds: feeds });
  };

  setDefaultId = () => {
    let { videoFeeds } = this.state;
    const keys = Object.keys(videoFeeds);
    let ID = videoFeeds[keys[0]].deviceId;
    let label = keys[0];
    keys.forEach(key => {
      if (key.includes('Cam Link')) {
        ID = videoFeeds[key];
        label = key;
      }
    });
    this.setState({ deviceId: ID, deviceLabel: label });
  };

  init = () => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoFeeds = devices.filter(feed => {
        return feed.kind === 'videoinput';
      });
      this.setVideoObject(videoFeeds);
      this.setDefaultId();
      this.populateDropdown();
    });
  };

  populateDropdown = () => {
    const dropdown = document.getElementById('video-dropdown-content');
    dropdown.innerHTML = '';
    Object.keys(this.state.videoFeeds).forEach(key => {
      const btn = document.createElement('button');
      btn.onclick = this.switchFeed;
      btn.innerHTML = key;
      btn.classList.add('videoButton');
      if (key === this.state.deviceLabel) {
        btn.classList.add('selectedFeed');
      }
      dropdown.appendChild(btn);
    });
  };

  // componentDidMount is built-in function that is called after the inital rendering of the component
  // Adds eventlistener on resizing window, and updates width and height in state accordingly.
  componentDidMount() {
    this.init();
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
      <div className="VideoFeed">
        <div className="dropdown">
          <button className="dropbtn"></button>
          <div id="video-dropdown-content"></div>
        </div>
        <Webcam
          videoConstraints={{ deviceId: this.state.deviceId }}
          height={this.state.height}
          width={this.state.width}
        />
      </div>
    );
  }
}

export default VideoFeed;
