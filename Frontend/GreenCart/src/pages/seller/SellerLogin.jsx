import { useNavigate } from "react-router-dom";
import { UseAppContext } from "../../context/UseAppContext";
import { useState } from "react";
import { assets } from "../../assets/assets";

export const SellerLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setRole, axios, toast } = UseAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");

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
      const response = await axios.post("/api/seller/login", {
        email,
        password,
      });
      if (response.status === 200) {
        setRole("seller");
        navigate("/seller/dashboard");
        toast.success("Logged in successfully.");
      }
    } catch (error) {
      if (error.status === 401) toast.error("Invalid email or password!");
      else toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex items-center text-sm text-gray-600"
    >
      <div className="flex flex-col gap-5 m-auto items-center p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Seller</span> Login
        </p>
        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Seller email"
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
            placeholder="Seller password"
            className="border border-gray-500/30 rounded w-full p-2 mt-1 outline-primary"
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
        <button
          className={`bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md flex items-center justify-center 
              ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
          disabled={loading}
        >
          Login
          {loading && (
            <span className="ml-2 inline-block size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
        </button>
      </div>
    </form>
  );
};
