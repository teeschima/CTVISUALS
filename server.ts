import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini API to prevent app crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API endpoint for generating AI Story (Real Gemini Integration!)
app.post("/api/story/generate", async (req, res) => {
  try {
    const { eventName, eventType, date, photosCount, guestsCount, style, highlights } = req.body;
    
    // Ensure lazy load is safe
    let ai;
    try {
      ai = getGenAI();
    } catch (err: any) {
      return res.status(400).json({ 
        error: "Gemini API is not configured yet. Set GEMINI_API_KEY in the Secrets panel." 
      });
    }

    const systemPrompt = `You are an elite, premium storytelling novelist and editorial writer for "Lagos Vogue Magazine" and world-class wedding planners. 
Your tone is incredibly warm, celebratory, deeply poetic, yet modern and sophisticated. 
Write a rich, beautifully styled 2-to-3 paragraph event story about this ${eventType || 'celebration'}. 
Incorporate Nigerian phrasing if appropriate (e.g., Owambe, traditional warmth, grace, vibrant energy, Aso-oke elegance) but keep it universally appealing, luxury, and captivating.`;

    const prompt = `Write an exquisite event memoir/story.
Event details:
- Name: "${eventName || 'Celebration of Life'}"
- Type: ${eventType || 'Specials'}
- Date: ${date || 'Recent times'}
- Style Select: ${style || 'Sunset Narrative'}
- Memories Captured: ${photosCount || 10} high-fidelity guest shots
- Vibrant Attendees: ${guestsCount || 3} loved ones and friends
- Highlight Moments: ${highlights || 'laughing, dancing, and enjoying exquisite food'}

Craft this into a timeless memory tale under 250 words. Do not use generic headings. Speak about the sounds, the majestic visual presence, and how shots truly became a tale.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
        topP: 0.95
      }
    });

    const storyText = response.text || "";
    return res.json({ story: storyText.trim() });
    
  } catch (error: any) {
    console.error("Gemini storytelling error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate storytelling memoir." });
  }
});

// Mock face recognition matching service (Face Index lookup simulation)
app.post("/api/facesearch/match", (req, res) => {
  const { selfieBase64, eventId } = req.body;
  if (!selfieBase64) {
    return res.status(400).json({ error: "Selfie is required." });
  }
  
  // Simulation: we delay for 1.8 seconds to represent AI matching,
  // and then return matching photo indexes which will highlight in the UI.
  setTimeout(() => {
    // Generate some random indices based on size
    res.json({
      success: true,
      message: "Matched faces successfully with index descriptors.",
      matchedPhotoIds: ["p-1", "p-3", "p-5", "p-8", "p-10"], // Match several preset photos
    });
  }, 1800);
});

// Mock AI photo restoration job submission
app.post("/api/restore/submit", (req, res) => {
  const { imageUrl, mode } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: "Image source is required." });
  }

  // Simulate remote processing queue latency (2 seconds)
  setTimeout(() => {
    res.json({
      success: true,
      jobId: `job-${Math.floor(Math.random() * 10000)}`,
      mode: mode,
      status: "DONE"
    });
  }, 2000);
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CT VIEW Engine] Server is active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
