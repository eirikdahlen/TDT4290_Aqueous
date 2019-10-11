const { runCommand } = require('./launchFile');

// Closes the simulator processes (FhRtVis.exe).
function closeSimulator(processName) {
  try {
    runCommand(`taskkill /F /IM ${processName} /T`);
  } catch (error) {
    console.log(`Tried to close ${processName}, but failed to do so.`);
  }
}

module.exports = { closeSimulator };
