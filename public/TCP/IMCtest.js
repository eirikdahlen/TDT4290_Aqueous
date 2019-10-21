const { encode, decode } = require('./IMC');

// entityState ================================
const states = {
  manual: 0,
  NF: 1,
  DP: 2,
};

const entityState = {
  state: states.manual,
  flags: {
    NF: false,
    DP: true,
  },
};

console.log('entityState ================================');

console.log(entityState);

let bufEntityState = encode.entityState(entityState);
console.log(bufEntityState);

let resultEntityState = decode(bufEntityState);
console.log(resultEntityState);

// entityState ================================

// desiredControl =============================
const desiredControl = {
  x: 1.1,
  y: 2.2,
  z: 3.3,
  k: 4.4,
  m: 5.5,
  n: 6.6,
  flags: {
    x: true,
    y: true,
    z: true,
    k: true,
    m: true,
    n: false,
  },
};

console.log('desiredControl =============================');
console.log(desiredControl);

let bufDesiredControl = encode.desiredControl(desiredControl);
console.log(bufDesiredControl);

let resultDesiredControl = decode(bufDesiredControl);
console.log(resultDesiredControl);

// desiredHeading =============================
console.log('desiredHeading =============================');
const desiredHeading = {
  value: 3.14,
};

console.log(desiredHeading);

let bufdesiredHeading = encode.lowLevelControlManeuver.desiredHeading(
  desiredHeading,
  10,
);
console.log(bufdesiredHeading);

let resultdesiredHeading = decode(bufdesiredHeading);
console.log(resultdesiredHeading);

// desiredZ =============================
console.log('desiredZ =============================');
const desiredZ = {
  value: 2.71828182846,
  z_units: 3,
};

console.log(desiredZ);

let bufDesiredZ = encode.lowLevelControlManeuver.desiredZ(desiredZ, 10);
console.log(bufDesiredZ);

let resultDesiredZ = decode(bufDesiredZ);
console.log(resultDesiredZ);

// goTo =============================
console.log('goTo =============================');
const goTo = {
  timeout: 132,
  lat: 1.1,
  lon: 2.2,
  z: 3.3,
  z_units: 3,
  speed: 4.4,
  speed_units: 0,
  roll: 5.5,
  pitch: 6.6,
  yaw: 7.7,
};

console.log(goTo);

let bufGoTo = encode.goTo(goTo);
console.log(bufGoTo);

let resultGoTo = decode(bufGoTo);
console.log(resultGoTo);

// netFollow =============================
console.log('netFollow =============================');
const netFollow = {
  timeout: 132,
  d: 1.1,
  v: 2.2,
  z: 3.3,
  z_units: 3,
};

console.log(netFollow);

let bufnetFollow = encode.netFollow(netFollow);
console.log(bufnetFollow);

let resultnetFollow = decode(bufnetFollow);
console.log(resultnetFollow);

// customNetFollow =============================
console.log('customNetFollow =============================');
const customNetFollow = {
  d: 132,
  v: 1.1,
  angle: 2.2,
};

console.log(customNetFollow);

let bufcustomNetFollow = encode.customNetFollow(customNetFollow);
console.log(bufcustomNetFollow);

let resultcustomNetFollow = decode(bufcustomNetFollow);
console.log(resultcustomNetFollow);

// composedExample ====================================
console.log('composedExample =============================');

let totalLength =
  bufDesiredControl.length + bufDesiredZ.length + bufdesiredHeading.length;
let resultComposed = decode(
  Buffer.concat(
    [bufDesiredControl, bufDesiredZ, bufdesiredHeading],
    totalLength,
  ),
);

console.log(resultComposed);
