/* eslint-disable react/require-default-props */
import React from "react";
import { useField, Field } from "formik";
import TextField from "@mui/material/TextField";

interface TextInputProps {
  name: string,
  placeholder: string,
  type: string,
  variant?: "outlined" | "filled" | "standard",
  size?: string,
  multiline?: boolean,
  rows?: number,
  style?: React.CSSProperties,
}

const FormikTextInput = ({
  name, placeholder, type, variant, size, multiline, rows, style,
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
        variant={variant}
        multiline={multiline}
        rows={rows}
        size={size}
      />
      {showError && <div className="errorText">{meta.error}</div>}
    </>
  );
};

export default FormikTextInput;
