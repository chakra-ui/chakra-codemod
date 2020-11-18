jest.autoMockOff();

import { defineTest } from "jscodeshift/dist/testUtils";

const fixtures = ["basic"] as const;
const name = "use-disclosure-api";

describe(name, () => {
  fixtures.forEach((test) =>
    defineTest(__dirname, name, null, `${name}/${test}`, {
      parser: "tsx",
    }),
  );
});
