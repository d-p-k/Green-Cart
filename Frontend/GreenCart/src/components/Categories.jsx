import { useNavigate } from "react-router-dom";
import { categories } from "../assets/assets";

export const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Categories</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-5">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-between items-center"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => navigate(`/products/${category.text.toLowerCase()}`)}
          >
            <div className="flex justify-center items-center size-full">
              <img
                src={category.image}
                alt={category.text}
                className="group-hover:scale-108 transition max-h-28"
                loading="lazy"
              />
            </div>
            <p className="text-sm font-medium text-center">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
