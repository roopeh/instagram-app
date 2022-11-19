/* eslint-disable react/require-default-props */
import React from "react";
import MuiLoadingButton from "@mui/lab/LoadingButton";

interface Props {
  variant: "text" | "outlined" | "contained",
  uploading: boolean | undefined,
  buttonText: string,
  size?: "small" | "medium" | "large",
  style?: React.CSSProperties,
}

const LoadingButton = ({
  variant, uploading, buttonText, size, style,
}: Props) => (
  <MuiLoadingButton
    type="submit"
    variant={variant}
    size={size}
    endIcon={uploading && <div style={{ width: "15px" }} />}
    loading={uploading}
    loadingPosition={uploading ? "end" : undefined}
    style={style}
  >
    {buttonText}
  </MuiLoadingButton>
);

export default LoadingButton;
