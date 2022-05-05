
import React from "react";
import api from "./api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

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
    setAuthIsLoading(true);
    console.log("CHECKING LOGIN");
    try {
      const value = await AsyncStorage.getItem('@key')
      if(value !== null) {
        // value previously stored token
        api.defaults.headers.common.Authorization = value;
            //TODO fix token login here
        api.get(`/accounts/current_user/`,{})
        .then((response) => {
          setCurrentUser(response.data);
          setAuthIsLoading(false);
        })
        .catch((error) => {
          console.log(error.response)
          setCurrentUser(null);
          setAuthIsLoading(false);
        });
      } else {
        console.log("No token found")
        console.log(e);
        setCurrentUser(null);
        setAuthIsLoading(false);
      }
    } catch (e) {
      console.log("No token found")
      console.log(e);
      setCurrentUser(null);
      setAuthIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthIsLoading(true);
    await AsyncStorage.removeItem('@key'); 
    setAuthIsLoading(false);
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