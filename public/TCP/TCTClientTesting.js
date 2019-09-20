const { getConnectedClient, sendDummyDataContinuously } = require('./TCPClient');

client = getConnectedClient();
sendDummyDataContinuously(client, 1000);