import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [isLoggedIn, _] = useState(localStorage.getItem("token"));
  const navigate = useNavigate(); 


  useEffect(() => {
    if(!localStorage.getItem("token")){
      navigate("/")
    }
  },[])


  return (
    <header className="inset-x-0 z-30 mx-auto w-full  border border-gray-100 bg-white/80 py-5 shadow backdrop-blur-lg  ">
      <div className="px-4">
        <div className="flex items-center justify-between mr-10">
          <div className="flex shrink-0">
            <Link aria-current="page" className="flex items-center" to="/">
              <PaperAirplaneIcon className="h-6 w-6 text-primary" />
              <p className="ml-1">Prontogram</p>
            </Link>
          </div>


          <div className="flex items-center justify-end gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/register"
                  className=" items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                >
                  Registrati
                </Link>
                <Link
                  to="/login"
                  className=" items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                >
                  Accedi
                </Link>
              </>
            ) : <button onClick={()=> {localStorage.clear(); window.location.reload() }} className=" items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex">
              Logout
            </button> }
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
