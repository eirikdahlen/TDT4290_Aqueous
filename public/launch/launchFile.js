const exec = require('child_process').exec;

function execute(command, callback) {
  exec(command, (error, stdout) => {
    callback(stdout);
  });
}

function runCommand(command) {
  execute(command, () => {});
}

module.exports = { runCommand };
