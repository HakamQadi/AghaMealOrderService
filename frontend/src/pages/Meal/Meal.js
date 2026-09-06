import { useEffect, useRef, useState } from "react"
import api from "../../services/api"
import Modal from "../../components/Modal/PopupModal"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Table from "../../components/ui/Table"
import { Plus, ImageIcon, Utensils, DollarSign, Tag, Globe } from "lucide-react"

export default function Meal() {
  const [meals, setMeals] = useState([])
  const [isModalopen, setModalOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const [mealNameEn, setMealNameEn] = useState("")
  const [mealNameAr, setMealNameAr] = useState("")
  const [mealCategoryId, setMealCategoryId] = useState("")
  const [mealPrice, setMealPrice] = useState("")
  const [mealImage, setMealImage] = useState(null)

  const fileInputRef = useRef(null)

  const fetchMealsData = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/admin/meals`)
      setMeals(response?.data?.meals)
    } catch (error) {
      console.error("ERROR :: ", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get(`/admin/categories`)
      setCategories(response.data.categories)
    } catch (error) {
      console.error("ERROR fetching categories:", error)
    }
  }

  const closeFunction = () => {
    setModalOpen(false)
    // Reset form
    setMealNameEn("")
    setMealNameAr("")
    setMealCategoryId("")
    setMealPrice("")
    setMealImage(null)
  }

  const handleAddMeal = async () => {
    const formData = new FormData()
    formData.append("name.en", mealNameEn)
    formData.append("name.ar", mealNameAr)
    formData.append("categoryId", mealCategoryId)
    formData.append("price", mealPrice)
    formData.append("image", mealImage)

    try {
      await api.post(`/admin/meals/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      closeFunction()
      fetchMealsData()
    } catch (error) {
      console.error("ERROR :: ", error.message)
    }
  }

  useEffect(() => {
    fetchMealsData()
    fetchCategories()
  }, [])

  return (
    <main className="bg-slate-900 min-h-screen">
      <section className="w-full max-w-7xl mx-auto">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3 hover:scale-105 transform transition-all duration-200">
              <div className="p-2 bg-slate-800 border border-cyan-500/30 rounded-lg">
                <Utensils className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-200 to-cyan-400 bg-clip-text text-transparent">
                Meals
              </h1>
            </div>
            <Button onClick={() => setModalOpen(true)} icon={Plus}>
              Add Meal
            </Button>
          </div>

          {/* Add Meal Modal */}
          {isModalopen && (
            <Modal onClose={closeFunction} size="lg">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3 mb-6">
                  <div className="p-1 bg-cyan-500/20 border border-cyan-500/30 rounded">
                    <Plus className="w-5 h-5 text-cyan-400" />
                  </div>
                  Add New Meal
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Name (English)"
                      value={mealNameEn}
                      onChange={(e) => setMealNameEn(e.target.value)}
                      placeholder="Enter meal name"
                      icon={Globe}
                      required
                    />

                    <Input
                      label="Name (Arabic)"
                      value={mealNameAr}
                      onChange={(e) => setMealNameAr(e.target.value)}
                      placeholder="أدخل اسم الوجبة"
                      icon={Globe}
                      dir="rtl"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={mealCategoryId}
                        onChange={(e) => setMealCategoryId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Price (JOD)"
                      type="number"
                      step="0.01"
                      value={mealPrice}
                      onChange={(e) => setMealPrice(e.target.value)}
                      placeholder="Enter price"
                      icon={DollarSign}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setMealImage(e.target.files[0])}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 transition-all duration-200"
                    />
                    {mealImage && (
                      <div className="relative pt-2">
                        <img
                          src={URL.createObjectURL(mealImage) || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl border border-slate-600/50"
                        />
                        <button
                          onClick={() => {
                            setMealImage(null)
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ""
                            }
                          }}
                          className="absolute top-4 right-2 p-2 rounded-full bg-red-600/90 text-white shadow-md hover:bg-red-700 hover:shadow-lg transform hover:scale-110 transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  <Button onClick={handleAddMeal} className="w-full" size="lg">
                    Add Meal
                  </Button>
                </div>
              </div>
            </Modal>
          )}

          {/* Meals Table */}
          <Table>
            <Table.Header>
              <div className="grid grid-cols-4 gap-4 font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>Image</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  <span>Name</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>Category</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Price</span>
                </div>
              </div>
            </Table.Header>

            <Table.Body>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
              ) : meals.length === 0 ? (
                <Table.EmptyState
                  icon={Utensils}
                  title="No meals found"
                  description="Add your first meal to get started"
                />
              ) : (
                meals.map((meal) => (
                  <Table.Row key={meal._id}>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="flex items-center">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-600/50 flex items-center justify-center border border-slate-500/30">
                          {meal?.image ? (
                            <img
                              src={meal.image || "/placeholder.svg"}
                              alt="Meal"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Utensils className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col justify-center">
                        <span className="text-slate-200 font-medium">{meal?.name?.en || "Unnamed Meal"}</span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-slate-300 truncate">{meal?.category?.name?.en || "No Category"}</span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-amber-400 font-bold">{meal.price} JOD</span>
                      </div>
                    </div>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </section>
    </main>
  )
}
