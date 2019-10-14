//Tests controls/mapping

const { handleClick, setUpOrDown } = require('./../controls/mapping');

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

toROV = {
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
  const { controls, bias } = handleClick({ button: 'none', value: 0.0 });
  expect(controls).toBe(toROV);
});
