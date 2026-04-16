import { useEffect, useState } from "react";
import { UseAppContext } from "../../context/UseAppContext";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import { ProductCard } from "../../components/ProductCard";

export const ProductDetails = () => {
  const navigate = useNavigate();
  const { user, products, addToCart, currency, toast } = UseAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item.id == id);

  useEffect(() => {
    scrollTo(0, 0);
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy
        .filter(
          (item) =>
            product?.category === item.category && product?.id !== item.id
        )
        .filter((item) => item.inStock);
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [product, products]);

  useEffect(() => {
    setThumbnail(product?.images[0]);
  }, [product]);

  return (
    product && (
      <div className="mt-16 mb-20">
        <div className="flex flex-wrap items-center text-gray-500 font-medium gap-2 not-sm:text-sm not-sm:gap-1">
          <NavLink to="/">
            <img src={assets.home_icon} alt="home_icon" loading="lazy" />
          </NavLink>
          <img
            src={assets.arrow_right}
            alt="arrow_right"
            className="size-4"
            loading="lazy"
          />
          <NavLink to="/products">Products</NavLink>
          <img
            src={assets.arrow_right}
            alt="arrow_right"
            className="size-4"
            loading="lazy"
          />
          <NavLink to={`/products/${product.category.toLowerCase()}`}>
            {product.category}
          </NavLink>
          <img
            src={assets.arrow_right}
            alt="arrow_right"
            className="size-4"
            loading="lazy"
          />
          <span className="text-primary"> {product.name}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 mt-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border size-15 sm:size-20 border-gray-500/30 rounded cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="size-full object-contain rounded"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="border border-gray-500/30 w-full h-auto aspect-square rounded">
              <img
                src={thumbnail}
                alt="thumbnail"
                className="size-full object-contain rounded"
                loading="lazy"
              />
            </div>
          </div>
          <div className="text-sm w-full">
            <h1 className="text-3xl font-medium">{product.name}</h1>
            <div className="flex items-center gap-0.5 mt-1">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={i}
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt="star"
                    className="md:w-3.5 w-3"
                    loading="lazy"
                  />
                ))}
              <p className="text-base ml-2">(4)</p>
            </div>
            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: {currency}
                {product.price}
              </p>
              <p className="text-2xl font-medium">
                MRP: {currency}
                {product.offerPrice}
              </p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>
            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
            <div className="flex items-center mt-10 gap-4 text-base">
              <button
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                onClick={() => addToCart(product.id)}
              >
                Add to Cart
              </button>
              <button
                className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
                onClick={() => {
                  if (user) {
                    addToCart(product.id);
                    navigate("/cart");
                  } else {
                    toast.error("Please login to buy products.");
                  }
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
        {/* ----------- related products ----------- */}
        <div className="flex flex-col items-center mt-20">
          <div className="flex flex-col items-end w-max">
            <p className="text-2xl font-medium uppercase">Related Products</p>
            <div className="w-16 h-0.5 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 my-12 gap-5 w-full">
            {relatedProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button
            className="mx-auto cursor-pointer px-12 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
            onClick={() => navigate("/products")}
          >
            See More
          </button>
        </div>
      </div>
    )
  );
};
