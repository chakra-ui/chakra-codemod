import { JSXAttribute, StringLiteral, Transform } from "jscodeshift";
import { createJSXElement } from "utils/jsx";
import {
  insertOrCreateSubmoduleImport,
  removeModuleImport,
} from "utils/module";
import { prepare } from "utils/shared";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const iconsPkgName = "@chakra-ui/icons";

const transformer: Transform = (file, api) => {
  const config = prepare(file, api);
  const { j, root, done } = config;

  // find all Icon jsx and grab the name attr's value
  root
    .findJSXElements("Icon")
    .filter(
      j.filters.JSXElement.hasAttributes({
        name: () => true,
      }),
    )
    .replaceWith((node) => {
      const v0Props = node.value.openingElement.attributes as JSXAttribute[];
      const { value } = v0Props.find((prop) => prop.name.name === "name");
      const v0IconName = (value as StringLiteral).value;

      const v1Props = v0Props.filter((prop) => prop.name.name !== "name");
      const v1IconName = `${capitalize(v0IconName)}Icon`;

      /**
       * Create a JSX element of `${capitalize(name)}Icon`
       * forward any props passed to Icon to new component
       */
      const v1Icon = createJSXElement(j, v1IconName, v1Props);

      insertOrCreateSubmoduleImport(j, root, {
        importedName: v1IconName,
        moduleName: iconsPkgName,
      });

      return v1Icon;
    });

  removeModuleImport(j, root, {
    moduleName: "@chakra-ui/core",
    selector: "Icon",
  });

  // console.log("Replaced icon syntax, kindly install `@chakra-ui/icons`");

  return done();
};

export default transformer;
