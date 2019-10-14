//Tests controls/mapping

const { handleClick } = require('./../controls/mapping');

// Mocks global state
global.toROV = {
  surge: 0.0,
  sway: 0.0,
  heave: 0.0,
  roll: 0.0,
  pitch: 0.0,
  yaw: 0.0,
  autodepth: false,
  autoheading: false,
};

const toROV = {
  surge: 0.0,
  sway: 0.0,
  heave: 0.0,
  roll: 0.0,
  pitch: 0.0,
  yaw: 0.0,
  autodepth: false,
  autoheading: false,
};
test('no clicks', () => {
  const { controls } = handleClick({ button: 'none', value: 0.0 });
  expect(controls).toStrictEqual(toROV);
});
