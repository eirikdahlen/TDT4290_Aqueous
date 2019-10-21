const { encodeData, decodeData } = require('./../TCP/coding');

const prefix = 'TCP/coding: ';

/*
 * data should be an object with these fields:
 * {'surge': number,
 *  'sway': number,
 *  'heave': number,
 *  'roll': number,
 *  'pitch': number,
 *  'yaw': number,
 *  'autodepth': bool,
 *  'autoheading': bool,
 * }
 *
 * nedrpy should be an object with these fields:
 * {'north': number,
 *  'east': number,
 *  'down': number,
 *  'roll': number,
 *  'pitch': number,
 *  'yaw': number,
 * }
 */
let data;
let nedrpy;

const clearData = () => {
  data = {
    surge: 0.0,
    sway: 0.0,
    heave: 0.0,
    roll: 0.0,
    pitch: 0.0,
    yaw: 0.0,
    autodepth: false,
    autoheading: false,
  };

  nedrpy = {
    north: 0.0,
    east: 0.0,
    down: 0.0,
    roll: 0.0,
    pitch: 0.0,
    yaw: 0.0,
  };
};

// Reset states before every test
beforeEach(() => {
  return clearData();
});

// Tests encoding data with all values being 0 or false
test(prefix + 'all 0/false encode', () => {
  expect(encodeData(data)).toStrictEqual(Buffer.alloc(64));
});

// Tests decoding of nedrpy with all values being 0 or false
test(prefix + 'all 0/false decode', () => {
  expect(decodeData(Buffer.alloc(64))).toStrictEqual(nedrpy);
});

// Tests encoding of data['roll'] being pi
test(prefix + 'encode pi', () => {
  data['roll'] = Math.PI;
  const buf = Buffer.alloc(64);
  buf.writeDoubleLE(Math.PI, 24);
  expect(encodeData(data)).toStrictEqual(buf);
});

// Tests decoding of data['north'] being 100
test(prefix + 'north 100 decode', () => {
  nedrpy['north'] = 100;

  const arr = new Float64Array([
    nedrpy['north'],
    nedrpy['east'],
    nedrpy['down'],
    nedrpy['roll'],
    nedrpy['pitch'],
    nedrpy['yaw'],
  ]);

  expect(decodeData(Buffer.from(arr.buffer))).toStrictEqual(nedrpy);
});
