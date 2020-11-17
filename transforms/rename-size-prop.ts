import { Transform } from "jscodeshift";
import { findJSXElementsByModuleName, prepare } from "../utils";

function insertAtIndex(arr1, arr2, idx) {
  return arr1.slice(0, idx).concat(arr2).concat(arr1.slice(idx));
}

const transformer: Transform = (file, api) => {
  const config = prepare(file, api);
  const { j, done } = config;

  const els = findJSXElementsByModuleName(
    config,
    "@chakra-ui/core",
    "Box|PseudoBox",
  ).filter(
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
        return;
      }

      if (prop.name.name !== "size") {
        newProps.push(prop);
        return;
      }

      sizePropIndex = index;
      sizePropValue = prop.value;
    });

    const w = j.jsxAttribute(j.jsxIdentifier("w"), sizePropValue);
    const h = j.jsxAttribute(j.jsxIdentifier("h"), sizePropValue);

    newProps = insertAtIndex(newProps, [w, h], sizePropIndex);
    path.value.openingElement.attributes = newProps;
  });

  return done();
};

export default transformer;
