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
      <div className="VideoFeed">
        <Webcam height={this.state.height} width={this.state.width} />
      </div>
    );
  }
}

export default VideoFeed;
