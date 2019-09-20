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
    console.log("data received: " + data);
  });
  return client;
}

function sendData(fromClient, data) {
  // Add function (encodeData) for formatting data to be sent here
  data = encodeData(data);
  fromClient.write(data);
}

module.exports = { getConnectedClient, sendData };
