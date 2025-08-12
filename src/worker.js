/**
 * Pantry Pal — Cloudflare Worker
 * Uses Cloudflare secret: pantrypalapp
 */

export default {
  async fetch(request, env) {
    const CORS = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }
    if (request.method !== "POST") {
      return new Response("POST only", { status: 405, headers: CORS });
    }

    // Secret guard
    const OPENAI_KEY = env.pantrypalapp;
    if (!OPENAI_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing `pantrypalapp` secret in Worker settings" }),
        { status: 500, headers: { "Content-Type": "application/json", ...CORS } }
      );
    }

    // Parse request
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...CORS } }
      );
    }

    const { meat, carb, vegetable, time, cuisine } = body;

    // JSON schema for structured output
    const schema = {
      type: "object",
      properties: {
        recipes: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              summary: { type: "string" },
              time: { type: "number" },
              ingredients: { type: "array", items: { type: "string" } },
              steps: { type: "array", items: { type: "string" } }
            },
            required: ["title", "summary", "time", "ingredients", "steps"],
            additionalProperties: false
          }
        }
      },
      required: ["recipes"],
      additionalProperties: false
    };

    const prompt = `
Generate 3 home-cook-friendly recipes that match:
- Meat: ${meat || "none"}
- Carb: ${carb || "any"}
- Vegetable: ${vegetable || "any"}
- Total time limit (minutes): ${Number(time) || 60}
- Cuisine style: ${cuisine || "any"}

Keep ingredients concise; steps actionable. Use common pantry items when possible.
`.trim();

    // Call OpenAI
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Known-good small model for JSON tasks
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Return ONLY JSON that matches the provided schema." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_schema", json_schema: { name: "recipes_schema", schema } },
        temperature: 0.6
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(text, { status: resp.status, headers: CORS });
    }

    // Ensure JSON response
    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content || "{}";

    let jsonOut;
    try {
      jsonOut = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      return new Response(
        JSON.stringify({ error: "Model returned non-JSON", raw }),
        { status: 502, headers: { "Content-Type": "application/json", ...CORS } }
      );
    }

    return new Response(JSON.stringify(jsonOut), {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS }
    });
  }
};

