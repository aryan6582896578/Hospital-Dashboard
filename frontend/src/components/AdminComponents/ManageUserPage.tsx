import { useContext, useEffect, useState } from "react"
import { UserRoleContext } from "../AuthPage"
import { Link } from "react-router";
import axios from "axios";

export function ManageUserPage(){
    const userRole = useContext<any>(UserRoleContext);
    const[displayAddUser,setdisplayAddUser]=useState<boolean>(false);
    const [userListData,setuserListData]=useState<any>();
    const [userListDataError,setuserListDataError]=useState<string>("");
    async function getUserList(){
        const userList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/listuser`,{withCredentials: true })
        if(userList.data.status==="unableToGetUserList"){
            setuserListDataError("error unable to fetch user list")
        }else{
            setuserListData(userList.data.userdata)
        }
    }
    useEffect(() => {
        getUserList()
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
                <div className="bg-blue-900 min-w-[150px] m-[10px] p-[15px] rounded-[10px] min-h-fit ">
                    <button className="bg-[#fab33c] text-white p-[5px] ml-auto flex mr-auto text-[25px] rounded-[5px] font-bold cursor-pointer  hover:bg-[#d19732]" onClick={()=>{
                        setdisplayAddUser(true)
                    }}>Add User</button>
                </div>
                <div className="bg-blue-900 w-full m-[10px] rounded-[10px] flex flex-col overflow-y-scroll ml-auto mr-auto pt-[20px]">
                    
                    {displayAddUser?<AddUserComponent setdisplayAddUser={setdisplayAddUser} getUserList={getUserList}/>:""}
                    {userListDataError? 
                        <div className="bg-blue-500 m-[10px] p-[10px] rounded-[5px] text-white font-medium text-center flex ">
                            <div className="flex ml-auto mr-auto text-[25px]">
                                {userListDataError}
                            </div>
                        </div>:""}
                        <div className="mb-[100px] ml-auto mr-auto flex flex-col">
                            {userListData?.map((x:any)=>{
                                return <div key={x.username} >
                                    <UserListComponent userDataList={x} getUserList={getUserList}/>
                                </div>
                            })}
                        </div>

                    
                </div>
            </div>
        </div>
    )
}

function UserListComponent({userDataList,getUserList}:{userDataList:any,getUserList:() => void}){
        const[userData,setuserData]=useState<{username:string,displayName:string,password:string,roleType:string,hospitalList:Array<string>}>({username:userDataList.username,displayName:userDataList.displayname,password:userDataList.password,roleType:userDataList.role,hospitalList:[]})
        const[isDisabled,setisDisabled]=useState<boolean>(true)
        const[errorMessage,seterrorMessage]=useState<string>("")
        async function UpdateUserPost(){
            console.log(userData)
            const addHospital = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/updateuser`,userData,{withCredentials: true })
            console.log(addHospital.data)
            if(addHospital.data.status==="unableToUpdateHospital"){
                seterrorMessage("internal server error contact admin")
            }else if(addHospital.data.status==="missingData"){
                seterrorMessage(" * fields cannot be empty")
            }else{
                setisDisabled(true)
                getUserList()
            }
        }
    return(
      <div className={`${isDisabled?'bg-gray-500':'bg-blue-500'}  m-[10px] p-[10px] rounded-[5px] text-white font-medium text-center mb-[30px] w-fit ml-auto mr-auto`}>
                <div className="flex  p-[5px] ">
                    <div className=" p-[10px] ml-auto mr-auto">
                        <div className="text-red-500 bg-white rounded-[5px]">{errorMessage?errorMessage:""}</div>
                        <div className="flex flex-col text-start">
                            <div className="">USERNAME <span className="text-red-500">*</span></div>
                            <input type="text" maxLength={15} className="bg-yellow-50 rounded-[5px] outline-0 p-[5px] text-black" required value={userData.username} disabled={true}/>
                        </div>
                        <div className="flex flex-col text-start mt-[5px]">
                            <div className="">DISPLAY NAME <span className="text-red-500">*</span></div>
                            <input type="text" maxLength={30} className="bg-yellow-50 rounded-[5px] outline-0 p-[5px] text-black" required onChange={(e)=>{
                                setuserData({...userData,displayName:e.target.value})
                            }} value={userData.displayName} disabled={isDisabled}/>
                        </div>
                        <div className="flex flex-col text-start mt-[5px]">
                            <div className="">PASSWORD <span className="text-red-500">*</span></div>
                            <input type="text" maxLength={20} className="bg-yellow-50 rounded-[5px] outline-0 p-[5px] text-black min-w-[300px]" required onChange={(e)=>{
                                setuserData({...userData,password:e.target.value})
                            }} value={userData.password} disabled={isDisabled}/>
                        </div>
                        <div className="flex flex-col text-start mt-[5px]">
                            <div className="">ROLE <span className="text-red-500">*</span></div>
                            <input type="text" maxLength={20} className="bg-gray-700 rounded-[5px] outline-0 p-[5px] text-white min-w-[300px]" value={userData.roleType} disabled={true}/>
                        </div>
                    </div>                    
                </div>
                <div className="flex place-content-evenly">
                    <button className={`text-[20px] p-[5px] pl-[10px] pr-[10px] ${isDisabled?'bg-green-500':'bg-[#fab33c]'}  mt-[10px] rounded-[5px] font-bold cursor-pointer ${isDisabled?'hover:bg-green-600':'hover:bg-[#d19732]'} `} onClick={()=>{
                        isDisabled?setisDisabled(false):UpdateUserPost()
                    }}>{isDisabled?'EDIT':'SAVE'}</button>
                    {isDisabled?"":<button className={`text-[20px] p-[5px] pl-[10px] pr-[10px] bg-red-500 hover:bg-red-600 mt-[10px] rounded-[5px] font-bold cursor-pointer`} onClick={()=>{
                        setisDisabled(true)
                    }}>CANCEL</button>}

                </div>
        </div>
    )
}

type Props = {
    getUserList: () => void
    setdisplayAddUser: React.Dispatch<React.SetStateAction<boolean>>
}
function AddUserComponent({getUserList,setdisplayAddUser}: Props){
    const[userData,setuserData]=useState<{username:string,displayName:string,password:string,roleType:string}>({username:"",displayName:"",password:"",roleType:"doctor"})
    const [errorMessage,seterrorMessage]=useState<string>("")

    async function AddUserPost(){
        console.log(userData)
        const addUser = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/adduser`,userData,{withCredentials: true })
        console.log(addUser.data)
        if(addUser.data.status==="unableToCreateUser"){
            setdisplayAddUser(false)
        }else if(addUser.data.status==="missingData"){
            seterrorMessage("fill all the fields")
        }else{
            setdisplayAddUser(false)
            getUserList()
        }

    }
    return(
        <div className="bg-blue-500 m-[10px] p-[10px] rounded-[5px] text-white font-medium text-center mb-[20px] w-fit ml-auto mr-auto">
                <div className="text-[25px] ">Add A New User</div>
                <div className="bg-white text-red-500 rounded-[5px] font-bold">{errorMessage?errorMessage:""}</div>
                <div className="flex  p-[5px]">
                    <div className=" p-[10px] ">
                        <div className="flex flex-col text-start">
                            <div className="">USERNAME <span className="text-red-500">*</span></div>
                            <input type="text" maxLength={15} className="bg-yellow-50 rounded-[5px] outline-0 p-[5px] text-black" required onChange={(e)=>{
                                setuserData({...userData,username:e.target.value})
                            }}/>
                        </div>
                        <div className="flex flex-col text-start mt-[5px]">
                            <div className="">DISPLAY NAME <span className="text-red-500">*</span></div>
                            <input type="text" maxLength={30} className="bg-yellow-50 rounded-[5px] outline-0 p-[5px] text-black" required onChange={(e)=>{
                                setuserData({...userData,displayName:e.target.value})
                            }}/>
                        </div>
                        <div className="flex flex-col text-start mt-[5px]">
                            <div className="">PASSWORD <span className="text-red-500">*</span></div>
                            <input type="text" maxLength={20} className="bg-yellow-50 rounded-[5px] outline-0 p-[5px] text-black min-w-[300px]" required onChange={(e)=>{
                                setuserData({...userData,password:e.target.value})
                            }}/>
                        </div>
                        <div className="flex flex-col text-start mt-[5px]">
                            <div className="">ROLE <span className="text-red-500">*</span></div>
                                <select value={userData.roleType} className="outline-0 bg-yellow-50 text-black cursor-pointer rounded-[5px]" onChange={(e) => {
                                    setuserData({...userData,roleType:e.target.value})
                                }} required>
                                    <option value="doctor" selected className="font-medium">DOCTOR</option>
                                    <option value="nurse" className="font-medium">NURSE</option>
                                </select>
                        </div>
                    </div>
                    
                </div>
                <div className="flex place-content-evenly">
                    <button className="text-[20px] p-[5px] pl-[10px] pr-[10px] bg-green-500 mt-[10px] rounded-[5px] font-bold cursor-pointer hover:bg-green-600 "onClick={()=>{
                        AddUserPost()
                    }}>Add User</button>
                    <button className="text-[20px] p-[5px] pl-[10px] pr-[10px] bg-red-500 mt-[10px] rounded-[5px] font-bold cursor-pointer hover:bg-red-600" onClick={()=>{
                        setdisplayAddUser(false)
                    }}>Cancel</button>
                </div>
        </div>
    )
}