import { Transform } from "jscodeshift";
import { prepare } from "../utils/shared";

/**
 * Convert imports from `@chakra-ui/core` to `@chakra-ui/react`
 */
const transformer: Transform = (file, api) => {
  const { j, root, done } = prepare(file, api);

  /**
   * Match imports from `@chakra-ui/core` and `@chakra-ui/core/dist`
   */
  const imports = root.find(j.ImportDeclaration, (n) => {
    return n.source.value.startsWith("@chakra-ui/core");
  });

  /**
   * Replace imports
   * @chakra-ui/core -> @chakra-ui/react
   * @chakra-ui/core/dist -> @chakra-ui/react/dist
   */
  imports.forEach((node) => {
    const source = node.value.source as { value: string };
    source.value = source.value.replace("@chakra-ui/core", "@chakra-ui/react");
  });

  return done();
};

export default transformer;
