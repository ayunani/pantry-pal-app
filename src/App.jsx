import { useState } from "react";
import "./App.css?v=3";

function App() {
  const [meat, setMeat] = useState("");
  const [carb, setCarb] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [time, setTime] = useState("45");
  const [cuisine, setCuisine] = useState("");

  const [recipes, setRecipes] = useState([]);  // <-- single source of truth
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const WORKER_URL = "https://plain-hat-398a.ayunanij.workers.dev/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRecipes([]);
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meat,
          carb,
          vegetable,
          time: Number(time || 60),
          cuisine
        })
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
    <div className="app">
      <header className="app-header">
        <h1 className="brand">Pantry Pal</h1>
        <p className="sub">Turn what you have into dinner ideas</p>
</header>


      <form className="filters" onSubmit={handleSubmit}>
        <div className="field">
          <label>Meat</label>
          <input value={meat} onChange={(e) => setMeat(e.target.value)} placeholder="chicken, beef, none…" />
        </div>

        <div className="field">
          <label>Carb</label>
          <input value={carb} onChange={(e) => setCarb(e.target.value)} placeholder="rice, pasta, bread…" />
        </div>

        <div className="field">
          <label>Vegetable</label>
          <input value={vegetable} onChange={(e) => setVegetable(e.target.value)} placeholder="broccoli, spinach…" />
        </div>

        <div className="field">
          <label className="range-label">
            Time: <strong>{time}</strong> min
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
          <div className="range-hints">
            <span>Quick Meal</span>
            <span>Slow Cook</span>
          </div>
        </div>

        <div className="field">
          <label>Cuisine</label>
          <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="asian, italian, any…" />
        </div>

        <button type="submit" className="primary">Get Recipes</button>
      </form>

      {loading && <p className="info">Generating recipes…</p>}
      {error && <p className="error">{error}</p>}

      {recipes.length > 0 && (
        <section className="recipes-wrap">
          <h2 className="section-title">Recipes</h2>
          <div className="recipes-grid" id="recipes">
            {recipes.map((r, i) => (
              <article className="recipe-card" key={i}>
                <header className="recipe-header">
                  <h3 className="recipe-title">{r.title}</h3>
                  <span className="recipe-time">{r.time} min</span>
                </header>

                {r.summary && <p className="recipe-summary">{r.summary}</p>}

                {Array.isArray(r.ingredients) && r.ingredients.length > 0 && (
                  <details className="recipe-details" open>
                    <summary>Ingredients</summary>
                    <ul className="recipe-list">
                      {r.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
                    </ul>
                  </details>
                )}

                {Array.isArray(r.steps) && r.steps.length > 0 && (
                  <details className="recipe-details">
                    <summary>Steps</summary>
                    <ol className="recipe-steps">
                      {r.steps.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ol>
                  </details>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
