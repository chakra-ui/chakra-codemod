/* global jest */
jest.autoMockOff();

import { defineTest } from "jscodeshift/dist/testUtils";

const fixtures = ["example-1"];

fixtures.forEach((test) =>
  defineTest(__dirname, "core-to-react", null, `core-to-react/${test}`, {
    parser: "tsx",
  })
);
