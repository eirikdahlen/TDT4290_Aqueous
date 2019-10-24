const net = require('net');
const { encodeData, decodeData } = require('./coding');
const { sendMessage } = require('./../utils/IPC');
const { encode, decode, messages } = require('./IMC');

const messageProtocols = {
  IMC: 'IMC',
  old: 'OLD',
};
let messageProtocol = messageProtocols.IMC;

// How many times the TCP has tried to connect and how many times it can try before quitting.
let connectionAttempts = 0;
const limitAttempts = 3;

// Creates a client that receives and sends data to port 5000
function getConnectedClient() {
  //console.log('Attempting to create TCP client and connect to server..');
  const client = new net.Socket();
  messageProtocol = global.settings.messageProtocol;
  console.log(messageProtocol);

  client.connect({
    port: global.settings.port,
    host: global.settings.host,
  });

  client.on('connect', function() {
    console.log(`Client: connection established with server!`);
    console.log(messageProtocol);

    if (messageProtocol === messageProtocols.old) {
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
    }
  });

  // Handles receiving data
  client.on('data', function(buf) {
    if (messageProtocol === messageProtocols.old) {
      let data = decodeData(buf);
      // console.log(`\n[${Date.now()}] Recieved data from server:`);
      // console.log(data);
      global.fromROV = data;
      sendMessage('data-received');
      sendData(client, global.toROV);
      sendMessage('data-sent');
    } else if (messageProtocol === messageProtocols.IMC) {
      decodeImcData(buf);
      sendIMCData(client);
    }
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
  //console.log(`\n[${Date.now()}] Sending byte array with data:`);
  //console.log(data);
  client.write(buf);
}

function decodeImcData(buf) {
  const recievedData = decode(buf);

  // Update mode
  /*
  global.mode = {
    currentMode: 0,
    nfAvailable: false,
    dpAvailable: false,
  };
*/
  const entityState = recievedData[messages.entityState];
  global.mode.nfAvailable = entityState.NF;
  global.mode.dpAvailable = entityState.DP;
  // TODO: Handle when ROV tells state is MANUAL

  const estimatedState = recievedData[messages.estimatedState];
  global.fromROV = {
    north: estimatedState.x,
    east: estimatedState.y,
    down: estimatedState.z,
    roll: estimatedState.phi,
    pitch: estimatedState.theta,
    yaw: estimatedState.psi,
  };
  sendMessage('data-received');
}

function sendIMCData(client) {
  /*
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
  */
  let desiredControlBuf = encode.desiredControl({
    x: global.toROV.surge,
    y: global.toROV.sway,
    z: global.toROV.heave,
    k: 0.0,
    m: global.toROV.pitch,
    n: global.toROV.yaw,
    flags: {
      x: true,
      y: true,
      z: !global.toROV.autodepth,
      k: false,
      m: true,
      n: !global.toROV.autoheading,
    },
  });

  client.write(desiredControlBuf);
  sendMessage('data-sent');
}

module.exports = { getConnectedClient, sendData };
