import {
  JSCodeshift,
  JSXAttribute,
  JSXElement,
  JSXIdentifier,
} from "jscodeshift";
import { TransformerConfig } from "./shared";
import { componentsSelector } from "./v0-components";

const baseSelector = componentsSelector;

interface FindJSXElementOptions {
  config: TransformerConfig;
  moduleName: string;
  selector?: string;
}

export function findByModuleName(options: FindJSXElementOptions) {
  const { config, moduleName, selector = baseSelector } = options;
  const regex = new RegExp(`^(${selector})$`);
  const { root, j } = config;

  const localNames = new Set();

  root
    .find(j.ImportDeclaration, {
      source: { value: moduleName },
    })
    .find(j.ImportSpecifier, (node) => regex.test(node.imported.name))
    .forEach((path) => {
      localNames.add(path.value.local.name);
    });

  const check = (name: string) => {
    return localNames.has(name);
  };

  return check;
}

export function findJSXElementsByModuleName(options: FindJSXElementOptions) {
  options.selector ??= baseSelector;
  const {
    config: { root },
  } = options;

  const hasName = findByModuleName(options);

  return root.findJSXElements().filter((node) => {
    const identifier = node.value.openingElement.name as JSXIdentifier;
    return hasName(identifier.name);
  });
}

export function renameJSXElement(node: JSXElement, name: string) {
  (node.openingElement.name as JSXIdentifier).name = name;
  (node.closingElement.name as JSXIdentifier).name = name;
}

export function createJSXElement(
  j: JSCodeshift,
  localName: string,
  attrs: JSXAttribute[] = [],
) {
  const openingElement = j.jsxOpeningElement(j.jsxIdentifier(localName), attrs);
  openingElement.selfClosing = true;
  return j.jsxElement(openingElement);
}

export function getJSXElementName(node: JSXElement) {
  return (node.openingElement.name as JSXIdentifier).name;
}
