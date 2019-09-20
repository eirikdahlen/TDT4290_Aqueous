const sum1 = require("../sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum1(1, 2)).toBe(3);
});
