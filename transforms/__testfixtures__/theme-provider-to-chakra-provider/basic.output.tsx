import { ChakraProvider } from "@chakra-ui/core";

function App({ children }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
