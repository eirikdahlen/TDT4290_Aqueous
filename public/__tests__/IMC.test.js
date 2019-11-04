const { encode, decode, messages } = require('../TCP/IMC');

const {
  toBeDeepCloseTo,
  toMatchCloseTo,
} = require('jest-matcher-deep-close-to');
expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const decimalError = 5;

describe('test IMC encode and decode', () => {
  test('entityState', () => {
    const entityState = {
      state: 0, // manual: 0, NF: 1, DP: 2
      flags: {
        NF: false,
        DP: true,
      },
    };

    const encoded = decode(encode.entityState(entityState));

    expect(entityState).toBeDeepCloseTo(
      encoded[messages.entityState],
      decimalError,
    );
  });

  test('desiredControl', () => {
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

    const encoded = decode(encode.goTo(goTo));

    expect(goTo).toBeDeepCloseTo(encoded[messages.goTo], decimalError);
  });

  test('netFollow', () => {
    const netFollow = {
      timeout: 132,
      d: 1.1,
      v: 2.2,
      z: 3.3,
      z_units: 3,
    };

    const encoded = decode(encode.netFollow(netFollow));

    expect(netFollow).toBeDeepCloseTo(
      encoded[messages.netFollow],
      decimalError,
    );
  });

  test('netFollow', () => {
    const netFollow = {
      timeout: 132,
      d: 1.1,
      v: 2.2,
      z: 3.3,
      z_units: 3,
    };

    const encoded = decode(encode.netFollow(netFollow));

    expect(netFollow).toBeDeepCloseTo(
      encoded[messages.netFollow],
      decimalError,
    );
  });

  test('customNetFollow', () => {
    const customNetFollow = {
      d: 132,
      v: 1.1,
      angle: 2.2,
    };

    const encoded = decode(encode.customNetFollow(customNetFollow));

    expect(customNetFollow).toBeDeepCloseTo(
      encoded[messages.customNetFollowState],
      decimalError,
    );
  });
});

// // composedExample ====================================
// console.log('composedExample =============================');

// let totalLength =
//   bufDesiredControl.length + bufDesiredZ.length + bufdesiredHeading.length;
// let resultComposed = decode(
//   Buffer.concat(
//     [bufDesiredControl, bufDesiredZ, bufdesiredHeading],
//     totalLength,
//   ),
// );

// console.log(resultComposed);
