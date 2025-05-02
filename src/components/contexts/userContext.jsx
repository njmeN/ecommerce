import React, { createContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const users = "http://localhost:3000/users";
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
        
      }, []);

      
      
    const logOut = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('cart')
        
    };  
    
    return(
        <UserContext.Provider value={{users, user,setUser,logOut}}>
            {children}
        </UserContext.Provider>
    )
}