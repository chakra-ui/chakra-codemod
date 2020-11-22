import { Box as ChakraPseudoBox, BoxProps as ChakraPseudoBoxProps, Box } from "@chakra-ui/core";

interface ButtonProps extends ChakraPseudoBoxProps {}

export function Button(props: ButtonProps) {
  const { children, ...rest } = props;
  return (
    <ChakraPseudoBox
      w="40px"
      bg="red.300"
      _hover={{
        bg: "red.400",
      }}
      {...rest}
    >
      <Box>{children}</Box>
    </ChakraPseudoBox>
  );