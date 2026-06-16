ecommerce-mern/
├── 📁 frontend/                          # React.js Application
│   ├── 📁 public/
│   │   ├── favicon.ico
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── 📁 src/
│   │   ├── 📁 assets/
│   │   │   ├── 📁 images/
│   │   │   └── 📁 icons/
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── StarRating.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── 📁 product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductFilter.jsx
│   │   │   │   ├── ProductReview.jsx
│   │   │   │   └── RelatedProducts.jsx
│   │   │   ├── 📁 cart/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   ├── CartSummary.jsx
│   │   │   │   └── CouponInput.jsx
│   │   │   ├── 📁 home/
│   │   │   │   ├── HeroBanner.jsx
│   │   │   │   ├── FeaturedProducts.jsx
│   │   │   │   ├── CategorySection.jsx
│   │   │   │   ├── FlashSale.jsx
│   │   │   │   ├── Testimonials.jsx
│   │   │   │   └── Newsletter.jsx
│   │   │   └── 📁 admin/
│   │   │       ├── Sidebar.jsx
│   │   │       ├── StatsCard.jsx
│   │   │       ├── SalesChart.jsx
│   │   │       └── RecentOrders.jsx
│   │   ├── 📁 pages/
│   │   │   ├── 📁 auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   ├── 📁 user/
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── Wishlist.jsx
│   │   │   │   └── Addresses.jsx
│   │   │   ├── 📁 admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── AddProduct.jsx
│   │   │   │   ├── EditProduct.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── Users.jsx
│   │   │   │   └── Analytics.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── NotFound.jsx
│   │   ├── 📁 redux/
│   │   │   ├── store.js
│   │   │   └── 📁 slices/
│   │   │       ├── authSlice.js
│   │   │       ├── productSlice.js
│   │   │       ├── cartSlice.js
│   │   │       ├── orderSlice.js
│   │   │       └── uiSlice.js
│   │   ├── 📁 hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   └── useDebounce.js
│   │   ├── 📁 services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   └── paymentService.js
│   │   ├── 📁 utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   ├── 📁 context/
│   │   │   └── ThemeContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── 📁 backend/                           # Node.js + Express API
│   ├── 📁 config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   ├── stripe.js
│   │   └── email.js
│   ├── 📁 models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   ├── Cart.js
│   │   ├── Coupon.js
│   │   └── Category.js
│   ├── 📁 controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── cartController.js
│   │   ├── userController.js
│   │   ├── reviewController.js
│   │   ├── couponController.js
│   │   └── adminController.js
│   ├── 📁 routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── userRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── couponRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── adminRoutes.js
│   ├── 📁 middleware/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   ├── upload.js
│   │   └── validate.js
│   ├── 📁 utils/
│   │   ├── sendEmail.js
│   │   ├── generateToken.js
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── pagination.js
│   ├── 📁 validators/
│   │   ├── authValidator.js
│   │   └── productValidator.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md







backend/
│
├── config/
│   └── db.js
│
├── controllers/
│
├── middleware/
│
├── models/
│
├── routes/
│
├── uploads/
│
├── .env
├── server.js
└── package.json