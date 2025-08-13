// App.jsx (Hero section mockup)
import { useState } from "react";
import "./App.css";

const sampleRecipes = [
  {
    title: "Garlic Butter Chicken with Rice",
    image: "https://images.unsplash.com/photo-1604908176997-5c6d94cfb63d",
    time: "30 min",
    servings: "2",
  },
  {
    title: "Veggie Stir Fry",
    image: "https://images.unsplash.com/photo-1512058564366-c9e3e046207b",
    time: "20 min",
    servings: "3",
  },
  {
    title: "Classic Spaghetti Bolognese",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
    time: "45 min",
    servings: "4",
  },
];
const [recipes, setRecipes] = useState(sampleRecipes);


function App() {
  // --- state hooks --- //
  const [meat, setMeat] = useState("");
  const [carb, setCarb] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [time, setTime] = useState("");
  const [cuisine, setCuisine] = useState("");

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const WORKER_URL = "https://plain-hat-398a.ayunanij.workers.dev/";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop";

async function getRecipes() {
  setError("");
  setLoading(true);
  try {
    // Adjust payload keys to what your Worker expects
    const payload = {
      meat,
      carb,
      vegetable,
      time,
      cuisine,
    };

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed: ${res.status}`);
    }

    const data = await res.json();

    // Normalize response into the shape our cards expect
    // Try common shapes: array or { recipes: [...] }
    const list = Array.isArray(data) ? data : data.recipes || [];

    const normalized = list.map((r) => ({
      title: r.title || r.name || "Untitled recipe",
      image: r.image || r.photo || r.thumbnail || FALLBACK_IMAGE,
      time: r.time || r.totalTime || r.readyIn || "—",
      servings: r.servings || r.yield || "—",
      url: r.url || r.link || "#",
    }));

    setRecipes(normalized);
  } catch (e) {
    console.error(e);
    setError(
      "Sorry—recipe generation failed. Please try again, and check Worker logs if it persists."
    );
  } finally {
    setLoading(false);
  }
}


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
            <button onClick={getRecipes} disabled={loading}>
              {loading ? "Generating…" : "Get Recipes"}
            </button>
          </div>
        </div>
      </section>

      {/* Recipe results placeholder */}
      {/* Recipe results */}
<section className="results">
  {error && (
    <p style={{ color: "#b91c1c", textAlign: "center", marginBottom: "1rem" }}>
      {error}
    </p>
  )}

  {loading && (
    <p style={{ textAlign: "center" }}>
      Cooking up ideas… 🍳
    </p>
  )}

  {!loading && recipes.length === 0 ? (
    <p style={{ textAlign: "center" }}>
      No recipes yet — start searching!
    </p>
  ) : (
    !loading && (
      <div className="cards-grid">
        {recipes.map((recipe, i) => (
          <div className="recipe-card" key={i}>
            <img src={recipe.image} alt={recipe.title} />
            <div className="recipe-content">
              <h3>{recipe.title}</h3>
              <div className="recipe-meta">
                <span>⏱ {recipe.time}</span>
                <span>🍽 {recipe.servings}</span>
              </div>
            </div>
            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={() => recipe.url !== "#" && window.open(recipe.url, "_blank")}
              >
                View Recipe
              </button>
              <button
                className="btn btn-outline"
                onClick={() => navigator.clipboard.writeText(recipe.title)}
                title="Copy title"
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  )}
</section>

    </div>
  );
}

export default App;
