import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAppContext } from "../../context/UseAppContext";
import { assets } from "../../assets/assets";

export const Cart = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const {
    user,
    products,
    cartItems,
    removeFromCart,
    updateCartItem,
    getCartCount,
    getCartTotalAmount,
    fetchUserStatus,
    currency,
    axios,
    toast,
  } = UseAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item.id == key);
      product.quantity = cartItems[key];
      tempArray.push(product);
    }
    setCartArray(tempArray);
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("/api/address/user/" + user.id);
      if (response.status === 200) {
        setAddresses(response.data);
        if (response.data.length > 0) setSelectedAddress(response.data[0]);
      }
    } catch (error) {
      if (error.status === 404) toast.error("Error while finding user.");
      else toast.error(error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrderOnline = async () => {
    const response = await axios.post("/api/order/online", {
      userId: user.id,
      items: cartArray.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      addressId: selectedAddress.id,
    });
    if (response.status === 200) {
      const { orderId, razorpayOrderId } = response.data;
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded)
        return toast.error("Razorpay SDK failed to load. Check you network.");
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: getCartTotalAmount() * 100,
        currency: "INR",
        name: "GreenCart",
        description: "Test Transaction",
        image: assets.logo,
        order_id: razorpayOrderId,
        handler: async (paymentResponse) => {
          const response = await axios.post("/api/order/verify", {
            orderId,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpaySignature: paymentResponse.razorpay_signature,
          });
          if (response.status === 200) {
            navigate("/my-orders");
            fetchUserStatus();
            toast.success("Order placed successfully");
          } else toast.error("Payment verification failed! Please try again.");
        },
        prefill: {
          name: user.firstName + " " + user.lastName,
          email: user.email,
          contact: user.phone,
        },
        notes: {
          address: "GreenCart Corporate Office",
        },
        theme: {
          color: "#4fbf8b",
        },
        retry: false,
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async (res) => {
        await axios.delete("/api/order/" + orderId);
        toast.error(res.error.description, {
          duration: 6000,
          style: { maxWidth: "1000px" },
        });
      });
      rzp.open();
    }
  };

  const placeOrderCOD = async () => {
    const response = await axios.post("/api/order/cod", {
      userId: user.id,
      items: cartArray.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      addressId: selectedAddress.id,
    });
    if (response.status === 201) {
      navigate("/my-orders");
      fetchUserStatus();
      toast.success("Order placed successfully");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!user) return toast.error("Please login to proceed.");
      if (!cartArray.length)
        return toast.error("Cart is empty. Please add items.");
      if (!addresses.length)
        return toast.error("Please add a delivery address.");
      setLoading(true);
      if (paymentOption === "COD") {
        await placeOrderCOD();
      } else {
        await placeOrderOnline();
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, cartItems]);

  useEffect(() => {
    if (user) fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setShowAddress(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    // products.length > 0 &&
    cartItems && (
      <div className="flex flex-col lg:flex-row my-16">
        <div className="flex-1 max-w-4xl">
          <div className="flex flex-col items-end w-max mb-6">
            <p className="text-2xl font-medium uppercase">Shopping Cart</p>
            <div className="w-16 h-0.5 bg-primary rounded-full" />
          </div>

          {cartArray.length ? (
            <div>
              <div className="grid grid-cols-[2fr_1fr_1fr] not-sm:grid-cols-[4fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 gap-2">
                <p className="text-left">
                  Product Details{" | "}
                  <span className="text-sm text-primary">
                    {getCartCount()} {getCartCount() > 1 ? "Items" : "Item"}
                  </span>
                </p>
                <p className="text-center">Subtotal</p>
                <p className="text-center">Action</p>
              </div>
              {cartArray.map((product, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[2fr_1fr_1fr] not-sm:grid-cols-[4fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
                >
                  <div className="flex items-center md:gap-6 gap-3">
                    <div
                      className="cursor-pointer size-24 p-1 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
                      onClick={() =>
                        navigate(
                          `/products/${product.category.toLowerCase()}/${
                            product.id
                          }`
                        )
                      }
                    >
                      <img
                        className="max-w-full h-full object-contain"
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p
                        className="hiddn md:block font-semibold cursor-pointer "
                        onClick={() =>
                          navigate(
                            `/products/${product.category.toLowerCase()}/${
                              product.id
                            }`
                          )
                        }
                      >
                        {product.name}
                      </p>
                      <div className="font-normal text-gray-500/70">
                        <p className="hidden md:block">
                          Category: <span>{product.category || "N/A"}</span>
                        </p>
                        <div className="flex items-center">
                          <p>Qty:</p>
                          <select
                            onChange={(e) =>
                              updateCartItem(product.id, Number(e.target.value))
                            }
                            value={cartItems[product.id]}
                            className="outline-none cursor-pointer"
                          >
                            {Array(
                              cartItems[product.id] > 9
                                ? cartItems[product.id]
                                : 9
                            )
                              .fill("")
                              .map((_, index) => (
                                <option key={index} value={index + 1}>
                                  {index + 1}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center">
                    {currency}
                    {product.offerPrice * product.quantity}
                  </p>
                  <button
                    className="cursor-pointer mx-auto"
                    onClick={() => removeFromCart(product.id)}
                  >
                    <img
                      src={assets.remove_icon}
                      alt="remove"
                      className="inline-block w-6 h-6"
                      loading="lazy"
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[20vh]">
              <p className="w-full text-center text-gray-500 my-10">
                No items here. Discover products and fill your cart.
              </p>
            </div>
          )}

          <button
            className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
            onClick={() => navigate("/products")}
          >
            <img
              src={assets.arrow_right_icon_colored}
              alt="arrow"
              className="group-hover:-translate-x-1 transition"
              loading="lazy"
            />
            Continue Shopping
          </button>
        </div>

        <div className="md:max-w-[360px] w-full bg-gray-100/40 p-5 max-lg:mt-16 border border-gray-300/70 rounded-md">
          <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
          <hr className="border-gray-300 my-5" />

          <div className="mb-6">
            <p className="text-sm font-medium uppercase">Delivery Address</p>

            {selectedAddress ? (
              <div className="relative flex justify-between items-start mt-2">
                <p className="text-gray-500">
                  {`${selectedAddress.firstName} ${selectedAddress.lastName} - ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.zipcode}, ${selectedAddress.state},  ${selectedAddress.country}.`}
                  <br />
                  {`Phone No - ${selectedAddress.phone}`}
                </p>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddress((prev) => !prev);
                  }}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Change
                </div>
              </div>
            ) : (
              <div className="relative flex justify-between items-start mt-2">
                <p className="text-gray-500">No address found</p>
                <button
                  className="text-primary hover:underline cursor-pointer"
                  onClick={() => {
                    if (!user) toast.error("Please login to add address.");
                    else {
                      navigate("/add-address");
                      setShowAddress(false);
                    }
                  }}
                >
                  Add Address
                </button>
              </div>
            )}

            {showAddress && (
              <div
                ref={menuRef}
                className="relative flex justify-between items-start"
              >
                <div className="absolute top-2 bg-white border border-gray-300 text-sm w-full rounded max-h-80 overflow-auto">
                  {addresses.map((address, index) => (
                    <p
                      key={index}
                      onClick={() => {
                        setSelectedAddress(address);
                        setShowAddress(false);
                      }}
                      className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {`${address.firstName} ${address.lastName} - ${address.street}, ${address.city}, ${address.zipcode}, ${address.state},  ${address.country}.`}
                      <br />
                      {`Phone No - ${address.phone}`}
                    </p>
                  ))}
                  <p
                    onClick={() => {
                      if (!user) toast.error("Please login to add address.");
                      else {
                        navigate("/add-address");
                        setShowAddress(false);
                      }
                    }}
                    className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                  >
                    Add New Address
                  </p>
                </div>
              </div>
            )}

            <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

            <select
              className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
              onChange={(e) => setPaymentOption(e.target.value)}
            >
              <option value="COD">Cash On Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>

          <hr className="border-gray-300" />

          <div className="text-gray-500 mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Price</span>
              <span>
                {currency}
                {getCartTotalAmount()}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-green-600">Free</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (2%)</span>
              <span>
                {currency}
                {(getCartTotalAmount() * 2) / 100}
              </span>
            </p>
            <p className="flex justify-between text-lg font-medium mt-3">
              <span>Total Amount:</span>
              <span>
                {currency}
                {getCartTotalAmount() + (getCartTotalAmount() * 2) / 100}
              </span>
            </p>
          </div>

          <button
            className={`bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 mt-6 rounded-md flex items-center justify-center 
              ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
            {loading && (
              <span className="ml-2 inline-block size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
          </button>
        </div>
      </div>
    )
  );
};
