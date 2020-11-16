import { Transformer } from "../utils";

/**
 * Convert imports from `@chakra-ui/core` to `@chakra-ui/react`
 */
const transformer: Transformer = (config) => {
  const { j, root, done } = config;

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
