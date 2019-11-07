const { encode, decode, messages } = require('../IMC');
const { decodeHeader } = require('../utils');
const {
  SYNC,
  OUR_IMC_ADDRESS,
  OUR_IMC_ENTITY,
  ROV_IMC_ADDRESS,
  ROV_IMC_ENTITY,
} = require('../constants');

const {
  toBeDeepCloseTo,
  toMatchCloseTo,
} = require('jest-matcher-deep-close-to');
expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const decimalError = 5;

const customEstimatedState = {
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

const customGoTo = {
  timeout: 132,
  x: 1.1,
  y: 2.2,
  z: 3.3,
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

describe('test IMC encoding', () => {
  test('netFollow header', () => {
    const netFollowBuf = encode.netFollow(netFollow);
    const header = decodeHeader(netFollowBuf, 0);

    // check timestamp seperately since this changes
    expect(header.timestamp / 100).toMatchCloseTo(new Date() / 1000 / 100, 1); // Tolerance of 100 seconds

    delete header.timestamp;
    expect(header).toBeDeepCloseTo({
      sync: SYNC,
      mgid: 465,
      size: 33 - 2,
      src: OUR_IMC_ADDRESS,
      src_ent: OUR_IMC_ENTITY,
      dst: ROV_IMC_ADDRESS,
      dst_ent: ROV_IMC_ENTITY,
    });
  });
});

describe('test IMC encode and decode', () => {
  test('customEstimatedState', () => {
    const encoded = decode(encode.customEstimatedState(customEstimatedState));

    expect(encoded[messages.customEstimatedState]).toBeDeepCloseTo(
      customEstimatedState,
      decimalError,
    );
  });

  test('entityState', () => {
    const encoded = decode(encode.entityState(entityState));

    expect(encoded[messages.entityState]).toBeDeepCloseTo(
      entityState,
      decimalError,
    );
  });

  test('desiredControl', () => {
    const encoded = decode(encode.desiredControl(desiredControl));

    expect(encoded[messages.desiredControl]).toBeDeepCloseTo(
      desiredControl,
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

    expect(
      encoded[messages.lowLevelControlManeuver.desiredHeading],
    ).toBeDeepCloseTo(expected, decimalError);
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

    expect(encoded[messages.lowLevelControlManeuver.desiredZ]).toBeDeepCloseTo(
      expected,
      decimalError,
    );
  });

  test('customGoTo', () => {
    const encoded = decode(encode.customGoTo(customGoTo));
    expect(encoded[messages.customGoTo]).toBeDeepCloseTo(
      customGoTo,
      decimalError,
    );
  });

  test('netFollow', () => {
    const encoded = decode(encode.netFollow(netFollow));

    expect(encoded[messages.netFollow]).toBeDeepCloseTo(
      netFollow,
      decimalError,
    );
  });

  test('customNetFollow', () => {
    const encoded = decode(encode.customNetFollow(customNetFollow));

    expect(encoded[messages.customNetFollowState]).toBeDeepCloseTo(
      customNetFollow,
      decimalError,
    );
  });
});

test('encode.combine', () => {
  const customEstimatedStateBuf = encode.customEstimatedState(
    customEstimatedState,
  );
  const entityStateBuf = encode.entityState(entityState);

  const bufDynamicLength = encode.combine([
    customEstimatedStateBuf,
    entityStateBuf,
  ]);
  expect(bufDynamicLength.length).toStrictEqual(
    customEstimatedStateBuf.length + entityStateBuf.length,
  );

  const length = 256;
  const bufFixedLength = encode.combine(
    [customEstimatedStateBuf, entityStateBuf],
    length,
  );
  expect(bufFixedLength.length).toStrictEqual(length);

  // Check if decoding with zero padding works (longer that the combined length)
  const decoded = decode(bufFixedLength);
  expect(Object.keys(decoded).sort()).toStrictEqual(
    [messages.entityState, messages.customEstimatedState].sort(),
  );
});
