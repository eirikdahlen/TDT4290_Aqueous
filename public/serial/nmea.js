/*const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const nmea = require('nmea-0183');

class SerialPortObject {
  constructor(port, baudRate) {
    this.openPort(port, baudRate);
  }

  openPort(port, baudRate) {
    // Create the serial port with port and baud rate from global settings
    this.port = new SerialPort(port, {
      baudRate: baudRate,
    });

    // In case of errors: Allow the program to keep running!
    // Optional error message, disabled for now because tests will complain
    this.port.on('error', () => {
      //console.log('Could not connect to serial port ' + port);
    });

    // Set up a serial parser
    this.parser = new Readline();
    this.port.pipe(this.parser);

    // Run printNMEA every time data is received
    this.parser.on('data', printNMEA);
  }

  closePort() {
    this.port.close();
    this.port = null;
    this.parser = null;
  }
}

function printNMEA(line) {
  console.log(`> ${line}`);

  try {
    if (line.startsWith('$GPHDT')) {
      const heading = line.split(',')[1];
      global.boat.heading = parseFloat(heading);
      return;
    }
    // Parse the serial data with an NMEA0183 parser.
    // NMEA-0183 example message:
    // '$GPGGA,123519,4807.038,N,01131.324,E,1,08,0.9,545.4,M,46.9,M, , *42'
    var nmeaData = nmea.parse(line);

    // Show the result in console
    console.log(JSON.stringify(nmeaData, null, 2));

    // Update the global variable with the longitude, latitude and/or heading
    if ('latitude' in nmeaData) {
      global.boat.latitude = parseFloat(nmeaData.latitude);
    }

    if ('longitude' in nmeaData) {
      global.boat.longitude = parseFloat(nmeaData.longitude);
    }

    if ('heading' in nmeaData) {
      global.boat.heading = nmeaData.heading;
    }
  } catch {
    // Display an error if the serial message could not be NMEA-parsed.
    // This also ensures that the port stays open, so that listening can continue
    console.log('Message format not recognized');
  }
}

module.exports = { SerialPortObject };
*/
