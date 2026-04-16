import { useEffect, useState } from "react";
import { UseAppContext } from "../../context/UseAppContext";
import { ProductCard } from "../../components/ProductCard";

export const Products = () => {
  const { products, searchQuery } = UseAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    scrollTo(0, 0);
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products
          .filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .filter((product) => product.inStock)
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className="mt-16 mb-20 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full" />
      </div>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 mt-6 gap-5">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[25vh]">
          <p className="w-full text-center text-gray-500 my-10">
            Oops! We couldn't find any matching products.
          </p>
        </div>
      )}
    </div>
  );
};
