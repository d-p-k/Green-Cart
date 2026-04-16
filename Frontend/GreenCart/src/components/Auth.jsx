import { useEffect, useState } from "react";
import { UseAppContext } from "../context/UseAppContext";
import { assets } from "../assets/assets";

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const { showUserLogin, setShowUserLogin, fetchUserStatus, axios, toast } =
    UseAppContext();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");

  useEffect(() => {
    if (showUserLogin) document.body.style.overflow = "hidden"; // Lock scroll
    else document.body.style.overflow = "auto"; // Restore scroll
    return () => (document.body.style.overflow = "auto"); // Cleanup when component unmounts
  }, [showUserLogin]);

  const seePassword = () => {
    setType("text");
    setTimeout(() => {
      setType("password");
    }, 700);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (state === "register") {
        const response = await axios.post("/api/user/register", {
          name,
          email,
          password,
        });
        if (response.status === 201) {
          setShowUserLogin(false);
          fetchUserStatus();
          toast.success("User registered successfully.");
        }
      } else {
        const response = await axios.post("/api/user/login", {
          email,
          password,
        });
        if (response.status === 200) {
          setShowUserLogin(false);
          fetchUserStatus();
          toast.success("User logged in successfully!");
        }
      }
    } catch (error) {
      if (error.status === 409) toast.error("User already exists!");
      else if (error.status === 401) toast.error("Invalid email or password!");
      else toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(loading)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-500/30 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>
        {state === "register" && (
          <div className="w-full">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="e.g. Deepak Koshta"
              className="border border-gray-500/30 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}
        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="e.g. deepakkoshta@email.com"
            className="border border-gray-500/30 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>
        <div className="w-full relative">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="e.g. StrongPass@123"
            className="border border-gray-500/30 rounded w-full p-2 pe-12 mt-1 outline-primary"
            type={type}
            required
          />
          {type === "password" && (
            <img
              src={assets.eye_icon}
              alt="eye_icon"
              className="p-1 size-7 absolute cursor-pointer"
              style={{ top: "29px", right: "13px" }}
              onClick={seePassword}
              loading="lazy"
            />
          )}
        </div>
        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
        <button
          className={`bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md flex items-center justify-center 
            ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
          disabled={loading}
        >
          {state === "register" ? "Create Account" : "Login"}
          {loading && (
            <span className="ml-2 inline-block size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
        </button>
      </form>
    </div>
  );
};
