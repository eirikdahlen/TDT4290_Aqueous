const net = require("net");
const ROVPort = 5000;
const { encodeData, decodeData } = require("./coding");

// Creates a client that receives and sends data to port 5000
function getConnectedClient() {
  const client = new net.Socket();

  client.connect({
    port: ROVPort
  });

  client.on("connect", function() {
    console.log(`Client: connection established with server`);
  });

  // Handles receiving data
  client.on("data", function(data) {
    data = decodeData(data);
    console.log(`\n[${Date.now()}] Recieved data from server:`);
    console.log(data);
    // TODO: This function should probably update global state somehow
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
  // Add function (encodeData) for formatting data to be sent here
  buf = encodeData(data);
  console.log(`\n[${Date.now()}] Sending byte array with data:`);
  console.log(data);
  client.write(buf);
}

function sendDummyData(client) {
  // Format is: 
  // Force surge, Force sway, Force heave, ...
  // Commanded Moment in roll (always 0), Commanded Moment in pitch (always 0),
  // Commanded Moment in yaw, Flag autodepth (0/1 off/on), Flag autoheading (0/1 off/on)
  // const doublesArray = new Float64Array([0.0, 0.0, 1.5, 0.0, 0.0, 1, 0, 0]);
  // const buf = Buffer.from(doublesArray.buffer);
  // console.log(`Sending byte array ${doublesArray}`);
  sendData(client, {
    'surge': 0,
    'sway': 0,
    'heave': 100,
    'roll': 0,
    'pitch': 0,
    'yaw': 50,
    'autodepth': false,
    'autoheading': false
  });
}

function sendDummyDataContinuously(client, interval) {
  sendDummyData(client);
  setTimeout(sendDummyDataContinuously, interval, client, interval);
}

module.exports = { getConnectedClient, sendData, sendDummyDataContinuously };
