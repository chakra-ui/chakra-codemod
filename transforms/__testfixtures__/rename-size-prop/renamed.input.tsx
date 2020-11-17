import { PseudoBox, Box as ChakraBox, Button } from "@chakra-ui/core";

export function Basic(props) {
  return (
    <PseudoBox
      as="button"
      rounded="full"
      outline="0"
      size={["40px", "80px"]}
      {...props}
    >
      <ChakraBox rounded="full" size="12px" />
      <Button variantColor="red">Click me</Button>
    </PseudoBox>
  );
}
