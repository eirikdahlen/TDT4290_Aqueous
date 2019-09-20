import React from "react";
import renderer from "react-test-renderer";
import ControlApp from "../Control";

test("renders correctly", () => {
  const tree = renderer.create(<ControlApp />).toJSON();
  expect(tree).toMatchSnapshot();
});
