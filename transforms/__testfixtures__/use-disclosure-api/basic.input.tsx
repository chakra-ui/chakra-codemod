import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/core";

function PaymentModal() {
  const { isOpen, onClose } = useDisclosure(true);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>Pay now</ModalContent>
    </Modal>
  );
}
