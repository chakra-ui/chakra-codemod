import { Transform } from "jscodeshift";
import { findJSXElementsByModuleName } from "../utils/jsx";
import { prepare } from "../utils/shared";

/**
 * Converts the `color` prop applied to `Switch` or `Progress`
 * to `colorScheme`
 * 
 * <Switch color="red" /> => <Switch colorScheme="red" />
 */
const transfomer: Transform = (file, api) => {
  const config = prepare(file, api);
  const { j, done } = config;

  findJSXElementsByModuleName({
    config,
    moduleName: "@chakra-ui/core",
    selector: "Switch|Progress",
  })
    .filter(
      j.filters.JSXElement.hasAttributes({
        color: () => true,
      }),
    )
    .find(j.JSXIdentifier, { name: "color" })
    .forEach((node) => {
      node.value.name = "colorScheme";
    });

  return done();
};

export default transfomer;
