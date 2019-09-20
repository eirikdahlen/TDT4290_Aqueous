//Functions for encoding and decoding TCP

// Function for formatting data in a way the simulator understands
function encodeData(data) {
  return data;
}

// Function for decoding data from bytearray to doubles
function decodeData(data) {
  return data;
  /* Something like this:
  const values = ["north", "east", "down", "roll", "pitch", "yaw"];
  const result = {};
  values.map((value, i) => {
    var buf = new ArrayBuffer(8);
    var view = new DataView(buf);
    let data = byteArray.slice(i * 8, (i + 1) * 8);
    data.forEach(function(b, i) {
      view.setUint8(i, b);
    });
    result[value] = view.getFloat32(0);
  });
  return result;
  */
}

module.exports = { encodeData, decodeData };
