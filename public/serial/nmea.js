const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const nmea = require('nmea-0183');

// Function for opening a serial port to listen to boat coordinate messages
function openSerialPort() {
  // Create the serial port with port and baud rate from global settings
  const port = new SerialPort(global.settings.boatSerialPort, {
    baudRate: global.settings.boatSerialBaudRate,
  });

  // Set up a serial parser
  const parser = new Readline();
  port.pipe(parser);

  // Run printNMEA every time data is received
  parser.on('data', printNMEA);
}

function printNMEA(line) {
  console.log(`> ${line}`);

  try {
    // Parse the serial data with an NMEA0183 parser.
    // NMEA-0183 example message:
    // '$GPGGA,123519,4807.038,N,01131.324,E,1,08,0.9,545.4,M,46.9,M, , *42'
    var nmeaData = nmea.parse(line);

    // Show the result in console
    console.log(JSON.stringify(nmeaData, null, 2));

    // Update the global variable with the longitude and latitude
    global.boatposition = {
      latitude: parseFloat(nmeaData.latitude),
      longitude: parseFloat(nmeaData.longitude),
    };
  } catch {
    // Display an error if the serial message could not be NMEA-parsed.
    // This also ensures that the port stays open, so that listening can continue
    console.log('Message is not in NMEA183 format');
  }
}

// npm i
// yarn install
// yarn electron-rebuild

module.exports = { openSerialPort };
