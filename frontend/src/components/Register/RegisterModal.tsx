import React from "react";
import * as yup from "yup";
import Modal from "@mui/material/Modal";
import logo from "../../assets/logo.png";
import "../../styles/LoginRegisterModal.css";
import SimpleForm from "../SimpleForm";
import { FormInput } from "../../types";

interface RegisterModalProps {
  openBoolean: boolean,
  onClose: () => void,
}

const RegisterModal = ({
  openBoolean, onClose,
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
    {
      name: "",
      label: "",
      placeholder: "",
      initialValue: "",
      type: "divider",
    },
    {
      name: "firstname",
      label: "First name",
      placeholder: "First name",
      initialValue: "",
      type: "input",
    },
    {
      name: "lastname",
      label: "Last name",
      placeholder: "Last name",
      initialValue: "",
      type: "input",
    },
  ];

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .min(5, "Username must be at least 5 characters long")
      .max(15, "Username must be less than 15 characters long")
      .required("Username is required"),
    password: yup
      .string()
      .min(5, "Password must be at least 5 characters long")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    firstname: yup
      .string()
      .required("First name is required"),
    lastname: yup
      .string()
      .required("Last name is required"),
  });

  return (
    <div>
      <Modal
        open={openBoolean}
        onClose={onClose}
      >
        <div className="loginRegister__container">
          <div className="loginRegister__topBar">
            <img src={logo} alt="Instagram" className="loginRegister__topBar__content" />
          </div>
          <div className="loginRegister__content">
            <SimpleForm
              inputs={inputs}
              validationSchema={validationSchema}
              submitText="Register"
              cancelEnabled={false}
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