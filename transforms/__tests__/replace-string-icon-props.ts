/* global jest */

jest.autoMockOff();

import { defineTest } from "jscodeshift/dist/testUtils";

/**
 * List of all test fixtures with an input and
 * output pair for each.
 */
const fixtures = ["basic"] as const;
const name = "replace-string-icon-props";

describe(name, () => {
  fixtures.forEach((test) =>
    defineTest(__dirname, name, null, `${name}/${test}`, {
      parser: "tsx",
    }),
  );
});
