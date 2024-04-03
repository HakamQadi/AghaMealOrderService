import React from "react";
import { Style } from "./style";

export default function NavBar() {
  return (
    <div className="sidenav" style={Style.container}>
      <h1 style={Style.headerOneText}>Agha Meal</h1>
      <h2 style={Style.headerTwoText}>Dashboard</h2>
      <span style={Style.divider}></span>
      <a className="navItem" style={Style.navItem} href="/">
        Home
      </a>
      <a className="navItem" style={Style.navItem} href="/meal">
        Meal
      </a>
      <a className="navItem" href="/category" style={Style.navItem}>
        Category
      </a>
    </div>
  );
}
