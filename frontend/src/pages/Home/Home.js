import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Style } from "./style";
import axios from "axios";
import { Colors } from "../../themes/Colors";

export default function Home() {
  const [mealsLength, setMealsLength] = useState([]);
  const [categoriesLength, setCategoriesLength] = useState([]);

  const fetchMealsData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/admin/meals");
      setMealsLength(response.data.length);
    } catch (error) {
      // TODO Toast HERE!!!
      console.error("ERROR :: ", error);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/admin/categories"
      );
      setCategoriesLength(response.data.length);
    } catch (error) {
      console.error("ERROR :: ", error);
    }
  };

  useEffect(() => {
    fetchMealsData();
    fetchCategoriesData();
  }, []);
  return (
    <main className="contentContainer">
      <section style={Style.container}>
        <div
          style={{
            // backgroundColor: "green",
            height: "50%",
            display: "flex",
            alignItems: "center",
            // justifyContent: "space-around",
            justifyContent: "center",
            // justifyItems:""
            // alignContent: "center",
            // marginTop: 100,
            gap: 300,
          }}
        >
          <div
            style={{
              backgroundColor: Colors.darkBlue,
              color: Colors.white,
              width: "20%",
              height: "50%",
              alignContent: "center",
              textAlign: "center",
              borderRadius: 20,
            }}
          >
            <h3>
              Meals Count{" "}
              <span style={{ color: Colors.yellow }}>{mealsLength}</span>
            </h3>
          </div>
          <div
            style={{
              backgroundColor: Colors.darkBlue,
              color: Colors.white,
              width: "20%",
              height: "50%",
              alignContent: "center",
              textAlign: "center",
              borderRadius: 20,
            }}
          >
            <h3>
              Categories Count{" "}
              <span style={{ color: Colors.yellow }}>{categoriesLength}</span>
            </h3>
          </div>
        </div>
      </section>
    </main>
  );
}
