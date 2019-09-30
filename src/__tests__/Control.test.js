import React from 'react';
import renderer from 'react-test-renderer';
import ControlApp from './../ControlComponents/ControlApp';

test('renders correctly', () => {
  const tree = renderer.create(<ControlApp />).toJSON();
  expect(tree).toMatchSnapshot();
});
