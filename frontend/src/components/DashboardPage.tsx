import { useContext, useEffect, useState } from "react"
import { UserRoleContext } from "./AuthPage"
import axios from "axios";
import { Link, useNavigate } from "react-router";


export function DashboardPage(){
    let navigate = useNavigate();
    const userRole = useContext<any>(UserRoleContext);


    async function logout(){
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`,{withCredentials: true })
        console.log(response)
        if(response.data.status==="logout"){
            navigate("/")
        }
    }

    return(
        <div className="flex flex-col h-full">
            <div className="bg-blue-600  min-h-fit sm:min-h-[70px] flex flex-col sm:flex-row ">

                <div className="text-white p-[10px] text-[25px] sm:text-[30px] font-bold flex">
                   Welcome <span className="font-bold bg-white text-blue-600 pl-[5px] pr-[5px] ml-[10px] mr-[10px] rounded-[5px]">{userRole.displayname}</span> 
                </div>
                <div className="flex text-[20px] sm:text-[25px]">
                    {userRole.roleType==="admin"?                    
                        <div className="flex">
                            <div className="text-white p-[10px] font-bold mt-auto mb-auto ">
                                <Link to="/dashboard/admin/manageuser"><button className="bg-purple-700 font-bold pl-[10px] pr-[10px] rounded-[5px] cursor-pointer hover:bg-purple-600">Users</button></Link>
                            </div>

                            <div className="text-white p-[10px] font-bold mt-auto mb-auto ">
                                <Link to="/dashboard/admin/managehospital"><button className="bg-purple-700 font-bold pl-[10px] pr-[10px] rounded-[5px] cursor-pointer hover:bg-purple-600">Hospitals</button></Link>
                            </div>
                        </div>:""}

                    <div className="text-white p-[10px] font-bold mt-auto mb-auto ">
                        <button className="bg-red-600 font-bold pl-[10px] pr-[10px] rounded-[5px] cursor-pointer hover:bg-red-500" onClick={()=>{
                            logout()
                        }}>Logout</button>
                    </div>
                    
                </div>
                
            </div>
            <div className="flex h-full">
                <ListHospital/>
            </div>
        </div>
    )
}

function ListHospital(){
    const [hospitalListData,sethospitalListData]=useState<any>();

    async function getHospitalList(){
        const userList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/listhospital`,{withCredentials: true })
        if(userList.data.status==="unableToGetHospitalList"){
            console.log("error unable to fetch hospital list")
        }else{
            sethospitalListData(userList.data.userdata)

        }
    }

    useEffect(() => {
        getHospitalList()
    }, [])
    return( <div className="w-full flex flex-col p-[20px] overflow-y-scroll pb-[100px]">
        {hospitalListData?.map((x:any)=>{
            {console.log(x)}
            return <Link to={x.name}>
            <div className="text-white bg-blue-700 hover:bg-blue-600 cursor-pointer m-[20px] p-[20px] rounded-[5px] " key={x.name}>
                <div className="text-[35px] font-bold hover:underline">{x.displayname}</div>
                <div className="text-[15px] font-medium">{x.name}</div>
                <div className="font-semibold flex mt-[10px]">DOCTORS : {(x.doctorlist.map((y:any)=>{
                    return <div key={y}  className="ml-[10px] bg-white text-blue-600 pl-[10px] pr-[10px] rounded-[3px]">{y}</div>
                }))}</div>
                <div className="font-semibold flex mt-[10px]">NURSES : {x.nurselist.map((y:any)=>{
                    return <div key={y} className="ml-[10px] bg-white text-blue-600 pl-[10px] pr-[10px] rounded-[3px]">{y}</div>
                })}</div>
            </div>
            </Link>
        })}


    </div>
    )
}
