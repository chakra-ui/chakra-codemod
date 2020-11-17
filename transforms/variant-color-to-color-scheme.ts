import { Transform } from "jscodeshift";
import { prepare } from "../utils";

const transformer: Transform = (file, api) => {
  const { j, root } = prepare(file, api);

  root
    .findJSXElements()
    .filter(
      j.filters.JSXElement.hasAttributes({
        variantColor: () => true,
      }),
    )
    .find(j.JSXIdentifier, { name: "variantColor" })
    .forEach((path) => {
      path.value.name = "colorScheme";
    });

  return root.toSource();
};

export default transformer;
