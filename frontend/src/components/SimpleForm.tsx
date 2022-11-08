import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import Button from "@mui/material/Button";
import FormikTextInput from "./FormikTextInput";
import { FormInput } from "../types";

interface FormProps {
  inputs: Array<FormInput>,
  validationSchema: any,
  submitText: string,
  isRegisterModal: boolean,
  onSubmit: (values: Object) => void,
}

const SimpleForm = ({
  inputs, validationSchema, submitText, onSubmit, isRegisterModal,
}: FormProps) => {
  const initialValues: { [field: string]: string } = {};
  inputs.forEach((input: FormInput) => {
    initialValues[input.name] = input.initialValue;
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        // Remove possible divider item from values
        const filteredMap = Object.fromEntries(
          Object.entries(values).filter(([k, v]) => k.length !== 0 && v.length !== 0),
        );
        onSubmit(filteredMap);
      }}
      validationSchema={validationSchema}
    >
      {() => (
        <Form className="form ui">
          <table>
            <tbody>
              {inputs.map((input: FormInput) => {
                if (input.type === "divider") {
                  return <tr key={input.name}><td colSpan={2}><hr /></td></tr>;
                }

                return (
                  <tr key={input.name}>
                    <td>{`${input.label}:`}</td>
                    <td>
                      <FormikTextInput
                        placeholder={input.placeholder}
                        name={input.name}
                        type={input.type}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td className="loginRegister__content__linkItem">
                  {isRegisterModal
                    ? (
                      <>
                        Already have an account?
                        <br />
                        <Link to="/accounts/login" style={{ textDecoration: "none" }}>Login</Link>
                      </>
                    ) : (
                      <>
                        Don&apos;t have an account?
                        <br />
                        <Link to="/accounts/register" style={{ textDecoration: "none" }}>Register</Link>
                      </>
                    )}
                </td>
                <td className="loginRegister__content__submitItem">
                  <Button
                    type="submit"
                    variant="contained"
                  >
                    {submitText}
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
      )}
    </Formik>
  );
};

export default SimpleForm;
