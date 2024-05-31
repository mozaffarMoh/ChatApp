import  { createContext, useContext, useState } from "react";

const UserDetailsContext = createContext({});

export const UserDetailsProvider = ({ children }:any) => {
  const [userDetails, setUserDetails] = useState({});

  return (
    <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetails = () => useContext(UserDetailsContext);
