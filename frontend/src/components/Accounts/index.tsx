import React from "react";
import AppBar from "../AppBar";
import NameForm from "./NameForm";
import PhotoForm from "./PhotoForm";
import useLogout from "../../hooks/useLogout";
import useMe from "../../hooks/useMe";
import { saveUserData } from "../../utils/userdata";
import "../../styles/Accounts.css";

const Accounts = () => {
  const meQuery = useMe();
  const [logout] = useLogout();

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  if (meQuery.error || (!meQuery.me && !meQuery.loading)) {
    console.log(meQuery.error);
    handleLogout();
    return (<div>unauthorized</div>);
  }
  if (meQuery.loading) {
    return (
      <div className="accounts">
        <AppBar />
        <div className="accounts__container">
          <div className="accounts__content">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (meQuery.me) {
    saveUserData(meQuery.me);
  }

  return (
    <div className="accounts">
      <AppBar />
      <div className="accounts__container">
        <div className="accounts__content">
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
        </div>
      </div>
    </div>
  );
};

export default Accounts;
