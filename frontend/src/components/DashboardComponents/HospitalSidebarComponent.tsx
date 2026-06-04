import { useContext} from "react";
import { Link, useNavigate, useParams } from "react-router";
import { UserRoleContext } from "../AuthPage";
import { ActivityIcon, ClipboardClockIcon, HomeIcon, LogOutIcon, UserPenIcon, Wallet } from "lucide-react";
import axios from "axios";

export default function HospitalSidebarComponent(){
    const userRole = useContext<any>(UserRoleContext);
    let navigate = useNavigate();
    const parms=useParams();
    // console.log(parms.hospitalname)
    async function logout() {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`,{ withCredentials: true });
        if (response.data.status === "logout") {
        navigate("/");
        }
    }

    return(
      <div className="bg-white justify-between flex-col flex min-w-fit" >
        <div className="min-w-fit flex flex-col">
            <Link to="/dashboard">
            <div className="h-20  flex items-center border-b border-[#e8edf2] ">
                <div className=" flex items-center gap-3 mb-8 justify-center mt-[20px] ml-[10px] mr-[10px]">
                <div className="min-w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <ActivityIcon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <div className=" flex flex-col">
                    <h1 className="text-2xl text-blue-900 font-semibold">
                    lforlungscare
                    </h1>
                    <div className="text-sm text-blue-600 ">
                        Hospital Management System
                    </div>
                </div>
                </div>
            </div>
            </Link>
            <div className="lg:mt-[20px] flex flex-col lg:mb-[20px] ">
                <div className="flex flex-col">
                    <div className="flex lg:flex-col">
                        <Link to="/dashboard"> <button className="flex  rounded-[5px] hover:bg-slate-100 cursor-pointer p-[10px] pl-[20px] pr-[20px]  lg:ml-auto lg:mr-auto  lg:mt-[10px] lg:min-w-[90%] min-w-fit"> <HomeIcon className="mr-[10px] text-blue-600"/>Home</button></Link>
                        <Link to={`/dashboard/${parms.hospitalname}`}> <button className="flex  rounded-[5px] hover:bg-slate-100 cursor-pointer p-[10px] pl-[20px] pr-[20px]  lg:ml-auto lg:mr-auto  lg:mt-[10px] lg:min-w-[90%] min-w-fit"> <ClipboardClockIcon className="mr-[10px] text-blue-600"/>Appointments</button></Link>
                    </div>
                    <div className="flex lg:flex-col">
                            <Link to={`/dashboard/${parms.hospitalname}/finance`}> <button className="flex  rounded-[5px] hover:bg-slate-100 cursor-pointer p-[10px] pl-[20px] pr-[20px]  lg:ml-auto lg:mr-auto  lg:mt-[10px] lg:min-w-[90%] min-w-fit"> <Wallet className="mr-[10px] text-blue-600"/>Finance </button></Link>
                            <Link to={`/dashboard/${parms.hospitalname}/patients`}> <button className="flex  rounded-[5px] hover:bg-slate-100 cursor-pointer p-[10px] pl-[20px] pr-[20px]  lg:ml-auto lg:mr-auto lg:mt-[10px] lg:min-w-[90%] min-w-fit"> <UserPenIcon className="mr-[10px] text-blue-600"/>Patients </button></Link>
                    </div>
                </div>
                <button className="flex rounded-[5px] hover:bg-red-100 hover:border-red-300 cursor-pointer p-[10px] pl-[20px] pr-[20px]  lg:ml-auto lg:mr-auto lg:min-w-[90%]  lg:mt-[10px] text-red-500 w-fit" onClick={()=>{
                    logout()
                }}> <LogOutIcon className="mr-[10px]"/> Logout </button>
                
            </div>
        </div>


        <div className="p-4 border-t border-[#e8edf2] select-none lg:flex hidden">
            
          <div className="flex items-center gap-3 ">
            <div className="w-11 h-11 rounded-full bg-blue-900 text-white flex items-center justify-center font-medium hover:bg-white duration-[0.3s] hover:text-blue-900 cursor-pointer border-2 border-blue-900">
              {userRole.displayname?.[0]}
            </div>

            <div>
              <h2 className="text-s text-blue-900 ">
                {userRole.displayname}
              </h2>
              <h1 className="text-xs text-[#64748b]">@{userRole.username}</h1>
            </div>
          </div>
        </div>
      </div>
    )
}