//Tests TCP/TCPClient

const {
  getConnectedClient,
  sendData,
  sendIMCData,
} = require('./../TCP/TCPClient');
const { initGlobals } = require('./../utils/globals');
const net = require('net');

const prefix = 'TCP/TCPClient: ';

let server;
let client;

const initData = () => {
  initGlobals();
  server = new net.createServer();
  server.listen(global.settings.port);
  client = null;
};

beforeEach(() => {
  return initData();
});

// Tests getting a connected client and sending data
test(prefix + 'TCP connect and send data', () => {
  client = getConnectedClient();
  expect(client.connecting).toBe(true);
  sendData(client, {
    surge: 400.0,
    sway: 0.0,
    heave: 0.0,
    roll: 0.0,
    pitch: 0.0,
    yaw: 0.0,
    autodepth: false,
    autoheading: false,
  });
  expect(client._pendingData.length).not.toBe(0);
  client.destroy();
  server.close();
});

// IMC
test(prefix + 'TCP cant connect', () => {
  client = getConnectedClient();
  global.toROV.autoheading = true;
  global.toROV.autodepth = true;
  sendIMCData(client);
  global.mode.currentMode = 1;
  sendIMCData(client);
  global.mode.currentMode = 2;
  sendIMCData(client);
  client.destroy();
  server.close();
});
