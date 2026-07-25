import {useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { AlertCircle, EditIcon, Plus, SaveIcon, User, XIcon} from "lucide-react";
import HospitalSidebarComponent from "./HospitalSidebarComponent";
import { UserRoleContext } from "../AuthPage";
import ConsultationPdfButton from "./ConsultationPdfButton";

export default function PatientProfilePage(){
   const[displayAddConsultation,setdisplayAddConsultation]=useState<boolean>(false);
    const[patientProfileData,setpatientProfileData]=useState<any[]>([]);
    const[consultationData,setconsultationData]=useState<any[]>([]);
    const parms = useParams();
    const userRole = useContext<any>(UserRoleContext);


    async function getPatientProfile(){
        const patientData = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/patient/getpatientprofile`,{params:{hospitalname:parms.hospitalname,patientid:parms.patientid},withCredentials: true})
        if(patientData.data.patientProfile){
            setpatientProfileData(patientData.data.patientProfile[0])
        }
    }

    async function getPatientConsultation(){
        const consultationData = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/patient/getpaitentconsultation`,{params:{hospitalname:parms.hospitalname,patientid:parms.patientid},withCredentials: true})
        if(consultationData.data.consultationDataPatient){
            setconsultationData(consultationData.data.consultationDataPatient)
        }
    }
    
    useEffect(() => {
        getPatientProfile()
        getPatientConsultation()
    }, [])
    
    return(

        <div className="bg-[#f6f8fb] h-dvh flex flex-col lg:flex-row ">
            <div className="flex w-full flex-col lg:flex-row ">
                <HospitalSidebarComponent />
                <div className="flex flex-col w-full overflow-y-scroll">
                    <div className="min-h-20 border-b bg-white border-[#e8edf2] px-2 sm:px-4 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="w-full lg:max-w-xl"></div>
                        { (userRole.roleType==="doctor") && 
                        <button onClick={() => {
                            setdisplayAddConsultation(true);
                        }}
                        className="flex-1 lg:flex-none min-h-11 px-5 rounded-[10px] bg-[#1e3a5f] hover:bg-[#24466f] text-white transition-all flex items-center justify-center gap-2 font-semibold cursor-pointer">
                            <Plus className="w-5 h-5 text-white " />
                            Add Consultation
                        </button>
                        }
                    </div>
                    {displayAddConsultation && <AddConsultationComponent  parms={parms} patientProfileData={patientProfileData} setdisplayAddConsultation={setdisplayAddConsultation} displayAddConsultation={displayAddConsultation} getPatientConsultation={getPatientConsultation}/>}
                    <PatientProfileComponent parms={parms} patientProfileData={patientProfileData} getPatientProfile={getPatientProfile} setdisplayAddConsultation={setdisplayAddConsultation}  />
                    <PatientConsultationComponent consultationData={consultationData} getPatientConsultation={getPatientConsultation} />
                </div>
            </div>
        </div> 
    )

}

function PatientProfileComponent({parms,patientProfileData,getPatientProfile}:any){
    const userRole = useContext<any>(UserRoleContext);
  const [patientData, setpatientData] = useState({fullname: "",gender: "Male",age:"",dob:"",phonenumber:"",bloodgroup:"",address:"",emergencycontactname:"",emergencycontactnumber:"",notes:"",allergies:"",chronicconditions:"",hospitalname: `${parms.hospitalname}`});
  const [errorMessage,seterrorMessage]=useState<{fullname:string,updateStatus:string,updateStatusError:string}>({fullname:"",updateStatus:"",updateStatusError:""});
  const [isDisabled,setisDisabled]=useState<boolean>(true);
  useEffect(() => {
  if (!patientProfileData) return;

    setpatientData({
        fullname: patientProfileData.fullname || "",
        gender: patientProfileData.gender || "",
        age: patientProfileData.age || "",
        dob: patientProfileData?.dob?.split("T")[0] || "",
        phonenumber: patientProfileData.phonenumber || "",
        bloodgroup: patientProfileData.bloodgroup || "",
        address: patientProfileData.address || "",
        emergencycontactname: patientProfileData.emergencycontactname || "",
        emergencycontactnumber: patientProfileData.emergencycontactnumber || "",
        notes: patientProfileData.notes || "",
        allergies: patientProfileData.allergies || "",
        chronicconditions: patientProfileData.chronicconditions || "",
        hospitalname: parms?.hospitalname || "",
    });
    }, [patientProfileData]);

    async function UpdatePatientPost() {
        const updatePatient = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/patient/editpatient/${parms.patientid}`,patientData,{ withCredentials: true });
        if(updatePatient.data.status==="patientUpdated"){
            getPatientProfile()
            setisDisabled(true)
            seterrorMessage({...errorMessage,updateStatus:"Patient Profile Updated"})
            setTimeout(() => {
                seterrorMessage({...errorMessage,updateStatus:""})
            }, 3000);
        }else if(updatePatient.data.status==="unableToEditPatient"){
            seterrorMessage({...errorMessage,updateStatusError:"Unable To Edit Patient Profile Contact Admin"})
        }else{
            seterrorMessage({...errorMessage,updateStatusError:`${updatePatient.data.status}`})
        }


    }

    return(
                <div className="flex-1 flex flex-col bg-white rounded-3xl border border-[#e8edf2] shadow-xs p-5 sm:p-8 m-[10px] ">

                <div className="mb-[10px]">
                <div>
                    <h1 className="text-2xl font-semibold text-[#1e293b]"> Patient Profile</h1>
                </div>
                <div className="text-[12px] text-[#64748b]">
                    <span className="mr-[5px]">Last Updated by: {patientProfileData.lastupdatedby}</span> 
                    {new Date(patientProfileData.updated_at).toLocaleString("en-IN", {timeZone: "Asia/Kolkata",day: "2-digit",month: "short",year: "numeric",hour: "numeric",minute: "2-digit",hour12: true})}

                </div>
                <div className="min-h-[20px] h-[20px] text-green-500">
                    {errorMessage.updateStatus}
                </div>
                </div>

                <form onSubmit={(e)=>{
                    e.preventDefault();
                    if(patientData.fullname){
                        UpdatePatientPost()
                        
                    }else{
                        seterrorMessage({...errorMessage,fullname:"Name cannot be empty"})
                    }
                }}>
                    <div className="space-y-5 flex flex-col ">
                        <div className="flex flex-col lg:flex-row">
                            <div className="select-none flex flex-col mr-[10px] min-w-[300px]">
                                <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Full Name <span className="text-red-500">*</span> </div>
                                <div className="flex relative select-none">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] z-1 select-none" />
                                    <input type="text" maxLength={100} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative pl-[50px] text-[#64748b] outline-0 ${errorMessage.fullname?"border border-red-500":"border-[#dbe4ee]"}`} onChange={(e:any)=>{
                                        seterrorMessage({...errorMessage,fullname:""})
                                        setpatientData({...patientData,fullname:e.target.value});
                                    }} value={patientData.fullname} disabled={isDisabled} />
                                </div>
                                {errorMessage.fullname && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errorMessage.fullname}</p>)}
                            </div>

                            <div className="select-none min-w-[100px] mr-[10px]">
                                <label className="block mb-2 text-sm font-medium text-[#64748b]">Gender <span className="text-red-500">*</span></label>
                                <select value={patientData.gender} disabled={isDisabled} onChange={(e) =>
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
                                    }} value={patientData.age} disabled={isDisabled}/>
                                </div>
                            </div>
                            <div className="select-none flex flex-col mr-[10px] cursor-pointer">
                                <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">DOB</div>
                                <div className="flex relative select-none">
                                    <input type="date" maxLength={5} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px] cursor-pointer`} onChange={(e:any)=>{
                                        setpatientData({...patientData,dob:e.target.value});
                                    }} value={patientData.dob} disabled={isDisabled}/>
                                </div>
                            </div>
                            <div className="select-none flex flex-col mr-[10px] ">
                                <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Phone Number</div>
                                <div className="flex relative select-none">
                                    <input type="text" maxLength={15} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                        setpatientData({...patientData,phonenumber:e.target.value});
                                    }} value={patientData.phonenumber} disabled={isDisabled}/>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row">
                            <div className="select-none flex flex-col mr-[10px] ">
                                <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Blood Group</div>
                                <div className="flex relative select-none">
                                    <input type="text" maxLength={15} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                        setpatientData({...patientData,bloodgroup:e.target.value});
                                    }} value={patientData.bloodgroup} disabled={isDisabled} />
                                </div>
                            </div>

                            <div className="select-none flex flex-col mr-[10px] ">
                                <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Emergency Contact Name</div>
                                <div className="flex relative select-none">
                                    <input type="text" maxLength={100} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                        setpatientData({...patientData,emergencycontactname:e.target.value});
                                    }} value={patientData.emergencycontactname} disabled={isDisabled} />
                                </div>
                            </div>
                            <div className="select-none flex flex-col mr-[10px] ">
                                <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Emergency Contact Number</div>
                                <div className="flex relative select-none">
                                    <input type="text" maxLength={15} className={`border w-full h-[50px] rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                        setpatientData({...patientData,emergencycontactnumber:e.target.value});
                                    }} value={patientData.emergencycontactnumber} disabled={isDisabled} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row ">
                            <div className="select-none flex flex-col mr-[10px] w-full">
                                <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Address</div>
                                <div className="flex relative select-none">
                                    <textarea maxLength={150} rows={3} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                        setpatientData({...patientData,address:e.target.value});
                                    }} value={patientData.address} disabled={isDisabled} />
                                </div>
                            </div>
                            <div className="select-none flex flex-col mr-[10px] w-full">
                                <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Notes</div>
                                <div className="flex relative select-none">
                                    <textarea maxLength={200} rows={3} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                        setpatientData({...patientData,notes:e.target.value});
                                    }} value={patientData.notes} disabled={isDisabled} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row">
                            <div className="select-none flex flex-col mr-[10px] w-full">
                                <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Allergies</div>
                                <div className="flex relative select-none">
                                    <textarea maxLength={200} rows={3} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                        setpatientData({...patientData,allergies:e.target.value});
                                    }} value={patientData.allergies} disabled={isDisabled} />
                                </div>
                            </div>
                            <div className="select-none flex flex-col mr-[10px] w-full">
                                <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Chronic Conditions</div>
                                <div className="flex relative select-none">
                                    <textarea maxLength={200} rows={3} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[5px]`} onChange={(e:any)=>{
                                        setpatientData({...patientData,chronicconditions:e.target.value});
                                    }} value={patientData.chronicconditions} disabled={isDisabled}/>
                                </div>
                            </div>
                        </div>

                    </div>
                    {userRole.roleType==="doctor" && 
                    <div className={`flex flex-col sm:flex-row gap-3 mt-8 ${isDisabled?"justify-end":"justify-start"}`}>
                    {isDisabled?
                        <button className="h-10 px-4 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-green-200 transition-all flex items-center gap-2 text-[#1e293b] cursor-pointer font-semibold" onClick={()=>{
                            setisDisabled(false)
                        }}>
                            <EditIcon className="w-4 h-4" /> Edit
                        </button>
                    :
                    <div className=" flex gap-3">
                        <button type="submit" className="h-10 px-4 rounded-[10px] border border-[#dbe4ee] hover:bg-[#394d6e] transition-all flex items-center gap-2 bg-[#1e293b] text-white whitespace-nowrap cursor-pointer font-semibold">
                            <SaveIcon className="w-4 h-4" /> Save
                        </button>
                        <button className=" h-10 px-4 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-green-200 transition-all flex items-center gap-2 text-[#1e293b] cursor-pointer font-semibold" onClick={()=>{
                            setisDisabled(true)
                        }}>
                            Cancel
                        </button>
                    </div> }

                    </div>
                    }
                </form>
            </div>
    )
}


function AddConsultationComponent({setdisplayAddConsultation,displayAddConsultation,parms,patientProfileData,getPatientConsultation}: any) {
    type MedicationType = {medicinename: string;duration: string;dosage: string;timing: string[];notes: string;};

    type ConsultationDataType = {pastmedicalhistory: string;personalhistory: string;hospitalname: string; medications: MedicationType[]; paymentamount:number,paymentstatus:string,paymentnote:string};

    const [consultationData, setconsultationData] =useState<ConsultationDataType>({pastmedicalhistory: "",personalhistory: "",hospitalname: parms.hospitalname,
        medications: [{medicinename: "",duration:"",dosage:"",timing: [],notes: "",}],paymentamount:0.0,paymentstatus:"notpaid",paymentnote:""
    });

    const [errorMessage, seterrorMessage] = useState<{meds:string,status:string}>({meds:"",status:""});

    const timingOptions = ["Before Breakfast","After Breakfast","Before Lunch","After Lunch","Before Dinner","After Dinner","Before Snacks","After Snacks"];

    async function AddConsultationPost() {
        try {
            const addConsultation = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/patient/addconsultation/${parms.patientid}`,consultationData,{withCredentials: true});
            console.log(addConsultation.data.status)
            if(addConsultation.data.status === "consultationCreated"){
                getPatientConsultation()
                setdisplayAddConsultation(false)
            }else if(addConsultation.data.status==="consultationNotCreated"){
                seterrorMessage({...errorMessage,status:"Contact Admin Server Error"})
            }

        } catch (error) {
            console.log(error);
        }
    }

    function addMedication() {
        setconsultationData((prev) => ({...prev,medications: [...prev.medications,{medicinename: "",duration:"",dosage:"",timing: [],notes: ""}]}));
    }

    function removeMedication(index: number) {
        setconsultationData((prev) => ({...prev, medications: prev.medications.filter((_, i) => i !== index),}));
    }

    function updateMedication(index: number,field: keyof MedicationType,value: string | string[]) {
        setconsultationData((prev) => {
            const updated = [...prev.medications];
            updated[index] = {...updated[index],[field]: value};
            return {...prev,medications: updated};
        });
    }

    function toggleTiming(index: number, value: string) {
        setconsultationData((prev) => {
            const updated = [...prev.medications];
            const currentTiming = updated[index].timing;
            updated[index] = {...updated[index],timing: currentTiming.includes(value)? currentTiming.filter((x) => x !== value): [...currentTiming, value]};
            return {...prev,medications: updated};
        });
    }
    const [medicineList,setmedicineList]=useState<any[]>([])
    async function getMedList(){
        const medList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/patient/getmedicinelist`,{withCredentials: true})
        setmedicineList(medList.data.medlist)
        // console.log(medList.data.medlist[0].medname)
    }
    useEffect(() => {
        getPatientConsultation()
        getMedList()
    }, [])
    

  return (
    <div className="bg-[#f6f8fb] w-full flex flex-col ">
        <div className={` flex flex-col bg-white rounded-3xl border border-[#e8edf2] shadow-xs p-5 sm:p-8 m-[10px]`}>
            <div className="text-center">
                <div className="text-[30px]">Consultation</div>
                <div className="select-none flex flex-col mr-[10px] min-w-[300px]">
                    <div className="text-[#64748b] text-sm mb-2 ml-[1px] select-none">Patient Name: {patientProfileData.fullname}</div>
                </div>
            </div>
            <div className="">
                {errorMessage.status && (<p className="text-[30px] p-[10px] rounded-[10px] font-semibold bg-white text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-5 h-5 " />{errorMessage.status}</p>)}
                <div className="text-[30px] mt-[20px]">Patient History</div>
                <div className="select-none flex mr-[10px] min-w-[300px] gap-3 flex-col lg:flex-row">
                    <div className="text-[#64748b] text-m mb-2 ml-[1px] w-full">
                        <div className="mb-[5px]">Past Medical History</div>
                        <textarea maxLength={200} rows={4} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[10px]`} onChange={(e:any)=>{
                            setconsultationData({...consultationData,pastmedicalhistory:e.target.value});
                            }} value={consultationData.pastmedicalhistory} placeholder="Patients Past Medical History..."/>
                    </div>
                    <div className="text-[#64748b] text-m mb-2 ml-[1px] w-full">
                        <div className="mb-[5px]">Personal History</div>
                        <textarea maxLength={200} rows={4} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[10px]`} onChange={(e:any)=>{
                            setconsultationData({...consultationData,personalhistory:e.target.value});
                            }} value={consultationData.personalhistory} placeholder="Patients Personal History..." />
                    </div>
                    
                </div>
                
            </div>
            <div className="">
                <div className="flex items-center justify-between mb-[15px]">
                    <div className="">
                        <div className="text-[30px]">Medications</div>
                        {errorMessage.meds && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errorMessage.meds}</p>)}
                    </div>

                </div>

                <div className="flex flex-col gap-[20px]">
                    {consultationData.medications.map((med: any, index: number) => {
                        return (
                            <div key={index} className="border border-[#dbe4ee] rounded-[15px] p-[20px] bg-[#f8fafc]">
                                <div className="flex items-center justify-between mb-[15px]">
                                    <div className="text-[20px] font-semibold text-[#1e293b]">
                                        Medicine {index + 1}
                                    </div>

                                    {consultationData.medications.length > 1 && (
                                        <button type="button" onClick={() => { removeMedication(index)}} className="text-red-500 hover:bg-red-100 p-[5px] rounded-[5px] cursor-pointer font-semibold">
                                            <XIcon/>
                                        </button>
                                    )}
                                </div>

                                <div className="mb-[15px]">
                                    <div className="text-[#64748b] text-sm mb-[5px]">Medicine Name</div>
                                    {/* <input type="text" placeholder="Enter medicine name..." value={med.medicinename}
                                        onChange={(e) => {
                                            seterrorMessage({...errorMessage,meds:""})
                                            updateMedication(index,"medicinename",e.target.value);
                                        }}
                                        className="border w-full h-[50px] rounded-[10px] bg-white text-[#64748b] outline-0 border-[#dbe4ee] p-[10px]"/> */}
                                        <select value={med.medicinename} onChange={(e) =>
                                            updateMedication(index,"medicinename",e.target.value)
                                            }
                                            
                                            className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] outline-none cursor-pointer ">
                                                <option value="" ></option>
                                                {medicineList.map((x:any)=>{
                                                    return <option value={x.medname} key={x.medid}>{x.medname}</option>
                                                    
                                                })}
                                        </select>

                                </div>
                                <div className="mb-[15px] flex gap-3">
                                    <div className=" w-full">
                                        <div className="text-[#64748b] text-sm mb-[5px]">Duration</div>
                                        <input type="text" placeholder="Enter Number of days... eg 5 days" value={med.duration}
                                            onChange={(e) => {
                                                updateMedication(index,"duration",e.target.value);
                                            }}
                                            className="border w-full h-[50px] rounded-[10px] bg-white text-[#64748b] outline-0 border-[#dbe4ee] p-[10px]"/>
                                    </div>

                                    <div className="w-full">
                                        <div className="text-[#64748b] text-sm mb-[5px]">Dosage</div>
                                        <input type="text" placeholder="Enter dosage... eg 20ml" value={med.dosage}
                                            onChange={(e) => {
                                                updateMedication(index,"dosage",e.target.value);
                                            }}
                                            className="border w-full h-[50px] rounded-[10px] bg-white text-[#64748b] outline-0 border-[#dbe4ee] p-[10px]"/>
                                    </div>
                                </div>

                                <div className="mb-[15px]">
                                    <div className="text-[#64748b] text-sm mb-[10px]">
                                        Timing
                                    </div>

                                    <div className="flex flex-wrap gap-[10px]">
                                        {timingOptions.map((option) => {
                                            return (
                                                <button type="button" key={option} onClick={() => {
                                                        toggleTiming(index, option);
                                                    }}
                                                    className={`px-[14px] py-[8px] rounded-[10px] border transition-all cursor-pointer ${med.timing.includes(option)? "bg-blue-500 text-white border-blue-500": "bg-white border-[#dbe4ee] text-[#64748b]"}`}>
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[#64748b] text-sm mb-[5px]">
                                        Notes
                                    </div>

                                    <textarea rows={3} placeholder="How to take this medicine..." value={med.notes}
                                        onChange={(e) => {
                                            updateMedication(index,"notes",e.target.value);
                                        }} className="resize-none border break-all w-full rounded-[10px] bg-white text-[#64748b] outline-0 border-[#dbe4ee] p-[10px]"/>
                                </div>
                            </div>
                        );
                    })}
                    
                </div>
                <div className="mt-[10px]">
                    <button type="button" onClick={()=>{
                        addMedication()
                    }} className="h-[45px] px-[20px] rounded-[10px] bg-[#1e3a5f] hover:bg-[#24466f] text-white cursor-pointer flex items-center gap-[8px]">
                        <Plus className="w-[18px] h-[18px]" />
                        Add Medicine
                    </button>
                </div>
                <div className="bg-white p-[20px] mt-[20px] rounded-[10px] ">
                    <div className="text-[30px] mb-[10px]">Payment</div>
                    <div className="flex flex-col md:flex-row">
                        <div className="text-[#64748b] mr-[20px]">
                            Amount
                            <input type="number" step="50" maxLength={10} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[10px]`} onChange={(e:any)=>{
                                setconsultationData({...consultationData,paymentamount:e.target.value});
                                }} value={consultationData.paymentamount} placeholder="Enter Amount To Bill... "/>
                        </div>
                        <div className="text-[#64748b] mr-[20px]">
                            Payment Status
                            <select value={consultationData.paymentstatus} onChange={(e) =>
                                setconsultationData({...consultationData,paymentstatus: e.target.value})
                                }
                                className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] outline-none cursor-pointer ">
                                <option value="notpaid">Not Paid</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                        <div className="text-[#64748b]">
                            Amount
                            <input type="text" maxLength={10} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[10px]`} onChange={(e:any)=>{
                                setconsultationData({...consultationData,paymentnote:e.target.value});
                                }} value={consultationData.paymentnote} placeholder="Payment Note..."/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                {errorMessage.meds && (<p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errorMessage.meds}</p>)}
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={()=>{
                    if(consultationData.medications[0].medicinename){
                        AddConsultationPost();
                    }else{
                        seterrorMessage({...errorMessage,meds:"Enter Atleast one Medicine"})
                    }
                }} className="h-10 mt-[20px] px-4 rounded-[10px] border border-[#dbe4ee] hover:bg-[#394d6e] transition-all flex items-center gap-2 bg-[#1e293b] text-white whitespace-nowrap cursor-pointer font-semibold">
                    <SaveIcon className="w-4 h-4" /> Save
                </button>
                {displayAddConsultation &&
                    <button className=" h-10 mt-[20px] px-4 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-red-200 transition-all flex items-center gap-2 text-[#1e293b] cursor-pointer font-semibold" onClick={()=>{
                            setdisplayAddConsultation(false)
                        }}>
                            Cancel
                    </button>
                }
            </div>
        </div>
    </div>
  );
}

function PatientConsultationComponent({consultationData = [], getPatientConsultation}: {consultationData?: any[], getPatientConsultation?: () => void }){
    if (!consultationData) return;    
    return(
        <div className="">
            {consultationData.map((x:any,y:any)=>{
                return (
                    <PatientConsultationDataComponent key={y} x={x} y={y} getPatientConsultation={getPatientConsultation}/>
                )
            })}
        </div>
    )
}
function PatientConsultationDataComponent({x,y,getPatientConsultation}:any){
    const userRole = useContext<any>(UserRoleContext);
    const parms= useParams();
    const[paymentData,setpaymentData]=useState<{paymentamount:number,paymentstatus:string,paymentnote:string,hospitalname:string,consultationid:string,patientid:string}>({paymentamount:x.paymentamount,paymentstatus:x.paymentstatus,paymentnote:x.paymentnote,hospitalname:parms.hospitalname || "",consultationid:x.consultationid,patientid:parms.hospitalname || ""})
    const [isDisabled,setisDisabled]=useState<boolean>(true);
    
    async function UpdatePaymentPost(){
        const updatePayment = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/patient/updatepaymentconsultation`,paymentData,{ withCredentials: true });
        if(updatePayment.data.status==="updatedPayment"){
            getPatientConsultation()
            setisDisabled(true)
            
        }else if(updatePayment.data.status==="updatedNotPayment"){
            console.log("contact admin ")
        }
    }
    useEffect(() => {
        setpaymentData(prev => ({
            ...prev,
            paymentamount: x.paymentamount,
            paymentstatus: x.paymentstatus,
            paymentnote: x.paymentnote,
        }));
    }, [x.paymentamount, x.paymentstatus, x.paymentnote]);
    
    return(
                <div className="bg-white m-[20px] flex cursor-pointer hover:bg-blue-100  rounded-[10px] flex-col p-[20px]">
                    <div className="text-[20px]">Consultation {y+1}</div>
                    <div className="flex justify-between">
                        <div className="">
                            <div className="text-[#64748b] text-xs mb-[5px] mt-[10px]">Patient Name: {x?.patient?.fullname}</div>
                            <div className="text-[#64748b] text-xs mb-[5px] ">Doctor Name: {x.doctorname}</div>  
                            <div className="text-[#64748b] text-xs mb-[5px] "> Date: {new Date(x.createdat).toLocaleString("en-IN", {timeZone: "Asia/Kolkata",day: "2-digit",month: "short",year: "numeric",hour: "numeric",minute: "2-digit",hour12: true})}</div>
                        </div>
                        <div className="cursor-pointer">
                            <ConsultationPdfButton consultation={x}/>
                        </div>
                    </div>
                    <div className="flex justify-between flex-col lg:flex-row" >
                        <div className="text-[#64748b] text-xs flex gap-2 mt-auto mb-auto">
                            <div className="">Amount: {x.paymentamount}</div>
                            <div>Status: <span className={`uppercase text-green-500 ${x.paymentstatus=="notpaid" && "text-red-500"}`}> {x.paymentstatus} </span></div>
                            {x.paymentnote && <div className="">Payment Note: {x.paymentnote}</div>}
                            <div className="">Payment Updated By: {x.paymentupdatedby}</div>
                        </div>
                        {isDisabled? <div className=""> { (userRole.roleType==="doctor" || userRole.roleType==="nurse") &&  <div className=" mt-[20px] lg:mt-0">
                            <button className="h-10 px-4 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-green-200 transition-all flex items-center gap-2 text-[#1e293b] cursor-pointer font-semibold" onClick={()=>{
                                getPatientConsultation()
                                setisDisabled(false)
                            }}>
                                <EditIcon className="w-4 h-4" /> Edit Payment
                            </button>
                        </div>
                        } </div>
                        :
                        <div className="flex gap-2 mt-[20px] lg:mt-0">
                            <button className="h-10 px-4 rounded-[10px] border border-[#dbe4ee] hover:bg-[#394d6e] transition-all flex items-center gap-2 bg-[#1e293b] text-white whitespace-nowrap cursor-pointer font-semibold" onClick={()=>{
                                UpdatePaymentPost()
                            }}>
                                <SaveIcon className="w-4 h-4" /> Save
                            </button>
                            <button className="h-10 px-4 rounded-[10px] text-white  bg-red-500 hover:bg-red-600 transition-all flex items-center gap-2 cursor-pointer font-semibold" onClick={()=>{
                                setisDisabled(true)
                            }}>
                                Cancel
                            </button>
                        </div>}

                    </div>
                    {!isDisabled && 
                        <div className="bg-white p-[20px] mt-[20px] rounded-[10px]">
                            <div className="text-[30px] mb-[10px]">Payment</div>
                            <div className="flex flex-col lg:flex-row">
                                <div className="text-[#64748b] mr-[20px]">
                                    Amount
                                    <input type="number" step="50" maxLength={10} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[10px]`} onChange={(e:any)=>{
                                        setpaymentData({...paymentData,paymentamount:e.target.value});
                                        }} value={paymentData.paymentamount} placeholder="Enter Amount To Bill... "/>
                                </div>
                                <div className="text-[#64748b] mr-[20px]">
                                    Payment Status
                                    <select value={paymentData.paymentstatus} onChange={(e) =>
                                        setpaymentData({...paymentData,paymentstatus: e.target.value})
                                        }
                                        className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] outline-none cursor-pointer ">
                                        <option value="notpaid">Not Paid</option>
                                        <option value="paid">Paid</option>
                                    </select>
                                </div>
                                <div className="text-[#64748b]">
                                    Payment Note
                                    <input type="text" maxLength={10} className={`resize-none border break-all w-full  rounded-[10px] bg-[#f8fafc] hover:text-[#3e4856] relative text-[#64748b] outline-0 border-[#dbe4ee] p-[10px]`} onChange={(e:any)=>{
                                        setpaymentData({...paymentData,paymentnote:e.target.value});
                                        }} value={paymentData.paymentnote} placeholder="Payment Note..."/>
                                </div>
                            </div>
                        </div>
                    }
                </div>
    )
}
