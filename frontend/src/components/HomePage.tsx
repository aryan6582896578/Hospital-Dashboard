import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Activity, User, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function HomePage() {
  let navigate = useNavigate();
  const [userData, setuserData] = useState({ username: "", password: "" });
  const [usernameError, setusernameError] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [cookieCheck, setcookieCheck] = useState(false);

  async function LoginUser() {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`,userData,{ withCredentials: true });
    if (response.data.status === "userValid") {
      navigate("/dashboard");
    }else if(response.data.status==="invalidData"){
        console.log(cookieCheck)
        setusernameError("Invalid Username or Password")
    }else if(response.data.status==="userInvalid"){
      setusernameError("Invalid Username or Password")
    }
  }

  useEffect(() => {
    if (document.cookie) {
      setcookieCheck(true);
    }else{
        setcookieCheck(false);
    }
  }, [LoginUser]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center p-4 ">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center " >
        <div className="hidden lg:flex flex-col justify-center space-y-6 p-8 mb-[30px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Activity className="w-10 h-10 text-white" strokeWidth={1} />
            </div>
            <div>
              <h1 className="text-4xl text-blue-900 ">lforlungscare</h1>
              <p className="text-s text-blue-600 ">Hospital Management System</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl text-blue-900 ">Welcome Back</h2>
            <p className="text-lg text-blue-700 ">
              Access your hospital dashboard to manage patient data, appointments,
              and medical records all in one place.
            </p>
          </div>

        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-2xl text-blue-900 ">lforlungscare</h1>
                <p className="text-sm text-blue-600 ">Hospital Management System</p>
              </div>
            </div>

            <div className="mb-8 ">
              <h2 className="text-3xl text-gray-900 mb-2 ">Sign In</h2>
              {cookieCheck?"":<p className="text-xs sm:text-sm text-gray-600 font-medium">Enter your credentials to access your account</p>}
            </div>
            {cookieCheck ? (
              <div className="space-y-6">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 group cursor-pointer font-semibold" onClick={() => {
                    LoginUser();
                  }}> Continue to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => {
                  e.preventDefault();
                  if (userData.username) {
                    setusernameError("");
                    if (userData.password) {
                      setpasswordError("");
                      LoginUser();
                    } else {
                      setpasswordError("Password cannot be empty");
                    }
                  } else {
                    setusernameError("Username cannot be empty");
                  }
                }}
                className="space-y-5">

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${usernameError ? "border-red-500" : "border-gray-200"} rounded-xl outline-none`} placeholder="Enter your username"onChange={(e) => {
                        setuserData({ ...userData, username: e.target.value });
                        setusernameError("");
                      }}
                    />
                  </div>
                  {usernameError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {usernameError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="password" className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${passwordError ? "border-red-500" : "border-gray-200"} rounded-xl outline-none `} placeholder="Enter your password" onChange={(e) => {
                        setuserData({ ...userData, password: e.target.value });
                        setpasswordError("");
                      }}/>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {passwordError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-medium" onClick={() => {
                      alert("Contact Admin to reset username or password");
                    }}>
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 group cursor-pointer ">
                  Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500 font-semibold">
                Hospital staff access only. Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
