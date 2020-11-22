import { ASTPath, JSCodeshift, JSXElement, Transform } from "jscodeshift";
import { prepare } from "../utils/shared";

const isJSXElement = (
  j: JSCodeshift,
  jsxEl: ASTPath<JSXElement>,
  _name: string,
) => {
  const { name } = jsxEl.value.openingElement;
  return j.JSXIdentifier.check(name) && name.name === _name;
};

const transformer: Transform = (file, api) => {
  const config = prepare(file, api);
  const { j, done, root } = config;

  root.findJSXElements("Slider").forEach((node) => {
    (node.value as any).extra.parenthesized = false;

    let filledTrack: JSXElement;

    j(node)
      .childElements()
      .forEach((el) => {
        if (isJSXElement(j, el, "SliderFilledTrack")) {
          filledTrack = el.value;
        }
      });

    j(node)
      .childElements()
      .forEach((el) => {
        if (isJSXElement(j, el, "SliderTrack")) {
          el.value.openingElement.selfClosing = false;
          el.value.closingElement = j.jsxClosingElement(
            j.jsxIdentifier("SliderTrack"),
          );
          const space = j.jsxText("\n      ");
          el.value.children.push(space, filledTrack, space);
        }
      });

    node.value.children = node.value.children.filter(
      //@ts-expect-error
      (node) => node.openingElement?.name?.name !== "SliderFilledTrack",
    );
  });

  return done();
};

export default transformer;
