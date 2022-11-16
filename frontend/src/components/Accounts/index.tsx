import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../AppBar";
import NameForm from "./NameForm";
import PhotoForm from "./PhotoForm";
import ErrorModal from "../ErrorModal";
import useLogout from "../../hooks/useLogout";
import useMe from "../../hooks/useMe";
import { getUserData, saveUserData } from "../../utils/userdata";
import "../../styles/Accounts.css";

const DefaultAccountsContent = ({ children }: any) => (
  <div className="accounts">
    <AppBar />
    <div className="accounts__container">
      <div className="accounts__content">
        {children}
      </div>
    </div>
  </div>
);

const Accounts = () => {
  const meQuery = useMe();
  const [logout] = useLogout();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  if (meQuery.error || (!meQuery.me && !meQuery.loading)) {
    if (getUserData() && !meQuery.error) {
      handleLogout();
    }

    return (
      <DefaultAccountsContent>
        <ErrorModal
          text={meQuery.error
            ? "Internal server error"
            : "You must be logged in to access this page"}
          onClose={() => navigate("/")}
        />
      </DefaultAccountsContent>
    );
  }
  if (meQuery.loading) {
    return <DefaultAccountsContent>Loading...</DefaultAccountsContent>;
  }

  if (meQuery.me) {
    saveUserData(meQuery.me);
  }

  return (
    <DefaultAccountsContent>
      <NameForm />
      <hr />
      <div className="accounts__imageUploadFlex">
        <div className="accounts__imageUploadFlex__item">
          <PhotoForm
            title="Upload profile photo"
            isCoverPhoto={false}
          />
        </div>
        <div className="accounts__imageUploadFlex__item">
          <PhotoForm
            title="Upload cover photo"
            isCoverPhoto
          />
        </div>
      </div>
    </DefaultAccountsContent>
  );
};

export default Accounts;
