//Tests TCP/TCPClient

const { getConnectedClient, sendData } = require('./../TCP/TCPClient');
const net = require('net');

const prefix = 'TCP/TCPClient: ';

let server;
let client;

const initData = () => {
  global.settings = {
    port: 5000,
    host: '127.0.0.1',
    serialFile:
      'C:/_work/FhSim/sfhdev/FhSimPlayPen_vs14_amd64/bin/aquaculturerobotics/runrtvisrunROV_ILOS_1.bat',
  };
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
