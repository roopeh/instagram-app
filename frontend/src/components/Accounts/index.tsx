import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../AppBar";
import NameForm from "./NameForm";
import BioTextForm from "./BioTextForm";
import PhotoForm from "./PhotoForm";
import ErrorModal from "../ErrorModal";
import useLogout from "../../hooks/useLogout";
import useMe from "../../hooks/useMe";
import { getUserData, saveUserData } from "../../utils/userdata";
import "../../styles/Accounts.css";

const DefaultAccountsContent = ({ children }: any) => (
  <div className="main">
    <AppBar />
    <div className="main__container">
      <div className="main__content">
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

  if (meQuery.error) {
    return (
      <DefaultAccountsContent>
        <ErrorModal
          text="Internal server error"
          openBoolean
          buttonText="Return"
          onClose={() => navigate("/")}
        />
      </DefaultAccountsContent>
    );
  }

  if (!meQuery.me) {
    if (meQuery.loading) {
      return <DefaultAccountsContent>Loading...</DefaultAccountsContent>;
    }

    if (getUserData()) {
      handleLogout();
    }

    return (
      <DefaultAccountsContent>
        <ErrorModal
          text="You must be logged in to access this page"
          openBoolean
          buttonText="Return"
          onClose={() => navigate("/")}
        />
      </DefaultAccountsContent>
    );
  }

  if (meQuery.me) {
    saveUserData(meQuery.me);
  }

  return (
    <DefaultAccountsContent>
      <h3>Edit profile details</h3>
      <div className="accounts__textInputFlex">
        <div className="accounts__textInputFlex__item">
          <NameForm />
        </div>
        <div className="accounts__textInputFlex__item">
          <BioTextForm />
        </div>
      </div>
      <hr className="accounts__divider" />
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
