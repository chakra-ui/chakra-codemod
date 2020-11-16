/* global jest */
jest.autoMockOff();

import { defineTest } from "jscodeshift/dist/testUtils";

/**
 * List of all test fixtures with an input and
 * output pair for each.
 */
const fixtures = ["basic"] as const;

describe("core-to-react", () => {
  fixtures.forEach((test) =>
    defineTest(__dirname, "core-to-react", null, `core-to-react/${test}`, {
      parser: "tsx",
    })
  );
});
