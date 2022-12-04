import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import EmptyProfilePic from "../assets/empty_profile.png";
import useAllUsers from "../hooks/useAllUsers";
import { User } from "../types";

interface SearchComponentProps {
  searchText: string,
  clearText: () => void,
}

const SearchComponent = ({ searchText, clearText }: SearchComponentProps) => {
  const [results, setResults] = useState<Array<User>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    getAllUsers, allUsers, error, loading: queryLoading,
  } = useAllUsers();
  const navigate = useNavigate();

  const handleSearch = async (str: string): Promise<void> => {
    const splittedString = str.split(" ");
    await getAllUsers({
      variables: {
        input: splittedString.length === 2
          ? { firstName: splittedString[0], lastName: splittedString[1] }
          : { username: str, firstName: str, lastName: str },
      },
    });
  };

  useEffect(() => {
    if (!searchText) {
      return () => null;
    }
    if (!loading) {
      setResults([]);
      setLoading(true);
    }
    const timeOut = setTimeout(() => handleSearch(searchText), 800);
    return () => clearTimeout(timeOut);
  }, [searchText]);

  useEffect(() => {
    if (error) {
      setResults([]);
      setLoading(false);
    } else if (!queryLoading && allUsers) {
      setResults(allUsers);
      setLoading(false);
    }
  }, [allUsers, error, queryLoading]);

  const handleRedirect = (username: string): void => {
    setResults([]);
    clearText();
    navigate(`/${username}`);
  };

  if (!searchText || !searchText.length) {
    return null;
  }
  if (loading) {
    return (
      <div className="appBar__searchContainer__results appBar__searchContainer__loading">
        <CircularProgress style={{ color: "var(--borderColorDark)" }} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="appBar__searchContainer__results appBar__searchContainer__error">
        {`Error: ${error.message}`}
      </div>
    );
  }
  if (!results || !results.length) {
    return (
      <div
        className="appBar__searchContainer__results appBar__searchContainer__error"
        style={{ textAlign: "center" }}
      >
        No results
      </div>
    );
  }

  return (
    <div className="appBar__searchContainer__results">
      <table>
        <tbody>
          {[results.map((user) => (
            <tr key={user.id}>
              <td onClick={() => handleRedirect(user.username)} aria-hidden>
                <div className="default__userItem appBar__searchItem">
                  <div
                    className="default__userItem__avatar"
                    style={{
                      backgroundImage: `url(${user.profilePhoto
                        ? user.profilePhoto.imageString
                        : EmptyProfilePic})`,
                    }}
                  />
                  <div className="default__userItem__textContainer">
                    <div className="default__userItem__textContainer__username">
                      {user.username}
                    </div>
                    <div className="default__userItem__textContainer__personname">
                      {`${user.firstName} ${user.lastName}`}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))]}
        </tbody>
      </table>
    </div>
  );
};

export default SearchComponent;
