const net = require('net');
const { encodeData, decodeData } = require('./coding');
const { encode, decode, messages } = require('./IMC/IMC');
const { sendVibrationRequest } = require('./../controls/mapping');

const messageLength = 256;

const messageProtocols = {
  IMC: 'IMC',
  old: 'OLD',
};
let messageProtocol = messageProtocols.IMC;

// How many times the TCP has tried to connect and how many times it can try before quitting.
let connectionAttempts = 0;
const limitAttempts = 5;

// Creates a client that receives and sends data to port 5000
function getConnectedClient() {
  //console.log('Attempting to create TCP client and connect to server..');
  const client = new net.Socket();
  messageProtocol = global.settings.messageProtocol;

  client.connect({
    port: global.settings.port,
    host: global.settings.host,
  });

  client.on('connect', function() {
    console.log(`Client: connection established with server!`);

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
    } else {
      sendIMCData(client);
    }
  });

  // Handles receiving data
  client.on('data', function(buf) {
    try {
      if (messageProtocol === messageProtocols.old) {
        let data = decodeData(buf);
        global.fromROV = data;
        sendData(client, global.toROV);
      } else if (messageProtocol === messageProtocols.IMC) {
        const fromROVIMC = decodeImcData(buf);
        global.fromROVIMC = fromROVIMC;
        const toROVIMC = sendIMCData(client);
        global.toROVIMC = toROVIMC;
      }
    } catch (error) {
      console.log('Unable to decode message:');
      console.log(
        `Buffer: ${buf
          .toString('hex')
          .match(/../g)
          .join(' ')}`,
      );
      console.log(`Buffer length: ${buf.length}`);

      console.log(error.message);
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
  global.mode.nfAvailable = entityState.flags.NF;
  global.mode.dpAvailable = entityState.flags.DP;
  // TODO: Handle when ROV tells state is MANUAL
  if (currentModeUnavailable()) {
    setSafetyControls();
  }

  const customEstimatedState = recievedData[messages.customEstimatedState];
  global.fromROV = {
    north: customEstimatedState.x,
    east: customEstimatedState.y,
    down: customEstimatedState.z,
    roll: customEstimatedState.phi,
    pitch: customEstimatedState.theta,
    yaw: customEstimatedState.psi,
  };
  return recievedData;
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
  let buf;
  const { currentMode, manual, dp, nf } = global.mode;
  if (currentMode === manual) {
    // MANUAL MODE
    const desiredControl = {
      x: global.toROV.surge,
      y: global.toROV.sway,
      z: global.toROV.autodepth ? 0 : global.toROV.heave,
      k: 0.0,
      m: global.toROV.pitch,
      n: global.toROV.autoheading ? 0 : global.toROV.yaw,
      flags: {
        x: false,
        y: false,
        z: global.toROV.autodepth,
        k: true,
        m: false,
        n: global.toROV.autoheading,
      },
    };
    buf = encode.desiredControl(desiredControl);

    if (global.toROV.autodepth) {
      /*eslint-disable */
      const lowLevelControlManeuverDesiredZBuf = encode.lowLevelControlManeuver.desiredZ(
        /*eslint-enable */
        {
          value: global.toROV.heave,
          z_units: 0,
        },
        10,
      );
      buf = encode.combine([buf, lowLevelControlManeuverDesiredZBuf]);
    }

    if (global.toROV.autoheading) {
      /*eslint-disable */
      const lowLevelControlManeuverDesiredHeadingBuf = encode.lowLevelControlManeuver.desiredHeading(
        /*eslint-enable */

        { value: global.toROV.yaw },
        10,
      );
      buf = encode.combine([buf, lowLevelControlManeuverDesiredHeadingBuf]);
    }
  }
  if (currentMode === dp) {
    // DYNAMIC POSITIONING

    // TODO: Get proper value from global state
    buf = encode.customGoTo({
      timeout: 10,
      x: global.dynamicpositioning.north,
      y: global.dynamicpositioning.east,
      z: global.dynamicpositioning.down,
      yaw: global.dynamicpositioning.yaw,
    });
  }

  if (currentMode === nf) {
    // NET FOLLOWING

    /*
    global.netfollowing = {
      distance: 0,
      velocity: 0,
      degree: 0,
      depth: 0,
    };
*/
    buf = encode.netFollow({
      timeout: 10,
      d: global.netfollowing.distance,
      v: global.netfollowing.velocity,
      z: global.netfollowing.depth,
      z_units: 0,
    });
  }
  client.write(encode.combine([buf], messageLength));
  return decode(buf);
}

// Checks if currentmode is available
function currentModeUnavailable() {
  const { currentMode, dpAvailable, nfAvailable } = global.mode;
  return (
    (currentMode === 1 && !dpAvailable) || (currentMode === 2 && !nfAvailable)
  );
}

// Sets to manual and locks autoheading and autodepth at current depth and heading
function setSafetyControls() {
  global.mode.currentMode = 0; // Switch to manual
  global.toROV.autodepth = true; // Start autodepth
  global.toROV.autoheading = true; // Start autoheading
  global.toROV.heave = global.fromROV.down; // Sets heave to current down - heave is used by autodepth
  global.toROV.yaw = global.fromROV.yaw; // Sets yaw to current yaw - yaw is used by autoheading
  sendVibrationRequest(false); // Sends hard vibration to gamepad
}

module.exports = { getConnectedClient, sendData, sendIMCData, decodeImcData };
