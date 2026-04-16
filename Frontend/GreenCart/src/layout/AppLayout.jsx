// import { Outlet, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { UseAppContext } from "../context/UseAppContext";
import { Auth } from "../components/Auth";

export const AppLayout = () => {
  const { showUserLogin } = UseAppContext();

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      <Navbar />
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        {showUserLogin && <Auth />}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
