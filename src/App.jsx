import { useState } from "react";
import "./App.css";


function App() {
  const [meat, setMeat] = useState("");
  const [carb, setCarb] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [time, setTime] = useState("");
  const [cuisine, setCuisine] = useState("");

  const [recipes, setRecipes] = useState([]); // Stores recipe results

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now: create fake recipes using inputs
    const sampleRecipes = [
      {
        title: `${cuisine} ${meat} with ${carb}`,
        description: `A tasty ${cuisine} dish made in ${time} minutes.`,
      },
      {
        title: `${vegetable} & ${meat} stir-fry`,
        description: `Quick and flavorful, ready in ${time} minutes.`,
      },
      {
        title: `${carb} and ${vegetable} salad`,
        description: `A light and fresh ${cuisine} recipe.`,
      },
    ];

    setRecipes(sampleRecipes);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Pantry Pal</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Meat: </label>
          <input value={meat} onChange={(e) => setMeat(e.target.value)} />
        </div>
        <div>
          <label>Carb: </label>
          <input value={carb} onChange={(e) => setCarb(e.target.value)} />
        </div>
        <div>
          <label>Vegetable: </label>
          <input
            value={vegetable}
            onChange={(e) => setVegetable(e.target.value)}
          />
        </div>
<div style={{ marginBottom: "15px" }}>
  <label>
    Time: {time} minutes
  </label>
  <input
    type="range"
    className="slider"
    min="20"
    max="120"
    step="5"
    value={time}
    onChange={(e) => setTime(e.target.value)}
  />
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: "0.9em",
      color: "#555",
      marginTop: "4px"
    }}
  >
    <span>Quick Meal</span>
    <span>Slow Cook</span>
  </div>
</div>


        <div>
          <label>Cuisine: </label>
          <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Get Recipes
        </button>
      </form>

      {recipes.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {recipes.map((recipe, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
