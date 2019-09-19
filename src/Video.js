// The App for the VideoWindow. This is where every video-component should go.

import React from 'react';
import drawBias from './VideoComponents/js/bias.js';
import { drawHeading, heading_init } from './VideoComponents/js/heading.js';
import { drawDepth, depth_init } from './VideoComponents/js/depth.js';
import './VideoComponents/css/overlay.css';

class VideoApp extends React.Component {
  constructor(props) {
    super(props);
    this.canvas_ref_bias = React.createRef();
    this.canvas_ref_heading = React.createRef();
    this.canvas_ref_depth = React.createRef();
  }
  componentDidMount() {
    // Get the bias canvas
    let canvas_bias = this.canvas_ref_bias.current;
    let context_bias = canvas_bias.getContext('2d');

    // Get the heading canvas
    let canvas_heading = this.canvas_ref_heading.current;
    let context_heading = canvas_heading.getContext('2d');

    // Get the depth canvas
    let canvas_depth = this.canvas_ref_depth.current;
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
          ref={this.canvas_ref_bias}
          width={500}
          height={500}
        ></canvas>
        <canvas
          id="canvasHeading"
          ref={this.canvas_ref_heading}
          width={800}
          height={75}
        ></canvas>
        <canvas
          id="canvasDepth"
          ref={this.canvas_ref_depth}
          width={75}
          height={500}
        ></canvas>
      </div>
    );
  }
}

export default VideoApp;
