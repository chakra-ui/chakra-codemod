import { BooleanLiteral, Transform } from "jscodeshift";
import { prepare } from "utils/shared";

const transform: Transform = (file, api) => {
  const config = prepare(file, api);
  const { j, root, done } = config;

  const calls = root.find(j.CallExpression, {
    callee: {
      name: "useDisclosure",
    },
  });

  calls.forEach((node) => {
    const hasArguments = node.value.arguments.length > 0;
    if (hasArguments) {
      const { value } = node.value.arguments[0] as BooleanLiteral;
      node.value.arguments[0] = j.objectExpression([
        j.objectProperty(
          j.identifier("defaultIsOpen"),
          j.booleanLiteral(value),
        ),
      ]);
    }
  });

  return done();
};

export default transform;
