import { API, Collection, FileInfo, JSCodeshift } from "jscodeshift";

export interface TransformerConfig {
  j: JSCodeshift;
  root: Collection;
  done(): void;
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

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
