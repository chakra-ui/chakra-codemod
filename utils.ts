import {
  API,
  ASTPath,
  Collection,
  FileInfo,
  JSCodeshift,
  JSXIdentifier,
  VariableDeclarator,
} from "jscodeshift";

export interface TransformerConfig {
  j: JSCodeshift;
  root: Collection;
  done(): void;
}

export interface Transformer {
  (config: TransformerConfig): string | null | undefined | void;
}

export function prepare(file: FileInfo, api: API) {
  // Alias the jscodeshift API for ease of use.
  const j = api.jscodeshift;

  // Convert the entire file source into a collection of nodes paths.
  const root = j(file.source);

  // Function to call after all transformations
  const done = () => root.toSource();

  return { root, j, done };
}

const baseSelector =
  "Box|PseudoBox|Icon|Accordion|Alert|AlertDialog|AspectRatioBox|Avatar|Badge|Breadcrumb|Button|Checkbox|CircularProgress|CloseButton|Code|Collapse|ControlBox|Divider";

interface FindJSXElementOptions {
  config: TransformerConfig;
  moduleName: string;
  selector?: string;
}

export function findJSXElementsByModuleName(options: FindJSXElementOptions) {
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

  return root.findJSXElements().filter((node) => {
    const identifier = node.value.openingElement.name as JSXIdentifier;
    return localNames.has(identifier.name);
  });
}
