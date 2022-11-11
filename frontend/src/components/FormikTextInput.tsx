/* eslint-disable react/require-default-props */
import React from "react";
import { useField, Field } from "formik";
import { TextField } from "@mui/material";

interface TextInputProps {
  name: string,
  placeholder: string,
  type: string,
  size?: string,
  style?: React.CSSProperties,
}

const FormikTextInput = ({
  name, placeholder, type, size, style,
}: TextInputProps) => {
  const [field, meta, helpers] = useField<string>(name);
  const showError: boolean = meta.touched && meta.error !== null && meta.error !== undefined;

  const inputStyle: React.CSSProperties = style || { width: "100%" };
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
        style={inputStyle}
        size={size}
      />
      {showError && <div className="errorText">{meta.error}</div>}
    </>
  );
};

export default FormikTextInput;
