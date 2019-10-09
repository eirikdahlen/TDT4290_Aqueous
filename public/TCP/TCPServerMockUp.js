const net = require('net');

const port = 5000;
const host = '127.0.0.1';

console.log(`Waiting for client to connect to host ${host} port ${port}`);

const server = new net.createServer(socket => {
  console.log(`TCP Server bound to port ${port}.`);

  socket.on('data', buf => {
    console.log(`[${Date.now()}] Recieved data from client:`);
    console.log(decodeRecievedData(buf));

    // Respond when getting data
    let doubleArray = new Float64Array([1.5, 2.5, 3.5, 4.5, 5.5, 6.5]);
    console.log(`Sending byte array ${doubleArray}\n`);
    socket.write(Buffer.from(doubleArray.buffer));
  });
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
    'netfollowing',
    'dp',
  ];
  const result = {};
  values.map((value, i) => {
    result[value] = buf.readDoubleLE(8 * i);
  });
  return result;
}
