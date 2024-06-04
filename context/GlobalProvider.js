const { createContext, useContext, useEffect, useState } = require("react");

import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

// Provider Component
export const GlobalProvider = ({ children }) => {
  // State of the app
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Actions for updating the state
  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, setUser, user, isLoading }}>{children}</GlobalContext.Provider>;
};
