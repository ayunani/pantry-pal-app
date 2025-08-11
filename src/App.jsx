import { useState } from "react";
import "./App.css";


function App() {
  const [meat, setMeat] = useState("");
  const [carb, setCarb] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [time, setTime] = useState("");
  const [cuisine, setCuisine] = useState("");

  const [recipes, setRecipes] = useState([]); // Stores recipe results
  const WORKER_URL = "https://plain-hat-398a.ayunanij.workers.dev/";
const handleSubmit = async (e) => {
  e.preventDefault();
  setRecipes([]); // clear old
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meat, carb, vegetable, time: Number(time || 60), cuisine
        // we'll add spice/maxIngredients/vegetarian later
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json(); // expects { recipes: [...] }
    if (Array.isArray(data.recipes)) {
      setRecipes(data.recipes);
    } else {
      throw new Error("Bad JSON shape from Worker");
    }
  } catch (err) {
    console.error(err);
    alert("Sorry—recipe generation failed. Check the Worker logs.");
  }
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
