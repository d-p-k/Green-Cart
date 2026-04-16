import { useState } from "react";
import { assets, categories } from "../../assets/assets";
import { UseAppContext } from "../../context/UseAppContext";

export const AddProduct = () => {
  const { fetchProducts, axios, toast } = UseAppContext();
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Bakery & Bread");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const handleImageChange = (e) => {
    const validImageExtensions = [
      "image/jpeg",
      "image/png",
      "image/png",
      "image/webp",
    ];
    const selectedFiles = Array.from(e.target.files);
    const invalidFiles = selectedFiles.filter(
      (file) => !validImageExtensions.includes(file.type)
    );
    if (invalidFiles.length > 0)
      return toast.error(
        "Only image files (jpg, jpeg, png, webp) are allowed.",
        { style: { maxWidth: "1000px" } }
      );
    if (selectedFiles.length + files.length > 4)
      return toast.error("You can only upload up to 4 images.");
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (files.length < 1)
        return toast.error("Please upload at least one image.");
      setLoading(true);
      const productDataJson = {
        name,
        description: description.split("\n"),
        category,
        price,
        offerPrice,
      };
      const formData = new FormData();
      formData.append("productDataJson", JSON.stringify(productDataJson));
      files.forEach((file) => formData.append("images", file));
      const response = await axios.post("/api/product/add", formData);
      if (response.status === 201) {
        toast.success("Product added successfully.");
        fetchProducts();
        setFiles([]);
        setName("");
        setDescription("");
        setCategory("Bakery & Bread");
        setPrice("");
        setOfferPrice("");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[90vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:px-10 md:py-7 p-5">
        <h2 className="text-lg font-medium">Add Product</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-6 max-w-2xl">
          {/* Product Images */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <p>Product Images</p>
              <span className="group relative cursor-pointer">
                <img
                  src={assets.info_icon}
                  alt="info"
                  className="size-5"
                  loading="lazy"
                />
                <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#EDF8F3] px-3 py-2 text-sm text-primary opacity-0 transition-opacity group-active:opacity-100 md:group-hover:opacity-100">
                  You can only upload up to 4 images.
                </span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {files.length > 0 ? (
                <div>
                  <div className="flex justify-center items-center gap-5">
                    {files.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Image ${index + 1}`}
                        className="size-22 object-cover border-2 border-dashed border-gray-300 rounded cursor-pointer"
                        loading="lazy"
                      />
                    ))}
                  </div>
                  <div
                    className="text-sm cursor-pointer flex items-center text-gray-500 gap-2 mt-4"
                    onClick={() => setFiles([])}
                  >
                    <img
                      src={assets.cross_icon}
                      alt="cross_icon"
                      className="size-3"
                      loading="lazy"
                    />
                    <span>Clear All</span>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="images"
                  className="border-2 border-dashed border-gray-300 rounded w-full cursor-pointer flex justify-center items-center"
                >
                  <input
                    type="file"
                    id="images"
                    multiple
                    hidden
                    onChange={handleImageChange}
                  />
                  <img
                    src={assets.upload_area}
                    alt="upload"
                    className="size-22 object-cover"
                    loading="lazy"
                  />
                </label>
              )}
            </div>
          </div>
          {/* Product Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="product-name">Product Name</label>
            <input
              id="product-name"
              type="text"
              placeholder="e.g. Banana"
              className="border border-gray-300 rounded p-2 outline-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {/* Product Description */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <label
                htmlFor="product-description"
                className="flex items-center gap-1"
              >
                Product Description
              </label>
              <span className="group relative cursor-pointer">
                <img
                  src={assets.info_icon}
                  alt="info"
                  className="size-5"
                  loading="lazy"
                />
                <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#EDF8F3] px-3 py-2 text-sm text-primary opacity-0 transition-opacity group-active:opacity-100 md:group-hover:opacity-100">
                  Write one sentence per line using enter key.
                </span>
              </span>
            </div>
            <textarea
              id="product-description"
              rows={4}
              className="border border-gray-300 rounded p-2 outline-primary resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                "e.g.\nFresh and organic apples.\nRich in fiber and vitamins.\nPerfect for snacks and desserts."
              }
              required
            ></textarea>
          </div>
          {/* Category */}
          <div className="flex flex-col gap-1">
            <label htmlFor="category">Category</label>
            <div className="flex flex-wrap gap-3">
              {categories.map((item, index) => {
                const isSelected = category === item.text;
                return (
                  <button
                    type="button"
                    key={index}
                    className={`px-4 py-1 rounded-full text-sm border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setCategory(isSelected ? "" : item.text);
                    }}
                  >
                    {item.text}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Price & Offer Price */}
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="product-price">Product Price</label>
              <input
                id="product-price"
                type="number"
                placeholder="0"
                className="border border-gray-300 rounded p-2 outline-primary"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="offer-price">Offer Price</label>
              <input
                id="offer-price"
                type="number"
                placeholder="0"
                className="border border-gray-300 rounded p-2 outline-primary"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                required
              />
            </div>
          </div>
          {/* Submit Button */}
          <button
            className={`bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md flex items-center justify-center 
              ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            disabled={loading}
          >
            ADD
            {loading && (
              <span className="ml-2 inline-block size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
