import { Transform } from "jscodeshift";
import { prepare } from "../utils/shared";

const REPLACEMENTS = {
  PseudoBox: "Box",
  PseudoBoxProps: "BoxProps",
  AccordionHeader: "AccordionButton",
  AspectRatioBox: "AspectRatio",
};

/**
 * @todo
 * Check if the import already includes the identifier
 * instead of adding duplicate imports.
 *
 * import {Box, PseudoBox} from "chakra"
 *
 * Output should only remove PseudoBox instead of adding another Box
 */

const updateImports: Transform = (file, api) => {
  const { j, root, done } = prepare(file, api);

  const imports = root.find(j.Identifier, (node) => {
    return node.name in REPLACEMENTS;
  });

  imports.forEach((node) => {
    node.value.name = REPLACEMENTS[node.value.name];
  });

  return done();
};

export default updateImports;
