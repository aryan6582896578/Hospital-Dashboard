import {  useContext, useEffect, useState } from "react";
import {  useParams } from "react-router";
import axios from "axios";
import { AlertCircle, NotepadText, Save, User} from "lucide-react";
import HospitalSidebarComponent from "./HospitalSidebarComponent";
import { UserRoleContext } from "../AuthPage";

export function HospitalPage(){
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const [searchDate,setsearchDate]=useState(today.toISOString().split("T")[0])
    const[appoinmentsData,setappoinmentsData]=useState<any[]>([]);
    const parms = useParams();
    // console.log(parms.hospitalname)

    async function getAppoinments(){
        
        const appoinments = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/patient/getappointments`,{params:{hospitalname:parms.hospitalname ,appointmentdate:searchDate},withCredentials: true})
        
        setappoinmentsData(appoinments.data.appointments)
        console.log(appoinments.data.appointments)
    }

    useEffect(() => {
        getAppoinments()
    }, [searchDate])

    
        return(

        <div className="bg-[#f6f8fb] h-dvh flex flex-col lg:flex-row">

            <HospitalSidebarComponent />
            <AppointmentsPage setsearchDate={setsearchDate} searchDate={searchDate} appoinmentsData={appoinmentsData} getAppoinments={getAppoinments}/>
            

        </div>
            
        )
    }



function AppointmentsPage({setsearchDate,searchDate,appoinmentsData,getAppoinments}:any){
    const [displayAddAppoinment,setdisplayAddAppoinment]=useState<boolean>(false);
    return(
        <div className="flex w-full flex-col overflow-y-auto h-dvh pb-[20px] overflow-x-hidden">
                <div className="min-h-20 border-b bg-white border-[#e8edf2] px-2 sm:px-4 lg:px-8 py-4 lg:flex flex-col lg:flex-row lg:items-center hidden">

                </div>
                <div className="flex flex-col lg:flex-row">
                    <AddAppoinmentsComponent setdisplayAddAppoinment={setdisplayAddAppoinment} displayAddAppoinment={displayAddAppoinment}/>
                    <ListAppoinmentsComponent setsearchDate={setsearchDate} searchDate={searchDate} appoinmentsData={appoinmentsData} getAppoinments={getAppoinments}/>
                </div>
        </div>
    )
}

function AddAppoinmentsComponent({setdisplayAddAppoinment,displayAddAppoinment}:any){

    const parms=useParams();
    const [appoinmentData,setappoinmentData]=useState<{name:string,phonenumber:string,age:string,gender:string,reason:string,status:string,date:string,time:string,hospitalname:string,}>({name:"",phonenumber:"",age:"",gender:"male",reason:"",status:"booked",date:"",time:"", hospitalname: parms.hospitalname ?? ""})
    const [errorMessage,seterrorMessage]=useState<string>("");
    async function AddAppoinmentPost() {
        const addPatient = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/patient/addappoinment`,appoinmentData,{ withCredentials: true });
        if(addPatient.data.status==="missingData"){
            console.log("missing data")
        }else if(addPatient.data.status==="appointmentCreated"){
            // getPatientList()
            setdisplayAddAppoinment(false);
            setappoinmentData({...appoinmentData,name:"",phonenumber:"",age:"",gender:"male",reason:"",status:"booked",date:"",time:"", hospitalname: parms.hospitalname ?? ""})
            
        }else if(addPatient.data.status==="appointmentNotCreated"){
            seterrorMessage("internal server error contact admin")
        }
    }
    
    return (
        <div className="lg:w-[60%] bg-white  m-[5px] mt-[10px] lg:m-[20px] p-[20px] rounded-[10px] shadow-xl border-[#e8edf2] border-1 h-fit">
            <div className="flex ">
                <button className="flex-1 lg:flex-none min-h-11 px-5 rounded-[10px] bg-[#1e3a5f] hover:bg-[#24466f] text-white transition-all flex items-center justify-center gap-2 font-semibold cursor-pointer" onClick={()=>{
                    setdisplayAddAppoinment(true)
                }}> 
                    <NotepadText/> Add Appoinment
                </button>                
            </div>
            {errorMessage && (<p className="text-xl text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errorMessage}</p>)}
            {displayAddAppoinment &&
            <div className="mt-[20px]">
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
                        <div className="select-none flex flex-col mr-[10px] ">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Name <span className="text-red-500">*</span> </div>
                            <div className="flex relative select-none">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />
                                <input type="text" maxLength={100} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative pl-[50px] text-[#64748b] outline-0 border-[#dbe4ee]`} onChange={(e:any)=>{
                                    seterrorMessage("")
                                    setappoinmentData({...appoinmentData,name:e.target.value});
                                }} value={appoinmentData.name} placeholder="Enter Name..."/>
                            </div>
                            
                        </div>
                        <div className="select-none flex flex-col mr-[10px] ">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Phone Number </div>
                            <div className="flex relative select-none">
                                <input type="text" maxLength={15} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] p-[5px] hover:text-[#3e4856] relative  text-[#64748b] outline-0 border-[#dbe4ee]`} onChange={(e:any)=>{
                                    setappoinmentData({...appoinmentData,phonenumber:e.target.value});
                                }} value={appoinmentData.phonenumber} placeholder="Enter Phone Number..."/>
                            </div>
                        </div>
                        <div className="select-none flex flex-col mr-[10px] ">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Age</div>
                            <div className="flex relative select-none">
                                <input type="string" maxLength={10} className={`border w-[70px] h-[50px] rounded-[10px] bg-[#f8fafc] p-[10px] hover:text-[#3e4856] relative  text-[#64748b] outline-0 border-[#dbe4ee]`} onChange={(e:any)=>{
                                    setappoinmentData({...appoinmentData,age:e.target.value});
                                }} value={appoinmentData.age} />
                            </div>
                        </div>
                        <div className="select-none min-w-[100px] mr-[10px]">
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
                    </div>
                    <div className="mt-[10px] flex flex-col lg:flex-row">
                        <div className="select-none flex flex-col mr-[10px] ">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Reason</div>
                            <div className="flex relative select-none">
                                <textarea maxLength={200} rows={4} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                    setappoinmentData({...appoinmentData,reason:e.target.value});
                                }} value={appoinmentData.reason} placeholder="Routine Checkup..."/>
                            </div>
                        </div>
                        <div className="select-none min-w-[100px] mr-[10px]">
                            <label className="block mb-2 text-sm font-medium text-[#64748b]">Status</label>
                            <select value={appoinmentData.status} onChange={(e) =>
                                setappoinmentData({...appoinmentData,status: e.target.value,})
                                }
                                className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] pl-[10px] outline-none cursor-pointer ">
                                <option value="booked">Booked</option>
                                <option value="ongoing">On Going</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="noshow">No Show</option>
                                <option value="completed">Completed</option>
                                
                            </select>
                        </div>
                        <div className="select-none flex flex-col mr-[10px] cursor-pointer">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Date</div>
                            <div className="flex relative select-none">
                                <input type="date" maxLength={5} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px] cursor-pointer`} onChange={(e:any)=>{
                                    setappoinmentData({...appoinmentData,date:e.target.value});
                                }} value={appoinmentData.date}/>
                            </div>
                        </div>
                        <div className="select-none flex flex-col mr-[10px] ">
                            <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Time</div>
                            <div className="flex relative select-none">
                                <input type="time" maxLength={15} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] p-[5px] hover:text-[#3e4856] relative  text-[#64748b] outline-0 border-[#dbe4ee]`} onChange={(e:any)=>{
                                    setappoinmentData({...appoinmentData,time:e.target.value});
                                }} value={appoinmentData.time} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button type="submit" className=" w-full lg:w-fit pl-[20px] pr-[20px] min-h-[50px] rounded-xl bg-[#1e3a5f] hover:bg-[#245188] text-white transition-all flex items-center justify-center gap-2 font-medium cursor-pointer">
                           <Save/>
                           Save     
                    </button>

                    <button onClick={() => {
                        setappoinmentData({...appoinmentData,name:"",phonenumber:"",age:"",gender:"male",reason:"",status:"booked",date:"",time:"", hospitalname: parms.hospitalname ?? ""})
                        setdisplayAddAppoinment(false)
                        
                        }} className="h-12 px-5 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-red-100 hover:border-red-100 transition-all font-medium cursor-pointer">Cancel</button>
                    </div>
                </form>
            </div>
            }
        </div>
    )
}

function ListAppoinmentsComponent({setsearchDate,searchDate,appoinmentsData,getAppoinments}:any){
    return(
        <div className="lg:w-full  m-[5px] mt-[10px] lg:m-[20px] p-[20px] rounded-[10px] bg-white">
            <div className="flex">
                <div className="m-[20px] text-3xl ">Appoinments </div>
                <input type="date" className="text-xl cursor-pointer text-blue-500 outline-none" value={searchDate} onChange={(e)=>{
                    setsearchDate(e.target.value)
                }}/>
            </div>
            <div className="">
                {appoinmentsData?.map((x:any,y:any)=>{
                    return <ListAppoinmentsDataComponent x={x} key={y} getAppoinments={getAppoinments}/>
                })}
            </div>
        </div>
    )
}

function ListAppoinmentsDataComponent({ x,getAppoinments }: any) {
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
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="bg-white m-[20px] p-[20px] rounded-[5px] border-[#e8edf2] border hover:bg-blue-100">

            <div className="flex justify-between">
                <div>
                    <div className="flex gap-2 flex-col lg:flex-row">
                        <div className="">Name: {x.name}</div>
                        {x.phonenumber &&  <div className="">Phone Number: {x.phonenumber}</div>}
                    </div>

                    <div className="flex gap-2 flex-col lg:flex-row">
                            <div className="">Date: {new Date(x.appointmentdate).toLocaleString("en-IN", {timeZone: "Asia/Kolkata",day: "2-digit",month: "short",year: "numeric"})}</div>
                            <div className="">Time: {x.appointmenttime}</div>
                    </div>
                    <div className="flex justify-between flex-col gap-2">
                        <div className="">
                            {isDisabled ? (
                                <div className="mt-2">Status:<span className="ml-2 ">{x.status}</span></div>
                            ) : (
                                <div className="mt-4 flex gap-4">
                                    <div>
                                        <div>Status</div>

                                        <select value={appointmentData.status} onChange={(e) =>setAppointmentData({...appointmentData,status: e.target.value})} className="border rounded p-2 outline-none">
                                            <option value="booked">Booked</option>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="noshow">No Show</option>
                                        </select>
                                    </div>

                                </div>
                            )}
                        </div>
                    
                        <div className="flex">
                            {(userRole.roleType === "doctor" || userRole.roleType === "nurse") && (

                                isDisabled ? (
                                    <button className="h-10 px-4 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-green-200" onClick={() => setIsDisabled(false)}>
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button className=" w-full h-fit lg:w-fit pl-[20px] pr-[20px] min-h-[40px] rounded-xl bg-[#1e3a5f] hover:bg-[#245188] text-white transition-all flex items-center justify-center gap-2 font-medium cursor-pointer" onClick={updateAppointment}>
                                            <Save/>
                                            Save
                                        </button>

                                        <button
                                            className="w-full h-fit lg:w-fit pl-[20px] pr-[20px] min-h-[40px] rounded-xl bg-white hover:bg-red-300 text-black transition-all flex items-center justify-center gap-2 font-medium cursor-pointer"
                                            onClick={() => {
                                                setAppointmentData({ appointmentid: x.appointmentid, status: x.status,reason: x.reason || "",hospitalname: parms.hospitalname ?? ""});

                                                setIsDisabled(true);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                </div>
                </div>
            </div>
        </div>
    );
}