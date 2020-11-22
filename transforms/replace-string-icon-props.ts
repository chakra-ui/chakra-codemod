/**
 * Converts icon string prop to the equivalent icon element
 * in @chakra-ui/icons package
 *
 * From this:
 * <Button leftIcon="phone">Click me</Button>
 *
 * To this:
 * <Button leftIcon={<PhoneIcon/>}>Testing</Button>
 */

import { JSCodeshift, Transform } from "jscodeshift";
import { createJSXElement, findJSXElementsByModuleName } from "../utils/jsx";
import { insertOrCreateSubmoduleImport } from "../utils/module";
import { capitalize, prepare } from "../utils/shared";

const hasJSXAttribute = (j: JSCodeshift, prop: string) => {
  return j.filters.JSXElement.hasAttributes({ [prop]: () => true });
};

const iconsPkgName = "@chakra-ui/icons";

/**
 * IconButton: Check for `icon` prop
 * Button: Check for `leftIcon` and `rightIcon` prop
 */

const transformer: Transform = (file, api) => {
  const config = prepare(file, api);
  const { done, j, root } = config;

  findJSXElementsByModuleName({
    config,
    moduleName: "@chakra-ui/core",
    selector: "Button|IconButton",
  })
    .filter((node) => {
      return (
        hasJSXAttribute(j, "leftIcon")(node) ||
        hasJSXAttribute(j, "rightIcon")(node) ||
        hasJSXAttribute(j, "icon")(node)
      );
    })
    .find(j.JSXAttribute, (n) =>
      ["leftIcon", "rightIcon", "icon"].includes(n.name.name),
    )
    .replaceWith((node) => {
      const attrValue =
        j.StringLiteral.check(node.value.value) && node.value.value.value;
      const attrName =
        j.JSXIdentifier.check(node.value.name) && node.value.name.name;

      const v1IconName = `${capitalize(attrValue)}Icon`;
      const newJSXAttribute = j.jsxAttribute(
        j.jsxIdentifier(attrName),
        j.jsxExpressionContainer(createJSXElement(j, v1IconName)),
      );

      insertOrCreateSubmoduleImport(j, root, {
        importedName: v1IconName,
        moduleName: iconsPkgName,
      });

      return newJSXAttribute;
    });

  return done();
};

export default transformer;
