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
    console.log(`[${Date.now()}] Recieved data from server:`);
    console.log(data);
  });
  return client;
}

function sendData(client, data) {
  // Add function (encodeData) for formatting data to be sent here
  data = encodeData(data);
  client.write(data);
}

function sendDummyData(client) {
  // Format is: 
  // Force surge, Force sway, Force heave, ...
  // Commanded Moment in roll (always 0), Commanded Moment in pitch (always 0),
  // Commanded Moment in yaw, Flag autodepth (0/1 off/on), Flag autoheading (0/1 off/on)
  const doublesArray = new Float64Array([0.0, 0.0, 1.5, 0.0, 0.0, 1, 0, 0]);
  const buf = Buffer.from(doublesArray.buffer);
  console.log(`Sending byte array ${doublesArray}`);
  sendData(client, buf);
}

function sendDummyDataContinuously(client, interval) {
  sendDummyData(client);
  setTimeout(sendDummyDataContinuously, interval, client, interval);
}

module.exports = { getConnectedClient, sendData, sendDummyDataContinuously };
