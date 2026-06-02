import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { UserRoleContext } from "../AuthPage";
import axios from "axios";
import { Loader2Icon } from "lucide-react";

export default function HospitalAuthPage(){
    const userRole = useContext<any>(UserRoleContext);
    const[hasAccess,sethasAccess]=useState<boolean>(false)
    let navigate = useNavigate();
    const parms = useParams();
    const[isLoading,setisLoading]=useState<boolean>(true)
    async function getHospital(){
        const hospitalData = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/gethospital`,{params:{hospitalname:parms.hospitalname},withCredentials: true})
        
        if(hospitalData.data.status==="validUser" && userRole.roleType===hospitalData.data.type){
            sethasAccess(true)
            setisLoading(false)
        }else if(hospitalData.data.status==="invalidHospital"){
            navigate("/dashboard")
        }
    }
    useEffect(() => {
        setisLoading(true)
        getHospital()
    }, [])
    if(isLoading){
        return <LoadingPage/>
    }else if(hasAccess){
        return <Outlet/>
    }
}
function LoadingPage(){
    return(
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-blue-400 flex justify-center p-4 text-white flex-col">
            <div className="flex text-[40px] lg:text-[100px] mt-auto mb-auto flex-col justify-center self-center"> 
                <div className="flex"><Loader2Icon className="animate-spin h-[40px] w-[40px] lg:h-[100px] lg:w-[100px] mt-auto mb-auto mr-[10px]"/> LOADING...</div>
                
                <div className="flex  text-[15px] lg:text-[25px] ml-auto mr-auto mt-[10px]">If Loading For More Than 30sec Contact Admin</div>
            </div>
            
        </div>
    )
}
