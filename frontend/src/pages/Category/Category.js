import React, { useEffect, useState } from "react";
import axios from "axios";
import { Style } from "./style";
import Modal from "../../components/Modal/PopupModal";

function Category() {
  const [categories, setCategories] = useState([]);
  const [isModalopen, setModalOpen] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  const fetchCategoriesData = async () => {
    try {
      const response = await axios.get(
        "https://aghamealorderservice.onrender.com/admin/categories"
        // "http://localhost:8080/admin/categories"
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("ERROR :: ", error);
    }
  };

  const closeFunction = () => {
    setModalOpen(false);
  };

  const handleAddMeal = async () => {
    const newCategory = {
      name: categoryName,
      image: categoryImage,
    };

    try {
      await axios.post(
        // "http://localhost:8080/admin/categories/add",
        "https://aghamealorderservice.onrender.com/admin/categories/add",
        newCategory
      );
      setModalOpen(false);
      fetchCategoriesData();

      // Reset states
      setCategoryName("");
      setCategoryImage("");
    } catch (error) {
      console.error("ERROR :: ", error);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [isModalopen]);

  return (
    <main className="contentContainer ">
      <section style={Style.container}>
        <div className="container">
          <div style={Style.headerContainer}>
            <h1 style={Style.headerText}>Categories</h1>
            <button
              onClick={() => setModalOpen(true)}
              className="navItem"
              href="#"
              style={Style.addButton}
            >
              <p style={{ margin: 0 }}>Add</p>
            </button>
          </div>
          {isModalopen && (
            <Modal onClose={closeFunction}>
              <div style={Style.modalContainer}>
                <h1>Add New Category</h1>
                <div style={Style.inputsContainer}>
                  <div style={Style.input}>
                    <p style={{ margin: 0 }}>Name</p>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </div>
                  <div style={Style.input}>
                    <p style={{ margin: 0 }}>Image</p>
                    {/* <input
                      style={{
                        width: "50%",
                      }}
                      type="file"
                    /> */}
                    <input
                      type="text"
                      value={categoryImage}
                      onChange={(e) => setCategoryImage(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddMeal}
                  className="navItem"
                  href="#"
                  style={Style.addButton}
                >
                  <p style={{ margin: 0 }}>Add</p>
                </button>
              </div>
            </Modal>
          )}
          <div style={Style.tabelHeader}>
            <div style={Style.itemText}>Image</div>
            <div style={Style.itemText}>Name</div>
          </div>
          <div
            className="scroll-container"
            style={{ height: "80vh", overflowY: "scroll" }}
          >
            {categories.map((category) => {
              return (
                <div style={Style.itemContainer} key={category._id}>
                  <div style={Style.imageContainer}>
                    <img
                      // src={"https://i.ibb.co/7kFJh4S/image.jpg"}
                      src={`https://aghamealorderservice.onrender.com/images/${category.image}`}
                      alt="Category"
                      style={Style.image}
                    />
                  </div>
                  <div style={Style.itemText}>{category.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Category;
