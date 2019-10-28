const { SerialPortObject } = require('../serial/nmea');

const initGlobals = () => {
  // Global settings for TCP port and IP adress, as well as the "start serial port"-file
  global.settings = {
    port: 5000,
    host: '127.0.0.1',
    serialFile:
      'C:/_work/FhSim/sfhdev/FhSimPlayPen_vs14_amd64/bin/aquaculturerobotics/runrtvisrunROV_ILOS_1.bat',
    messageProtocol: 'OLD',
    boatSerialPort: 'COM2',
    boatSerialBaudRate: 4800,
    boatSerialPortObject: null,
  };

  // Initialize a serial object with the port and baud rate given in the global settings
  global.settings.boatSerialPortObject = new SerialPortObject(
    global.settings.boatSerialPort,
    global.settings.boatSerialBaudRate,
  );

  // Global state objects
  global.toROV = {
    surge: 0.0,
    sway: 0.0,
    heave: 0.0,
    roll: 0.0,
    pitch: 0.0,
    yaw: 0.0,
    autodepth: false,
    autoheading: false,
  };
  global.fromROV = {
    north: 0.0,
    east: 0.0,
    down: 0.0,
    roll: 0.0,
    pitch: 0.0,
    yaw: 0.0,
  };
  global.bias = {
    surge: 0.0,
    sway: 0.0,
    heave: 0.0,
  };

  /**
   * Global mode variable
   * 0 - Manual
   * 1 - DP mode
   * 2 - NF mode
   */
  global.mode = {
    currentMode: 0,
    nfAvailable: true,
    dpAvailable: true,
  };

  /**
   * In IMC, positive and negative values of velocity is also indicating port/starboard direction
   * Positive velocity values: Starboard / styrbord
   * Negative velocity values: Port / babord
   * Direction property is therefore not needed
   */
  global.netfollowing = {
    distance: 0,
    velocity: 0,
    degree: 0,
    depth: 0,
  };

  /**
   * Add correct settings later
   * Placeholders for X, Y, Z for now
   */
  global.dynamicpositioning = {
    latitude: 0,
    longitude: 0,
    heading: 0,
    depth: 0,
  };

  // Boat position and heading
  global.boat = {
    latitude: 0,
    longitude: 0,
    heading: 0,
  };
};

module.exports = { initGlobals };
