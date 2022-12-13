import React, { useState } from "react";
import { ApolloError } from "@apollo/client";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import logo from "../../assets/logo.png";
import "../../styles/LoginRegisterModal.css";
import SimpleForm from "../SimpleForm";
import { FormInput } from "../../types";
import useRegister from "../../hooks/useRegister";

interface RegisterModalProps {
  openBoolean: boolean,
  onClose: () => void,
}

const RegisterModal = ({
  openBoolean, onClose,
}: RegisterModalProps) => {
  const [register] = useRegister();
  const [error, setError] = useState<string>("");
  const [registering, setRegistering] = useState<boolean>(false);
  const navigate = useNavigate();

  const root = document.querySelector(":root") as HTMLElement;
  root.style.setProperty("--modalTopValue", "var(--modalTopRegister)");

  const onSubmit = async (values: any) => {
    setRegistering(true);
    setError("");
    try {
      await register({
        username: values.username,
        password: values.password,
        firstName: values.firstname,
        lastName: values.lastname,
      });
      setRegistering(false);
      navigate("/accounts/login");
    } catch (err) {
      setRegistering(false);
      setError(err instanceof ApolloError ? err.message : String(err));
    }
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

  const formLeftItem: JSX.Element = (
    <>
      Already have an account?
      <br />
      <Link to="/accounts/login" style={{ textDecoration: "none" }}>Login</Link>
    </>
  );

  return (
    <div>
      <Modal
        open={openBoolean}
        onClose={onClose}
      >
        <div className="loginRegister__container">
          <div className="loginRegister__topBar">
            <Link to="/">
              <img src={logo} alt="Instagram" className="loginRegister__topBar__content" />
            </Link>
          </div>
          <div className="loginRegister__content">
            <SimpleForm
              inputs={inputs}
              validationSchema={validationSchema}
              submitText="Register"
              leftItem={formLeftItem}
              useLoadingButton
              loadingButtonAction={registering}
              onSubmit={onSubmit}
            />
            <br />
            {error && (
              <div className="errorText" style={{ fontSize: "15px" }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RegisterModal;
