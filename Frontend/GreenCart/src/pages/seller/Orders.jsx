import { useEffect, useState } from "react";
import { UseAppContext } from "../../context/UseAppContext";
// import { assets } from "../../assets/assets";

export const Orders = () => {
  const { currency, products, axios, toast } = UseAppContext();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchAddress = async (id) => {
    try {
      const response = await axios.get("/api/address/" + id);
      if (response.status === 200) return response.data;
    } catch (error) {
      if (error.status === 404) toast.error("Error while finding address!");
      toast.error(error);
    }
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/order/seller");
      if (response.status === 200) {
        const tempOrders = await Promise.all(
          response.data.map(async (order) => ({
            id: order.id,
            userId: order.userId,
            amount: order.amount,
            status: order.status,
            paymentType: order.paymentType,
            isPaid: order.isPaid,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            address: await fetchAddress(order.addressId),
            items: order.items.map((item) => ({
              id: item.id,
              quantity: item.quantity,
              product: products.find((p) => p.id == item.productId),
            })),
          }))
        );
        setOrders(tempOrders);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !loading ? (
    <div className="no-scrollbar flex-1 h-[90vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:px-10 md:py-7 p-5 space-y-6">
        <h2 className="text-lg font-medium">Orders</h2>
        {orders.length > 0 &&
          orders.map((order, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-lg border border-gray-200 shadow p-6 space-y-4"
            >
              {/* Header: Summary Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-900">Order ID:</span>{" "}
                    {order.id}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Date:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                {/* Payment Info */}
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-900">Payment:</span>{" "}
                    {order.paymentType}
                  </p>
                  <p
                    className={
                      order.isPaid
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </p>
                </div>
                {/* Total Amount */}
                <div className="text-lg font-bold text-primary">
                  {currency}
                  {order.amount}
                </div>
              </div>
              {/* Products List */}
              <div className="divide-y divide-gray-200 m-0">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 gap-2"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        {item.product.name}{" "}
                        <span className="text-primary">x {item.quantity}</span>
                      </h3>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {currency}
                      {item.product.offerPrice * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              {/* Address */}
              <div className="text-sm text-gray-700 pt-3 border-t border-gray-200">
                <p className="font-semibold text-gray-900 mb-1">
                  Shipping Address:
                </p>
                <p>
                  {order.address.firstName} {order.address.lastName},{" "}
                  <br className="block sm:hidden" />
                  {order.address.street}, {order.address.city},{" "}
                  {order.address.state} - {order.address.zipcode},{" "}
                  {order.address.country}. <br className="block sm:hidden" />
                  Phone: {order.address.phone}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  ) : (
    <div className="no-scrollbar flex-1 h-[90vh] overflow-y-scroll flex flex-col justify-between">
      <div className="min-h-screen w-full flex items-center justify-center">
        <span className="inline-block size-4 border-2 border-primary-dull border-t-transparent rounded-full animate-spin"></span>
      </div>
    </div>
  );
};
