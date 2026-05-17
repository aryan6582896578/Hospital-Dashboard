import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserRoleContext = createContext("");
export function AuthPage(){
  let navigate = useNavigate();
  const[validUser,setvalidUser]=useState<any>(null)
  
  async function verifyUser() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verify`,{withCredentials: true })
      if (response.data.status === "userValid") {
        setvalidUser(response.data);
        console.log(response.data)
        // navigate(`/dashboard`);
      }else{
        navigate(`/`);
      }
    } catch (error) {
      console.log("Server Error");
    }
  }

  useEffect(() => {
    verifyUser()
    
  }, [])
  if(validUser?.status==="userValid"){
    return (
    <UserRoleContext.Provider value={validUser}>
        <Outlet />
    </UserRoleContext.Provider>
    )
  }
    
}