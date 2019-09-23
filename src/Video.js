/* eslint-disable max-len */
// The App for the VideoWindow. This is where every video-component should go.

import React from 'react';
import { CanvasBias } from './VideoComponents/canvasComponents/component_bias.js';
import { CanvasHeading } from './VideoComponents/canvasComponents/component_heading.js';
import { CanvasDepth } from './VideoComponents/canvasComponents/component_depth.js';
import './VideoComponents/css/overlay.css';
import './VideoComponents/css/Video.css';
import './VideoComponents/css/general.css';
import VideoFeed from './VideoComponents/VideoFeed';

class VideoApp extends React.Component {
  render() {
    return (
      <div className="VideoApp">
        <CanvasBias u={0.7} v={0.5} w={0.3} />
        <CanvasHeading heading={72.57387} />
        <CanvasDepth depth={1.25479} />
        <VideoFeed />
      </div>
    );
  }
}

export default VideoApp;
