import { Transform } from "jscodeshift";
import { findJSXElementsByModuleName, renameJSXElement } from "../utils/jsx";
import { addSubmoduleImport, removeModuleImport } from "../utils/module";
import { prepare } from "../utils/shared";

const transformer: Transform = (file, api) => {
  const config = prepare(file, api);
  const { done, j, root } = config;

  addSubmoduleImport(j, root, {
    moduleName: "@chakra-ui/core",
    importedName: "ChakraProvider",
    localName: "ChakraProvider",
  });

  findJSXElementsByModuleName({
    config,
    moduleName: "@chakra-ui/core",
    selector: "ThemeProvider",
  }).forEach((node) => {
    //@ts-expect-error remove wrapping parenthesis
    node.value.extra.parenthesized = false;
    renameJSXElement(node.value, "ChakraProvider");
  });

  findJSXElementsByModuleName({
    config,
    moduleName: "@chakra-ui/core",
    selector: "CSSReset",
  }).remove();

  // trim the whitespace added by removing the CSSReset
  root
    .findJSXElements("ChakraProvider")
    .find(j.JSXText, (n) => n.value.includes("\n"))
    .remove();

  removeModuleImport(j, root, {
    selector: "ThemeProvider|CSSReset",
    moduleName: "@chakra-ui/core",
  });

  return done();
};

export default transformer;
