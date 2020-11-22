import { Transform } from "jscodeshift";
import { prepare } from "../utils/shared";

const REPLACEMENTS = {
  PseudoBox: "Box",
  PseudoBoxProps: "BoxProps",
  AccordionHeader: "AccordionButton",
  AspectRatioBox: "AspectRatio",
};

const updateImports: Transform = (file, api) => {
  const { j, root, done } = prepare(file, api);

  root
    .find(j.Identifier, (node) => {
      return node.name in REPLACEMENTS;
    })
    .closest(j.ImportDeclaration)
    .forEach((node) => {
      const newSpecifiers = [];
      node.value.specifiers.forEach((n) => {
        const isInImport = node.value.specifiers.find(
          (nn) => nn.local.name === REPLACEMENTS[n.local.name],
        );
        if (!isInImport) {
          newSpecifiers.push(n);
        }
      });
      node.value.specifiers = newSpecifiers;
    });

  root
    .find(j.Identifier, (node) => {
      return node.name in REPLACEMENTS;
    })
    .forEach((node) => {
      node.value.name = REPLACEMENTS[node.value.name];
    });

  return done();
};

export default updateImports;
