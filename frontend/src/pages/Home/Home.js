import { useEffect, useState } from "react"
import api from "../../services/api"
import { Utensils, Tag, ShoppingBag, TrendingUp } from "lucide-react"
import StatCard from "../../components/ui/StatCard"

export default function Home() {
  const [mealsLength, setMealsLength] = useState(0)
  const [categoriesLength, setCategoriesLength] = useState(0)
  const [ordersLength, setOrdersLength] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchMealsData = async () => {
    try {
      const response = await api.get(`/admin/meals`)
      setMealsLength(response?.data?.count)
    } catch (error) {
      console.error("ERROR :: ", error.response || error.message)
    }
  }

  const fetchCategoriesData = async () => {
    try {
      const response = await api.get(`/admin/categories`)
      setCategoriesLength(response?.data?.count)
    } catch (error) {
      console.error("ERROR :: ", error.response || error.message)
    }
  }

  const fetchOrdersData = async () => {
    try {
      const response = await api.get(`/admin/orders`)
      setOrdersLength(response?.data?.count)
    } catch (error) {
      console.error("ERROR :: ", error.response || error.message)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchMealsData(), fetchCategoriesData(), fetchOrdersData()])
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <main className="bg-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Dashboard Overview</h1>
          </div>
          <p className="text-slate-300 text-center text-lg">Monitor your meals, categories, and orders at a glance</p>
        </div>

        {/* Stats Cards Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <StatCard
              title="Total Meals"
              value={mealsLength}
              description="Available meals in your system"
              icon={Utensils}
              color="emerald"
            />

            <StatCard
              title="Categories"
              value={categoriesLength}
              description="Organized meal categories"
              icon={Tag}
              color="cyan"
            />

            <StatCard
              title="Orders"
              value={ordersLength}
              description="Total customer orders"
              icon={ShoppingBag}
              color="amber"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <p className="text-slate-400 text-sm mb-1">Server Status</p>
              <p className="text-emerald-400 font-semibold">Online</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <p className="text-slate-400 text-sm mb-1">Last Updated</p>
              <p className="text-cyan-400 font-semibold">Just now</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <p className="text-slate-400 text-sm mb-1">Active Users</p>
              <p className="text-amber-400 font-semibold">1</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}