import { Transform } from "jscodeshift";
import { prepare } from "utils/shared";
import { findJSXElementsByModuleName } from "utils/jsx";

function insertAtIndex(arr1, arr2, idx) {
  return arr1.slice(0, idx).concat(arr2).concat(arr1.slice(idx));
}

const transformer: Transform = (file, api) => {
  const config = prepare(file, api);
  const { j, done, root } = config;

  const els = findJSXElementsByModuleName({
    config,
    moduleName: "@chakra-ui/core",
    selector: "Box|PseudoBox",
  }).filter(
    j.filters.JSXElement.hasAttributes({ size: (value) => value != null }),
  );

  els.forEach((path) => {
    let props = path.value.openingElement.attributes;
    let newProps: typeof props = [];

    let sizePropIndex: number;
    let sizePropValue: any;

    props.forEach((prop, index) => {
      if (prop.type === "JSXSpreadAttribute") {
        newProps.push(prop);
      } else if (prop.name.name !== "size") {
        newProps.push(prop);
      } else {
        sizePropIndex = index;
        sizePropValue = prop.value;
      }
    });

    const w = j.jsxAttribute(j.jsxIdentifier("w"), sizePropValue);
    const h = j.jsxAttribute(j.jsxIdentifier("h"), sizePropValue);

    newProps = insertAtIndex(newProps, [w, h], sizePropIndex);
    path.value.openingElement.attributes = newProps;
  });

  return done();
};

export default transformer;
