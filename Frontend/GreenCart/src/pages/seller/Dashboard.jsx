import { useEffect, useState } from "react";
import { UseAppContext } from "../../context/UseAppContext";
import { assets } from "../../assets/assets";
import { CustomPieChart } from "../../components/CustomPieChart";
import { CustomBarChart } from "../../components/CustomBarChart";

export const Dashboard = () => {
  const { currency, axios, toast } = UseAppContext();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [salesByPayment, setSalesByPayment] = useState([]);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/seller/stats");
      if (response.status === 200) {
        setTotalUsers(response.data.totalUsers);
        setTotalProducts(response.data.totalProducts);
        setTotalOrders(response.data.totalOrders);
        setTotalSales(response.data.totalSales);
        setSalesByCategory(response.data.categorySalesResponses);
        setSalesByPayment(response.data.paymentSalesResponses);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[90vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:px-10 md:py-7 p-5">
        <h2 className="text-lg font-medium">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-4">
          <div className="flex justify-between items-center py-7 px-9 rounded-lg border border-gray-200 shadow">
            <div>
              <h3 className="text-sm text-gray-500">Total Users</h3>
              <p className="text-2xl font-semibold mt-1">{totalUsers}</p>
            </div>
            <div className="rounded-full bg-primary/20 p-4">
              <img
                src={assets.total_users_icon}
                alt="add_icon"
                className="size-8"
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex justify-between items-center py-7 px-9 rounded-lg border border-gray-200 shadow">
            <div>
              <h3 className="text-sm text-gray-500">Total Products</h3>
              <p className="text-2xl font-semibold mt-1">{totalProducts}</p>
            </div>
            <div className="rounded-full bg-primary/20 p-4">
              <img
                src={assets.total_products_icon}
                alt="add_icon"
                className="size-8"
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex justify-between items-center py-7 px-9 rounded-lg border border-gray-200 shadow">
            <div>
              <h3 className="text-sm text-gray-500">Total Orders</h3>
              <p className="text-2xl font-semibold mt-1">{totalOrders}</p>
            </div>
            <div className="rounded-full bg-primary/20 p-4">
              <img
                src={assets.total_orders_icon}
                alt="add_icon"
                className="size-8"
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex justify-between items-center py-7 px-9 rounded-lg border border-gray-200 shadow">
            <div>
              <h3 className="text-sm text-gray-500">Total Sales</h3>
              <p className="text-2xl font-semibold mt-1">
                {currency} {totalSales ? totalSales.toLocaleString() : 0}
              </p>
            </div>
            <div className="rounded-full bg-primary/20 p-4">
              <img
                src={assets.total_sales_icon}
                alt="add_icon"
                className="size-8"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 mt-6 gap-6">
          <CustomPieChart data={salesByCategory} heading="Sales By Category" />
          <CustomBarChart
            data={salesByPayment}
            heading="Sales By Payment Type"
          />
        </div>
      </div>
    </div>
  );
};
