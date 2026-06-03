import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import {
  ArrowLeft,
  Search,
  Plus,
  User,
  Shield,
  X,
  Save,
  UserCircle,
  Lock,
  Edit,
  Stethoscope,
  AlertCircle,
  UserRoundXIcon,
} from "lucide-react";

import SidebarComponent from "./SidebarComponent";

export function ManageUserPage() {
    const [displayAddUser, setdisplayAddUser] = useState(false);
    const [userListData, setuserListData] = useState<any[]>([]);
    const [selectedUser, setselectedUser] = useState<any>(null);
    const [searchValue, setsearchValue] = useState("");
    const [showPassword,setshowPassword]=useState<{show:boolean,user:any}>({show:false,user:""})
    const[isEmptySearch,setisEmptySearch]=useState<boolean>(false)
    async function getUserList() {
        const userList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/listuser`,{ withCredentials: true });
        setuserListData(userList.data.userdata || []);
    }

    useEffect(() => {
        getUserList();
    }, []);

  const filteredUsers = useMemo(() => {
    return userListData.filter((x: any) => {
      return (x.displayname?.toLowerCase().includes(searchValue.toLowerCase()) || x.username?.toLowerCase().includes(searchValue.toLowerCase()));
    });
  }, [searchValue, userListData]);
  useEffect(() => {
      if(filteredUsers?.length!=0){
        setisEmptySearch(false)
      }else{
        setisEmptySearch(true)
      }

  }, [filteredUsers])

  return (
    <div className="bg-[#f6f8fb] flex h-full flex-col lg:flex-row overflow-y-auto">
       
    <SidebarComponent/>

      <div className="w-full flex flex-col">
        <div className="min-h-20 bg-white border-b border-[#e8edf2] px-3 sm:px-4 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ">
          <div className="relative w-full lg:max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            {searchValue && (
              <X className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] cursor-pointer" onClick={() => {
                  setsearchValue("");
                }}/>
            )}
            <input type="text" placeholder="Search doctors or nurses..." className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] pl-11 pr-4 outline-none " value={searchValue}onChange={(e) => {
                setsearchValue(e.target.value);
              }}/>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Link to="/dashboard" className="flex-1 md:flex-none">
              <button className="w-full lg:w-auto h-11 px-5 rounded-[10px] border border-[#dbe4ee] cursor-pointer group font-semibold bg-white hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-[#1e293b] ">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
            </Link>

            <button onClick={() => {
                setdisplayAddUser(true);
              }}
              className="flex-1 lg:flex-none h-11 px-5 rounded-[10px] bg-[#1e3a5f] hover:bg-[#24466f] text-white transition-all flex items-center justify-center gap-2 font-semibold cursor-pointer">
              <Plus className="w-5 h-5 text-white " />
              Add User
            </button>
          </div>
        </div>
        <div className="p-3 md:p-4 lg:p-8 flex flex-col overflow-y-auto">
            
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1e293b]">
              User Management
            </h1>
          </div>

          <div className="bg-white border border-[#e8edf2] rounded-[10px] shadow-sm flex flex-col ">
            {filteredUsers.map((x: any) => {
              return (
                <div key={x.username} className="border-b border-[#eef2f7] hover:bg-[#fafcff] transition-all flex flex-col sm:flex-row ">
                  <div className="flex">  
                    <div className="px-4 lg:px-6 py-5 w-fit">
                        <div className="flex items-center gap-3 lg:min-w-[220px]">
                        <div className="w-11 h-11 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold hover:bg-white duration-[0.3s] hover:text-blue-900 cursor-pointer border-2 border-blue-900 capitalize">
                            {x.displayname?.[0]}
                        </div>

                        <div>
                            <h2 className="font-semibold text-[#1e293b] break-words">
                            {x.displayname}
                            </h2>

                            <p className="text-sm text-[#64748b]">@{x.username}</p>
                        </div>
                        </div>
                    </div>

                    <div className="px-4 lg:px-6 py-5 w-[120px] lg:w-[150px] select-none">
                        <div className="inline-flex w-[100px] items-center gap-2 px-3 h-9 rounded-[10px] bg-[#f1f5f9] text-[#1e293b] text-sm font-semibold capitalize ">
                        {x.role === "doctor" ? (<Stethoscope className="w-4 h-4" />) : (<Shield className="w-4 h-4" />)}
                        {x.role}
                        </div>
                    </div>
                  </div>

                  <div className="flex justify-between w-full  sm:flex-row">
                    <div className="px-4 lg:px-6 py-5 ">
                        <input type={showPassword.show && showPassword.user===x ?"text":"password"} readOnly className="bg-slate-100 text-black h-[40px] p-[5px] rounded-[5px] border border-slate-200 font-medium outline-0 " value={x.password} onMouseEnter={()=>(
                                setshowPassword({...showPassword,show:true,user:x})
                            )} onMouseLeave={()=>{
                                setshowPassword({...showPassword,show:false,user:x})
                            }}/>
                    </div>

                    <div className="px-4 lg:px-6 py-5 ">
                        <div className="flex justify-start lg:justify-end">
                        <button onClick={() => {
                            setselectedUser(x);
                            }} className="h-10 px-4 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-green-200 transition-all flex items-center gap-2 text-[#1e293b]  whitespace-nowrap cursor-pointer font-semibold">
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                        </div>
                    </div>
                   </div>     
                </div>
              );
            })}
            {isEmptySearch?
                <div className="flex flex-col mt-[50px]">
                    <div className="bg-blue-400 w-fit p-[20px] rounded-full self-center mb-[20px]"> <UserRoundXIcon className="h-[60px] w-[60px] stroke-[1.2] text-white" /></div>
                    <div className="flex flex-col mb-[20px]">
                        <h1 className="font-bold text-[25px] self-center mb-[10px]">No User Found</h1>
                        <p className="text-[15px] text-[#64748b] ml-auto mr-auto w-[80%] text-center">There are no users with the given name</p>
                    </div>
                </div>:""}

          </div>


        </div>

      </div>

      {displayAddUser && (<AddUserComponent getUserList={getUserList} setdisplayAddUser={setdisplayAddUser}/>)}

      {selectedUser && (<EditUserComponent selectedUser={selectedUser}setselectedUser={setselectedUser}getUserList={getUserList}/>)}
    </div>
  );
}

function EditUserComponent({selectedUser,setselectedUser,getUserList}: any) {
  const [userData, setuserData] = useState({ username: selectedUser.username,displayName: selectedUser.displayname,password: selectedUser.password,roleType: selectedUser.role});
  const [displayNameError,setdisplayNameError]=useState<string>("")
  const [passwordError,setpasswordError]=useState("")
  const [showPassword,setshowPassword]=useState<boolean>(false);
  async function UpdateUserPost() {
    const updateUser = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/updateuser`,userData,{ withCredentials: true });
    if(updateUser.data.status==="missingData"){
        console.log("missing data")
    }else{
        getUserList();
        setselectedUser(null);
    }

  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full sm:max-w-md h-fit bg-white border-l border-[#e8edf2] p-5 sm:p-8 overflow-y-auto rounded-[5px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e293b]">Edit User</h1>
            <p className="text-sm text-[#64748b] mt-1"> Update user information</p>
          </div>

          <button onClick={() => {
              setselectedUser(null);
            }} className="w-11 h-11 rounded-[10px]  flex items-center justify-center hover:bg-red-100 cursor-pointer text-black">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={(e)=>{
            e.preventDefault();
            if(userData.displayName){
                setdisplayNameError("")
                if(userData.password){
                    setpasswordError("")
                    UpdateUserPost()
                }else{
                    setpasswordError("Password Cannot Be Empty")
                }
            }else{
                setdisplayNameError("Display Name Cannot Be Empty")
            }

        }}>
            <div className="space-y-5">
                
            <div className="select-none cursor-not-allowed">
                <div className="text-[#64748b] text-sm mb-[10px] ml-[1px] select-none">Username</div>
                <div className="flex relative top-1/2 select-none">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />
                    <input type="text" disabled className={`border w-full h-[50px] rounded-[10px] bg-[#f1f5f9] border-[#dbe4ee] relative pl-[50px] text-[#64748b] select-none cursor-not-allowed`} defaultValue={userData.username} readOnly />
                </div>
            </div>

            <div className="select-none">
                <div className="text-[#64748b] text-sm mb-[10px] ml-[1px] select-none">Display Name</div>
                <div className="flex relative top-1/2 select-none">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />
                    <input type="text" className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc]  relative pl-[50px] text-[#64748b] hover:text-[#3e4856]  outline-0 ${displayNameError?"border border-red-500":"border-[#dbe4ee]"}`} onChange={(e:any)=>(
                        setdisplayNameError(""),
                        setuserData({...userData,displayName:e.target.value})
                    )} value={userData.displayName} />
                </div>
                {displayNameError && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{displayNameError}</p>)}
            </div>
            <div className="select-none">
                <div className="text-[#64748b] text-sm mb-[10px] ml-[1px] select-none">Password</div>
                <div className="flex relative top-1/2 select-none">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />
                    <input type={showPassword?"text":"password"} maxLength={20} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative pl-[50px] text-[#64748b] outline-0 ${displayNameError?"border border-red-500":"border-[#dbe4ee]"}`} onChange={(e:any)=>{
                        setdisplayNameError("");
                        setuserData({...userData,password:e.target.value});
                        
                    }} value={userData.password} onMouseEnter={()=>(
                            setshowPassword(true)
                        )} onMouseLeave={()=>{
                                setshowPassword(false)
                            }} />
                </div>
                {passwordError && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{passwordError}</p>)}
            </div>

            
            <div className="select-none cursor-not-allowed">
                <div className="text-[#64748b] text-sm mb-[10px] ml-[1px] select-none">Role</div>
                <div className="flex relative top-1/2 select-none">
                    {userData.roleType==="nurse"?<Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />:<Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />}
                    <input type="text" disabled className={`border w-full h-[50px] rounded-[10px] bg-[#f1f5f9] border-[#dbe4ee] relative pl-[50px] text-[#64748b] select-none cursor-not-allowed`} defaultValue={userData.roleType} readOnly />
                </div>
            </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button type="submit" className="flex-1 min-h-[50px] rounded-xl bg-[#1e3a5f] hover:bg-[#245188] text-white transition-all flex items-center justify-center gap-2 font-medium cursor-pointer">
                <Save className="w-4 h-4" /> Save Changes
            </button>

            <button onClick={() => {
                setselectedUser(null)
                }} className="h-12 px-5 rounded-[10px] border border-[#dbe4ee] hover:bg-red-100 hover:border-red-100 transition-all font-medium cursor-pointer">Cancel</button>
            </div>
        </form>

      </div>
    </div>
  );
}

function AddUserComponent({getUserList,setdisplayAddUser,}: any) {
  const [userData, setuserData] = useState({username: "",displayName: "",password: "",roleType: "doctor",});
  const [errorMessage,seterrorMessage]=useState<{username:string,displayName:string,password:string,userCreated:string}>({username:"",displayName:"",password:"",userCreated:""})
  const[showPassword,setshowPassword]=useState<boolean>(false)
  async function AddUserPost() {
    const addUser = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/adduser`,userData,{ withCredentials: true });
    if(addUser.data.status==="missingData"){
        console.log("missing data")
    }else if(addUser.data.status==="unableToCreateUser"){
        seterrorMessage({...errorMessage,username:"Username is Taken"})
    }else{
        getUserList();
        seterrorMessage({...errorMessage,userCreated:"User Created"})
        setTimeout(() => {
            setdisplayAddUser(false);
        }, 3000);

    }

  }

  

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-lg ${errorMessage.userCreated?"bg-green-300":"bg-white"} rounded-3xl border border-[#e8edf2] shadow-xl p-5 sm:p-8`}>

        <div className="flex items-center justify-between mb-[10px]">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e293b]"> Add User </h1>
            <p className="text-sm text-[#64748b] mt-1"> Create doctor or nurse account</p>
          </div>

          <button onClick={() => { setdisplayAddUser(false);}} className="w-11 h-11 rounded-xl hover:bg-red-100 flex items-center justify-center cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={(e)=>{
            e.preventDefault();
            if(userData.username){
                seterrorMessage({...errorMessage,username:""})
                if(userData.displayName){
                    seterrorMessage({...errorMessage,displayName:""})
                    if(userData.password){
                        seterrorMessage({...errorMessage,password:""})
                        AddUserPost()
                    }else{
                        seterrorMessage({...errorMessage,password:"Password Cannot Be Empty"})
                    }
                }else{
                    seterrorMessage({...errorMessage,displayName:"Display Name Cannot Be Empty"})
                }
            }else{
                seterrorMessage({...errorMessage,username:"Username Cannot Be Empty"})
            }
        }}>
            <div className="space-y-5">

                <div className="select-none">
                    <div className="text-[#64748b] text-sm mb-[10px] ml-[1px] select-none">Username</div>
                    <div className="flex relative top-1/2 select-none">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />
                        <input type="text" maxLength={20} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative pl-[50px] text-[#64748b] outline-0 ${errorMessage.username?"border border-red-500":"border-[#dbe4ee]"}`} onChange={(e:any)=>{
                            seterrorMessage({...errorMessage,username:""})
                            setuserData({...userData,username:e.target.value});
                        }} value={userData.username}/>
                    </div>
                    {errorMessage.username && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errorMessage.username}</p>)}
                </div>

                <div className="select-none">
                    <div className="text-[#64748b] text-sm mb-[10px] ml-[1px] select-none">Display Name</div>
                    <div className="flex relative top-1/2 select-none">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />
                        <input type="text" maxLength={20} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative pl-[50px] text-[#64748b] outline-0 ${errorMessage.displayName?"border border-red-500":"border-[#dbe4ee]"}`} onChange={(e:any)=>{
                            seterrorMessage({...errorMessage,displayName:""})
                            setuserData({...userData,displayName:e.target.value});
                            
                        }} value={userData.displayName}/>
                    </div>
                    {errorMessage.displayName && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errorMessage.displayName}</p>)}
                </div>


                <div className="select-none">
                    <div className="text-[#64748b] text-sm mb-[10px] ml-[1px] select-none">Password</div>
                    <div className="flex relative top-1/2 select-none">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />
                        <input type={showPassword?"text":"password"} maxLength={20} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative pl-[50px] text-[#64748b] outline-0 ${errorMessage.password?"border border-red-500":"border-[#dbe4ee]"}`} onChange={(e:any)=>{
                            seterrorMessage({...errorMessage,password:""})
                            setuserData({...userData,password:e.target.value});
                            
                        }} value={userData.password} onMouseEnter={()=>(
                                setshowPassword(true)
                            )} onMouseLeave={()=>{
                                    setshowPassword(false)
                                }} />
                    </div>
                    {errorMessage.password && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errorMessage.password}</p>)}
                </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-[#64748b]">
                    Role
                </label>

                <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]">
                    {userData.roleType==="doctor"?<Stethoscope className="w-4 h-4" />:<Shield className="w-4 h-4" />} 
                </div>

                <select value={userData.roleType} onChange={(e) =>
                    setuserData({...userData,roleType: e.target.value,})
                    }
                    className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] pl-11 pr-5 outline-none cursor-pointer ">
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                </select>
                </div>
            </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button type="submit"className="flex-1 min-h-[50px] rounded-xl bg-[#1e3a5f] hover:bg-[#245188] text-white transition-all flex items-center justify-center gap-2 font-medium cursor-pointer">
                <Plus className="w-4 h-4" />
                Add User
            </button>

            <button onClick={() => {
                setdisplayAddUser(false)
                }} className="h-12 px-5 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-red-100 hover:border-red-100 transition-all font-medium cursor-pointer">Cancel</button>
            </div>
        </form>
      </div>
    </div>
  );
}
