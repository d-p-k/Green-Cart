import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { AppLayout } from "./layout/AppLayout";
import { Home } from "./pages/user/Home";
import { Products } from "./pages/user/Products";
import { ProductCategory } from "./pages/user/ProductCategory";
import { ProductDetails } from "./pages/user/ProductDetails";
import { Cart } from "./pages/user/Cart";
import { AddAddress } from "./pages/user/AddAddress";
import { MyOrders } from "./pages/user/MyOrders";
import { SellerLogin } from "./pages/seller/SellerLogin";
import { SellerLayout } from "./layout/SellerLayout";
import { AddProduct } from "./pages/seller/AddProduct";
import { ProductList } from "./pages/seller/ProductList";
import { Orders } from "./pages/seller/Orders";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/seller/Dashboard";
import { Contact } from "./pages/user/Contact";

export const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute allowedRoles={["guest", "user"]}>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "products",
          element: (
            <ProtectedRoute allowedRoles={["guest", "user"]}>
              <Products />
            </ProtectedRoute>
          ),
        },
        {
          path: "products/:category",
          element: (
            <ProtectedRoute allowedRoles={["guest", "user"]}>
              <ProductCategory />
            </ProtectedRoute>
          ),
        },
        {
          path: "products/:category/:id",
          element: (
            <ProtectedRoute allowedRoles={["guest", "user"]}>
              <ProductDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute allowedRoles={["guest", "user"]}>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: "contact",
          element: (
            <ProtectedRoute allowedRoles={["guest", "user"]}>
              <Contact />
            </ProtectedRoute>
          ),
        },
        {
          path: "add-address",
          element: (
            <ProtectedRoute allowedRoles={["user"]}>
              <AddAddress />
            </ProtectedRoute>
          ),
        },
        {
          path: "my-orders",
          element: (
            <ProtectedRoute allowedRoles={["user"]}>
              <MyOrders />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/seller",
      element: (
        <ProtectedRoute allowedRoles={["guest"]}>
          <SellerLogin />
        </ProtectedRoute>
      ),
    },
    {
      path: "/seller",
      element: <SellerLayout />,
      children: [
        {
          path: "dashboard",
          element: (
            <ProtectedRoute allowedRoles={["seller"]}>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "add-product",
          element: (
            <ProtectedRoute allowedRoles={["seller"]}>
              <AddProduct />
            </ProtectedRoute>
          ),
        },
        {
          path: "product-list",
          element: (
            <ProtectedRoute allowedRoles={["seller"]}>
              <ProductList />
            </ProtectedRoute>
          ),
        },
        {
          path: "orders",
          element: (
            <ProtectedRoute allowedRoles={["seller"]}>
              <Orders />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
