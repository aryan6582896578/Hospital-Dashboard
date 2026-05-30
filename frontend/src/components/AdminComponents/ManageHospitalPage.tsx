import { useContext, useEffect, useState } from "react"
import { UserRoleContext } from "../AuthPage"
import { Link } from "react-router";
import axios from "axios";

export function ManageHospitalPage(){
    const userRole = useContext<any>(UserRoleContext);
    const[displayAddHospital,setdisplayAddHospital]=useState<boolean>(false);
    const [hospitalListData,sethospitalListData]=useState<any>();
    const [hospitalListDataError,sethospitalListDataError]=useState<string>("");

    async function getHospitalList(){
        const userList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/listhospital`,{withCredentials: true })
        if(userList.data.status==="unableToGetHospitalList"){
            sethospitalListDataError("error unable to fetch hospital list")
        }else{
            sethospitalListData(userList.data.hospitalData)

        }
    }

    useEffect(() => {
        getHospitalList()
    }, [])


    return(
        <div className="flex flex-col h-full">
            <div className="bg-blue-600 min-h-[fit] sm:min-h-[70px] sm:h-[70px] flex flex-col sm:flex-row ">

                <div className="text-white p-[10px] text-[25px] sm:text-[30px] font-bold flex">
                   Welcome <span className="font-bold bg-white text-blue-600 pl-[5px] pr-[5px] ml-[10px] mr-[10px] rounded-[5px]">{userRole.displayname}</span> 
                </div>
                <div className="flex text-[20px] sm:text-[25px]">

                    <div className="text-white p-[10px] font-bold mt-auto mb-auto ">
                        <Link to="/dashboard"><button className="bg-green-500 font-bold pl-[10px] pr-[10px] rounded-[5px] cursor-pointer hover:bg-green-600">Go Back</button></Link>
                    </div>
                </div>
                
            </div>
            <div className="bg-gray-300 flex h-full flex-col sm:flex-row p-[5px]">
                <div className="bg-blue-900 min-w-[fit] m-[10px] p-[15px] rounded-[10px] min-h-fit">
                    <button className="bg-[#fab33c] text-white p-[5px] ml-auto flex mr-auto text-[25px] rounded-[5px] font-bold cursor-pointer  hover:bg-[#d19732] min-w-fit" onClick={()=>{
                        setdisplayAddHospital(true)
                    }}>Add Hospital</button>
                </div>
                <div className="bg-blue-900 w-full m-[10px] rounded-[10px] flex flex-col overflow-y-scroll ml-auto mr-auto">
                    
                    {displayAddHospital?<AddHospitalComponent getHospitalList={getHospitalList} setdisplayAddHospital={setdisplayAddHospital} />:""}
                    {hospitalListDataError? 
                        <div className="bg-blue-500 m-[10px] p-[10px] rounded-[5px] text-white font-medium text-center flex ">
                            <div className="flex ml-auto mr-auto text-[25px]">
                                {hospitalListDataError}
                            </div>
                        </div>:""}
                        <div className="mb-[100px] ">
                            {hospitalListData?.map((x:any)=>{
                                return <div key={x.username} >
                                    <HospitalListComponent hospitalDataList={x} getHospitalList={getHospitalList}/>
                                </div>
                            })}
                </div>   
                </div>
            </div>
         </div>
    )
}

function HospitalListComponent({hospitalDataList,getHospitalList}:{hospitalDataList:any,getHospitalList: () => void}){
        const[hospitalData,sethospitalData]=useState<{name:string,displayName:string,doctorList:Array<string>,nurseList:Array<string>}>({name:hospitalDataList.name,displayName:hospitalDataList.displayname,doctorList:hospitalDataList.doctorlist||[],nurseList:hospitalDataList.nurselist||[]})
        const[isDisabled,setisDisabled]=useState<boolean>(true)
        const[userList,setuserList]=useState<any[]>([])
        const[errorMessage,seterrorMessage]=useState<string>("")
        async function getUserList(){
            const userList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/listuser`,{withCredentials: true })
                if(userList.data.status==="unableToGetUserList"){
                    console.log("error unable to fetch user list")
                }else{
                    setuserList(userList.data.userdata)
                }
        }
        async function UpdateHospitalPost(){
            console.log(hospitalData)
            const addHospital = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/updatehospital`,hospitalData,{withCredentials: true })
            console.log(addHospital.data)
            if(addHospital.data.status==="unableToUpdateHospital"){
                seterrorMessage("internal server error contact admin")
            }else if(addHospital.data.status==="missingData"){
                seterrorMessage("* fields cannot be empty")
            }else{
                setisDisabled(true)
                getUserList()
                getHospitalList()
            }
        }
        useEffect(() => {
          getUserList()
        }, [])
        
    return(
      <div className={`${isDisabled?'bg-gray-500':'bg-blue-500'}  m-[10px] p-[10px] rounded-[5px] text-white font-medium text-center mb-[30px]`}>
        <div className="text-red-500 bg-white rounded-[5px]">{errorMessage?errorMessage:""}</div>
                <div className="flex  p-[5px] flex-col sm:flex-row">
                    
                    <div className=" p-[10px] ">
                        
                        <div className="flex flex-col text-start">
                            <div className="">HOSPITAL NAME <span className="text-red-500">*</span></div>
                            <input type="text" maxLength={15} className="bg-gray-700 rounded-[5px] outline-0 p-[5px] text-white" required value={hospitalData.name} disabled={true}/>
                        </div>
                        <div className="flex flex-col text-start mt-[5px]">
                            <div className="">DISPLAY NAME <span className="text-red-500">*</span></div>
                            <input type="text" maxLength={30} className="bg-yellow-50 rounded-[5px] outline-0 p-[5px] text-black" required onChange={(e)=>{
                                sethospitalData({...hospitalData,displayName:e.target.value})
                            }} value={hospitalData.displayName} disabled={isDisabled}/>
                        </div>
                    </div>
                    <div className="w-full p-[0px]">
                       {userList?.map((x:any) => {
                            return (
                                <div className="flex w-full" key={x.username}>
                                    <div className="flex bg-yellow-50 text-black m-[10px] rounded-[5px] h-fit w-full p-[10px]">
                                        <input type="checkbox" className="flex" disabled={isDisabled} checked={hospitalData.doctorList.includes(x.username) || hospitalData.nurseList.includes(x.username)} onChange={(e) => {
                                                if(x.role === "doctor") {
                                                    if(e.target.checked) {
                                                        sethospitalData((prev:any) => ({...prev,
                                                            doctorList: [...prev.doctorList, x.username]
                                                        }))
                                                    }else{
                                                        sethospitalData((prev:any) => ({...prev,
                                                            doctorList: prev.doctorList.filter(
                                                                (username:any) => username !== x.username
                                                            )
                                                        }))
                                                    }
                                                }
                                                if (x.role === "nurse") {
                                                    if(e.target.checked) {
                                                        sethospitalData((prev:any) => ({ ...prev,
                                                            nurseList: [...prev.nurseList, x.username]
                                                        }))
                                                    } else {
                                                        sethospitalData((prev:any) => ({...prev,
                                                            nurseList: prev.nurseList.filter(
                                                                (username:any) => username !== x.username
                                                            )
                                                        }))
                                                    }
                                                }
                                            }}/>

                                        <div className="flex ml-[10px]">
                                            <div className="mr-[10px]">Name: {x.displayname}</div>
                                            <div>Role: {x.role}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}                                        
                    </div>
                    
                </div>
                <div className="flex place-content-evenly ">
                    <button className={`text-[20px] p-[5px] pl-[10px] pr-[10px] ${isDisabled?'bg-green-500':'bg-[#fab33c]'}  mt-[10px] rounded-[5px] font-bold cursor-pointer ${isDisabled?'hover:bg-green-600':'hover:bg-[#d19732]'} `} onClick={()=>{
                        
                        isDisabled?setisDisabled(false):UpdateHospitalPost()
                    }}>{isDisabled?'EDIT':'SAVE'}</button>
                    {isDisabled?"":<button className={`text-[20px] p-[5px] pl-[10px] pr-[10px] bg-red-500 hover:bg-red-600 mt-[10px] rounded-[5px] font-bold cursor-pointer`} onClick={()=>{
                        setisDisabled(true)
                    }}>CANCEL</button>}

                </div>
        </div>
    )
}




type Props = {
    getHospitalList: () => void
    setdisplayAddHospital: React.Dispatch<React.SetStateAction<boolean>>
}
function AddHospitalComponent({getHospitalList,setdisplayAddHospital}: Props){
    const[hospitalData,sethospitalData]=useState<{name:string,displayName:string,doctorList:Array<string>,nurseList:Array<string>}>({name:"",displayName:"",doctorList:[],nurseList:[]})
    const[userList,setuserList]=useState<any[]>([])

    async function AddHospitalPost(){
        console.log(hospitalData)
        const addHospital = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/addhospital`,hospitalData,{withCredentials: true })
        console.log(addHospital.data)
        if(addHospital.data.status==="unableToCreateHospital"){
            setdisplayAddHospital(false)
        }else{
            setdisplayAddHospital(false)
            getUserList()
            getHospitalList()
        }
    }

    async function getUserList(){
        const userList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/listuser`,{withCredentials: true })
            if(userList.data.status==="unableToGetUserList"){
                console.log("error unable to fetch user list")
            }else{
                setuserList(userList.data.userdata)
            }
    }
    useEffect(() => {
      getUserList()
    
    }, [])
    

    return(
        <div className="bg-blue-500 m-[10px] p-[10px] rounded-[5px] text-white font-medium text-center mb-[20px]">
                <div className="text-[25px] ">Add Hospital</div>
                <div className="flex  p-[5px]">
                    <div className=" p-[10px] ">
                        <div className="flex flex-col text-start">
                            <div className="">HOSPITAL NAME <span className="text-red-500">*</span></div>
                            <input type="text" maxLength={15} className="bg-yellow-50 rounded-[5px] outline-0 p-[5px] text-black" required onChange={(e)=>{
                                sethospitalData({...hospitalData,name:e.target.value})
                            }}/>
                        </div>
                        <div className="flex flex-col text-start mt-[5px]">
                            <div className="">DISPLAY NAME <span className="text-red-500">*</span></div>
                            <input type="text" maxLength={30} className="bg-yellow-50 rounded-[5px] outline-0 p-[5px] text-black" required onChange={(e)=>{
                                sethospitalData({...hospitalData,displayName:e.target.value})
                            }}/>
                        </div>


                    </div>
                    <div className="w-full">
                        {userList?.map((x:any) => {
                            return (
                                <div className="flex" key={x.username}>
                                    <div className="flex bg-white text-black m-[10px] rounded-[5px] h-fit w-full p-[10px]">
                                        <input type="checkbox" className="flex" onChange={(e) => {
                                                if(x.role === "doctor") {
                                                    if(e.target.checked) {
                                                        sethospitalData((prev:any) => ({...prev,
                                                            doctorList: [...prev.doctorList, x.username]
                                                        }))
                                                    }else{
                                                        sethospitalData((prev:any) => ({...prev,
                                                            doctorList: prev.doctorList.filter(
                                                                (username:any) => username !== x.username
                                                            )
                                                        }))
                                                    }
                                                }
                                                if (x.role === "nurse") {
                                                    if(e.target.checked) {
                                                        sethospitalData((prev:any) => ({ ...prev,
                                                            nurseList: [...prev.nurseList, x.username]
                                                        }))
                                                    } else {
                                                        sethospitalData((prev:any) => ({...prev,
                                                            nurseList: prev.nurseList.filter(
                                                                (username:any) => username !== x.username
                                                            )
                                                        }))
                                                    }
                                                }
                                            }}/>

                                        <div className="flex ml-[10px]">
                                            <div className="mr-[10px]">Name: {x.displayname}</div>
                                            <div>Role: {x.role}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                    
                </div>
                <div className="flex place-content-evenly">
                    <button className="text-[20px] p-[5px] pl-[10px] pr-[10px] bg-green-500 mt-[10px] rounded-[5px] font-bold cursor-pointer hover:bg-green-600 "onClick={()=>{
                        AddHospitalPost()
                    }}>Add Hospital</button>
                    <button className="text-[20px] p-[5px] pl-[10px] pr-[10px] bg-red-500 mt-[10px] rounded-[5px] font-bold cursor-pointer hover:bg-red-600" onClick={()=>{
                        setdisplayAddHospital(false)
                    }}>Cancel</button>
                </div>
        </div>
    )
}