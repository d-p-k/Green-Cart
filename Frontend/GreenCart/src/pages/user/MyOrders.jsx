import { useEffect, useState } from "react";
import { UseAppContext } from "../../context/UseAppContext";

export const MyOrders = () => {
  const { currency, user, products, axios, toast } = UseAppContext();
  const [myOrders, setMyOrders] = useState([]);

  const fetchMyOrders = async () => {
    try {
      const response = await axios.get("/api/order/user/" + user.id);
      if (response.status === 200) {
        const tempOrders = response.data.map((order) => ({
          id: order.id,
          userId: order.userId,
          amount: order.amount,
          addressId: order.addressId,
          status: order.status,
          paymentType: order.paymentType,
          isPaid: order.isPaid,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            product: products.find((p) => p.id == item.productId),
          })),
        }));
        setMyOrders(tempOrders);
      }
    } catch (error) {
      if (error.status === 404) toast.error("Error while finding user!");
      else toast.error();
    }
  };

  useEffect(() => {
    if (user) fetchMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <div className="mt-16 mb-20 w-full">
      <div className="flex flex-col items-end w-max mb-6">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full" />
      </div>
      {myOrders.length ? (
        myOrders.map((order, index) => (
          <div
            key={index}
            className="w-full bg-white shadow rounded-xl overflow-hidden mb-10 border border-gray-200 transition-shadow duration-300"
          >
            <div className="bg-primary/10 px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">Order ID:</span>{" "}
                  {order.id}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">Payment:</span>{" "}
                  {order.paymentType}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Total (With Tax):
                  </span>{" "}
                  <span className="text-primary font-semibold">
                    {currency}
                    {order.amount}
                  </span>
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="divide-y divide-gray-200">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-6"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4 md:w-1/2">
                    <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="size-16 object-cover rounded-md"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.product.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Category: {item.product.category}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Status */}
                  <div className="flex flex-col text-sm text-gray-600 md:w-1/3">
                    <p>
                      <span className="font-medium text-gray-700">
                        Quantity:
                      </span>{" "}
                      {item.quantity}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Status:</span>{" "}
                      {order.status}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-primary font-bold text-lg md:w-15">
                    {currency}
                    {item.product.offerPrice * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-[25vh]">
          <p className="w-full text-center text-gray-500 my-10">
            No items here. Discover products and order now.
          </p>
        </div>
      )}
    </div>
  );
};
