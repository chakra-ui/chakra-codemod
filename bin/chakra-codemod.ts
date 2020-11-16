import { Transform } from "jscodeshift";
import updateImport from "../transforms/update-import";

const transformer: Transform = (file, api) => {
  return updateImport(file, api, {});
};

export default transformer;
