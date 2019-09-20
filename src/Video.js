// The App for the VideoWindow. This is where every video-component should go.


import React from 'react';
import drawBias from './VideoComponents/js/bias.js';
import { drawHeading, heading_init } from './VideoComponents/js/heading.js';
import { drawDepth, depth_init } from './VideoComponents/js/depth.js';
import './VideoComponents/css/overlay.css';
import './VideoComponents/css/Video.css';
import './VideoComponents/css/general.css';
import VideoFeed from './VideoComponents/VideoFeed';

class VideoApp extends React.Component {
  componentDidMount() {
    // Get the bias canvas

    // eslint-disable-next-line
    let canvas_bias = this.refs.canvasBias;
    let context_bias = canvas_bias.getContext('2d');

    // Get the heading canvas
    // eslint-disable-next-line
    let canvas_heading = this.refs.canvasHeading;
    let context_heading = canvas_heading.getContext('2d');

    // Get the depth canvas
    // eslint-disable-next-line
    let canvas_depth = this.refs.canvasDepth;
    let context_depth = canvas_depth.getContext('2d');

    // Initialize the heading and depth widgets (color, indicators, ...)
    heading_init(context_heading);
    depth_init(context_depth);

    // Function for redrawing all canvases in one interval
    function redraw_overlay() {
      drawBias(context_bias);
      drawHeading(context_heading);
      drawDepth(context_depth);
    }

    // Redraw the canvases continuously
    setInterval(redraw_overlay, 30);
  }

  render() {
    return (
      <div className="VideoApp">
        <canvas
          id="canvasBias"
          // eslint-disable-next-line
          ref="canvasBias"
          width={500}
          height={500}
        ></canvas>
        <canvas
          id="canvasHeading"
          // eslint-disable-next-line
          ref="canvasHeading"
          width={800}
          height={75}
        ></canvas>
        <canvas
          id="canvasDepth"
          // eslint-disable-next-line
          ref="canvasDepth"
          width={75}
          height={500}
        ></canvas>
        <VideoFeed />
      </div>
    );
  }
}

export default VideoApp;
