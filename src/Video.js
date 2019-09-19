// The App for the VideoWindow. This is where every video-component should go.

import React from 'react';
import drawBias from './VideoComponents/js/bias.js';
import { drawHeading, heading_init } from './VideoComponents/js/heading.js';
import { drawDepth, depth_init } from './VideoComponents/js/depth.js';
import './VideoComponents/css/overlay.css';

class VideoApp extends React.Component {
  render() {
    return (
      <div>
        <CanvasBias u={1.0} v={0.5} w={0.3} />
        <CanvasHeading heading={50} />
        <CanvasDepth depth={1.5} />
      </div>
    );
  }
}

class CanvasBias extends React.Component {
  constructor(props) {
    super(props);
    this.saveContext = this.saveContext.bind(this);
  }

  saveContext(ctx) {
    this.ctx = ctx;
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { u, v, w } = this.props;
    drawBias(this.ctx, u, v, w);
  }

  render() {
    return <PureCanvasBias contextRef={this.saveContext}></PureCanvasBias>;
  }
}

class PureCanvasBias extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <canvas
        id="canvasBias"
        width={500}
        height={500}
        ref={node =>
          // eslint-disable-next-line react/prop-types
          node ? this.props.contextRef(node.getContext('2d')) : null
        }
      />
    );
  }
}

class CanvasHeading extends React.Component {
  constructor(props) {
    super(props);
    this.saveContext = this.saveContext.bind(this);
  }

  saveContext(ctx) {
    this.ctx = ctx;
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { heading } = this.props;
    heading_init(this.ctx);
    drawHeading(this.ctx, heading);
  }

  render() {
    return (
      <PureCanvasHeading contextRef={this.saveContext}></PureCanvasHeading>
    );
  }
}

class PureCanvasHeading extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <canvas
        id="canvasHeading"
        width={800}
        height={75}
        ref={node =>
          // eslint-disable-next-line react/prop-types
          node ? this.props.contextRef(node.getContext('2d')) : null
        }
      />
    );
  }
}

class CanvasDepth extends React.Component {
  constructor(props) {
    super(props);
    this.saveContext = this.saveContext.bind(this);
  }

  saveContext(ctx) {
    this.ctx = ctx;
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { depth } = this.props;
    depth_init(this.ctx);
    drawDepth(this.ctx, depth);
  }

  render() {
    return <PureCanvasDepth contextRef={this.saveContext}></PureCanvasDepth>;
  }
}

class PureCanvasDepth extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <canvas
        id="canvasDepth"
        width={75}
        height={500}
        ref={node =>
          // eslint-disable-next-line react/prop-types
          node ? this.props.contextRef(node.getContext('2d')) : null
        }
      />
    );
  }
}

export default VideoApp;
