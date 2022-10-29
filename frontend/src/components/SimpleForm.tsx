import React from "react";
import { Formik, Form } from "formik";
import Button from "@mui/material/Button";
import FormikTextInput from "./FormikTextInput";
import { FormInput } from "../types";

interface FormProps {
  inputs: Array<FormInput>,
  validationSchema: any,
  submitText: string,
  cancelEnabled: boolean,
  cancelText: string,
  onSubmit: (values: Object) => void,
  cancelFunc: () => void,
}

const SimpleForm = ({
  inputs, validationSchema, submitText, onSubmit, cancelEnabled, cancelText, cancelFunc,
}: FormProps) => {
  const initialValues: { [field: string]: string } = {};
  inputs.forEach((input: FormInput) => {
    initialValues[input.name] = input.initialValue;
  });

  const twoButtonsStyle: React.CSSProperties = {
    textAlign: "right",
    paddingTop: "10px",
  };

  const singleButtonStyle: React.CSSProperties = {
    paddingTop: "10px",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
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
              <tr>
                {cancelEnabled
                  ? (
                    <td style={singleButtonStyle}>
                      <Button
                        color="error"
                        variant="contained"
                        type="button"
                        onClick={cancelFunc}
                      >
                        {cancelText}
                      </Button>
                    </td>
                  )
                  : <td />}
                <td style={cancelEnabled ? twoButtonsStyle : singleButtonStyle}>
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
