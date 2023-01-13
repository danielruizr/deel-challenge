import React, { useState, useContext } from "react";

export const ProfileContext = React.createContext({
    activeUser: null,
    setActiveUser: () => {},
});

export const useActiveUser = () => {
  const {activeUser, setActiveUser} = useContext(ProfileContext);

  return [activeUser, setActiveUser];
} 


export const ProfileProvider = ({ children }) => {
    const [activeUser, setActiveUser] = useState(null);
    
    return (
      <ProfileContext.Provider
        value={{
          activeUser,
          setActiveUser,
        }}
      >
        {children}
      </ProfileContext.Provider>
    );
  };