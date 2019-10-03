import Webcam from 'react-webcam';
import React, { Component } from 'react';

class VideoFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // Function for updating size - is called when window is resized to make webcam fit window properly
  updateDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  setDeviceId = () => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoFeeds = devices.filter(el => {
        return el.kind === 'videoinput';
      });
      console.log(videoFeeds);
      let chosenFeedId = '';
      if (videoFeeds.length === 1) {
        chosenFeedId = videoFeeds[0].deviceId;
      } else {
        const camLinkFeed = videoFeeds.filter(feed => {
          return feed.label.indexOf('Cam Link') >= 0;
        });
        chosenFeedId = camLinkFeed.deviceId;
      }
      this.setState({ deviceId: chosenFeedId });
    });
  };

  // componentDidMount is built-in function that is called after the inital rendering of the component
  // Adds eventlistener on resizing window, and updates width and height in state accordingly.
  componentDidMount() {
    this.setDeviceId();
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
