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
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** This const shows the jscript code of what happens when a user clicks on the Get Recipe button */
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setRecipes([]);
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meat, carb, vegetable, time: Number(time || 60), cuisine })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json(); // { recipes: [...] }
    if (!Array.isArray(data.recipes)) throw new Error("Bad JSON shape");
    setRecipes(data.recipes);
  } catch (err) {
    console.error(err);
    setError("Recipe generation failed. Check the Worker logs.");
  } finally {
    setLoading(false);
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

      {loading && <p>Generating recipes…</p>}
{error && <p style={{ color: "crimson" }}>{error}</p>}

{recipes.length > 0 && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      marginTop: "20px",
    }}
  >
    {recipes.map((r, i) => (
      <div key={i} style={{ border: "1px solid #ddd", padding: 16, borderRadius: 10 }}>
        <h3 style={{ marginTop: 0 }}>{r.title}</h3>
        <p style={{ margin: "6px 0", color: "#555" }}>{r.summary}</p>
        <p style={{ fontSize: 14, margin: "6px 0" }}><strong>Time:</strong> {r.time} min</p>
        <div style={{ marginTop: 10 }}>
          <strong>Ingredients</strong>
          <ul style={{ paddingLeft: 18, marginTop: 6 }}>
            {r.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
          </ul>
        </div>
        <div style={{ marginTop: 10 }}>
          <strong>Steps</strong>
          <ol style={{ paddingLeft: 18, marginTop: 6 }}>
            {r.steps.map((s, idx) => <li key={idx}>{s}</li>)}
          </ol>
        </div>
      </div>
    ))}
  </div>
)}

    </div>
  );
}

export default App;
