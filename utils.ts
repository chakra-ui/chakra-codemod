import { API, Collection, FileInfo, JSCodeshift } from "jscodeshift";

export interface TransformerConfig {
  j: JSCodeshift;
  root: Collection;
  done(): void;
}

export interface Transformer {
  (config: TransformerConfig): string | null | undefined | void;
}

export function toTransformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const done = () => root.toSource();
  return { root, j, done };
}
