const net = require('net');
const ROVPort = 5000;
const { encodeData, decodeData } = require('./coding');
const { sendReceivedMessage } = require('./../IPC');

// Variable for keeping track of connection status - used to handle ECONNREFUSED error
let connected = false;

// Creates a client that receives and sends data to port 5000
function getConnectedClient() {
  console.log('Attempting to create TCP client and connect to server..');
  const client = new net.Socket();

  client.connect({
    port: ROVPort,
  });

  client.on('connect', function() {
    console.log(`Client: connection established with server!`);
    sendData(client, {
      surge: 0.0,
      sway: 0.0,
      heave: 0.0,
      roll: 0.0,
      pitch: 0.0,
      yaw: 0.0,
      autodepth: false,
      autoheading: false,
    });
  });

  // Handles receiving data
  client.on('data', function(data) {
    data = decodeData(data);
    console.log(`\n[${Date.now()}] Recieved data from server:`);
    console.log(data);
    global.fromROV = data;
    sendReceivedMessage();
    sendData(client, global.toROV);
  });

  // Tries to connect again if server is not opened yet
  client.on('error', function(err) {
    const { code } = err;
    if (code === 'ECONNREFUSED' && !connected) {
      console.log('Attempt failed :( Trying again in 500ms..');
      setTimeout(getConnectedClient, 500);
    } else if (code === 'ECONNREFUSED' && connected) {
      console.log('ROV server closed');
      connected = false;
    }
  });
  return client;
}

function sendData(client, data) {
  /**
   * data should be a object with these fields:
   * {'surge': number,
   *  'sway': number,
   *  'heave': number,
   *  'roll': number,
   *  'pitch': number,
   *  'yaw': number,
   *  'autodepth': bool,
   *  'autoheading': bool
   * }
   */
  let buf = encodeData(data);
  console.log(`\n[${Date.now()}] Sending byte array with data:`);
  console.log(data);
  client.write(buf);
}

module.exports = { getConnectedClient, sendData };
