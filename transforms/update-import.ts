import { Transform } from "jscodeshift";
import { prepare } from "utils/shared";

const REPLACEMENTS = {
  PseudoBox: "Box",
  PseudoBoxProps: "BoxProps",
  AccordionHeader: "AccordionButton",
  AspectRatioBox: "AspectRatio",
};

const updateImports: Transform = (file, api) => {
  const { j, root, done } = prepare(file, api);

  const imports = root.find(
    j.Identifier,
    (node) => node.value.name in REPLACEMENTS,
  );

  imports.forEach((node) => {
    j(node).renameTo(REPLACEMENTS[node.value.name]);
  });

  return done();
};

export default updateImports;
