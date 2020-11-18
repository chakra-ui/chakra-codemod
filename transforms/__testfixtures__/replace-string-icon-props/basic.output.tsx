import { Button, IconButton, Box } from "@chakra-ui/core";

import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";

function Example(props) {
  return (
    <Box>
      <Button leftIcon={<PhoneIcon />}>Click me</Button>
      <IconButton icon={<EmailIcon />} />
    </Box>
  );
}
