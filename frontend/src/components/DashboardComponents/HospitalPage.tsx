import { useContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import { UserRoleContext } from "../AuthPage";
import axios from "axios";

export function HospitalPage(){
    const userRole = useContext<any>(UserRoleContext);
    const[hasAccess,sethasAccess]=useState<boolean>(false)
    const[isLoading,setisLoading]=useState<boolean>(true)
    const parms = useParams();
    // console.log(parms.hospitalname)

    async function getHospital(){
        const hospitalData = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/gethospital`,{
            params:{
                hospitalname:parms.hospitalname
            },
            withCredentials: true
        })
        console.log(hospitalData.data)
    }

    useEffect(() => {
        getHospital()
    }, [])
    
    if(isLoading){
        return <div className="">LOADING ....</div>
    }
    if(!hasAccess){
        return null
    }
    return(
        <div className="">
            hospital page
            {userRole.status}
            {/* <Outlet /> */}
        </div>
        
    )
}