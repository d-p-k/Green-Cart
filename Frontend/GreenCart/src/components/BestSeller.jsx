import { UseAppContext } from "../context/UseAppContext";
import { ProductCard } from "./ProductCard";

export const BestSeller = () => {
  const { products } = UseAppContext();

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 mt-6 gap-5">
        {/* {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))} */}

        {/* here I've passed random ids so that I can show product of each category */}
        {/* but make sure these ids present in products array */}
        {/* if you don't want to pass random ids, you can uncomment above code as well */}

        <ProductCard product={products[9]} />
        <ProductCard product={products[16]} />
        <ProductCard product={products[24]} />
        <ProductCard product={products[50]} />
        <ProductCard product={products[60]} />
      </div>
    </div>
  );
};
