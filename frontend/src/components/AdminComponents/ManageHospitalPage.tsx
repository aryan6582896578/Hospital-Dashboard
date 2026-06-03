import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import {ArrowLeft,Plus,X,Save,Edit,Stethoscope,Shield,Building2,AlertCircle, Search, HospitalIcon,} from "lucide-react";
import SidebarComponent from "./SidebarComponent";

export function ManageHospitalPage() {
  const [displayAddHospital, setdisplayAddHospital] =useState<boolean>(false);
  const [hospitalListData, sethospitalListData] = useState<any[]>([]);
  const[searchValue,setsearchValue]=useState<string>("");
  const[isEmptySearch,setisEmptySearch]=useState<boolean>(false)

  async function getHospitalList() {
    const hospitalList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/listhospital`,{ withCredentials: true });
    if (hospitalList.data.status === "unableToGetHospitalList") {
      console.log("error unable to fetch hospital list");
    } else {
      sethospitalListData(hospitalList.data.hospitalData || []);
    }
  }

  const filteredHospital = useMemo(() => {
    return hospitalListData.filter((x: any) => {
        return (x.displayname?.toLowerCase().includes(searchValue.toLowerCase()) ||x.name?.toLowerCase().includes(searchValue.toLowerCase()));
    });
  }, [searchValue, hospitalListData]);

  useEffect(() => {
      if(filteredHospital?.length!=0){
        setisEmptySearch(false)
      }else{
        setisEmptySearch(true)
      }

  }, [filteredHospital])
  
  useEffect(() => {
    getHospitalList();
  }, []);

  return (
    <div className="bg-[#f6f8fb] flex h-dvh flex-col lg:flex-row">

        <SidebarComponent />

      <div className="flex flex-col w-full overflow-y-scroll">
            <div className="min-h-20 shrink-0 bg-white border-b border-[#e8edf2] px-3 sm:px-4 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-[15px] lg:text-[18px]">
                <div className="relative w-full lg:max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                    {searchValue && (
                    <X className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] cursor-pointer" onClick={() => {
                        setsearchValue("");
                        }}/>
                    )}
                    <input type="text" placeholder="Search hospitals..." maxLength={30} className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] pl-11 pr-4 outline-none " value={searchValue} onChange={(e) => {
                        setsearchValue(e.target.value);
                    }}/>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                    <Link to="/dashboard" className="flex-1 md:flex-none">
                    <button className="w-full lg:w-auto h-11 px-5 rounded-[10px] border border-[#dbe4ee] cursor-pointer group  bg-white hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-[#1e293b]">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                    </button>
                    </Link>

                    <button onClick={() => {
                        setdisplayAddHospital(true);
                    }}
                    className="flex-1 lg:flex-none h-11 px-5 rounded-[10px] bg-[#1e3a5f] hover:bg-[#24466f] text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <Plus className="w-5 h-5 text-white" /> Add Hospital
                    </button>
                </div>
            </div>

            <div className="bg-[#f6f8fb] p-0 lg:p-[20px] flex w-full overflow-y-auto flex-col">
                <div className="mb-8">
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1e293b]">
                    Hospital Management
                  </h1>
                </div>
                <div className="flex w-full p-0 lg:p-[20px] ">

                    <div className=" border border-[#e8edf2] rounded-[10px] shadow-sm  overflow-y-auto bg-white w-full pb-[20px]">
                        <div className="flex flex-col">
                            {filteredHospital?.map((x: any) => {
                                return (<HospitalListComponent key={x.name}hospitalDataList={x}getHospitalList={getHospitalList}/>);
                            })
                            }
                        </div>
                        
                        {isEmptySearch?
                        <div className="flex flex-col mt-[50px]">
                            <div className="bg-blue-400 w-fit p-[20px] rounded-full self-center mb-[20px]"><HospitalIcon className="h-[60px] w-[60px] stroke-[1.2] text-white" /></div>
                            <div className="flex flex-col">
                                <h1 className="font-bold text-[25px] self-center mb-[10px]">No Hospitals Available</h1>
                                <p className="text-[15px] text-[#64748b] ml-auto mr-auto w-[80%] text-center">There are no hospitals Available with the given name</p>
                            </div>
                        </div>:""}

                    </div>
                </div>
            </div>

            <div className="">
                {displayAddHospital && ( <AddHospitalComponent getHospitalList={getHospitalList}setdisplayAddHospital={setdisplayAddHospital}/>)}
            </div>
      </div>
    </div>
  );
}

function HospitalListComponent({hospitalDataList,getHospitalList,}: {hospitalDataList: any;getHospitalList: () => void;}) {
  const [hospitalData, sethospitalData] = useState<{name: string;displayName: string;doctorList: Array<string>;nurseList: Array<string>;}>({name: hospitalDataList.name,displayName: hospitalDataList.displayname,doctorList: hospitalDataList.doctorlist || [],nurseList: hospitalDataList.nurselist || []});
  const [isDisabled, setisDisabled] = useState<boolean>(true);
  const [userList, setuserList] = useState<any[]>([]);
  const [errorMessage, seterrorMessage] = useState<string>("");

  async function getUserList() {
    const userList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/listuser`,{ withCredentials: true });

    if (userList.data.status === "unableToGetUserList") {
      console.log("error unable to fetch user list");
    } else {
      setuserList(userList.data.userdata);
    }
  }



  async function UpdateHospitalPost() {
    const addHospital = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/updatehospital`,hospitalData,{ withCredentials: true });

    if (addHospital.data.status === "unableToUpdateHospital") {
      seterrorMessage("internal server error contact admin");
    } else if (addHospital.data.status === "missingData") {
      seterrorMessage("* fields cannot be empty");
    } else {
      setisDisabled(true);
      getUserList();
      getHospitalList();
    }
  }

  useEffect(() => {
    getUserList();
  }, []);

  const totalUsers = useMemo(() => {
    return (hospitalData.doctorList.length + hospitalData.nurseList.length);
  }, [hospitalData]);

  return (
    <div className={`border-1   transition-all  border-[#dbe4ee] rounded-[10px] m-[20px] cursor-pointer ${isDisabled?"hover:bg-blue-100":"bg-green-100"} `}>
      <div className="flex flex-col lg:flex-row justify-between p-5 gap-5 break-all">
        <div className="flex gap-4 ">
          <div className="min-w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-lg capitalize">{hospitalData.displayName?.[0]}</div>
          {errorMessage && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errorMessage}</p>)}
          <div className="">
            <h2 className="font-semibold text-[#1e293b] text-lg">{hospitalData.displayName}</h2>
            <p className="text-sm text-[#64748b]">@{hospitalData.name}</p>
            <div className="flex flex-wrap gap-3 mt-3 ">
              <div className="inline-flex items-center gap-2 px-3 h-9 rounded-[10px] bg-[#f1f5f9] text-[#1e293b] text-sm font-semibold ">
                <Stethoscope className="w-4 h-4" /> {hospitalData.doctorList.length} Doctors
              </div>

              <div className="inline-flex items-center gap-2 px-3 h-9 rounded-[10px] bg-[#f1f5f9] text-[#1e293b] text-sm font-semibold">
                <Shield className="w-4 h-4" /> {hospitalData.nurseList.length} Nurses
              </div>

              <div className="inline-flex items-center gap-2 px-3 h-9 rounded-[10px] bg-[#f1f5f9] text-[#1e293b] text-sm font-semibold">
                <Building2 className="w-4 h-4" /> {totalUsers} Members
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          {isDisabled ? (
            <button onClick={() => {
                setisDisabled(false);
              }}
              className="h-10 px-4 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-green-200 transition-all flex items-center gap-2 text-[#1e293b] whitespace-nowrap cursor-pointer ">
              <Edit className="w-4 h-4" />Edit
            </button>
          ) : (
            <>
              <button onClick={() => {
                  UpdateHospitalPost();
                }}
                className="h-10 px-4 rounded-[10px] bg-[#1e3a5f] hover:bg-[#245188] text-white transition-all flex items-center gap-2  cursor-pointer">
                <Save className="w-4 h-4" />Save
              </button>

              <button onClick={() => {
                  setisDisabled(true);
                }}
                className="h-10 p-2 rounded-[10px] bg-transparent hover:bg-red-200 text-black transition-all flex items-center gap-2  cursor-pointer">
                 <X className="w-4 h-4"/>   
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="px-5 pt-[10px] overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-2">
          {userList?.map((x: any) => {
            return (
              <div key={x.username} className="border border-[#dbe4ee] rounded-[10px] p-3 bg-[#f8fafc] flex items-center justify-between mb-[20px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold capitalize">
                    {x.displayname?.[0]}
                  </div>

                  <div>
                    <div className="font-medium text-[#1e293b]">
                      {x.displayname}
                    </div>

                    <div className="text-sm text-[#64748b] capitalize flex items-center gap-1">
                      {x.role === "doctor" ? (<Stethoscope className="w-3 h-3" />) : (<Shield className="w-3 h-3" /> )}
                      {x.role}
                    </div>
                  </div>
                </div>

                <input
                  type="checkbox"
                  disabled={isDisabled}
                  checked={hospitalData.doctorList.includes(x.username) ||hospitalData.nurseList.includes(x.username)}
                  onChange={(e) => {
                    if (x.role === "doctor") {
                      if (e.target.checked) {
                        sethospitalData((prev: any) => ({
                          ...prev,
                          doctorList: [...prev.doctorList, x.username],
                        }));
                      } else {
                        sethospitalData((prev: any) => ({
                          ...prev,
                          doctorList: prev.doctorList.filter(
                            (username: any) =>
                              username !== x.username
                          ),
                        }));
                      }
                    }

                    if (x.role === "nurse") {
                      if (e.target.checked) {
                        sethospitalData((prev: any) => ({
                          ...prev,
                          nurseList: [...prev.nurseList, x.username],
                        }));
                      } else {
                        sethospitalData((prev: any) => ({
                          ...prev,
                          nurseList: prev.nurseList.filter(
                            (username: any) =>
                              username !== x.username
                          ),
                        }));
                      }
                    }
                  }}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </div>
  );
}

type Props = {getHospitalList: () => void;setdisplayAddHospital: React.Dispatch<React.SetStateAction<boolean>>};

function AddHospitalComponent({getHospitalList,setdisplayAddHospital}: Props) {
  const [hospitalData, sethospitalData] = useState<{name: string;displayName: string;doctorList: Array<string>;nurseList: Array<string>;}>({name: "",displayName: "",doctorList: [],nurseList: []});
  const [userList, setuserList] = useState<any[]>([]);
  const [errorMessage, seterrorMessage] = useState<{name:string,displayName:string}>({name:"",displayName:""});
  async function AddHospitalPost() {
    const addHospital = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/addhospital`,hospitalData,{ withCredentials: true });

    if (addHospital.data.status === "unableToCreateHospital") {
      seterrorMessage({...errorMessage,name:"use a diffrent hospital name"})
    } else {
      setdisplayAddHospital(false);
      getUserList();
      getHospitalList();
    }
  }

  async function getUserList() {
    const userList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/admin/listuser`,{ withCredentials: true });

    if (userList.data.status === "unableToGetUserList") {
      console.log("error unable to fetch user list");
    } else {
      setuserList(userList.data.userdata);
    }
  }

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-[#e8edf2] shadow-xl p-5 sm:p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-[10px]">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e293b]">Add Hospital</h1>
            <p className="text-sm text-[#64748b] mt-1">Create and manage hospital access</p>
          </div>

          <button onClick={() => {
              setdisplayAddHospital(false);
            }} className="w-11 h-11 rounded-xl hover:bg-red-100 flex items-center justify-center cursor-pointer"> <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={(e)=>{
            e.preventDefault();
            if(hospitalData.name){
                seterrorMessage({...errorMessage,name:""})
                if(hospitalData.displayName){
                    seterrorMessage({...errorMessage,displayName:""})
                    AddHospitalPost()
                }else{
                    seterrorMessage({...errorMessage,displayName:"display name cannot be empty"})
                }
            }else{
                seterrorMessage({...errorMessage,name:"Hospital name cannot be empty"})
            }
        }}>
        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
                <div className="text-[#64748b] text-sm mb-[10px] ml-[1px]">Hospital Name</div>

                <input type="text" maxLength={30} className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] px-4 outline-none" onChange={(e) => {
                    seterrorMessage({...errorMessage,name:""})
                    sethospitalData({...hospitalData,name: e.target.value});
                }}/>
                {errorMessage.name && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errorMessage.name}</p>)}
            </div>

            <div>
                <div className="text-[#64748b] text-sm mb-[10px] ml-[1px]">Display Name</div>

                <input type="text" maxLength={20} className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] px-4 outline-none" onChange={(e) => {
                    seterrorMessage({...errorMessage,displayName:""}) 
                    sethospitalData({...hospitalData,displayName: e.target.value,});
                }}/>
                {errorMessage.displayName && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errorMessage.displayName}</p>)}
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userList?.map((x: any) => {
                return (
                <div key={x.username} className="border border-[#dbe4ee] rounded-[10px] p-3 bg-[#f8fafc] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold capitalize">
                        {x.displayname?.[0]}
                    </div>
                    <div>
                        <div className="font-medium text-[#1e293b]">{x.displayname}</div>
                        <div className="text-sm text-[#64748b] capitalize flex items-center gap-1">
                            {x.role === "doctor" ? (<Stethoscope className="w-3 h-3" />) : (<Shield className="w-3 h-3" /> )}
                            {x.role}
                        </div>
                    </div>
                    </div>

                    <input type="checkbox" className="w-5 h-5 cursor-pointer" onChange={(e) => {
                        if (x.role === "doctor") {
                            if (e.target.checked) {
                                sethospitalData((prev: any) => ({...prev,doctorList: [...prev.doctorList,x.username]}));
                            } else {
                                sethospitalData((prev: any) => ({...prev,doctorList: prev.doctorList.filter((username: any) =>username !== x.username)}));
                            }
                        }

                        if (x.role === "nurse") {
                        if (e.target.checked) {
                            sethospitalData((prev: any) => ({...prev,nurseList: [...prev.nurseList,x.username]}));
                        } else {
                            sethospitalData((prev: any) => ({...prev,nurseList: prev.nurseList.filter((username: any) =>username !== x.username)}));
                        }
                        }
                    }}/>
                </div>
                );
            })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button type="submit"className="flex-1 min-h-[50px] rounded-xl bg-[#1e3a5f] hover:bg-[#245188] text-white transition-all flex items-center justify-center gap-2 font-medium cursor-pointer">
                <Plus className="w-4 h-4" /> Add Hospital
            </button>

            <button onClick={() => {
                setdisplayAddHospital(false);
                }}
                className="h-12 px-5 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-red-100 hover:border-red-100 transition-all font-medium cursor-pointer">
                Cancel
            </button>
            </div>
        </form>

      </div>
    </div>
  )
}