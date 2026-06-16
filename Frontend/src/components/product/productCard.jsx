import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HeartIcon, ShoppingCartIcon, StarIcon, EyeIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { addToCart } from "../../redux/slices/cartSlice";
import { toggleWishlist } from "../../redux/slices/productSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isWishlisted = user?.wishlist?.includes(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product._id));
  };

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-700 aspect-square">
          <img
            src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                -{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="px-2 py-0.5 bg-gray-800 text-white text-xs font-bold rounded-full">
                Out of Stock
              </span>
            )}
            {product.isTrending && (
              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                🔥 Trending
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition-all"
            >
              {isWishlisted ? (
                <HeartSolid className="w-4 h-4 text-red-500" />
              ) : (
                <HeartIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 hover:scale-110 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCartIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">
            {product.brand}
          </p>
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.ratings)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.numReviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Rs. {(product.discountPrice || product.price).toLocaleString()}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
