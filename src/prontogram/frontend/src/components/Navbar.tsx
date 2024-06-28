import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Navbar() {
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
        </div>
      </div>
    </header>
  );
}

export default Navbar;
