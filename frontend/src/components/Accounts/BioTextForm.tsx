import React, { useState } from "react";
import { Form, Formik } from "formik";
import LoadingButton from "../LoadingButton";
import FormikTextInput from "../FormikTextInput";
import useSetBioText from "../../hooks/useSetBioText";
import { getUserData, saveUserData } from "../../utils/userdata";

interface BioTextFields {
  bioText: string,
}

const BioTextForm = () => {
  const [setBioText] = useSetBioText();
  const [errorText, setErrorText] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const userData = getUserData()!;

  const inputStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "5px",
  };

  const updateBioText = async (values: BioTextFields, { resetForm }: any): Promise<void> => {
    resetForm();
    setUpdating(true);
    try {
      const { data } = await setBioText(values);
      if (data && data.setBioText) {
        saveUserData({
          ...userData,
          bioText: data.bioText,
        });
      }
      setUpdating(false);
    } catch (err) {
      setUpdating(false);
      setErrorText(String(err));
    }
  };

  return (
    <Formik
      initialValues={{ bioText: userData.bioText ? userData.bioText : "" }}
      onSubmit={updateBioText}
    >
      {() => (
        <Form className="form ui">
          <span className="accounts__formLabel">Bio text</span>
          <br />
          <FormikTextInput
            placeholder="Your bio text"
            name="bioText"
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

export default BioTextForm;
