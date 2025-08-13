// App.jsx (Hero section mockup)
import { useState } from "react";
import "./App.css";

function App() {
  const [meat, setMeat] = useState("");
  const [carb, setCarb] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [time, setTime] = useState("");
  const [cuisine, setCuisine] = useState("");

  const [recipes, setRecipes] = useState([]);

  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🍳 Pantry Pal</h1>
          <p>Find delicious recipes using what’s already in your kitchen</p>
          <div className="search-card">
            <input
              type="text"
              placeholder="Protein (e.g., chicken)"
              value={meat}
              onChange={(e) => setMeat(e.target.value)}
            />
            <input
              type="text"
              placeholder="Carb (e.g., rice)"
              value={carb}
              onChange={(e) => setCarb(e.target.value)}
            />
            <input
              type="text"
              placeholder="Vegetable (e.g., broccoli)"
              value={vegetable}
              onChange={(e) => setVegetable(e.target.value)}
            />
            <input
              type="text"
              placeholder="Time available (e.g., 30 min)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <input
              type="text"
              placeholder="Cuisine (e.g., Italian)"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            />
            <button>Get Recipes</button>
          </div>
        </div>
      </section>

      {/* Recipe results placeholder */}
      <section className="results">
        {recipes.length === 0 ? (
          <p style={{ textAlign: "center" }}>No recipes yet — start searching!</p>
        ) : (
          recipes.map((r, i) => <div key={i}>{r.name}</div>)
        )}
      </section>
    </div>
  );
}

export default App;
