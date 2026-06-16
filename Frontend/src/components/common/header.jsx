import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCartIcon, UserIcon, SunIcon, MoonIcon,
  MagnifyingGlassIcon, HeartIcon, Bars3Icon, XMarkIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../../redux/slices/authSlice";

const CATEGORIES = [
  "Electronics", "Fashion", "Gadgets", "Home Appliances", "Accessories",
];

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDark, setDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { cart } = useSelector((s) => s.cart);
  const cartCount = cart?.items?.length || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleDark = () => {
    setDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      {/* ── Top Bar ── */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs py-1.5 text-center">
        🚀 Free shipping on orders above Rs. 1000! | Use code{" "}
        <span className="font-bold">SAVE10</span> for 10% off
      </div>

      {/* ── Main Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              ShopNow
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto hidden md:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="w-full pl-4 pr-12 py-2.5 border-2 border-purple-200 rounded-full focus:outline-none focus:border-purple-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3 ml-auto">
            <button onClick={toggleDark} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isDark ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-600" />}
            </button>

            {isAuthenticated && (
              <Link to="/wishlist" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
            )}

            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <ShoppingCartIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <img
                    src={user?.avatar?.url}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                  />
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-semibold text-sm dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <Link to="/profile" className="block px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg dark:text-gray-300">My Profile</Link>
                    <Link to="/my-orders" className="block px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg dark:text-gray-300">My Orders</Link>
                    {user?.role === "admin" && (
                      <Link to="/admin/dashboard" className="block px-3 py-2 text-sm text-purple-600 font-semibold hover:bg-purple-50 rounded-lg">Admin Panel</Link>
                    )}
                    <button
                      onClick={() => dispatch(logoutUser())}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
              >
                <UserIcon className="w-4 h-4" />
                Login
              </Link>
            )}

            <button className="md:hidden p-2" onClick={() => setMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category Nav */}
        <nav className="hidden md:flex items-center gap-6 pb-2 border-t border-gray-100 dark:border-gray-800 pt-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/shop?category=${cat}`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors whitespace-nowrap"
            >
              {cat}
            </Link>
          ))}
          <Link to="/shop" className="text-sm text-purple-600 font-semibold ml-auto">
            View All →
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSearch} className="mt-3 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-200 rounded-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </form>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/shop?category=${cat}`}
              className="block py-2 text-gray-600 dark:text-gray-400 border-b border-gray-50 dark:border-gray-800"
              onClick={() => setMenuOpen(false)}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
