const { encode, decode, messages } = require('../TCP/IMC');

const {
  toBeDeepCloseTo,
  toMatchCloseTo,
} = require('jest-matcher-deep-close-to');
expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const decimalError = 5;

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

const entityState = {
  state: 0, // manual: 0, NF: 1, DP: 2
  flags: {
    NF: false,
    DP: true,
  },
};

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

const netFollow = {
  timeout: 132,
  d: 1.1,
  v: 2.2,
  z: 3.3,
  z_units: 3,
};

const customNetFollow = {
  d: 132,
  v: 1.1,
  angle: 2.2,
};

describe('test IMC encode and decode', () => {
  test('estimatedState', () => {
    const encoded = decode(encode.estimatedState(estimatedState));

    expect(estimatedState).toBeDeepCloseTo(
      encoded[messages.estimatedState],
      decimalError,
    );
  });

  test('entityState', () => {
    const encoded = decode(encode.entityState(entityState));

    expect(entityState).toBeDeepCloseTo(
      encoded[messages.entityState],
      decimalError,
    );
  });

  test('desiredControl', () => {
    const encoded = decode(encode.desiredControl(desiredControl));

    expect(desiredControl).toBeDeepCloseTo(
      encoded[messages.desiredControl],
      decimalError,
    );
  });

  test('desiredHeading', () => {
    const desiredHeading = {
      value: 3.14321,
    };

    let duration = 10;
    const expected = {
      control: desiredHeading,
      duration: duration,
    };

    const encoded = decode(
      encode.lowLevelControlManeuver.desiredHeading(desiredHeading, duration),
    );

    expect(expected).toBeDeepCloseTo(
      encoded[messages.lowLevelControlManeuver.desiredHeading],
      decimalError,
    );
  });

  test('desiredZ', () => {
    const desiredZ = {
      value: 2.71828182846,
      z_units: 3,
    };

    let duration = 10;
    const expected = {
      control: desiredZ,
      duration: duration,
    };

    const encoded = decode(
      encode.lowLevelControlManeuver.desiredZ(desiredZ, duration),
    );

    expect(expected).toBeDeepCloseTo(
      encoded[messages.lowLevelControlManeuver.desiredZ],
      decimalError,
    );
  });

  test('goTo', () => {
    const encoded = decode(encode.goTo(goTo));
    expect(goTo).toBeDeepCloseTo(encoded[messages.goTo], decimalError);
  });

  test('netFollow', () => {
    const encoded = decode(encode.netFollow(netFollow));

    expect(netFollow).toBeDeepCloseTo(
      encoded[messages.netFollow],
      decimalError,
    );
  });

  test('customNetFollow', () => {
    const encoded = decode(encode.customNetFollow(customNetFollow));

    expect(customNetFollow).toBeDeepCloseTo(
      encoded[messages.customNetFollowState],
      decimalError,
    );
  });
});

test('encode.combine', () => {
  const estimatedStateBuf = encode.estimatedState(estimatedState);
  const entityStateBuf = encode.entityState(entityState);

  const bufDynamicLength = encode.combine([estimatedStateBuf, entityStateBuf]);
  expect(bufDynamicLength.length).toStrictEqual(
    estimatedStateBuf.length + entityStateBuf.length,
  );

  const length = 256;
  const bufFixedLength = encode.combine(
    [estimatedStateBuf, entityStateBuf],
    length,
  );
  expect(bufFixedLength.length).toStrictEqual(length);

  // Check if decoding with too long messages works
  const decoded = decode(bufFixedLength);
  expect(Object.keys(decoded).sort()).toStrictEqual(
    [messages.entityState, messages.estimatedState].sort(),
  );
});
