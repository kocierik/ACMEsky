import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
function Navbar() {

  return (
    <header
      className=" inset-x-0 z-30 mx-auto w-full  border border-gray-100 bg-white/80 py-5 shadow backdrop-blur-lg  ">
      <div className="px-4">
        <div className="flex items-center justify-between mr-10">
          <div className="flex shrink-0">
            <a aria-current="page" className="flex items-center" href="/">
              <PaperAirplaneIcon className="h-6 w-6 text-primary" />
              <p className="ml-1">ACMEsky</p>
            </a>
          </div>
          <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
            <Link aria-current="page"
              className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              to="/findTrip">Cerca Voli</Link>
            <Link className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              to="/offer">Offerte</Link>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Link to="/register" className=" items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
            >Registrati</Link>
            <Link to="/login" className=" items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
            >Accedi</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
