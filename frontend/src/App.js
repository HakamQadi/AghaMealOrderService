import { Routes, Route } from "react-router-dom";
import "./App.css";
import Category from "./pages/Category/Category";
import NavBar from "./components/NavBar/NavBar";
import Meal from "./pages/Meal/Meal";
import Home from "./pages/Home/Home";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="meal" element={<Meal />} />
        <Route path="category" element={<Category />} />
      </Routes>
    </>
  );
}

export default App;
