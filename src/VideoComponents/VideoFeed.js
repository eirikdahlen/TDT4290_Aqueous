import Webcam from "react-webcam";
import React, { Component } from "react";

class VideoFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  updateDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener("resize", e => {
      e.preventDefault();
      this.updateDimensions();
    });
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  render() {
    return (
      <div>
        <Webcam height={this.state.height} width={this.state.width} />
      </div>
    );
  }
}

export default VideoFeed;
