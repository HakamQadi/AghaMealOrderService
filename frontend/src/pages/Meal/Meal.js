import React, { useEffect, useState } from "react";
import { Style } from "./style";
import axios from "axios";

export default function Meal() {
  const [meals, setMeals] = useState([]);
  const fetchMealsData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/admin/meals");
      setMeals(response.data.meals);
    } catch (error) {
      console.error("ERROR :: ", error);
    }
  };

  useEffect(() => {
    fetchMealsData();
  }, [fetchMealsData()]);

  return (
    <main className="contentContainer ">
      <section style={Style.container}>
        <div className="container">
          <h1 style={Style.headerText}>Meals</h1>
          <div style={Style.tabelHeader}>
            <div style={Style.itemText}>Image</div>
            <div style={Style.itemText}>Name</div>
            <div style={Style.itemText}>Category</div>
            <div style={Style.itemText}>Price</div>
          </div>
          <div
            className="scroll-container"
            style={{ height: "400px", overflowY: "scroll" }}
          >
            {meals.map((meal) => {
              return (
                <div style={Style.itemContainer} key={meal._id}>
                  <div style={Style.imageContainer}>
                    <img
                      src={"https://i.ibb.co/7kFJh4S/image.jpg"}
                      // src={meal.image}
                      alt="Category"
                      style={Style.image}
                    />
                  </div>
                  <div style={Style.itemText}>{meal.meal}</div>
                  <div style={Style.itemText}>{meal.category.name}</div>
                  <div style={Style.priceText}>{meal.price} JOD</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
