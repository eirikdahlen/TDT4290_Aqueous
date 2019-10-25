import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './css/LockWidget.css';
import ImageLock from './images/lock.png';

class LockWidget extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  static get propTypes() {
    return {
      id: PropTypes.string,
      value: PropTypes.string,
      isLocked: PropTypes.bool,
    };
  }

  render() {
    return (
      <div
        id={this.props.id}
        className="LockWidget"
        style={{ visibility: this.props.isLocked ? 'visible' : 'hidden' }}
      >
        <img src={ImageLock} alt="" />
        <p>{this.props.value}</p>
      </div>
    );
  }
}

export default LockWidget;
