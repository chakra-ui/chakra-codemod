import { Transformer } from "../utils";

const REPLACEMENTS = {
  PseudoBox: "Box",
  PseudoBoxProps: "BoxProps",
  AccordionHeader: "AccordionButton",
  AspectRatioBox: "AspectRatio",
};

const updateImports: Transformer = (config) => {
  const { j, root, done } = config;

  const imports = root.find(
    j.Identifier,
    (node) => node.value.name in REPLACEMENTS
  );

  imports.forEach((node) => {
    j(node).renameTo(REPLACEMENTS[node.value.name]);
  });

  return done();
};

export default updateImports;
