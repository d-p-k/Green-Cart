import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { UseAppContext } from "../../context/UseAppContext";
import { useNavigate } from "react-router-dom";

const InputField = ({
  label,
  type,
  placeholder,
  name,
  handleChange,
  address,
}) => {
  return (
    <div>
      <label htmlFor={label} className="block mb-1">
        {label}
      </label>
      <input
        className="w-full p-2 border border-gray-500/30 rounded outline-primary"
        id={label}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        value={address[name]}
        required
      />
    </div>
  );
};

export const AddAddress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user, axios, toast } = UseAppContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await axios.post("/api/address/add", {
        userId: user?.id,
        ...address,
      });
      if (response.status === 201) {
        navigate("/cart");
        toast.success("Address added successfully.");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10 md:mt-16 md:mb-20">
      <div className="flex flex-col items-center lg:flex-row justify-between gap-5">
        <div className="flex-1 max-w-lg">
          <div className="flex flex-col items-end w-max">
            <p className="text-2xl font-medium uppercase">Add Address</p>
            <div className="w-16 h-0.5 bg-primary rounded-full" />
          </div>
          <div className="text-gray-500 text-sm md:text-md mt-3 mb-10">
            <p>Keep your addresses updated for smooth deliveries.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                label="First Name"
                name="firstName"
                type="text"
                placeholder="e.g. Deepak"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="e.g. Koshta"
              />
            </div>
            <InputField
              handleChange={handleChange}
              address={address}
              label="Email"
              name="email"
              type="email"
              placeholder="e.g. deepakkoshta@email.com"
            />
            <InputField
              handleChange={handleChange}
              address={address}
              label="Street"
              name="street"
              type="text"
              placeholder="e.g. 45, Bada Fuwara"
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                label="City"
                name="city"
                type="text"
                placeholder="e.g. Jabalpur"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                label="State"
                name="state"
                type="text"
                placeholder="e.g. Madhya Pradesh"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                label="Zip Code"
                name="zipcode"
                type="number"
                placeholder="e.g. 482001"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                label="Country"
                name="country"
                type="text"
                placeholder="e.g. India"
              />
            </div>
            <InputField
              handleChange={handleChange}
              address={address}
              label="Phone"
              name="phone"
              type="number"
              placeholder="e.g. 9999988888"
            />
            <button
              className={`bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 mt-5 rounded-md flex items-center justify-center
                ${
                  loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                }`}
              disabled={loading}
            >
              Save Address
              {loading && (
                <span className="ml-2 inline-block size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
            </button>
          </form>
        </div>
        <img
          src={assets.add_address_image}
          alt="add-address"
          className="size-70 lg:size-120 xl:size-140 hidden lg:block"
          loading="lazy"
        />
      </div>
    </div>
  );
};
