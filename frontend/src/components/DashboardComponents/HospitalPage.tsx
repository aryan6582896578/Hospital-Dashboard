import {  useContext, useEffect, useState } from "react";
import {  Link, useParams } from "react-router";
import axios from "axios";
import { AlertCircle, FolderOpenDotIcon, NotepadText, Save, User, XIcon} from "lucide-react";
import HospitalSidebarComponent from "./HospitalSidebarComponent";
import { UserRoleContext } from "../AuthPage";

export function HospitalPage(){
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const [searchDate,setsearchDate]=useState(today.toISOString().split("T")[0])
    const[appoinmentsData,setappoinmentsData]=useState<any[]>([]);
    const[patientRecords,setpatientRecords]=useState<any[]>([]);
    const parms = useParams();

    async function getAppoinments(){
        const appoinments = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/patient/getappointments`,{params:{hospitalname:parms.hospitalname ,appointmentdate:searchDate},withCredentials: true})
        setappoinmentsData(appoinments.data.appointments)
    }
    async function getPatientRecords(){
        
        const patientrecordslist = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/patient/getpatientlist`,{params:{hospitalname:parms.hospitalname },withCredentials: true})
        setpatientRecords(patientrecordslist.data.patientlist)
    }

    useEffect(() => {
        getAppoinments()
        getPatientRecords()
    }, [searchDate])
        return(
        <div className="bg-[#f6f8fb] h-dvh flex flex-col lg:flex-row">
            <HospitalSidebarComponent />
            <AppointmentsPage setsearchDate={setsearchDate} searchDate={searchDate} appoinmentsData={appoinmentsData} getAppoinments={getAppoinments} patientRecords={patientRecords}/>
        </div>
            
        )
    }



function AppointmentsPage({setsearchDate,searchDate,appoinmentsData,getAppoinments,patientRecords}:any){
    const [displayAddAppoinment,setdisplayAddAppoinment]=useState<boolean>(false);
    const userRole = useContext<any>(UserRoleContext);
    return(
        <div className="flex w-full flex-col overflow-y-auto h-dvh pb-[20px] overflow-x-hidden ">
                <div className="min-h-20 border-b bg-white border-[#e8edf2] px-2 sm:px-4 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center  justify-end text-[25px] font-semibold">
                    <div className="bg-blue-900 text-white pl-[20px] pr-[20px] rounded-[5px] w-fit">
                        Appoinments
                    </div>
                </div>
                <div className="flex flex-col ">
                {userRole.roleType!="admin"? <AddAppoinmentsComponent setdisplayAddAppoinment={setdisplayAddAppoinment} displayAddAppoinment={displayAddAppoinment} getAppoinments={getAppoinments} patientRecords={patientRecords} />:""}
                    <ListAppoinmentsComponent setsearchDate={setsearchDate} searchDate={searchDate} appoinmentsData={appoinmentsData} getAppoinments={getAppoinments} setdisplayAddAppoinment={setdisplayAddAppoinment}/>
                </div>
        </div>
    )
}

function AddAppoinmentsComponent({setdisplayAddAppoinment,displayAddAppoinment,getAppoinments,patientRecords}:any){

    const parms=useParams();
    const [appoinmentData,setappoinmentData]=useState<{name:string,phonenumber:string,age:string,gender:string,reason:string,status:string,date:string,time:string,hospitalname:string,recordname:string,recordid:string}>({name:"",phonenumber:"",age:"",gender:"male",reason:"",status:"booked",date:"",time:"", hospitalname: parms.hospitalname ?? "",recordname:"",recordid:""})
    const [errorMessage,seterrorMessage]=useState<string>("");
    async function AddAppoinmentPost() {
        console.log(appoinmentData)
        const addPatient = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/patient/addappoinment`,appoinmentData,{ withCredentials: true });
        if(addPatient.data.status==="missingData"){
            console.log("missing data")
        }else if(addPatient.data.status==="appointmentCreated"){
            // getPatientList()
            setdisplayAddAppoinment(false);
            setappoinmentData({...appoinmentData,name:"",phonenumber:"",age:"",gender:"male",reason:"",status:"booked",date:"",time:"", hospitalname: parms.hospitalname ?? "",recordname:"",recordid:""})
            getAppoinments()
        }else if(addPatient.data.status==="appointmentNotCreated"){
            seterrorMessage("internal server error contact admin")
            getAppoinments()
        }
    }
    
    return (
        <div className=" bg-white  m-[5px] mt-[10px] lg:m-[20px] rounded-[10px] shadow-2xs border-[#e8edf2] border-1 h-fit">
            <div className="flex m-[20px]">
                <button className=" w-fit lg:flex-none min-h-11 px-5 rounded-[10px] bg-[#1e3a5f] hover:bg-[#24466f] text-white transition-all flex items-center justify-center gap-2 font-semibold cursor-pointer" onClick={()=>{
                    setdisplayAddAppoinment(true)
                }}> 
                    <NotepadText/> Add Appoinment
                </button>                
            </div>
            {errorMessage && (<p className="text-xl text-red-500 mt-1 flex items-center gap-1 ml-[10px]"><AlertCircle className="w-4 h-4" />{errorMessage}</p>)}
            {displayAddAppoinment &&
            <div className="mt-[20px] border-t border-[#dbe4ee] p-[20px] ">
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    if(appoinmentData.name){
                        if(appoinmentData.gender){
                            if(appoinmentData.date){
                                if(appoinmentData.time){
                                    seterrorMessage("")
                                    AddAppoinmentPost()
                                }else{
                                    seterrorMessage(" appoinment time cannot be empty")
                                }
                            }else{
                                seterrorMessage(" appoinment date cannot be empty")
                            }
                        }else{
                            seterrorMessage("gender cannot be empty")
                        }
                    }else{
                        seterrorMessage("name cannot be empty")
                    }
                }}> 
                    <div className="flex gap-2  mb-[20px] flex-col lg:flex-row">
                        <div className="select-none flex flex-col mr-[10px] w-full">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Full Name <span className="text-red-500">*</span> </div>
                            <div className="flex relative select-none">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />
                                <input type="text" maxLength={100} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative pl-[50px] text-[#64748b] outline-0 border-[#dbe4ee]`} onChange={(e:any)=>{
                                    seterrorMessage("")
                                    setappoinmentData({...appoinmentData,name:e.target.value});
                                }} value={appoinmentData.name} placeholder="Enter Patient Name..."/>
                            </div>
                        </div>
                        <div className="select-none flex flex-col mr-[10px] lg:w-[30%] ">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Phone Number </div>
                            <div className="flex relative select-none">
                                <input type="text" maxLength={15} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] p-[5px] hover:text-[#3e4856] relative  text-[#64748b] outline-0 border-[#dbe4ee]`} onChange={(e:any)=>{
                                    setappoinmentData({...appoinmentData,phonenumber:e.target.value});
                                }} value={appoinmentData.phonenumber} placeholder="+91 0000000000"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2  mb-[20px] flex-col lg:flex-row ">
                        <div className="select-none flex flex-col mr-[10px] w-full">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Age</div>
                            <div className="flex relative select-none">
                                <input type="string" maxLength={10} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] p-[10px] hover:text-[#3e4856] relative  text-[#64748b] outline-0 border-[#dbe4ee]`} onChange={(e:any)=>{
                                    setappoinmentData({...appoinmentData,age:e.target.value});
                                }} value={appoinmentData.age} placeholder="Age"/>
                            </div>
                        </div>
                        <div className="select-none min-w-[100px] mr-[10px] w-full">
                            <label className="block mb-2 text-sm font-medium text-[#64748b]">Gender</label>
                            <select value={appoinmentData.gender} onChange={(e) =>
                                setappoinmentData({...appoinmentData,gender: e.target.value,})
                                }
                                className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] pl-[10px] outline-none cursor-pointer ">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="select-none min-w-[100px] mr-[10px] w-full">
                            <label className="block mb-2 text-sm font-medium text-[#64748b]">Status</label>
                            <select value={appoinmentData.status} onChange={(e) =>
                                setappoinmentData({...appoinmentData,status: e.target.value,})
                                }
                                className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] pl-[10px] outline-none cursor-pointer ">
                                <option value="booked">Booked</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                                
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2  mb-[20px] flex-col lg:flex-row">
                        <div className="select-none flex flex-col mr-[10px] cursor-pointer w-full">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Date <span className="text-red-500">*</span></div>
                            <div className="flex relative select-none">
                                <input type="date" maxLength={5} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px] cursor-pointer`} onChange={(e:any)=>{
                                    setappoinmentData({...appoinmentData,date:e.target.value});
                                }} value={appoinmentData.date} placeholder="Select Date"/>
                            </div>
                        </div>
                        <div className="select-none flex flex-col mr-[10px] w-full">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Time <span className="text-red-500">*</span></div>
                            
                            <div className="flex relative select-none">
                                <input type="time" maxLength={15} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] p-[5px] hover:text-[#3e4856] relative  text-[#64748b] outline-0 border-[#dbe4ee]`} onChange={(e:any)=>{
                                    setappoinmentData({...appoinmentData,time:e.target.value});
                                }} value={appoinmentData.time} placeholder="Select Time" />
                            </div>
                        </div>
                        <div className="select-none flex flex-col mr-[10px] w-full">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Reason</div>
                            <div className="flex relative select-none">
                                <textarea maxLength={200} rows={2} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                    setappoinmentData({...appoinmentData,reason:e.target.value});
                                }} value={appoinmentData.reason} placeholder=" eg Routine Checkup..."/>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2  mb-[20px] flex-col lg:flex-row">
                        <div className="select-none flex flex-col mr-[10px] cursor-pointer w-full">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Patient Records (Name) </div>
                            <div className="flex relative select-none">
                                    <select value={appoinmentData.recordid} onChange={(e) =>{
                                       const name = patientRecords.find((a:any)=>a.patientid===e.target.value)
                                        setappoinmentData({...appoinmentData,recordname:name.fullname})
                                        setappoinmentData({...appoinmentData,recordid:e.target.value})
                                    }
                                        }
                                        className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] outline-none cursor-pointer ">
                                            <option value="" ></option>
                                            {patientRecords.map((x:any)=>{
                                                return <option value={x.patientid} key={x.patientid}>{x.fullname}</option>
                                                    
                                            })}
                                    </select>
                            </div>
                        </div>

                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button type="submit" className=" w-full lg:w-fit pl-[20px] pr-[20px] min-h-[50px] rounded-xl bg-[#1e3a5f] hover:bg-[#245188] text-white transition-all flex items-center justify-center gap-2 font-medium cursor-pointer">
                           <Save/>
                           Save     
                    </button>

                    <button onClick={() => {
                        setappoinmentData({...appoinmentData,name:"",phonenumber:"",age:"",gender:"male",reason:"",status:"booked",date:"",time:"", hospitalname: parms.hospitalname ?? "",recordname:"",recordid:""})
                        setdisplayAddAppoinment(false)
                        
                        }} className="h-12 px-5 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-red-100 hover:border-red-100 transition-all font-medium cursor-pointer">Cancel</button>
                    </div>
                </form>
            </div>
            }
        </div>
    )
}

function ListAppoinmentsComponent({setsearchDate,searchDate,appoinmentsData,getAppoinments,setdisplayAddAppoinment}:any){
    return(
        <div className="w-full">
            <div className="flex flex-col lg:flex-row">
                <div className="m-[20px] text-3xl font-semibold">Appoinments Scheduled Today</div>
                <input type="date" className="bg-blue-200 h-fit mt-auto mb-auto font-semibold p-[10px] rounded-full ml-[10px] mr-[10px] w-fit" value={searchDate} onChange={(e)=>{
                    setsearchDate(e.target.value)
                }}/>
            </div>
            <div className="flex flex-col text-center">
                <div className="bg-[#f2f4f6] m-[20px] mb-0 p-[20px] rounded-[5px] border-[#e8edf2] border border-b-0 hover:bg-blue-100 rounded-bC-none text-[#555658] font-semibold flex justify-between flex-col text-left lg:flex-row lg:text-center">
                    <div className="w-full">Patient Name</div>
                    <div className="w-full">Contact</div>
                    <div className="w-full">Date & Time</div>
                    <div className="w-full">Status</div>
                    <div className="w-full">Action</div>
                    <div className="w-full">Patient</div>
                </div>
                {appoinmentsData?.map((x:any,y:any)=>{
                    return <ListAppoinmentsDataComponent x={x} key={y} getAppoinments={getAppoinments} setdisplayAddAppoinment={setdisplayAddAppoinment}/>
                })}
            </div>
        </div>
    )
}

function ListAppoinmentsDataComponent({ x,getAppoinments,setdisplayAddAppoinment }: any) {
    const userRole = useContext<any>(UserRoleContext);
    const parms=useParams()
    const [appointmentData, setAppointmentData] = useState({appointmentid: x.appointmentid,status: x.status,reason: x.reason || "",hospitalname: parms.hospitalname ?? ""});
    const [isDisabled, setIsDisabled] = useState(true);
    useEffect(() => {
        setAppointmentData({appointmentid: x.appointmentid,status: x.status,reason: x.reason || "",hospitalname: parms.hospitalname ?? ""});
    }, [x.status, x.reason]);

    async function updateAppointment() {
        try {
            const update = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/patient/updateappointment`,appointmentData,{ withCredentials: true });
            if (update.data.status === "appointmentUpdated") {
                getAppoinments();
                setIsDisabled(true);
                setdisplayAddAppoinment(false)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
                <div className="bg-white m-[20px] mt-0 mb-0 p-[20px]  border-[#e8edf2] border   hover:bg-blue-100  flex justify-between flex-col lg:flex-row text-left lg:text-center gap-4 cursor-pointer">
                    
                        <div className="flex w-full ">
                            <div className="w-9 h-9 rounded-full bg-blue-300 text-blue-900 flex items-center justify-center font-semibold cursor-pointer mt-auto mb-auto">{x.name[0]}</div>
                            <div className="ml-[20px] mt-auto mb-auto ">{x.name}</div>
                        </div>
                        <div className="w-full mt-auto mb-auto">
                            {x.phonenumber}
                        </div>
                        <div className="w-full mt-auto mb-auto">
                            <div className="">{new Date(x.appointmentdate).toLocaleString("en-IN", {timeZone: "Asia/Kolkata",day: "2-digit",month: "short",year: "numeric"})}</div>
                            <div className="text-[#47484a]">{x.appointmenttime}</div>
                        </div>
                    
                        <div className="w-full mt-auto mb-auto">
                            {isDisabled ? (<div className="flex"><div className="bg-green-100 text-black p-[5px] pl-[10px] pr-[10px] rounded-[10px] ml-auto mr-auto uppercase">{x.status}</div></div>) 
                            : (
                                <div className="mt-4 flex gap-4">
                                    <div>
                                        <select value={appointmentData.status} onChange={(e) =>setAppointmentData({...appointmentData,status: e.target.value})} className="border rounded p-2 outline-none">
                                            <option value="booked">Booked</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                </div>
                            )}
                        </div>
                        <div className="w-full flex">

                                {(userRole.roleType === "doctor" || userRole.roleType === "nurse") && (

                                        isDisabled ? (
                                            <div className="ml-auto mr-auto">
                                                <button className="h-10 px-4 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-green-200 ml-auto mr-auto cursor-pointer" onClick={() => setIsDisabled(false)}>
                                                    Edit
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 ml-auto">
                                                <button className=" w-full h-fit lg:w-fit pl-[20px] pr-[20px] min-h-[40px] rounded-xl bg-[#1e3a5f] hover:bg-[#245188] text-white transition-all flex items-center justify-center gap-2 font-medium cursor-pointer" onClick={updateAppointment}>
                                                    <Save/>
                                                </button>

                                                <button
                                                    className="w-full h-fit lg:w-fit pl-[20px] pr-[20px] min-h-[40px] rounded-xl bg-white hover:bg-red-300 text-black transition-all flex items-center justify-center gap-2 font-medium cursor-pointer"
                                                    onClick={() => {
                                                        setAppointmentData({ appointmentid: x.appointmentid, status: x.status,reason: x.reason || "",hospitalname: parms.hospitalname ?? ""});
                                                        setIsDisabled(true);
                                                    }}>
                                                    <XIcon/>
                                                </button>
                                            </div>
                                        )
                                )}
                        </div>
                        <div className="flex w-full">
                            <div className="ml-auto mr-auto">
                                <Link to={`patients/${x.recordid}`} >
                                    <button className="h-10 px-4 rounded-[10px] border text-white border-[#dbe4ee] bg-blue-500 hover:bg-blue-600 ml-auto mr-auto cursor-pointer">
                                        <FolderOpenDotIcon/>
                                        {x.recordname}
                                    </button>
                                </Link>
                            </div>
                        </div>

                </div>
    );
}