import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Modal from "../../components/Modal/PopupModal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import { Plus, ImageIcon, Tag, FileText } from "lucide-react";

function Category() {
  const [categories, setCategories] = useState([]);
  const [isModalopen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);

  const fileInputRef = useRef(null);

  const fetchCategoriesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/categories`
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("ERROR :: ", error);
    } finally {
      setLoading(false);
    }
  };

  const closeFunction = () => {
    setModalOpen(false);
    setEditingCategoryId(null);
    // Reset form
    setNameEn("");
    setNameAr("");
    setDescEn("");
    setDescAr("");
    setCategoryImage(null);
  };


  const handleAddCategory = async () => {
    const formData = new FormData();
    formData.append("name.en", nameEn);
    formData.append("name.ar", nameAr);
    formData.append("description.en", descEn);
    formData.append("description.ar", descAr);
    formData.append("image", categoryImage);

    try {
      if (editingCategoryId) {
        await axios.patch(
          `${process.env.REACT_APP_API_BASE_URL}/admin/categories/update/${editingCategoryId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/admin/categories/add`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      closeFunction();
      fetchCategoriesData();
    } catch (error) {
      console.error("ERROR :: ", error);
    }
  };

  const handleEditCategory = (category) => {
    setNameEn(category?.name?.en || "");
    setNameAr(category?.name?.ar || "");
    setDescEn(category?.description?.en || "");
    setDescAr(category?.description?.ar || "");
    setCategoryImage(null);
    setModalOpen(true);
    // Optionally, store ID to know which category to update later
    setEditingCategoryId(category._id);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/admin/categories/delete/${id}`
      );
      fetchCategoriesData();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  return (
    <main className="bg-slate-900 min-h-screen">
      <section className="w-full max-w-7xl mx-auto">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3 hover:scale-105 transform transition-all duration-200">
              <div className="p-2 bg-slate-800 border border-cyan-500/30 rounded-lg">
                <Tag className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-200 to-cyan-400 bg-clip-text text-transparent">
                Categories
              </h1>
            </div>
            <Button onClick={() => setModalOpen(true)} icon={Plus}>
              Add Category
            </Button>
          </div>

          {/* Add Category Modal */}
          {isModalopen && (
            <Modal onClose={closeFunction} size="lg">
              <div className="p-6">
                {/* Dynamic title and icon */}
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3 mb-6">
                  <div className="p-1 bg-cyan-500/20 border border-cyan-500/30 rounded">
                    {editingCategoryId ? (
                      <FileText className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <Plus className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                  {editingCategoryId ? "Edit Category" : "Add New Category"}
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Name (EN)"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="Enter category name"
                      icon={Tag}
                      required
                    />

                    <Input
                      label="Name (AR)"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder="أدخل اسم الفئة"
                      icon={Tag}
                      dir="rtl"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Description (EN)
                      </label>
                      <textarea
                        value={descEn}
                        onChange={(e) => setDescEn(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
                        placeholder="Enter category description"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Description (AR)
                      </label>
                      <textarea
                        value={descAr}
                        onChange={(e) => setDescAr(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
                        placeholder="أدخل وصف الفئة"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setCategoryImage(e.target.files[0])}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 transition-all duration-200"
                    />

                    {(categoryImage || editingCategoryId) && (
                      <div className="relative pt-2">
                        <img
                          src={
                            categoryImage
                              ? URL.createObjectURL(categoryImage)
                              : categories.find(
                                  (cat) => cat._id === editingCategoryId
                                )?.image || "/placeholder.svg"
                          }
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl border border-slate-600/50"
                        />
                        <button
                          onClick={() => {
                            setCategoryImage(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="absolute top-4 right-2 p-2 rounded-full bg-red-600/90 text-white shadow-md hover:bg-red-700 hover:shadow-lg transform hover:scale-110 transition-all duration-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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

                  <Button
                    onClick={handleAddCategory}
                    className="w-full"
                    size="lg"
                  >
                    {editingCategoryId ? "Update Category" : "Add Category"}
                  </Button>
                </div>
              </div>
            </Modal>
          )}

          {/* Categories Table */}
          <Table>
            <Table.Header>
              <div className="grid grid-cols-3 gap-4 font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>Image</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>Name</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>Actions</span>
                </div>
              </div>
            </Table.Header>

            <Table.Body>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
              ) : categories.length === 0 ? (
                <Table.EmptyState
                  icon={Tag}
                  title="No categories found"
                  description="Add your first category to get started"
                />
              ) : (
                categories.map((category) => (
                  <Table.Row key={category._id}>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-600/50 flex items-center justify-center border border-slate-500/30">
                          {category?.image ? (
                            <img
                              src={category.image || "/placeholder.svg"}
                              alt="Category"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-slate-200 font-medium truncate">
                          {category?.name?.en || "Unnamed Category"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleEditCategory(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Delete
                        </Button>
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
  );
}

export default Category;
