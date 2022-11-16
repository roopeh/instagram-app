import React from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

interface ModalProps {
  text: string,
  onClose: () => void,
}

const ErrorModal = ({ text, onClose }: ModalProps) => (
  <Modal
    open
    onClose={onClose}
  >
    <div className="errorModal">
      {text}
      <div className="errorModal__return__content">
        <Button
          type="button"
          variant="contained"
          size="small"
          onClick={onClose}
        >
          Return
        </Button>
      </div>
    </div>
  </Modal>
);

export default ErrorModal;
