import Webcam from 'react-webcam';
import React, { Component } from 'react';
import './css/VideoFeed.css';
import PropTypes from 'prop-types';

class VideoFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  // componentDidMount is built-in function that is called after the inital rendering of the component
  // Adds eventlistener on resizing window, and updates width and height in state accordingly.
  componentDidMount() {
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
        <Webcam
          videoConstraints={{ deviceId: this.props.deviceId }}
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
