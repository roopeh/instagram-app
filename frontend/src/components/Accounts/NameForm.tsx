import React, { useState } from "react";
import { ApolloError } from "@apollo/client";
import * as yup from "yup";
import { Form, Formik } from "formik";
import LoadingButton from "../LoadingButton";
import FormikTextInput from "../FormikTextInput";
import useSetNames from "../../hooks/useSetNames";
import { getUserData, saveUserData } from "../../utils/userdata";

interface NameFields {
  firstName: string,
  lastName: string,
}

const NameForm = () => {
  const [setNames] = useSetNames();
  const [errorText, setErrorText] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const userData = getUserData()!;

  const inputStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "5px",
  };

  const updateNameFields = async (values: NameFields): Promise<void> => {
    setUpdating(true);
    setErrorText("");
    try {
      const { data } = await setNames(values);
      if (data && data.setNames) {
        saveUserData({
          ...userData,
          firstName: data.setNames.firstName,
          lastName: data.setNames.lastName,
        });
      }
      setUpdating(false);
    } catch (err) {
      setUpdating(false);
      setErrorText(err instanceof ApolloError ? err.message : String(err));
    }
  };

  return (
    <Formik
      initialValues={
          {
            firstName: userData.firstName,
            lastName: userData.lastName,
          }
        }
      validationSchema={yup.object().shape({
        firstName: yup
          .string()
          .required("Firstname is required"),
        lastName: yup
          .string()
          .required("Lastname is required"),
      })}
      onSubmit={updateNameFields}
    >
      {() => (
        <Form className="form ui">
          <span className="accounts__formLabel">Firstname</span>
          <FormikTextInput
            placeholder="Firstname"
            name="firstName"
            type="input"
            size="small"
            style={inputStyle}
          />
          <span
            className="accounts__formLabel"
            style={{ marginTop: "10px" }}
          >
            Lastname
          </span>
          <FormikTextInput
            placeholder="Lastname"
            name="lastName"
            type="input"
            size="small"
            style={inputStyle}
          />
          <LoadingButton
            variant="contained"
            size="small"
            uploading={updating}
            buttonText="Update"
            style={{ marginTop: "10px" }}
          />
          <br />
          {errorText && (
          <div className="errorText" style={{ marginTop: "15px" }}>
            {errorText}
          </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default NameForm;
