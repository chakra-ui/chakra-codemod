/* global jest */
jest.autoMockOff();

import { defineTest } from "jscodeshift/dist/testUtils";

/**
 * List of all test fixtures with an input and
 * output pair for each.
 */
const fixtures = ["basic"] as const;

describe("rename-size-prop", () => {
  fixtures.forEach((test) =>
    defineTest(
      __dirname,
      "rename-size-prop",
      null,
      `rename-size-prop/${test}`,
      {
        parser: "tsx",
      },
    ),
  );
});
