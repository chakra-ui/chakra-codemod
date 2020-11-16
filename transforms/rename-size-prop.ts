import { JSXElement, Transform } from "jscodeshift";
import { prepare } from "../utils";

function isValidElementType(node) {
  const type = node.openingElement.name.name;
  return ["PseudoBox", "Box"].includes(type);
}

function hasSizeJSXAttribute(node: JSXElement) {
  const { attributes } = node.openingElement;
  return !!attributes.find(
    (attr) => attr.type === "JSXAttribute" && attr.name.name === "size",
  );
}

function selector(node: JSXElement) {
  return isValidElementType(node) && hasSizeJSXAttribute(node);
}

function insertAtIndex(arr1, arr2, idx) {
  return arr1.slice(0, idx).concat(arr2).concat(arr1.slice(idx));
}

const transformer: Transform = (file, api) => {
  const { j, root, done } = prepare(file, api);

  const elements = root.find(j.JSXElement, selector);

  elements.forEach((path) => {
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
