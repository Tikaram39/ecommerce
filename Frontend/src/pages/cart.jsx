import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { fetchCart, removeFromCart, updateCartItem } from "../redux/slices/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.13);
  const total = subtotal + shipping + tax - (cart?.discountAmount || 0);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started!</p>
        <Link
          to="/shop"
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full hover:shadow-lg transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Shopping Cart ({items.length} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <Link to={`/product/${item.product._id}`}>
                <img
                  src={item.product.images?.[0]?.url}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product._id}`}>
                  <h3 className="font-semibold text-gray-800 dark:text-white hover:text-purple-600 truncate">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500">{item.product.brand}</p>
                <p className="text-purple-600 font-bold mt-1">Rs. {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(updateCartItem({ productId: item.product._id, quantity: item.quantity - 1 }))}
                  className="p-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <MinusIcon className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => dispatch(updateCartItem({ productId: item.product._id, quantity: item.quantity + 1 }))}
                  className="p-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => dispatch(removeFromCart(item.product._id))}
                  className="mt-1 text-red-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm h-fit sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-500 font-medium">Free</span> : `Rs. ${shipping}`}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>VAT (13%)</span>
              <span>Rs. {tax.toLocaleString()}</span>
            </div>
            {cart?.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-Rs. {cart.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Proceed to Checkout
          </button>
          <Link to="/shop" className="block text-center mt-3 text-sm text-purple-600 hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
