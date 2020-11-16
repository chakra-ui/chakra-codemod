import { Transform } from "jscodeshift";
import { prepare } from "../utils";

/**
 * Convert imports from `@chakra-ui/core` to `@chakra-ui/react`
 */
const transformer: Transform = (file, api) => {
  const { j, root, done } = prepare(file, api);

  const imports = root.find(j.ImportDeclaration, {
    source: {
      value: "@chakra-ui/core",
    },
  });

  imports.forEach((node) => {
    node.value.source.value = "@chakra-ui/react";
  });

  return done();
};

export default transformer;
