
import React from "react";
import api from "./api";

const currentUserObject = {
  'user':{        
    "id": -1,
    "first_name": "",
    "last_name": "",
    "email": "",
    "phone_number": "",
    "country_code": null,
    "national_number": null,
    "profile_picture": null
  }

}
export const UserContext = {
  currentUser: currentUserObject,
  setCurrentUser: (user) => {},
  checkLogin: () => {},
  setAuthIsLoading: (isLoading) => {},
  authIsLoading: false, 
  handleLogout: () => {}
};

const CurrentUserContext = React.createContext(UserContext)
export default CurrentUserContext;

export function CurrentUserProvider({children}) {
  const [currentUser, setCurrentUser] = React.useState({});
  const [authIsLoading, setAuthIsLoading] = React.useState(true);
  React.useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const token = 'Token 71fdc88b4a624e06b28cecd120e1937bcc34b25c'//localStorage.getItem("bottega_workshop_token");

    console.log("CHECKING LOGIN");

    setAuthIsLoading(true);
    //TODO fix token login here
    if (token) {
      api.get(`/accounts/current_user/`,{},{headers: {Authorization:token}})
        .then((response) => {
          console.log("CURRENT USER RES", response.data);
          setCurrentUser(response.data);
          setAuthIsLoading(false);
        })
        .catch((_error) => {
          console.log(_error.response)
          setCurrentUser(null);
          setAuthIsLoading(false);
        });
    } else {
      setCurrentUser(null);
      setAuthIsLoading(false);
    }
  };

  const handleLogout = async () => {
    //localStorage.removeItem("bottega_workshop_token");
    setCurrentUser(null);
  };

  const stateValues = {
    currentUser,
    setCurrentUser,
    checkLogin,
    setAuthIsLoading,
    authIsLoading,
    handleLogout,
  };

  return ( 
      <CurrentUserContext.Provider value={stateValues}>
        {children}
      </CurrentUserContext.Provider>
  )
}

/** 
export default function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState({});
  const [authIsLoading, setAuthIsLoading] = React.useState(true);
  React.useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const token = 'Token 71fdc88b4a624e06b28cecd120e1937bcc34b25c'//localStorage.getItem("bottega_workshop_token");

    console.log("CHECKING LOGIN");

    setAuthIsLoading(true);

    if (token) {
      api.get(`/accounts/current_user/`,{},{headers: {'Authorization':token}})
        .then((response) => {
          console.log("CURRENT USER RES", response.data.user);
          setCurrentUser(response.data.user);
          setAuthIsLoading(false);
        })
        .catch((_error) => {
          setCurrentUser(null);
          setAuthIsLoading(false);
        });
    } else {
      setCurrentUser(null);
      setAuthIsLoading(false);
    }
  };

  const handleLogout = async () => {
    //localStorage.removeItem("bottega_workshop_token");
    setCurrentUser(null);
  };

  const stateValues = {
    currentUser,
    setCurrentUser,
    checkLogin,
    setAuthIsLoading,
    authIsLoading,
    handleLogout,
  };

  return (
    <CurrentUserContext.Provider value={stateValues}>
      {children}
    </CurrentUserContext.Provider>
  )

}
*/
/** 
export default CurrentUserContext*/