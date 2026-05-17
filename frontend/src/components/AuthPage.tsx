import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";

export function AuthPage(){
  let navigate = useNavigate();
  const[validUser,setvalidUser]=useState<boolean>(false)
  async function verifyUser() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verify`,{withCredentials: true })
      if (response.data.status === "userValid") {
        setvalidUser(true);
        navigate(`/dashboard/`);
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
  if(validUser){
    return <Outlet />;
  }
    
}