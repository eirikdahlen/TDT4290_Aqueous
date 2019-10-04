//Functions for encoding and decoding TCP

// Function for formatting data in a way the simulator understands
function encodeData(data) {
  /**
   * data should be a object with these fields:
   * {'surge': number,
   *  'sway': number,
   *  'heave': number,
   *  'roll': number,
   *  'pitch': number,
   *  'yaw': number,
   *  'autodepth': bool,
   *  'autoheading': bool,
   * }
   */
  const doublesArray = new Float64Array([
    data['surge'],
    data['sway'],
    data['heave'],
    data['roll'],
    data['pitch'],
    data['yaw'],
    data['autodepth'] ? 1 : 0,
    data['autoheading'] ? 1 : 0,
  ]);
  const buf = Buffer.from(doublesArray.buffer);
  return buf;
}

// Function for decoding data from bytearray to doubles
function decodeData(buf) {
  // buf should be a 48-bit Buffer containing 6 doubles (2 bytes)

  // Values is in this order
  const values = ['north', 'east', 'down', 'roll', 'pitch', 'yaw'];
  const result = {};
  values.map((value, i) => {
    result[value] = buf.readDoubleLE(8 * i);
  });
  return result;
}

module.exports = { encodeData, decodeData };
