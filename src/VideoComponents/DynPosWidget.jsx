import React, { Component } from 'react';
import { clamp, mapRange } from './js/tools';

const { remote } = window.require('electron');

class DynPosWidget extends Component {
  constructor(props) {
    super(props);

    this.fontSizeDP = 14;
    this.distance = { north: 0, east: 0, down: 0, total: 0 };
  }

  calculateDistance(dataDP, fromROV) {
    this.distance.north = dataDP.north - fromROV.north;
    this.distance.east = dataDP.east - fromROV.east;
    this.distance.down = dataDP.down - fromROV.down;
    this.distance.total = Math.sqrt(
      Math.pow(this.distance.north, 2) +
        Math.pow(this.distance.east, 2) +
        Math.pow(this.distance.down, 2),
    );
  }

  updateDimensions = () => {
    const width = window.innerWidth;
    this.fontSizeDP = clamp(mapRange(width, 1000, 1500, 12, 14), 12, 14);
  };

  componentDidMount() {
    // Register event listener
    window.removeEventListener('resize', this.updateDimensions);

    this.updateDimensions();
  }

  componentDidUpdate() {
    this.updateDimensions();
  }

  componentWillUnmount() {
    // Unregister event listener
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    const dataDP = remote.getGlobal('dynamicpositioning');
    const fromROV = remote.getGlobal('fromROV');

    this.calculateDistance(dataDP, fromROV);

    return (
      <div id="DynPos" style={{ fontSize: this.fontSizeDP + 'px' }}>
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
              <td>{dataDP.north.toFixed(2)}</td>
              <td>{this.distance.north.toFixed(2)}</td>
            </tr>
            <tr>
              <td>East</td>
              <td>{dataDP.east.toFixed(2)}</td>
              <td>{this.distance.east.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Down</td>
              <td>{dataDP.down.toFixed(2)}</td>
              <td>{this.distance.down.toFixed(2)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Euclidean</td>
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
