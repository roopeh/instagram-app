import React, { useState } from "react";
import { ApolloError } from "@apollo/client";
import * as yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import logo from "../../assets/logo.png";
import "../../styles/LoginRegisterModal.css";
import SimpleForm from "../SimpleForm";
import { FormInput } from "../../types";
import useLogin from "../../hooks/useLogin";
import { saveUserData } from "../../utils/userdata";

interface LoginModalProps {
  openBoolean: boolean,
  showLogo: boolean,
  titleText: string,
  onClose: () => void,
}

const LoginModal = ({
  openBoolean, showLogo, titleText, onClose,
}: LoginModalProps) => {
  const [login] = useLogin();
  const [error, setError] = useState<string>("");
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (values: any) => {
    setLoggingIn(true);
    setError("");
    try {
      const { data } = await login({
        username: values.username,
        password: values.password,
      });
      if (data && data.login) {
        saveUserData(data.login);
      }
      setLoggingIn(false);
      onClose();
      if (location.pathname === "/") {
        navigate(0);
      } else {
        navigate("/");
      }
    } catch (err) {
      setLoggingIn(false);
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
  ];

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required("Username is required"),
    password: yup
      .string()
      .required("Password is required"),
  });

  const formLeftItem: JSX.Element = (
    <>
      Don&apos;t have an account?
      <br />
      <Link to="/accounts/register" style={{ textDecoration: "none" }}>Register</Link>
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
            {showLogo
              ? (
                <Link to="/">
                  <img src={logo} alt="Instagram" className="loginRegister__topBar__content" />
                </Link>
              )
              : <span className="loginRegister__topBar__content">{titleText}</span>}
          </div>
          <div className="loginRegister__content">
            <SimpleForm
              inputs={inputs}
              validationSchema={validationSchema}
              submitText="Login"
              leftItem={formLeftItem}
              useLoadingButton
              loadingButtonAction={loggingIn}
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

export default LoginModal;
