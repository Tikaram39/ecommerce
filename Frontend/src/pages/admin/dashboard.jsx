import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UsersIcon, ShoppingBagIcon, CubeIcon, BanknotesIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { fetchDashboardStats } from "../../redux/slices/orderSlice";
import AdminSidebar from "../../components/admin/Sidebar";

const COLORS = ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { dashboardStats, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full" /></div>;

  const { stats, monthlySales, orderStatusBreakdown, lowStockProducts, recentOrders } =
    dashboardStats || {};

  const chartData = monthlySales?.map((d) => ({
    name: MONTHS[d._id.month - 1],
    sales: d.sales,
    orders: d.orders,
  })) || [];

  const pieData = orderStatusBreakdown?.map((d) => ({
    name: d._id,
    value: d.count,
  })) || [];

  const statCards = [
    { label: "Total Revenue", value: `Rs. ${stats?.totalRevenue?.toLocaleString() || 0}`, icon: BanknotesIcon, color: "from-purple-500 to-indigo-500" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBagIcon, color: "from-blue-500 to-cyan-500" },
    { label: "Total Products", value: stats?.totalProducts || 0, icon: CubeIcon, color: "from-emerald-500 to-teal-500" },
    { label: "Total Users", value: stats?.totalUsers || 0, icon: UsersIcon, color: "from-orange-500 to-amber-500" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Area Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Monthly Sales Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={2} fill="url(#salesGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Order Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Low Stock Alerts</h2>
            </div>
            <div className="space-y-3">
              {lowStockProducts?.map((p) => (
                <div key={p._id} className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <img src={p.images?.[0]?.url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock === 0 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-2 text-gray-500 font-medium">User</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Amount</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {recentOrders?.map((order) => (
                    <tr key={order._id}>
                      <td className="py-3 text-gray-800 dark:text-white">{order.user?.name}</td>
                      <td className="py-3 font-medium text-gray-800 dark:text-white">Rs. {order.totalPrice?.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          order.orderStatus === "Delivered" ? "bg-green-100 text-green-600"
                          : order.orderStatus === "Pending" ? "bg-yellow-100 text-yellow-600"
                          : order.orderStatus === "Shipped" ? "bg-blue-100 text-blue-600"
                          : order.orderStatus === "Cancelled" ? "bg-red-100 text-red-600"
                          : "bg-purple-100 text-purple-600"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
