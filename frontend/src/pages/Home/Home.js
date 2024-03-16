import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <main className="contentContainer">
      <section
        style={{
          backgroundColor: "yellow",
          width: "80%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>Home1</div>
        <div>Home2</div>
        <div>Home3</div>
        <div>Home4</div>
        <div>Home5</div>
      </section>
    </main>
  );
}
