const net = require('net');
const { encode, decode, messages } = require('./IMC');
const { ipcMain } = require('electron');

const port = 5000;

// States for IMC ==============================================
/* eslint-disable no-unused-vars */

const states = {
  manual: 0,
  DP: 1,
  NF: 2,
};

/* eslint no-unused-vars: ["error", { "args": "none" }] */
// FROM ROV ==============================================
let entityState = {
  state: states.manual,
  flags: {
    DP: true,
    NF: true,
  },
};

let estimatedState = {
  lat: 0.0,
  lon: 0.0,
  height: 0.0,
  x: 0.0,
  y: 0,
  z: 0,
  phi: 0,
  theta: 0,
  psi: 0,
  u: 0,
  v: 0,
  w: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  p: 0,
  q: 0,
  r: 0,
  depth: 0,
  alt: 0,
};

let customNetFollow = {
  d: 132,
  v: 1.1,
  angle: 2.2,
};
// FROM ROV END ========================================

// TO ROV ==============================================
// MANUAL MODE
let desiredControl = {
  x: 0,
  y: 0,
  z: 0,
  k: 0,
  m: 0,
  n: 0,
  flags: {
    x: true,
    y: true,
    z: true,
    k: true,
    m: true,
    n: true,
  },
};

let lowLevelControlManeuver = {
  desiredHeading: {
    control: { value: 0, z_units: 0 },
    duration: 0,
  },
  desiredZ: {
    control: { value: 0, z_units: 0 },
    duration: 0,
  },
};
// MANUAL MODE END

// DP MODE
let goTo = {
  timeout: 0,
  lat: 0,
  lon: 0,
  z: 0,
  z_units: 0,
  speed: 0,
  speed_units: 0,
  roll: 0,
  pitch: 0,
  yaw: 0,
};
// DP MODE END

// NF MODE
let netFollow = {
  timeout: 132,
  d: 1.1,
  v: 2.2,
  z: 3.3,
  z_units: 3,
};
// NF MODE END
// TO ROV END===========================================

/* eslint-disable no-unused-vars */
// End states IMC ==============================================

const ipcCommunicationTCPServer = () => {
  console.log('Starting ipcCommunicationTCPServer');

  ipcMain.on('rov-mock-up-send-estimated-state', (event, arg) => {
    estimatedState = arg;
    console.log('Received rov-mock-up-send-estimated-state:', estimatedState);
  });

  ipcMain.on('rov-mock-up-send-custom-nf-state', (event, arg) => {
    customNetFollow = arg;
    console.log('Received rov-mock-up-send-custom-nf-state:', customNetFollow);
  });

  ipcMain.on('rov-mock-up-send-df-available', (event, arg) => {
    entityState.flags.DP = arg;
    console.log('Received rov-mock-up-send-df-available:', entityState);
  });

  ipcMain.on('rov-mock-up-send-nf-available', (event, arg) => {
    entityState.flags.NF = arg;
    console.log('Received rov-mock-up-send-nf-available:', entityState);
  });

  ipcMain.on('startROVMockupServer', () => startServer());
};

const startServer = () => {
  console.log(`Waiting for client to connect to port ${port}`);

  const server = new net.createServer(socket => {
    console.log(`TCP Server bound to port ${port}.`);

    socket.on('data', buf => {
      console.log(`[${Date.now()}] Recieved data from client:`);
      const recievedData = decode(buf);
      try {
        global.mockupWindow.webContents.send(
          'rov-mock-up-send-data',
          recievedData,
        );
      } catch (error) {
        console.log('Could not send more data');
        socket.destroy();
        return;
      }
      console.log(decode(buf));
      Object.keys(recievedData).map(message => {
        switch (message) {
          case messages.desiredControl:
            // Is in manual mode
            if (entityState.state !== states.manual) {
              entityState.state = states.manual;
              global.mockupWindow.webContents.send(
                'rov-mock-up-send-mode',
                states.manual,
              );
            }
            desiredControl = recievedData[message];
            // TODO: SEND IPC message?
            break;
          case messages.lowLevelControlManeuver.desiredHeading:
            lowLevelControlManeuver.desiredHeading = recievedData[message];
            // TODO: SEND IPC message?
            break;
          case messages.lowLevelControlManeuver.desiredZ:
            lowLevelControlManeuver.desiredZ = recievedData[message];
            // TODO: SEND IPC message?
            break;
          case messages.goTo:
            if (entityState.state !== states.DP) {
              entityState.state = states.DP;
              global.mockupWindow.webContents.send(
                'rov-mock-up-send-mode',
                states.DP,
              );
            }
            goTo = recievedData[message];
            // TODO: SEND IPC message?
            break;
          case messages.netFollow:
            if (entityState.state !== states.NF) {
              entityState.state = states.NF;
              global.mockupWindow.webContents.send(
                'rov-mock-up-send-mode',
                states.NF,
              );
            }
            netFollow = recievedData[message];
            // TODO: SEND IPC message?
            break;
          default:
            break;
        }
      });
    });

    const sendData = () => {
      // Create IMC message with estimated state and entity state
      console.log(`[${Date.now()}] Sending IMC message:`);
      console.log(estimatedState);
      console.log(entityState);

      let estimatedStateBuf = encode.estimatedState(estimatedState);
      let entityStateBuf = encode.entityState(entityState);
      let buf = Buffer.concat(
        [estimatedStateBuf, entityStateBuf],
        estimatedStateBuf.length + entityStateBuf.length,
      );

      // Add custom net follow message when mode is NF
      if (entityState.state === states.NF) {
        console.log(customNetFollow);

        let customNetFollowBuf = encode.customNetFollow(customNetFollow);
        buf = Buffer.concat(
          [buf, customNetFollowBuf],
          buf.length + customNetFollowBuf.length,
        );
      }
      try {
        socket.write(buf);
      } catch (error) {
        clearInterval(sendData);
      }
    };

    setInterval(sendData, 200);
  });

  server.listen(port);
};

module.exports = {
  ipcCommunicationTCPServer,
};
