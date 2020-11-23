import { Transform } from "jscodeshift";
import { prepare } from "../utils/shared";
import { findByModuleName } from "../utils/jsx";

const REPLACEMENTS = {
  PseudoBox: "Box",
  PseudoBoxProps: "BoxProps",
  AccordionHeader: "AccordionButton",
  AspectRatioBox: "AspectRatio",
};

const updateImports: Transform = (file, api) => {
  const config = prepare(file, api);
  const { j, root, done } = config;

  const hasFromChakra = findByModuleName({
    config,
    moduleName: "@chakra-ui/core",
    selector: Object.keys(REPLACEMENTS).join("|"),
  });

  const identifiers = root.find(j.Identifier, (node) => {
    return node.name in REPLACEMENTS && hasFromChakra(node.name);
  });

  identifiers.closest(j.ImportDeclaration).forEach((node) => {
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

  identifiers.forEach((node) => {
    node.value.name = REPLACEMENTS[node.value.name];
  });

  return done();
};

export default updateImports;
