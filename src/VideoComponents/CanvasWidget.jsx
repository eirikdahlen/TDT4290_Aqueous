import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './css/CanvasWidget.css';

// The canvas classes are split into two main types: Canvases and PureCanvases.
// The higher-level Canvas classes handle the context and drawing. The lower-level PureCanvas classes
// is closer to the HTML canvas element in that it defines dimensions and id, as well
// as specify that the Canvas React element should not be removed and re-added, as
// would happen in animation.

class CanvasWidget extends Component {
  // Base class for all higher-level elements
  constructor(props, purewidget) {
    super(props);
    this.saveContext = this.saveContext.bind(this);
    this.purewidget = purewidget; // This is the class rendering the raw html canvas element
  }

  saveContext(ctx) {
    // Method for saving the canvas context
    this.ctx = ctx;
  }

  // Function for scaling canvas widgets when resizing video window
  updateDimensions = () => {
    this.scaleFunction(this.ctx, this.initialWidth, this.initialHeight);
    this.componentDidUpdate();
  };

  // This is the method calling the functions to actually draw on the canvas
  componentDidMount() {
    // Add resize event listener, to be able to resize widgets along with the window
    window.addEventListener('resize', this.updateDimensions);

    this.updateDimensions();
    this.componentDidUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    // Render the canvas using the widget given in the constructor
    return <this.purewidget contextRef={this.saveContext}></this.purewidget>;
  }
}

class PureCanvas extends Component {
  // Base class for all the lower-level canvas elements
  constructor(props, id, width, height) {
    super(props);
    this.id = id;
    this.width = width;
    this.height = height;
  }

  static get propTypes() {
    // This defines the data types that the contextRef property can have
    return {
      contextRef: PropTypes.any,
    };
  }

  // In case of any change (eg. animation), this component should never update.
  // The redrawing is handled within the canvas element itself.
  shouldComponentUpdate() {
    return false;
  }

  // Render the actual HTML canvas element
  render() {
    return (
      <canvas
        className={this.id}
        width={this.width}
        height={this.height}
        ref={node =>
          node ? this.props.contextRef(node.getContext('2d')) : null
        }
      />
    );
  }
}

export { CanvasWidget, PureCanvas };
