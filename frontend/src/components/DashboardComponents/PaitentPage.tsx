import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { UserRoleContext } from "../AuthPage";
import axios from "axios";
import { AlertCircle, Loader2Icon, Plus, Search, User, X} from "lucide-react";
import HospitalSidebarComponent from "./HospitalSidebarComponent";

export function PaitentPage(){
    const userRole = useContext<any>(UserRoleContext);
    const[hasAccess,sethasAccess]=useState<boolean>(false)
    const[isLoading,setisLoading]=useState<boolean>(true)
    const[dataHospital,setdataHospital]=useState<any>();
    const[displayAddPaitent,setdisplayAddPatient]=useState<boolean>(false);
    let navigate = useNavigate();
    const parms = useParams();

    async function getHospital(){
        const hospitalData = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/gethospital`,{params:{hospitalname:parms.hospitalname},withCredentials: true})
        
        if(hospitalData.data.status==="validUser" && userRole.roleType===hospitalData.data.type){
            sethasAccess(true)
            setisLoading(false)
            setdataHospital(hospitalData.data.hospitalData[0])
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
    }else if(!hasAccess){
        navigate("/dashboard")
    }
    else{
        return(

        <div className="bg-[#f6f8fb] h-dvh flex flex-col lg:flex-row">

            <HospitalSidebarComponent />
            <PatientListComponent parms={parms} dataHospital={dataHospital} setdisplayAddPatient={setdisplayAddPatient}/>
            {displayAddPaitent && <AddPatientComponent setdisplayAddPatient={setdisplayAddPatient} parms={parms} />}

        </div>
            
        )
    }

}

function PatientListComponent({parms,dataHospital,setdisplayAddPatient}:any){
    const[searchValue,setsearchValue]=useState<string>("");
    const[patientList,setpatientList]=useState<any[]>([]);
    const[isEmptySearch,setisEmptySearch]=useState<boolean>(false);
    async function getPatientList(){
        const hospitalData = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/patient/getpaitentlist`,{params:{hospitalname:parms.hospitalname},withCredentials: true})
        if(hospitalData.data.patientlist){
            setpatientList(hospitalData.data.patientlist)
            console.log(hospitalData.data.patientlist)
        }
    }
    useEffect(() => {
      getPatientList()
    }, [])
    const filteredPatient = useMemo(() => {
        return patientList?.filter((x: any) => {
        return (x.fullname?.toLowerCase().includes(searchValue.toLowerCase()) || x.phonenumber?.toLowerCase().includes(searchValue.toLowerCase()));
        });
    }, [searchValue, patientList]);

    useEffect(() => {
        if(filteredPatient?.length!=0){
            setisEmptySearch(false)
        }else{
            setisEmptySearch(true)
        }

    }, [filteredPatient])
    
    return(
        <div className=" bg-white w-full flex flex-col">
            <div className="min-h-20 bg-white border-b border-[#e8edf2] px-3 sm:px-4 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ">
                <div className="relative w-full lg:max-w-xl">
                    
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                    {searchValue && (
                    <X className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] cursor-pointer" onClick={() => {
                        setsearchValue("");
                        }}/>
                    )}
                    <input type="text" placeholder="Search Patient..." className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] pl-11 pr-4 outline-none " value={searchValue}onChange={(e) => {
                        setsearchValue(e.target.value);
                    }}/>
                </div>
                <button onClick={() => {
                    setdisplayAddPatient(true);
                }}
                className="flex-1 lg:flex-none h-11 px-5 rounded-[10px] bg-[#1e3a5f] hover:bg-[#24466f] text-white transition-all flex items-center justify-center gap-2 font-semibold cursor-pointer">
                <Plus className="w-5 h-5 text-white " />
                Add Patient
                </button>
            </div>
            <div className="">
                <div className="">
                    {dataHospital.displayname}
                </div>
                <div className="">
                    {patientList?.map((x: any) => {
                        return <div className="" >{x.fullname}</div>;
                    })}
                </div>
            </div>
        </div>
    )
}


function AddPatientComponent({setdisplayAddPatient,parms}: any) {
  const [patientData, setpatientData] = useState({fullname: "",gender: "Male",age:"",dob:"",phonenumber:"",bloodgroup:"",address:"",emergencycontactname:"",emergencycontactnumber:"",notes:"",allergies:"",chronicconditions:"",hospitalname: `${parms.hospitalname}`});
  const [errorMessage,seterrorMessage]=useState<{fullname:string}>({fullname:""})
  async function AddPatientPost() {
    const addPatient = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/patient/addpatient`,patientData,{ withCredentials: true });
    if(addPatient.data.status==="missingData"){
        console.log("missing data")
    }else if(addPatient.data.status==="patientCreated"){
        setdisplayAddPatient(false);
        
    }else if(addPatient.data.status==="patientNotCreated"){
        seterrorMessage({...errorMessage,fullname:"internal server error contact admin"})
    }

  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full  bg-white rounded-3xl border border-[#e8edf2] shadow-xl p-5 sm:p-8`}>

        <div className="flex items-center justify-between mb-[10px]">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e293b]"> Add Patient to {patientData.hospitalname} </h1>
            <p className="text-sm text-[#64748b] mt-1"> Create a new Patient</p>
          </div>

          <button onClick={() => { setdisplayAddPatient(false);}} className="w-11 h-11 rounded-xl hover:bg-red-100 flex items-center justify-center cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e)=>{
            e.preventDefault();
            if(patientData.fullname){
                AddPatientPost()
            }else{
                seterrorMessage({...errorMessage,fullname:"Name cannot be empty"})
            }
        }}>
            <div className="space-y-5">
                <div className="flex">
                    <div className="select-none flex flex-col mr-[10px] min-w-[300px]">
                        <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Full Name <span className="text-red-500">*</span> </div>
                        <div className="flex relative select-none">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />
                            <input type="text" maxLength={100} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative pl-[50px] text-[#64748b] outline-0 ${errorMessage.fullname?"border border-red-500":"border-[#dbe4ee]"}`} onChange={(e:any)=>{
                                seterrorMessage({...errorMessage,fullname:""})
                                setpatientData({...patientData,fullname:e.target.value});
                            }} value={patientData.fullname}/>
                        </div>
                        {errorMessage.fullname && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errorMessage.fullname}</p>)}
                    </div>

                    <div className="select-none min-w-[100px] mr-[10px]">
                        <label className="block mb-2 text-sm font-medium text-[#64748b]">Gender <span className="text-red-500">*</span></label>
                        <select value={patientData.gender} onChange={(e) =>
                            setpatientData({...patientData,gender: e.target.value,})
                            }
                            className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] pl-[10px] outline-none cursor-pointer ">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="select-none flex flex-col mr-[10px] w-[70px]">
                        <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Age</div>
                        <div className="flex relative select-none">
                            <input type="text" maxLength={5} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                setpatientData({...patientData,age:e.target.value});
                            }} value={patientData.age}/>
                        </div>
                    </div>
                    <div className="select-none flex flex-col mr-[10px] cursor-pointer">
                        <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">DOB</div>
                        <div className="flex relative select-none">
                            <input type="date" maxLength={5} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px] cursor-pointer`} onChange={(e:any)=>{
                                setpatientData({...patientData,dob:e.target.value});
                            }} value={patientData.dob}/>
                        </div>
                    </div>
                    <div className="select-none flex flex-col mr-[10px] ">
                        <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Phone Number</div>
                        <div className="flex relative select-none">
                            <input type="text" maxLength={15} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                setpatientData({...patientData,phonenumber:e.target.value});
                            }} value={patientData.phonenumber}/>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="select-none flex flex-col mr-[10px] ">
                        <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Blood Group</div>
                        <div className="flex relative select-none">
                            <input type="text" maxLength={15} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                setpatientData({...patientData,bloodgroup:e.target.value});
                            }} value={patientData.bloodgroup}/>
                        </div>
                    </div>

                    <div className="select-none flex flex-col mr-[10px] ">
                        <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Emergency Contact Name</div>
                        <div className="flex relative select-none">
                            <input type="text" maxLength={100} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                setpatientData({...patientData,emergencycontactname:e.target.value});
                            }} value={patientData.emergencycontactname}/>
                        </div>
                    </div>
                    <div className="select-none flex flex-col mr-[10px] ">
                        <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Emergency Contact Number</div>
                        <div className="flex relative select-none">
                            <input type="text" maxLength={15} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                setpatientData({...patientData,emergencycontactnumber:e.target.value});
                            }} value={patientData.emergencycontactnumber}/>
                        </div>
                    </div>
                </div>

                <div className="flex ">
                    <div className="select-none flex flex-col mr-[10px] w-full">
                        <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Address</div>
                        <div className="flex relative select-none">
                            <textarea maxLength={150} rows={5} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                setpatientData({...patientData,address:e.target.value});
                            }} value={patientData.address}/>
                        </div>
                    </div>
                    <div className="select-none flex flex-col mr-[10px] w-full">
                        <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Notes</div>
                        <div className="flex relative select-none">
                            <textarea maxLength={200} rows={5} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                setpatientData({...patientData,notes:e.target.value});
                            }} value={patientData.notes}/>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="select-none flex flex-col mr-[10px] w-full">
                        <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Allergies</div>
                        <div className="flex relative select-none">
                            <textarea maxLength={200} rows={5} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                setpatientData({...patientData,allergies:e.target.value});
                            }} value={patientData.allergies}/>
                        </div>
                    </div>
                    <div className="select-none flex flex-col mr-[10px] w-full">
                        <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Chronic Conditions</div>
                        <div className="flex relative select-none">
                            <textarea maxLength={200} rows={5} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                setpatientData({...patientData,chronicconditions:e.target.value});
                            }} value={patientData.chronicconditions}/>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button type="submit"className="flex-1 min-h-[50px] rounded-xl bg-[#1e3a5f] hover:bg-[#245188] text-white transition-all flex items-center justify-center gap-2 font-medium cursor-pointer">
                <Plus className="w-4 h-4" />
                Add Patient
            </button>

            <button onClick={() => {
                setdisplayAddPatient(false)
                }} className="h-12 px-5 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-red-100 hover:border-red-100 transition-all font-medium cursor-pointer">Cancel</button>
            </div>
        </form>
      </div>
    </div>
  );
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