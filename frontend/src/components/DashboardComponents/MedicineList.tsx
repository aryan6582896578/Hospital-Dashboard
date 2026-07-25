
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import HospitalSidebarComponent from "./HospitalSidebarComponent";
import { TrashIcon } from "lucide-react";
import { UserRoleContext } from "../AuthPage";

export function MedicineList(){
    const userRole = useContext<any>(UserRoleContext);
    const [medicineList,setmedicineList]=useState<any[]>([]);
    async function getMedList(){
        const medList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/patient/getmedicinelist`,{withCredentials: true})
        setmedicineList(medList.data.medlist)
    }
    async function deleteMed(id:string){
        
        const med = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/patient/deletemedicine/${id}`,{withCredentials: true})
        if(med.data=="deleted"){
            getMedList()
        }else if(med.data=="Notdeleted"){
            console.log("contact admin not able to deleted medicine")
        }
    }

    useEffect(() => {
        getMedList()
    }, [])
    return(

        <div className="bg-[#f6f8fb] h-dvh flex flex-col lg:flex-row overflow-y-auto">
            <div className="flex w-full flex-col lg:flex-row">

                <HospitalSidebarComponent />
                <div className="flex w-full flex-col pb-[20px] ">
                    <div className="min-h-20 border-b bg-white border-[#e8edf2] px-2 sm:px-4 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center  justify-end text-[25px] font-semibold">
                        <div className="bg-blue-900 text-white pl-[20px] pr-[20px] rounded-[5px] w-fit">
                            Medicine List
                        </div>
                    </div>
                    <div className="">
                        <div className={`bg-white m-[10px] p-[20px] rounded-[10px] ${userRole.roleType=="doctor" ?"flex":"hidden"} `}>
                            <AddMedComponent getMedList={getMedList}/>
                        </div>
                        
                        <div className="mt-[10px]">
                            <div className="bg-blue-900 m-[10px] p-[20px] rounded-[10px] flex justify-between uppercase font-semibold text-white ">Medicine Name</div>
                                {medicineList?.map((x:any)=>{
                                    return <div className="bg-white m-[10px] mt-0 p-[20px] rounded-[10px] flex justify-between" key={x.medid} >
                                        <div className="">
                                            <div className=""> {x.medname}</div>
                                        </div>

                                        <div className={`${userRole.roleType==="doctor"?"flex":"hidden"}`}>
                                            <button onClick={()=>{
                                            deleteMed(x.medid) 
                                            }} ><TrashIcon className="text-white bg-red-500 cursor-pointer hover:bg-red-600  w-[30px] h-[30px] p-[5px] rounded-[5px]"/></button>
                                        </div>
                                    </div>
                                })}
                        </div>
                    </div>
                </div>
            </div>     
        </div>
            
    )
}

function AddMedComponent({getMedList}:any){
    const[medname,setmedname]=useState<{name:string}>({name:""})
    const[errorMessage,seterrorMessage]=useState<string>("");

    async function AddMed(){
        const addMedList = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/patient/addmedicine`,medname,{withCredentials: true})
        console.log(addMedList.data.status)
        if(addMedList.data.status=="medAdded"){
            setmedname({name:""})
            getMedList()
        }
        
    }

    return(
        <div className="select-none flex flex-col mr-[10px] min-w-[300px]">
            <div className="text-[#64748b] text-m mb-2 ml-[1px] select-none">Medicine Name<span className="text-red-500  ">*</span>  {errorMessage?<span className="text-red-500 text-sm font-semibold">{errorMessage}</span>:""}</div>
            <input type="text" maxLength={100} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative pl-[20px] text-[#64748b] outline-0 border-[#dbe4ee]  `} onChange={(e:any)=>{
                seterrorMessage("")
                setmedname({name:e.target.value});
            }} value={medname.name} placeholder="Enter Medicine Name..."/>
            <div className="flex">
                <button type="submit" className={` w-fit pl-[20px] pr-[20px] mt-[20px] min-h-[40px] rounded-xl  ${medname.name?`bg-[#1e3a5f] hover:bg-[#245188] cursor-pointer `:"bg-gray-300 cursor-not-allowed"} text-white transition-all flex items-center justify-center font-medium  `} onClick={()=>{
                    if(medname.name){
                        AddMed()
                    }else{
                        seterrorMessage("Medicine Name Cannot Be Empty")
                    }
                }}>
                    Add Medicine
                </button>
                <button  className={` ${medname.name?"flex":"hidden"} ml-[10px] w-fit pl-[20px] pr-[20px] mt-[20px] min-h-[40px] rounded-xl bg-red-500 cursor-pointer hover:bg-red-400 text-white transition-all flex items-center justify-center font-medium  `} onClick={()=>{
                    setmedname({name:""})
                }}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

