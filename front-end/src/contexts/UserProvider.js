import React, {useState, useEffect,  createContext} from "react";
import { auth } from "../services/firebase"
export const UserContext = createContext({user: null})
export default ({children}) => {
  const [user, setuser] = useState(null)
  useEffect(() => {
      auth.onAuthStateChanged(async (user) => {
      if(user != null && user.displayName != null){
        const { displayName, email }  = user;
        setuser({
          displayName,
          email
        })
      }
    })
  },[])
  return (
    <UserContext.Provider value={user}>{children}</UserContext.Provider>
  )
}