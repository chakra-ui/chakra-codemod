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
import { findJSXElementsByModuleName } from "utils/jsx";
import { prepare } from "utils/shared";

const hasProps = (j: JSCodeshift, props: string[]) => {
  const keys = props.reduce((acc, val) => {
    acc[val] = () => true;
    return acc;
  }, {});
  return j.filters.JSXElement.hasAttributes(keys);
};

/**
 * IconButton: Check for `icon` prop
 * Button: Check for `leftIcon` and `rightIcon` prop
 */

const transformer: Transform = (file, api) => {
  const config = prepare(file, api);
  const { done, j } = config;

  findJSXElementsByModuleName({
    config,
    moduleName: "@chakra-ui/core",
    selector: "Button",
  })
    .filter(hasProps(j, ["leftIcon", "rightIcon"]))
    .forEach((node) => {
      console.log(node.value);
    });

  return done();
};

export default transformer;
