const exec = require("child_process").exec;

function execute(command, callback) {
  exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
}

function launchSimulator(command) {
  execute(command, output => console.log("executed successfully"));
}

module.exports = { launchSimulator };
