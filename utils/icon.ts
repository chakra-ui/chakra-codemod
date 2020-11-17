import { JSCodeshift, JSXAttribute } from "jscodeshift";

export function createIconJSXElement(
  j: JSCodeshift,
  localName: string,
  attrs: JSXAttribute[] = [],
) {
  const openingElement = j.jsxOpeningElement(j.jsxIdentifier(localName), attrs);
  openingElement.selfClosing = true;
  return j.jsxElement(openingElement);
}
