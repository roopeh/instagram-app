/* eslint-disable react/require-default-props */
import React from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

interface ModalProps {
  text: string,
  openBoolean: boolean,
  buttonText: string,
  buttonVariant?: "contained" | "outlined",
  buttonColor?: "info" | "error" | "success" | "warning",
  onClose: () => void,
}

const ErrorModal = ({
  text, openBoolean, buttonText, buttonVariant, buttonColor, onClose,
}: ModalProps) => (
  <Modal
    open={openBoolean}
    onClose={onClose}
  >
    <div className="errorModal">
      {text}
      <div className="errorModal__return__content">
        <Button
          type="button"
          variant={buttonVariant || "contained"}
          color={buttonColor || "primary"}
          size="small"
          onClick={onClose}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ErrorModal;
