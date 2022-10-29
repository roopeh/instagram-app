import React from "react";
import * as yup from "yup";
import Modal from "@mui/material/Modal";
import logo from "../../assets/logo.png";
import "../../styles/LoginRegisterModal.css";
import SimpleForm from "../SimpleForm";
import { FormInput } from "../../types";

interface RegisterModalProps {
  openBoolean: boolean,
  hideCancelButton: boolean,
  showLogo: boolean,
  titleText: string,
  onClose: () => void,
}

const RegisterModal = ({
  openBoolean, hideCancelButton, showLogo, titleText, onClose,
}: RegisterModalProps) => {
  const onSubmit = (values: any) => {
    console.log(values);
  };

  const inputs: Array<FormInput> = [
    {
      name: "username",
      label: "Username",
      placeholder: "Username",
      initialValue: "",
      type: "input",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Password",
      initialValue: "",
      type: "password",
    },
    {
      name: "confirmPassword",
      label: "Confirm password",
      placeholder: "Confirm password",
      initialValue: "",
      type: "password",
    },
  ];

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required("Username is required"),
    password: yup
      .string()
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required"),
  });

  return (
    <div>
      <Modal
        open={openBoolean}
        onClose={onClose}
      >
        <div className="loginRegister__container">
          <div className="loginRegister__topBar">
            {showLogo
              ? <img src={logo} alt="Instagram" className="loginRegister__topBar__content" />
              : <span className="loginRegister__topBar__content">{titleText}</span>}
          </div>
          <div className="loginRegister__content">
            <SimpleForm
              inputs={inputs}
              validationSchema={validationSchema}
              submitText="Register"
              cancelEnabled={!hideCancelButton}
              cancelText="Cancel"
              onSubmit={onSubmit}
              cancelFunc={onClose}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RegisterModal;
