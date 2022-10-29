import React from "react";
import { useField, Field } from "formik";
import { TextField } from "@mui/material";

interface TextInputProps {
  name: string,
  placeholder: string,
  type: string,
}

const FormikTextInput = ({
  name, placeholder, type,
}: TextInputProps) => {
  const [field, meta, helpers] = useField<string>(name);
  const showError = meta.touched && meta.error;

  return (
    <>
      <Field
        type={type}
        placeholder={placeholder}
        name={name}
        value={field.value}
        error={showError}
        onChange={(e: any) => helpers.setValue(e.target.value)}
        onBlur={() => helpers.setTouched(true)}
        component={TextField}
        style={{ width: "100%" }}
      />
      {showError && <div className="errorText">{meta.error}</div>}
    </>
  );
};

export default FormikTextInput;
