import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { UserRoleContext } from "../AuthPage";
import axios from "axios";

import HospitalSidebarComponent from "./HospitalSidebarComponent";
import ConsultationPdfButton from "./ConsultationPdfButton";
import { EditIcon, SaveIcon } from "lucide-react";

export function FinancePage(){
    const [consultationData,setconsultationData]=useState<any[]>([]);
    const [paymentData,setpaymentData]=useState<any[]>([]);
    const parms = useParams();
    async function getConsultations(){
        const consultations = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/patient/getallconsultations`,{params:{hospitalname:parms.hospitalname,patientid:parms.patientid},withCredentials: true})
       setconsultationData(consultations.data.consultationDataAll)
       setpaymentData(consultations.data.payments)
       console.log(consultations.data.payments)
    }

    useEffect(() => {
        getConsultations()
    }, [])
    return(

        <div className="bg-[#f6f8fb] h-dvh flex flex-col lg:flex-row overflow-hidden">

            <HospitalSidebarComponent />
            <FinanceDataComponent consultationData={consultationData} getConsultations={getConsultations} paymentData={paymentData}/>
        
        </div>
            
    )
    

}

function FinanceDataComponent({consultationData,getConsultations,paymentData}:any){
    const userRole = useContext<any>(UserRoleContext);
    return(
        <div className="flex w-full flex-col overflow-y-auto h-dvh pb-[20px] ">
                <div className="min-h-20 border-b bg-white border-[#e8edf2] px-2 sm:px-4 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center  justify-end">
                    {(userRole.roleType==="admin" || userRole.roleType==="doctor")
                    && 
                    <div className="flex gap-3 text-xl text-white">
                        <div className="flex gap-3">
                            <div className=" text-black mt-auto mb-auto">Total Paid</div>
                            <div className="bg-green-400 p-[10px] rounded-[5px]">{paymentData.totalpaidamount} </div>
                        </div>
                        <div className="flex gap-3">
                            <div className=" text-black mt-auto mb-auto">Total Unpaid </div>
                            <div className="bg-yellow-400 p-[10px] rounded-[5px]">{paymentData.totalunpaidamount}</div>
                        </div>
                    </div>
                    }
                </div>
                <div className="">
                    <PatientConsultationComponent consultationData={consultationData} getConsultations={getConsultations} />
                </div>
        </div>
    )
}

function PatientConsultationComponent({consultationData = [], getConsultations}: {consultationData?: any[], getConsultations?: () => void }){
    if (!consultationData) return;
    
    return(
        <div className="">
            {consultationData.map((x:any,y:any)=>{
                return (
                    <PatientConsultationDataComponent key={y} x={x} y={y} getConsultations={getConsultations}/>
                )
            })}

            {consultationData.length===0 && <div className="bg-white m-[20px] p-[20px] text-3xl rounded-[10px] text-center">No Pending Payments</div> }
            
        </div>
    )
}
function PatientConsultationDataComponent({x,getConsultations}:any){
    const userRole = useContext<any>(UserRoleContext);
    const parms= useParams();
    const[paymentData,setpaymentData]=useState<{paymentamount:number,paymentstatus:string,paymentnote:string,hospitalname:string,consultationid:string,patientid:string}>({paymentamount:x.paymentamount,paymentstatus:x.paymentstatus,paymentnote:x.paymentnote,hospitalname:parms.hospitalname || "",consultationid:x.consultationid,patientid:parms.hospitalname || ""})
    const [isDisabled,setisDisabled]=useState<boolean>(true);
    
    async function UpdatePaymentPost(){
        const updatePayment = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/patient/updatepaymentconsultation`,paymentData,{ withCredentials: true });
        console.log(updatePayment.data.status)
        if(updatePayment.data.status==="updatedPayment"){
            getConsultations()
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
                    <Link to={`/dashboard/${parms.hospitalname}/patients/${x.patientid}`}>
                    <div className="flex justify-between">
                        <div className="text-black">
                            <div className=" text-s mb-[5px] mt-[10px]">Patient Name: {x?.patient?.fullname}</div>
                            <div className=" text-s mb-[5px] ">Doctor Name: {x.doctorname}</div>  
                            <div className=" text-s mb-[5px] "> Date: {new Date(x.createdat).toLocaleString("en-IN", {timeZone: "Asia/Kolkata",day: "2-digit",month: "short",year: "numeric",hour: "numeric",minute: "2-digit",hour12: true})}</div>
                        </div>
                        <div className="cursor-pointer">
                            <ConsultationPdfButton consultation={x}/>
                        </div>
                    </div>
                    </Link>
                    <div className="flex justify-between flex-col lg:flex-row">
                        <div className="text-black text-s flex gap-2 mt-auto mb-auto flex-col">
                            <div className="">
                                {x.paymentnote && <div className="">Payment Note: {x.paymentnote}</div>}
                                <div className="">Payment Updated By: {x.paymentupdatedby}</div>
                            </div>

                            {x.paymentstatus==="paid"?
                                <div className="flex gap-3">
                                    <div className="">Amount: <span className="bg-green-400 p-[5px] rounded-[5px] text-white font-medium">{x.paymentamount}</span> </div>
                                    <div className="">Status: <span className=" bg-green-400 p-[5px] rounded-[5px] text-white font-medium">{x.paymentstatus} </span></div>
                                </div>
                                
                                :
                                <div className="flex gap-3">
                                    <div className="">Amount: <span className="bg-red-400 p-[5px] rounded-[5px] text-white font-medium">{x.paymentamount}</span> </div>
                                    <div className="">Status: <span className=" bg-yellow-200 text-black p-[5px] rounded-[5px] ">{x.paymentstatus} </span></div>
                                </div>
                            }    


                        </div>
                        {isDisabled? <div className="mt-[20px]"> { (userRole.roleType==="doctor" || userRole.roleType==="nurse") &&  <div className="">
                            <button className="h-10 px-4 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-green-200 transition-all flex items-center gap-2 text-[#1e293b] cursor-pointer font-semibold" onClick={()=>{
                                getConsultations()
                                setisDisabled(false)
                            }}>
                                <EditIcon className="w-4 h-4" /> Edit Payment
                            </button>
                        </div>
                        } </div>
                        :
                        <div className="flex gap-2">
                            <button className="h-10 px-4 rounded-[10px] border border-[#dbe4ee] hover:bg-[#394d6e] transition-all flex items-center gap-2 bg-[#1e293b] text-white whitespace-nowrap cursor-pointer font-semibold" onClick={()=>{
                                UpdatePaymentPost()
                            }}>
                                <SaveIcon className="w-4 h-4" /> Save
                            </button>
                            <button className="h-10 px-4 rounded-[10px] border border-[#dbe4ee] bg-white hover:bg-red-200 transition-all flex items-center gap-2 text-[#1e293b] cursor-pointer font-semibold" onClick={()=>{
                                setisDisabled(true)
                            }}>
                                Cancel
                            </button>
                        </div>}

                    </div>
                    {!isDisabled && 
                        <div className="bg-white p-[20px] mt-[20px] rounded-[10px]">
                            <div className="text-[30px] mb-[10px]">Payment</div>
                            <div className="flex">
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