import { useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import toast from "react-hot-toast";
import axios from "axios";

// Context: Step-2
// creating AppContextProvide
export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  // setting up default base URL for axios
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
  // to send cookies with requests
  axios.defaults.withCredentials = true;

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");
  const [roleLoading, setRoleLoading] = useState(true);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
    if (role === "guest") {
      fetchUserStatus();
      fetchSellerStatus();
    }
  }, [role]);

  // fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/product/list");
      if (response.status === 200) setProducts(response.data);
    } catch (error) {
      toast.error(error);
    }
  };

  // fetch seller status
  const fetchSellerStatus = async () => {
    try {
      const response = await axios.get("/api/seller/is-authenticated");
      if (response.status === 200) setRole("seller");
    } catch (error) {
      console.error(error);
    }
  };

  // fetch user status
  const fetchUserStatus = async () => {
    try {
      setRoleLoading(true);
      const response1 = await axios.get("/api/user/is-authenticated");
      if (response1.status === 200) {
        const response2 = await axios.get("/api/user/profile");
        if (response2.status === 200) {
          setRole("user");
          setUser(response2.data);
          setCartItems(response2.data.cartItems);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRoleLoading(false);
    }
  };

  // add products to cart
  const addToCart = async (itemId) => {
    try {
      if (user) {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) cartData[itemId] += 1;
        else cartData[itemId] = 1;
        const response = await axios.put("/api/cart/modify", {
          userId: user.id,
          productId: itemId,
          quantity: cartData[itemId],
        });
        if (response.status === 200) {
          setCartItems(cartData);
          toast.success("Added to cart.");
        }
      } else {
        toast.error("Please login to add items to cart.");
      }
    } catch (error) {
      if (error.status === 404) toast.error("Error while finding user.");
      else toast.error(error);
    }
  };

  // update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    try {
      if (user) {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        const response = await axios.put("/api/cart/modify", {
          userId: user.id,
          productId: itemId,
          quantity: cartData[itemId],
        });
        if (response.status === 200) {
          setCartItems(cartData);
          toast.success("Cart updated.");
        }
      } else {
        toast.error("Please login to add items to cart.");
      }
    } catch (error) {
      if (error.status === 404) toast.error("Error while finding user.");
      else toast.error(error);
    }
  };

  // remove product from cart
  const removeFromCart = async (itemId) => {
    try {
      if (user) {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
          cartData[itemId] -= 1;
          if (cartData[itemId] === 0) delete cartData[itemId];
        }
        const response = await axios.put("/api/cart/modify", {
          userId: user.id,
          productId: itemId,
          quantity: cartData[itemId] ? cartData[itemId] : 0,
        });
        if (response.status === 200) {
          setCartItems(cartData);
          toast.success("Removed from cart.");
        }
      } else {
        toast.error("Please login to add items to cart.");
      }
    } catch (error) {
      if (error.status === 404) toast.error("Error while finding user.");
      else toast.error(error);
    }
  };

  // get cart items count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) totalCount += cartItems[item];
    return totalCount;
  };

  // get cart total amount
  const getCartTotalAmount = () => {
    let totalAmount = 0;
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        const itemInfo = products.find((product) => product.id == key);
        totalAmount += itemInfo.offerPrice * cartItems[key];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const value = {
    user,
    setUser,
    role,
    setRole,
    roleLoading,
    setRoleLoading,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartTotalAmount,
    axios,
    toast,
    fetchProducts,
    fetchUserStatus,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
