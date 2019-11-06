const { encode, decode, messages } = require('./IMC');

const estimatedState = {
  lat: 0.0,
  lon: 0.0,
  height: 0.0,
  x: 0.0,
  y: 0,
  z: 0,
  phi: 0,
  theta: 0,
  psi: 0,
  u: 0,
  v: 0,
  w: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  p: 0,
  q: 0,
  r: 0,
  depth: 0,
  alt: 0,
};

let buf = encode.estimatedState(estimatedState);
console.log(`length: ${buf.length}`);
console.log(buf);
let result = decode(buf);
console.log(result);

const desiredZ = {
  value: 2.71828182846,
  z_units: 3,
};

let duration = 10;
const expected = {
  control: desiredZ,
  duration: duration,
};

const desiredZBuf = encode.lowLevelControlManeuver.desiredZ(desiredZ, duration);
console.log(`length: ${desiredZBuf.length}`);
console.log(desiredZBuf);

const encoded = decode(desiredZBuf);
console.log(encoded);
