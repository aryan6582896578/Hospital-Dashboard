import {useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { HospitalIcon,Shield, StethoscopeIcon} from "lucide-react";
import SidebarComponent from "./AdminComponents/SidebarComponent";

export function DashboardPage() {

  return (
    <div className="bg-[#f6f8fb] flex h-full flex-col lg:flex-row overflow-y-auto w-full">

        <SidebarComponent/>

        <div className="flex h-full w-full">
            <ListHospital/>
        </div>

    </div>

  );
}

function ListHospital() {
  const [hospitalListData, sethospitalListData] = useState<any>();

  async function getHospitalList() {
    const hospitalList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/listhospital`,{ withCredentials: true });
    if (hospitalList.data.status === "unableToGetHospitalList") {
      console.log("error unable to fetch hospital list");
    } else {
      sethospitalListData(hospitalList.data.hospitalData);
    }
  }

  useEffect(() => {
    getHospitalList();
  }, []);
  return (
    <div className="w-full flex flex-col p-[20px]  pb-[40px] select-none">
        <div className="m-[20px] ">
            <h1 className="font-bold text-[25px]">Hospitals Overview</h1>
            <p className="text-[15px] text-[#64748b] ">Select a hospital to view and manage patient data</p>
        </div>
        <div className="bg-white p-[30px] min-h-[500px] h-fit overflow-y-auto flex flex-col border border-[#dbe4ee] rounded-[10px] shadow-sm" >
            {hospitalListData?
            <div className="">
                {hospitalListData?.map((x: any) => {
                    return (
                        <Link to={x.name} key={x.name}>
                            <div className="bg-white border border-slate-200 rounded-[10px] p-[15px] mb-[20px] shadow-sm hover:shadow-md hover:bg-slate-100 cursor-pointer">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-[28px] font-bold text-blue-600 flex"><HospitalIcon className="h-[40px] w-[40px] mr-[15px] text-black" /> {x.displayname}</h2>
                                        <p className="text-[14px] text-slate-500 mt-[2px] hover:underline ml-[55px]">{x.name}</p>
                                    </div>
                                </div>

                                <div className="mt-[22px] ml-[55px]">
                                    <div className="text-[13px] font-semibold tracking-wide text-slate-500 mb-[10px] flex"> <StethoscopeIcon className="mr-[10px]"/> DOCTORS</div>
                                    <div className="flex flex-wrap gap-[10px]">
                                        {x.doctorlist.map((y: any) => {
                                            return (<div key={y} className="bg-blue-100 text-blue-700 text-[14px] font-medium px-[12px] py-[6px] rounded-[8px] ">{y}</div>);
                                        })}
                                    </div>
                                </div>

                                <div className="mt-[20px] ml-[55px]">
                                    <div className="text-[13px] font-semibold tracking-wide text-slate-500 mb-[10px] flex"><Shield className="mr-[10px]"/> NURSES</div>
                                    <div className="flex flex-wrap gap-[10px]">
                                    {x.nurselist.map((y: any) => {
                                        return (<div key={y} className="bg-green-100 text-green-700 text-[14px] font-medium px-[12px] py-[6px] rounded-[8px]">{y}</div>);
                                    })}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}

            </div>
            :
            <div className="flex flex-col">
                <div className="bg-blue-400 w-fit p-[20px] rounded-full self-center mb-[20px]"><HospitalIcon className="h-[60px] w-[60px] stroke-[1.2] text-white" /></div>
                <div className="flex flex-col">
                    <h1 className="font-bold text-[25px] self-center mb-[10px]">No Hospitals Available</h1>
                    <p className="text-[15px] text-[#64748b] ml-auto mr-auto w-[80%] text-center">There are no hospitals Available Please Contact Admin.</p>
                </div>
            </div>}    

        </div>

    </div>
  );
}
