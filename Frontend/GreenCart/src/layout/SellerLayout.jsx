import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { UseAppContext } from "../context/UseAppContext";

export const SellerLayout = () => {
  const navigate = useNavigate();
  const { setRole, setRoleLoading, axios, toast } = UseAppContext();

  const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/seller/dashboard",
      icon: assets.dashboard_icon,
    },
    { name: "Add Product", path: "/seller/add-product", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const handleLogout = async () => {
    try {
      setRoleLoading(true);
      const response = await axios.post("/api/seller/logout");
      if (response.status === 200) {
        setRole("guest");
        navigate("/");
        toast.success("Logged out successfully.");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setRoleLoading(false);
    }
  };

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <NavLink to="/seller/dashboard">
          <img className="h-9" src={assets.logo} alt="logo" loading="lazy" />
        </NavLink>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Seller</p>
          <button
            onClick={handleLogout}
            className="border rounded-full text-sm px-4 py-1 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="md:w-64 w-16 border-r h-[90vh] text-base border-gray-300 pt-4 flex flex-col">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 ${
                  isActive
                    ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                    : "hover:bg-gray-100/90 border-white"
                }`
              }
            >
              <img
                src={item.icon}
                alt="icon"
                className="w-7 h-7"
                loading="lazy"
              />
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  );
};
