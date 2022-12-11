import React, { useState } from "react";
import { ApolloQueryResult } from "@apollo/client";
import { Form, Formik } from "formik";
import AsyncSelect from "react-select/async";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingButton from "../LoadingButton";
import EmptyProfilePic from "../../assets/empty_profile.png";
import { useAllUsersForConversations } from "../../hooks/useAllUsers";
import { User } from "../../types";
import useCreateConversation from "../../hooks/useCreateConversation";

type UserOption = {
  value: string,
  label: string,
  user: User,
};

interface ItemProps {
  user: User
}

const SearchItem = ({ user }: ItemProps) => (
  <div className="messages__newConversation__item">
    <div
      className="messages__newConversation__avatar"
      style={{
        backgroundImage: `url(${user.profilePhoto
          ? user.profilePhoto.imageString
          : EmptyProfilePic})`,
      }}
    />
    <div style={{ paddingLeft: "10px" }}>
      {`${user.firstName} ${user.lastName}`}
    </div>
  </div>
);

interface NewConversationProps {
  refetchFunc: () => Promise<ApolloQueryResult<any>>,
  closeFunc: () => void,
}

const NewConversationModal = ({ refetchFunc, closeFunc }: NewConversationProps) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [creating, setCreating] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [createConversation] = useCreateConversation();
  const { allUsers, error, loading } = useAllUsersForConversations();
  let searchResults: Array<UserOption> = [];

  if (error) {
    setErrorText(String(error));
  }
  if (!allUsers && loading) {
    return (
      <div style={{ padding: "8px" }}>
        <CircularProgress size={30} />
      </div>
    );
  }

  const handleCreate = async (): Promise<void> => {
    setErrorText("");
    if (!selectedId) {
      setErrorText("You must select a participiant");
      return;
    }
    setCreating(true);
    try {
      await createConversation({ receivers: [selectedId] });
      setCreating(false);
      refetchFunc();
      closeFunc();
    } catch (err) {
      setErrorText(String(err));
      setCreating(false);
    }
  };

  const handleChange = (usr: UserOption | null) => {
    if (!usr) {
      return;
    }
    setSelectedId(usr.value);
  };

  const loadOptions = (
    inputValue: string,
    callback: (options: Array<UserOption>) => void,
  ) => {
    const filteredArr = allUsers
      ? allUsers.filter((usr) => (
        usr.username.toLowerCase().includes(inputValue.toLowerCase())
          || usr.firstName.toLowerCase().includes(inputValue.toLowerCase())
          || usr.lastName.toLowerCase().includes(inputValue.toLowerCase())))
      : [];
    searchResults = [];
    filteredArr.forEach((usr) => searchResults.push({
      value: usr.id,
      label: `${usr.firstName} ${usr.lastName}`,
      user: usr,
    }));

    callback(searchResults);
  };

  return (
    <div style={{ padding: "10px" }}>
      Choose a participiant
      <div className="messages__newConversation">
        <AsyncSelect
          cacheOptions
          defaultOptions={searchResults}
          loadOptions={loadOptions}
          onChange={(e) => handleChange(e)}
        // eslint-disable-next-line react/no-unstable-nested-components
          formatOptionLabel={(usr) => <SearchItem user={usr.user} />}
        />
        <div className="messages__newConversation__buttons">
          <Button
            type="button"
            variant="contained"
            color="error"
            size="small"
            onClick={closeFunc}
          >
            Cancel
          </Button>
          <Formik initialValues={{}} onSubmit={handleCreate}>
            {() => (
              <Form className="form ui">
                <LoadingButton
                  variant="contained"
                  uploading={creating}
                  size="small"
                  buttonText="Create"
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {errorText && (
        <div className="errorText" style={{ marginTop: "8px" }}>
          {errorText}
        </div>
      )}
    </div>
  );
};

export default NewConversationModal;
