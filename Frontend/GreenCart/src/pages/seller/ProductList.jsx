import { useState } from "react";
import { UseAppContext } from "../../context/UseAppContext";
import { assets } from "../../assets/assets";

export const ProductList = () => {
  const [loadingForDeletion, setLoadingForDeletion] = useState(false);
  const [loadingForModification, setLoadingForModification] = useState(false);
  const { products, fetchProducts, currency, axios, toast } = UseAppContext();
  const [isStockModificationModalOpen, setIsStockModificationModalOpen] =
    useState(false);
  const [isStockDeletionModalOpen, setIsStockDeletionModalOpen] =
    useState(false);
  const [id, setId] = useState(null);

  const handleModifyStock = async () => {
    try {
      setLoadingForModification(true);
      const response = await axios.put("/api/product/stock", {
        id,
        inStock: !products.find((p) => p.id === id).inStock,
      });
      if (response.status === 200) {
        setIsStockModificationModalOpen(false);
        fetchProducts();
        toast.success("Stock modified successfully.");
      }
    } catch (error) {
      if (error.status === 404) toast.error("Error while finding product");
      else toast.error(error);
    } finally {
      setLoadingForModification(false);
    }
  };

  const handleDeleteStock = async () => {
    try {
      setLoadingForDeletion(true);
      const response = await axios.post(`/api/product/${id}`);
      if (response.status === 200) {
        setIsStockDeletionModalOpen(false);
        fetchProducts();
        toast.success("Stock deleted successfully.");
      }
    } catch (error) {
      if (error.status === 404) toast.error("Error while finding product");
      else toast.error(error);
    } finally {
      setLoadingForDeletion(false);
    }
  };

  return (
    <div
      className="no-scrollbar flex-1 h-[90vh] overflow-y-scroll flex flex-col justify-between"
      onClick={() => {
        setIsStockDeletionModalOpen(loadingForDeletion);
        setIsStockModificationModalOpen(loadingForModification);
        setId(null);
      }}
    >
      <div className="w-full md:px-10 md:py-7 p-5">
        <h2 className="text-lg font-medium">Product List</h2>
        <div className="overflow-x-auto mt-5">
          <div className="flex flex-col items-start w-full min-w-max rounded-md bg-white border border-gray-500/20">
            <table className="table-auto w-full min-w-[600px]">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Selling Price</th>
                  <th className="px-4 py-3 font-semibold">In Stock</th>
                  <th className="px-4 py-3 font-semibold">Remove</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-gray-500/20 whitespace-nowrap"
                  >
                    <td className="px-4 py-3 flex items-center gap-5">
                      <img
                        src={product.images[0]}
                        alt="Product"
                        className="size-18 object-cover border border-gray-300 rounded p-2"
                        loading="lazy"
                      />
                      <span>{product.name}</span>
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">
                      {currency}
                      {product.offerPrice}
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={product.inStock}
                          onChange={(e) => {
                            e.stopPropagation();
                            setId(product.id);
                            setIsStockModificationModalOpen(true);
                          }}
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-primary transition-colors duration-200"></div>
                        <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                        <button
                          className="cursor-pointer mx-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setId(product.id);
                            setIsStockDeletionModalOpen(true);
                          }}
                        >
                          <img
                            src={assets.remove_icon}
                            alt="remove_icon"
                            className="size-6"
                            loading="lazy"
                          />
                        </button>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* model for stock modification */}
      {isStockModificationModalOpen && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-center text-sm text-gray-600 bg-black/50">
          <div
            className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center bg-primary/20 rounded-full">
              <img
                src={assets.change_icon}
                alt="change"
                className="size-20"
                loading="lazy"
              />
            </div>
            <h2 className="text-gray-900 font-semibold mt-4 text-xl">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Do you really want to modify this stock?
            </p>
            <div className="flex items-center justify-center gap-4 mt-5 w-full">
              <button
                type="button"
                className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
                onClick={() => setIsStockModificationModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`w-full md:w-36 h-10 rounded-md text-white bg-primary font-medium text-sm hover:bg-primary-dull active:scale-95 transition flex items-center justify-center ${
                  loadingForModification
                    ? "cursor-not-allowed bg-primary-dull"
                    : "cursor-pointer"
                }`}
                onClick={handleModifyStock}
                disabled={loadingForModification}
              >
                Modify
                {loadingForModification && (
                  <span className="ml-2 inline-block size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* model for stock deletion */}
      {isStockDeletionModalOpen && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-center text-sm text-gray-600 bg-black/50">
          <div
            className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center p-6 bg-red-100 rounded-full">
              <img
                src={assets.delete_trash_icon}
                alt="delete_trash_icon"
                className="size-8"
                loading="lazy"
              />
            </div>
            <h2 className="text-gray-900 font-semibold mt-4 text-xl">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Do you really want to delete this stock?
            </p>
            <div className="flex items-center justify-center gap-4 mt-5 w-full">
              <button
                type="button"
                className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
                onClick={() => setIsStockDeletionModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition flex items-center justify-center ${
                  loadingForDeletion
                    ? "cursor-not-allowed bg-red-700"
                    : "cursor-pointer"
                }`}
                onClick={handleDeleteStock}
                disabled={loadingForDeletion}
              >
                Delete
                {loadingForDeletion && (
                  <span className="ml-2 inline-block size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
