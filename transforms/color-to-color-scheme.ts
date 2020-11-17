import { Transform } from "jscodeshift";
import { prepare } from "utils/shared";

const renameColorProps: Transform = (file, api) => {
  const { j, root, done } = prepare(file, api);

  root
    .find(j.JSXIdentifier, isApplicableJsxIdentifier)
    .closest(j.JSXElement)
    .filter(hasColorPropAttribute)
    .forEach((node) => {
      const colorAttribute = node.value.openingElement.attributes.find(
        (attribute) => attribute.name.name === "color",
      );
      colorAttribute.name.name = "colorScheme";
    });

  return done();
};

const identifiers = ["Switch", "Progress"];
function isApplicableJsxIdentifier(node) {
  return identifiers.includes(node.name);
}

function hasColorPropAttribute(node) {
  return !!node.value.openingElement?.attributes?.some(
    (attribute) => attribute.name.name === "color",
  );
}

module.exports = {
  renameColorProps,
};
