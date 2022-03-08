import { mode } from "@chakra-ui/theme-tools";
import type { SystemStyleFunction } from "@chakra-ui/theme-tools";

const replacesInsideObject: SystemStyleFunction = (props) => {
  return {
    transform: "translate(25%, 25%)",
    borderRadius: "full",
    border: "0.2em solid",
    borderColor: mode("white", "gray.800")(props),
  };
};

const createsVariablesIfOutsideObject: SystemStyleFunction = (props) => {
  const borderColor = mode("white", "gray.800")(props);
  const bgColor = mode("white", "gray.800")(props);

  return {
    borderColor,
    bg: bgColor,
  };
};

const mergesWithExisting: SystemStyleFunction = (props) => {
  const borderColor = mode("white", "gray.800")(props);

  return {
    _light: {
      color: "red.500",
    },
    borderColor,
  };
};

const worksWithNestedObjects: SystemStyleFunction = (props) => {
  const borderColor = mode("white", "gray.800")(props);

  return {
    _focus: {
      _light: {
        color: "red.500",
      },
      borderColor,
    },
  };
};

const usesExistingVariable: SystemStyleFunction = (props) => {
  const colorDark = "red.500";
  const colorLight = "blue.500";
  const borderColor = mode(colorDark, colorLight)(props);

  return {
    borderColor,
  };
};
