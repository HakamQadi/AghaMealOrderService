import React, { useEffect, useState } from "react";
import { Style } from "./style";
import axios from "axios";
import Modal from "../../components/Modal/PopupModal";

export default function Meal() {
  const [meals, setMeals] = useState([]);
  const [isModalopen, setModalOpen] = useState(false);

  const [mealName, setMealName] = useState("");
  const [mealCategory, setMealCategory] = useState("");
  const [mealPrice, setMealPrice] = useState("");
  // const [mealImage, setMealImage] = useState("");
  const [mealImage, setMealImage] = useState(null); // State to hold the selected image file

  const fetchMealsData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/admin/meals");
      setMeals(response.data.meals);
    } catch (error) {
      // TODO Toast HERE!!!
      console.error("ERROR :: ", error);
    }
  };

  const closeFunction = () => {
    setModalOpen(false);
  };

  // const handleAddMeal = async () => {
  //   const newMeal = {
  //     meal: mealName,
  //     category: mealCategory,
  //     price: mealPrice,
  //     image: mealImage,
  //   };

  //   try {
  //     await axios.post("http://localhost:8080/upload", newMeal);
  //     // await axios.post("http://localhost:8080/admin/meals/add", newMeal);
  //     setModalOpen(false);
  //     fetchMealsData();
  //     // Reset states
  //     setMealName("");
  //     setMealCategory("");
  //     setMealPrice("");
  //     setMealImage("");
  //   } catch (error) {
  //     // Handle error here
  //     console.error("ERROR :: ", error);
  //   }
  // };

  const handleAddMeal = async () => {
    const formData = new FormData(); // Create a FormData object to append the meal data
    formData.append("meal", mealName);
    formData.append("category", mealCategory);
    formData.append("price", mealPrice);
    formData.append("image", mealImage); // Append the image file

    try {
      const response = await axios.post(
        "http://localhost:8080/admin/meals/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      fetchMealsData();
      // Reset states
      setMealName("");
      setMealCategory("");
      setMealPrice("");
      setMealImage(null);

      setModalOpen(false);
    } catch (error) {
      console.error("ERROR :: ", error.message);
    }
  };
  useEffect(() => {
    fetchMealsData();
  }, []);
  // }, [isModalopen]);
  // }, [fetchMealsData()]);

  return (
    <main className="contentContainer ">
      <section style={Style.container}>
        <div className="container">
          <div style={Style.headerContainer}>
            <h1 style={Style.headerText}>Meals</h1>
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
                <h1>Add New Meal</h1>
                <div style={Style.inputsContainer}>
                  <div style={Style.input}>
                    <p style={{ margin: 0 }}>Name</p>
                    {/* <input /> */}
                    <input
                      type="text"
                      value={mealName}
                      onChange={(e) => setMealName(e.target.value)}
                    />
                  </div>
                  <div style={Style.input}>
                    <p style={{ margin: 0 }}>Category</p>
                    <input
                      type="text"
                      value={mealCategory}
                      onChange={(e) => setMealCategory(e.target.value)}
                    />
                  </div>
                  <div style={Style.input}>
                    <p style={{ margin: 0 }}>Price</p>
                    <input
                      type="text"
                      value={mealPrice}
                      onChange={(e) => setMealPrice(e.target.value)}
                    />
                  </div>
                  <div style={Style.input}>
                    <p style={{ margin: 0 }}>Image</p>
                    <input
                      style={{
                        width: "50%",
                      }}
                      type="file"
                      onChange={(e) => setMealImage(e.target.files[0])} // Capture the selected image file
                    />
                    {/* <input
                      type="text"
                      value={mealImage}
                      onChange={(e) => setMealImage(e.target.value)}
                    /> */}
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
            <div style={Style.itemText}>Category</div>
            <div style={Style.itemText}>Price</div>
          </div>
          <div
            className="scroll-container"
            style={{ height: "80vh", overflowY: "scroll" }}
          >
            {meals.map((meal) => {
              return (
                <div style={Style.itemContainer} key={meal._id}>
                  <div style={Style.imageContainer}>
                    <img
                      src={`http://localhost:8080/images/${meal.image}`}
                      // src={"https://i.ibb.co/7kFJh4S/image.jpg"}
                      // src={meal.image}
                      alt="Meal"
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
