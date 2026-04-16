import { useState } from "react";
import { UseAppContext } from "../context/UseAppContext";

export const NewsLetter = () => {
  const { toast } = UseAppContext();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thanks for subscribing to our newsletter!");
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 my-30">
      <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</h1>
      <p className="text-sm md:text-md text-gray-500 pb-8">
        Subscribe to get the latest offers, new arrivals and exclusive
        discounts.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
      >
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="email"
          placeholder="Enter your email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};
