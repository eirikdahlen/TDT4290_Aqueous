import React from "react";
import renderer from "react-test-renderer";
import ViewManager from "../ViewManager";

test("renders correctly", () => {
  const component = renderer.create(<ViewManager />).toJSON();
  //expect(tree).toMatchSnapshot();
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
