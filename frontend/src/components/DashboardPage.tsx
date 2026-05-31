import {useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { HospitalIcon,Search,Shield, StethoscopeIcon, X} from "lucide-react";
import SidebarComponent from "./AdminComponents/SidebarComponent";

export function DashboardPage() {

  return (
    <div className="bg-[#f6f8fb] h-dvh flex flex-col lg:flex-row">

        <SidebarComponent />
        <ListHospital />

    </div>

  );
}

function ListHospital() {
  const [hospitalListData, sethospitalListData] = useState<any>();
  const[searchValue,setsearchValue]=useState<string>("");
  const[isEmptySearch,setisEmptySearch]=useState<boolean>(false)
  async function getHospitalList() {
    const hospitalList = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/listhospital`,{ withCredentials: true });
    if (hospitalList.data.status === "unableToGetHospitalList") {
      console.log("error unable to fetch hospital list");
    } else {
      sethospitalListData(hospitalList.data.hospitalData);
    }
  }
  const filteredHospital = useMemo(() => {
    return hospitalListData?.filter((x: any) => {
      return (x.displayname?.toLowerCase().includes(searchValue.toLowerCase()) || x.name?.toLowerCase().includes(searchValue.toLowerCase()));
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
    <div className="w-full flex flex-col  pt-[0px] pb-[20px] overflow-y-auto select-none ">
        <div className="min-h-20 bg-white border-b border-[#e8edf2] px-3 sm:px-4 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ">
          <div className="relative w-full lg:max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            {searchValue && (
              <X className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] cursor-pointer" onClick={() => {
                  setsearchValue("");
                }}/>
            )}
            <input type="text" placeholder="Search hospitals..." className="w-full h-12 rounded-[10px] bg-[#f8fafc] border border-[#dbe4ee] pl-11 pr-4 outline-none " value={searchValue}onChange={(e) => {
                setsearchValue(e.target.value);
              }}/>
          </div>

        </div>
        <div className="m-[20px] ">
            <h1 className="font-bold text-[25px]">Hospitals Overview</h1>
            <p className="text-[15px] text-[#64748b] ">Select a hospital to view and manage patient data</p>
        </div>
        <div className="bg-white p-[30px] ml-[10px] mr-[10px] overflow-y-auto flex flex-col border border-[#dbe4ee] rounded-[10px] shadow-sm" >

            <div className="">
                {filteredHospital?.map((x: any) => {
                    return (
                        <Link to={x.name} key={x.name}>
                            <div className="bg-white border border-slate-200 rounded-[10px] p-[15px] mb-[20px] shadow-sm hover:shadow-md hover:bg-slate-100 cursor-pointer">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-[28px] font-bold text-blue-600 flex break-all "><HospitalIcon className="h-[40px] w-[40px] mr-[15px] text-black " /> {x.displayname}</h2>
                                        <p className="text-[14px] text-slate-500 mt-[2px] hover:underline ml-[55px] break-all">{x.name}</p>
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
                {isEmptySearch?
                    <div className="flex flex-col mt-[20px]">
                        <div className="bg-blue-400 w-fit p-[20px] rounded-full self-center mb-[20px]"><HospitalIcon className="h-[60px] w-[60px] stroke-[1.2] text-white" /></div>
                            <div className="flex flex-col">
                                <h1 className="font-bold text-[25px] self-center mb-[10px]">No Hospitals Available</h1>
                                <p className="text-[15px] text-[#64748b] ml-auto mr-auto w-[80%] text-center">There are no hospitals Available with the given name</p>
                            </div>
                    </div>:""}
            </div>
  

        </div>

    </div>
  );
}
