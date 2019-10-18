const net = require('net');

const port = 5000;
const host = '127.0.0.1';

// States for IMC ==============================================
/* eslint-disable no-unused-vars */

const states = {
  manual: 'manual',
  NF: 'NF',
  DP: 'DP',
};

/* eslint no-unused-vars: ["error", { "args": "none" }] */
const entityState = {
  state: states.manual,
  flags: {
    DP: true,
    NF: true,
  },
  description: 131072,
};

const manualState = {
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

const estimatedState = {
  lat: 1.0,
  lon: 2.0,
  height: 3.0,
  x: 4.0,
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
/* eslint-disable no-unused-vars */
// End states IMC ==============================================

console.log(`Waiting for client to connect to host ${host} port ${port}`);

const server = new net.createServer(socket => {
  console.log(`TCP Server bound to port ${port}.`);

  socket.on('data', buf => {
    console.log(`[${Date.now()}] Recieved data from client:`);
    console.log(decodeRecievedData(buf));
  });

  const sendData = () => {
    // Respond when getting data
    let doubleArray = new Float64Array([1.5, 2.5, 3.5, 4.5, 5.5, 6.5]);
    console.log(`Sending byte array ${doubleArray}\n`);
    socket.write(Buffer.from(doubleArray.buffer));
  };

  setInterval(sendData, 200);
});

server.listen(port, host);

// Function for decoding data from bytearray to doubles
function decodeRecievedData(buf) {
  // Values is in this order
  const values = [
    'surge',
    'sway',
    'heave',
    'roll',
    'pitch',
    'yaw',
    'autodepth',
    'autoheading',
  ];
  const result = {};
  values.map((value, i) => {
    result[value] = buf.readDoubleLE(8 * i);
  });
  return result;
}
