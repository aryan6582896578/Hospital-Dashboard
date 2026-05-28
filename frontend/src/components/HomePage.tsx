import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router";

export default function HomePage(){
    let navigate = useNavigate();
    const[userData,setuserData]= useState({username:"",password:""});
    const[usernameError,setusernameError]=useState("")
    const[passwordError,setpasswordError]=useState("")
    const[cookieCheck,setcookieCheck]=useState(false)
    async function LoginUser(){
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`,userData,{withCredentials: true })
        if(response.data.status==='userValid'){
            navigate("/dashboard");
        }
    }

    useEffect(() => {
      if(document.cookie){
        setcookieCheck(true)
      }
    }, [])
    
    
    return(
        <div className="flex bg-black h-[100%] flex-col">
        <div className="bg-blue-600 h-[45px] sm:h-[70px] text-white text-[25px] sm:text-[40px] pl-[10px] sm:pl-[5px] font-semibold"> Hospital Dashboard</div>
        <div className="bg-white sm:flex h-[100%]">
            <div className="sm:w-[70%] text-[30px] sm:text-[40px] ml-[20px] font-bold text-blue-600">Welcome to Hospital Dashboard</div>
            <div className="bg-blue-600 w-[90%] sm:w-[50%] sm:min-w-[40%] rounded-[10px] h-fit mt-[40px] ml-auto mr-auto flex flex-col sm:mr-[40px] text-white p-[30px] text-center">
                <div className="text-[50px] font-semibold mb-[30px]">LOGIN</div>
                {cookieCheck?<div className="">
                    <button className="bg-green-500 text-[20px] w-[fit] p-[5px] pl-[20px] pr-[20px] rounded-[5px] text-white font-semibold cursor-pointer hover:bg-green-600" onClick={()=>{
                        LoginUser() }}>CONTINUE</button>
                </div>:                <div className="bg-gray-100 text-black p-[20px] rounded-[10px] mb-[30px] w-[100%] sm:w-[90%] ml-auto mr-auto">
                    <div className="flex flex-col mt-[10px]">
                        <div className="flex text-[15px] font-bold">USERNAME <div className=" ml-[5px] text-red-500 text-[15px]">{usernameError}</div> </div>
                        <input type="text" className="rounded-[5px] border-2 h-[30px] bg-gray-300 border-gray-300 outline-0 p-[5px] font-semibold" onChange={(e)=>{
                            setuserData({...userData,username:e.target.value})
                        }}/>
                    </div>
                        <div className="flex flex-col mt-[20px]">
                        <div className="flex text-[15px] font-bold">PASSWORD <div className=" ml-[5px] text-red-500 text-[15px]">{passwordError}</div> </div>
                        <input type="password" className="rounded-[5px] border-2 h-[30px] bg-gray-300 border-gray-300 outline-0 p-[5px] font-semibold" onChange={(e)=>{
                            setuserData({...userData,password:e.target.value})
                        }}/>
                    </div>
                    <div className="flex text-[15px] mt-[5px] text-purple-800 font-semibold hover:underline cursor-pointer" onClick={()=>{
                        alert("Contact Admin to reset username or password")
                    }}>Forgot Password?</div>
                    <div className="mt-[20px]">
                        <button className="bg-green-500 text-[20px] w-[50%] p-[5px] pl-[20px] pr-[20px] rounded-[5px] text-white font-semibold cursor-pointer hover:bg-green-600" onClick={()=>{
                            if(userData.username){
                                setusernameError("")
                                if(userData.password){
                                    setpasswordError("")
                                    LoginUser()
                                }else{
                                    setpasswordError("*password cannot be empty")
                                }
                                
                            }else{
                                setusernameError("*username cannot be empty")
                            }
                            
                        }}>LOGIN</button>
                    </div>
                </div>}


        </div>
        </div>
        </div>
    )
}