import { Outlet, useNavigate } from "react-router";
import { UserRoleContext } from "../AuthPage";
import { useContext, useEffect, useState } from "react";

export function AdminPage(){
    const userRole = useContext<any>(UserRoleContext);
    const [isAdmin,setisAdmin]=useState<boolean>(false);
    let navigate = useNavigate();
    useEffect(() => {
     if(userRole.roleType==="admin"){
        setisAdmin(true)
     }else{
        navigate("/dashboard")
     }
    }, [])
    
    if(isAdmin){
    return (<Outlet/>)
    }else{
        return null
    }

}