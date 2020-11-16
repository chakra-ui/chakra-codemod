import { Transform } from "jscodeshift";
import updateImport from "../transforms/update-import";
import { toTransformer } from "../utils";

const transformer: Transform = (file, api) => {
  let source: any = file.source;
  const config = toTransformer(file, api);
  source = updateImport(config);
  return source;
};

export default transformer;
