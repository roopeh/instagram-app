import React, { useState } from "react";
import * as yup from "yup";
import { Form, Formik } from "formik";
import Button from "@mui/material/Button";
import { getUserData } from "../../utils/userdata";
import FormikTextInput from "../FormikTextInput";

interface NameFields {
  firstName: string,
  lastName: string,
}

const NameForm = () => {
  const [errorText, setErrorText] = useState<string>("");
  const userData = getUserData()!;

  const inputStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "5px",
  };

  const updateNameFields = async (values: NameFields): Promise<void> => {
    setErrorText(`first name is ${values.firstName} and last name is ${values.lastName} `);
  };

  return (
    <>
      <h3>Edit profile details</h3>
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
            <br />
            <FormikTextInput
              placeholder="Firstname"
              name="firstName"
              type="input"
              size="small"
              style={inputStyle}
            />
            <br />
            <span
              className="accounts__formLabel"
              style={{ marginTop: "10px" }}
            >
              Lastname
            </span>
            <br />
            <FormikTextInput
              placeholder="Lastname"
              name="lastName"
              type="input"
              size="small"
              style={inputStyle}
            />
            <br />
            <Button
              type="submit"
              variant="contained"
              size="small"
              style={{ marginTop: "10px" }}
            >
              Update
            </Button>
            <br />
            {errorText && (
              <div className="errorText" style={{ marginTop: "15px" }}>
                {errorText}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default NameForm;
