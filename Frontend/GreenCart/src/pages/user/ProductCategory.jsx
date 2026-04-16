import { useParams } from "react-router-dom";
import { UseAppContext } from "../../context/UseAppContext";
import { categories } from "../../assets/assets";
import { ProductCard } from "../../components/ProductCard";
import { useEffect } from "react";

export const ProductCategory = () => {
  const { products } = UseAppContext();
  const { category } = useParams();

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const searchCategory = categories.find(
    (item) => item.text.toLowerCase() === category
  );

  const filteredProducts = products
    .filter((product) => product.category.toLowerCase() == category)
    .filter((product) => product.inStock);

  return (
    <div className="mt-16 mb-20 flex flex-col">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium uppercase">
            {searchCategory.text}
          </p>
          <div className="w-16 h-0.5 bg-primary rounded-full" />
        </div>
      )}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6 gap-5">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[25vh]">
          <p className="w-full text-center text-gray-500 my-10">
            Oops! The category you're looking for is unavailable.
          </p>
        </div>
      )}
    </div>
  );
};
