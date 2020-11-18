import { ThemeProvider, CSSReset } from "@chakra-ui/core";

function App({ children }) {
  return (
    <ThemeProvider>
      <CSSReset />
      {children}
    </ThemeProvider>
  );
}
