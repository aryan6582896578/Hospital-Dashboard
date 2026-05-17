import { useContext } from "react"
import { UserRoleContext } from "../AuthPage"
import axios from "axios";
import { Link } from "react-router";

export function ManageHospitalPage(){
    const userRole = useContext<any>(UserRoleContext);


    return(
        <div className="">
            <div className="bg-blue-600 sm:h-[70px] flex flex-col sm:flex-row ">

                <div className="text-white p-[10px] text-[25px] sm:text-[30px] font-bold flex">
                   Welcome <span className="font-bold bg-white text-blue-600 pl-[5px] pr-[5px] ml-[10px] mr-[10px] rounded-[5px]">{userRole.displayname}</span> 
                </div>
                <div className="flex text-[20px] sm:text-[25px]">
                    <div className="text-white p-[10px] font-bold mt-auto mb-auto ">
                        <Link to="/dashboard"><button className="bg-green-500 font-bold pl-[10px] pr-[10px] rounded-[5px] cursor-pointer hover:bg-green-600">Go Back</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}