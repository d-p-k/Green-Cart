import { useState } from "react";
import { assets } from "../../assets/assets";
import { UseAppContext } from "../../context/UseAppContext";

export const Contact = () => {
  const { toast } = UseAppContext();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setMessage("");
    toast.success("Thanks! We'll get back to you soon.");
  };

  return (
    <div className="my-15 md:mt-16 md:mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[5fr_7fr] gap-15">
        <div className="">
          <div className="flex flex-col items-end w-max">
            <p className="text-2xl font-medium uppercase">Contact Us</p>
            <div className="w-16 h-0.5 bg-primary rounded-full" />
          </div>
          <div className="text-gray-500 text-sm md:text-md mt-3 mb-10">
            <p>Need some help? Let us know we'll get straight back to you.</p>
          </div>
          <form action={handleSubmit} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block mb-1">
                  Full Name
                </label>
                <input
                  className="w-full p-2 border border-gray-500/30 rounded outline-primary"
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="e.g Deepak Koshta"
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-1">
                  Phone
                </label>
                <input
                  className="w-full p-2 border border-gray-500/30 rounded outline-primary"
                  id="phone"
                  type="number"
                  name="phone"
                  placeholder="e.g. 9999988888"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="Email" className="block mb-1">
                Email
              </label>
              <input
                className="w-full p-2 border border-gray-500/30 rounded outline-primary"
                id="Email"
                type="email"
                name="Email"
                placeholder="e.g. deepakkoshta@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1">
                Message
              </label>
              <textarea
                className="w-full p-2 border border-gray-500/30 rounded outline-primary resize-none"
                id="message"
                name="message"
                placeholder="e.g. I need assistance with my order."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                rows="5"
                required
              />
            </div>
            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 mt-3 rounded-md cursor-pointer">
              Submit
            </button>
          </form>
        </div>
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117371.2004152977!2d79.88635107286613!3d23.17567366213528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae1a0fb6a97d%3A0x44020616bc43e3b9!2sJabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1759326814193!5m2!1sen!2sin"
            className="size-full rounded-lg not-lg:h-60"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-15 md:mt-20 gap-6">
        <div className="flex items-center gap-5 rounded-md border border-gray-500/20 p-6">
          <div className="p-5 bg-primary/20 rounded-full">
            <img
              src={assets.phone_icon}
              alt="phone_icon"
              className="size-6"
              loading="lazy"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium">Call Us</h3>
            <a href="tel:+919876543210" className="text-sm text-primary">
              +91 98765-43210
            </a>
          </div>
        </div>
        <div className="flex items-center gap-5 rounded-md border border-gray-500/20 p-6">
          <div className="p-5 bg-primary/20 rounded-full">
            <img
              src={assets.email_icon}
              alt="email_icon"
              className="size-6"
              loading="lazy"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium">Email Us</h3>
            <a href="mailto:demo@gmail.com" className="text-sm text-primary">
              support@greencart.com
            </a>
          </div>
        </div>
        <div className="flex items-center gap-5 rounded-md border border-gray-500/20 p-6 md:col-span-2 lg:col-span-1">
          <div className="p-5 bg-primary/20 rounded-full">
            <img
              src={assets.location_icon}
              alt="location_icon"
              className="size-6"
              loading="lazy"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium">Our Location</h3>
            <p className="text-sm text-gray-500">Jabalpur, MP, India.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
