const net = require('net');
const { encodeData, decodeData } = require('./coding');
const { sendMessage } = require('./../utils/IPC');

// How many times the TCP has tried to connect and how many times it can try before quitting.
let connectionAttempts = 0;
const limitAttempts = 3;

// Creates a client that receives and sends data to port 5000
function getConnectedClient() {
  console.log('Attempting to create TCP client and connect to server..');
  const client = new net.Socket();

  client.connect({
    port: global.settings.port,
    host: global.settings.host,
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
    sendMessage('data-received');
    sendData(client, global.toROV);
    sendMessage('data-sent');
  });

  // Tries to connect again if server is not opened yet
  client.on('error', function(err) {
    const { code } = err;
    if (code === 'ECONNREFUSED') {
      if (connectionAttempts < limitAttempts) {
        connectionAttempts += 1;
        console.log('Connection attempt failed. Trying again in 500ms..');
        setTimeout(getConnectedClient, 500);
      } else {
        console.log(
          `Giving up after ${connectionAttempts + 1} connection attempts. `,
        );
        connectionAttempts = 0;
      }
      client.destroy();
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
   *  'autoheading': bool,
   * }
   */
  let buf = encodeData(data);
  console.log(`\n[${Date.now()}] Sending byte array with data:`);
  console.log(data);
  client.write(buf);
}

module.exports = { getConnectedClient, sendData };
