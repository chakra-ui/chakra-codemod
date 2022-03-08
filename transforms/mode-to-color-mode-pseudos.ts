import { CallExpression, Transform } from "jscodeshift";
import { prepare } from "../utils/shared";
import { removeModuleImport } from "../utils/module";

type Unpacked<T> = T extends (infer U)[] ? U : T;

/**
 *
 * @param file
 * @param api
 */
const transfomer: Transform = (file, api) => {
  const config = prepare(file, api);
  console.log("transform it");
  const { j, root, done } = config;

  /**
   * finds the body of the function
   *
   * @param startNode
   */
  const findParentBlock = (startNode) => {
    if (startNode.name === "body") {
      return startNode;
    } else {
      return findParentBlock(startNode.parentPath);
    }
  };

  /**
   *
   * creates a new variable from `mode` arguments
   *
   *
   * @param variableValue
   * @param propertyName
   * @param propertyPath
   * @param variableSuffix
   */
  const createVariable = (
    variableValue: Unpacked<CallExpression["arguments"]>,
    propertyName: string,
    propertyPath: any,
    variableSuffix: string,
  ) => {
    if (variableValue.type !== "Identifier") {
      const newVariable = j.variableDeclaration("const", [
        j.variableDeclarator(
          j.identifier(`${propertyName}${variableSuffix}`),
          // @ts-ignore
          variableValue,
        ),
      ]);
      propertyPath.parentPath.parentPath.insertBefore(newVariable);
      return newVariable;
    }
    return variableValue;
  };

  /**
   * create _light / _dark if nessecary in `parentObject` regarding to mode
   *
   * add property in _light / _dark with `propertyName
   *
   *
   * @param parentObject
   * @param mode
   * @param propertyName
   * @param value
   */
  const addProperty = (
    parentObject,
    mode: "_light" | "_dark",
    propertyName,
    value,
  ) => {
    let propertyValue = value;
    // if the property is a variable we use its declaration
    // TODO are there more types that can be passed like this?
    if (value.type === "VariableDeclaration") {
      propertyValue = value.declarations[0].id;
    }

    const property = j.objectProperty(
      j.identifier(propertyName),
      propertyValue,
    );

    let addedToExisting = false;
    // try to find a _mode key on parentObject and add to it
    parentObject.value.map((val) => {
      if (val.key && val.key.name === mode) {
        val.value.properties.push(property);
        addedToExisting = true;
      }
    });
    // if we couldnt find a mode code in parentObject create a new one
    if (!addedToExisting) {
      const objectProperty = j.objectProperty(
        j.identifier(mode),
        j.objectExpression([property]),
      );
      parentObject.push(objectProperty);
    }
  };

  // find all calls of `mode`
  root
    .find(j.CallExpression, {
      callee: {
        type: "Identifier",
        name: "mode",
      },
    })
    .forEach((call, idx) => {
      // get the arguments of the call
      const [light, dark] = call.value.arguments;

      const propertyPath = call.parentPath.parentPath;
      switch (propertyPath.value.type) {
        /**
         * case:
         *
         * `const color = mode('example.200','example.700')`
         *
         * =>
         *
         * const colorLight = 'example.200'
         * const colorDark = 'example.700'
         *
         * // Special case 'example.200' is a variable e.g. lightColor already then we don't need to introduce a new one
         *
         * go up to function body find all object which have `color` as propertyName and replace them with
         *
         * {
         *   _light:{
         *      color:'example.200'
         *    }
         *   _dark:{
         *      color:'example.700'
         *    }
         * }
         *
         */
        case "VariableDeclarator": {
          const propertyName = propertyPath.value.id.name;
          const lightVariable = createVariable(
            light,
            propertyName,
            propertyPath,
            "Light",
          );
          const darkVariable = createVariable(
            dark,
            propertyName,
            propertyPath,
            "Dark",
          );

          /**
           * case 1 propertyName = objectKey
           *
           * const bg = mode('a','b')
           *
           * return {
           *   bg
           * }
           */
          j(findParentBlock(propertyPath))
            .find(j.ObjectProperty)
            .filter((e) => {
              return (
                // case {borderColor: variable}
                // @ts-ignore
                e.value.key.name === propertyName ||
                // @ts-ignore
                e.value.value.name === propertyName
              );
            })
            .forEach((objectProperty) => {
              addProperty(
                objectProperty.parentPath,
                "_light",
                // @ts-ignore
                objectProperty.value.key.name,
                lightVariable,
              );
              addProperty(
                objectProperty.parentPath,
                "_dark",
                // @ts-ignore
                objectProperty.value.key.name,
                darkVariable,
              );
              objectProperty.prune();
            });
          propertyPath.prune();
          break;
        }

        /**
         * case
         *
         * {
         *   color: mode('example.200','example.700)
         * }
         *
         * which is later used in theme
         *
         * becomes
         * =>
         *
         * {
         *   _light:{
         *      color:'example.200'
         *    }
         *   _dark:{
         *      color:'example.700'
         *    }
         * }
         */
        case "ObjectProperty": {
          const propertyName = propertyPath.value.key.name;
          const styleDefinition = call.parentPath.parentPath.parentPath;

          propertyPath.prune();
          addProperty(styleDefinition, "_light", propertyName, light);
          addProperty(styleDefinition, "_dark", propertyName, dark);
          break;
        }
      }
    });

  removeModuleImport(j, root, {
    moduleName: "@chakra-ui/theme-tools",
    selector: "mode",
  });
  // root
  //   .find(j.ImportSpecifier, { imported: { name: "mode" } })
  //   .forEach((importPath) => importPath.prune());

  return done();
};

export default transfomer;
