import React, { Component } from 'react';
import PropTypes from 'prop-types';

const { remote } = window.require('electron');

class DynPosWidget extends Component {
  constructor(props) {
    super(props);

    this.distance = { north: 0, east: 0, down: 0, total: 0 };
  }

  calculateDistance(dataDP) {
    this.distance.north = this.props.currentNorth - dataDP['latitude'];
    this.distance.east = this.props.currentEast - dataDP['longitude'];
    this.distance.down = this.props.currentDown - dataDP['depth'];
    this.distance.total = Math.sqrt(
      Math.pow(this.distance.north, 2) +
        Math.pow(this.distance.east, 2) +
        Math.pow(this.distance.down, 2),
    );
  }

  static get propTypes() {
    return {
      currentNorth: PropTypes.number,
      currentEast: PropTypes.number,
      currentDown: PropTypes.number,
    };
  }

  render() {
    const dataDP = remote.getGlobal('dynamicpositioning');

    this.calculateDistance(dataDP);

    return (
      <div id="DynPos">
        <table>
          <thead>
            <tr>
              <td>DIR</td>
              <td>TARGET</td>
              <td>DIST</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>North</td>
              <td>{dataDP['latitude'].toFixed(2)}</td>
              <td>{this.distance.north.toFixed(2)}</td>
            </tr>
            <tr>
              <td>East</td>
              <td>{dataDP['longitude'].toFixed(2)}</td>
              <td>{this.distance.east.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Down</td>
              <td>{dataDP['depth'].toFixed(2)}</td>
              <td>{this.distance.down.toFixed(2)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td></td>
              <td>{this.distance.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default DynPosWidget;
