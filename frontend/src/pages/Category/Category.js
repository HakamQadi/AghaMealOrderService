import React, { useEffect, useState } from "react";
import axios from "axios";
import { Style } from "./style";

function Category() {
  const [categories, setCategories] = useState([]);
  const fetchCategoriesData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/admin/categories"
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("ERROR :: ", error);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData()]);

  return (
    <main className="contentContainer ">
      <section style={Style.container}>
        <div className="container">
          <h1 style={Style.headerText}>Categories</h1>
          <div style={Style.tabelHeader}>
            <div style={Style.itemText}>Image</div>
            <div style={Style.itemText}>Name</div>
          </div>
          <div
            className="scroll-container"
            style={{ height: "400px", overflowY: "scroll" }}
          >
            {categories.map((category) => {
              return (
                <div style={Style.itemContainer} key={category._id}>
                  <div style={Style.imageContainer}>
                    <img
                      src={"https://i.ibb.co/7kFJh4S/image.jpg"}
                      // src={category.image}
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
