import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { UseAppContext } from "../context/UseAppContext";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    searchQuery,
    setSearchQuery,
    getCartCount,
    setCartItems,
    setRole,
    toast,
    axios,
  } = UseAppContext();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"; // Lock scroll
    else document.body.style.overflow = "auto"; // Restore scroll
    return () => (document.body.style.overflow = "auto"); // Cleanup when component unmounts
  }, [open]);

  useEffect(() => {
    if (searchQuery.length > 0) navigate("/products");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setIsMenuOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/user/logout");
      if (response.status === 200) {
        setOpen(false);
        setUser(null);
        setCartItems({});
        navigate("/");
        setRole("guest");
        toast.success("Logged out successfully!");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" loading="lazy" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
          />
          <img
            src={assets.search_icon}
            alt="search-icon"
            className="w-4 h-4"
            loading="lazy"
          />
        </div>

        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart-icon"
            className="w-6 opacity-80"
            loading="lazy"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {user ? (
          <div className="relative group" ref={menuRef}>
            <img
              src={assets.profile_icon}
              alt="profile-icon"
              className="w-10 cursor-pointer"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              loading="lazy"
            />
            {isMenuOpen && (
              <ul className="absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                <li
                  onClick={() => {
                    navigate("/my-orders");
                    setIsMenuOpen(false);
                  }}
                  className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  My Orders
                </li>
                <li
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        )}
      </div>

      <div className="flex items-center gap-6 sm:hidden">
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart-icon"
            className="w-6 opacity-80"
            loading="lazy"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className="cursor-pointer"
        >
          {/* Menu Icon SVG */}
          <img src={assets.menu_icon} alt="menu-icon" loading="lazy" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 z-40 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-5 flex justify-between items-center w-full px-5">
          <img className="h-9" src={assets.logo} alt="logo" loading="lazy" />
          <button
            className="size-5 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <img src={assets.cross_icon} alt="cross_icon" loading="lazy" />
          </button>
        </div>
        <NavLink to="/" onClick={() => setOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/products" onClick={() => setOpen(false)}>
          Products
        </NavLink>
        {user && (
          <NavLink to="/my-orders" onClick={() => setOpen(false)}>
            My Orders
          </NavLink>
        )}
        <NavLink to="/contact" onClick={() => setOpen(false)}>
          Contact
        </NavLink>
        {user ? (
          <button
            onClick={handleLogout}
            className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }}
            className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};
