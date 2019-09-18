var remote = require("remote");
var dialog = remote.require("dialog");
function simulator() {
  dialog.showOpenDialog(
    {
      properties: ["openFile"]
    },
    function(filename) {
      console.log(filename.toString());
    }
  );
}

module.exports = { simulator };
