import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";
import fs from "fs";
import crypto from "crypto";

// Simple token store persisted to tokens.json for development use only.
const TOKENS_FILE = path.join(process.cwd(), 'tokens.json');
let tokenStore: Record<string, any> = {};
try {
  if (fs.existsSync(TOKENS_FILE)) {
    const raw = fs.readFileSync(TOKENS_FILE, 'utf8');
    tokenStore = JSON.parse(raw || '{}');
  }
} catch (e) {
  tokenStore = {};
}

function persistTokens() {
  try {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokenStore, null, 2));
  } catch (e) {
    console.warn('Failed to persist tokens', e);
  }
}
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

// ------------------------------------------------------------------
// Google Drive OAuth scaffold
// ------------------------------------------------------------------
// Notes: This is a scaffold for OAuth flows using googleapis. Install
// the dependency: `npm install googleapis` and set the environment vars
// `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_OAUTH_REDIRECT`.
// The redirect should point back to this server's `/auth/google/callback`.

function getGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirect = process.env.GOOGLE_OAUTH_REDIRECT || `http://localhost:${PORT}/auth/google/callback`;
  if (!clientId || !clientSecret) throw new Error('Missing Google OAuth credentials.');
  return new google.auth.OAuth2(clientId, clientSecret, redirect);
}

// Redirect user to Google's OAuth consent screen (scaffold)
// Start OAuth flow: returns an auth URL and a generated state key the client can poll with.
app.get('/auth/google/start', (req, res) => {
  try {
    const state = crypto.randomBytes(12).toString('hex');
    const oauth2Client = getGoogleOAuthClient();
    const scopes = ['https://www.googleapis.com/auth/drive.readonly'];
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state,
    });
    // Initialize empty slot in the token store
    tokenStore[state] = { status: 'pending' };
    persistTokens();
    return res.json({ authUrl, state });
  } catch (err: any) {
    return res.status(500).send({ error: err.message });
  }
});

// Backwards-compatible redirect endpoint (not used by client start flow but kept)
app.get('/auth/google', (req, res) => {
  try {
    const oauth2Client = getGoogleOAuthClient();
    const scopes = ['https://www.googleapis.com/auth/drive.readonly'];
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: req.query.state as string | undefined,
    });
    res.redirect(authUrl);
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
});

// OAuth callback endpoint — exchanges code for tokens and returns them
app.get('/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).send({ error: 'Missing code.' });
    const oauth2Client = getGoogleOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    // In production you should associate tokens with a user session and store securely
    // store tokens under state if provided
    const state = req.query.state as string | undefined;
    if (state) {
      tokenStore[state] = { status: 'ok', tokens, createdAt: Date.now() };
      persistTokens();
    }

    // Redirect to a tiny page that will notify the opener window and close
    const redirectPage = `/auth/success?state=${encodeURIComponent(state || '')}`;
    return res.redirect(redirectPage);
  } catch (err: any) {
    console.error('Google OAuth callback error', err);
    return res.status(500).json({ error: err.message || 'OAuth failure' });
  }
});

// Serve a tiny success page that posts the state back to the opener window
app.get('/auth/success', (req, res) => {
  const state = req.query.state as string | undefined;
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!doctype html>
    <html>
    <head><meta charset="utf-8"><title>Auth Success</title></head>
    <body style="background:#071021;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial,Helvetica,sans-serif;">
      <div style="text-align:center;max-width:560px;padding:20px;">
        <h2>Authentication successful</h2>
        <p>You may close this window and return to the application.</p>
        <script>
          try {
            if (window.opener) {
              window.opener.postMessage({ type: 'google-auth', state: '${state || ''}' }, '*');
            }
          } catch (e) {}
          setTimeout(() => window.close(), 900);
        </script>
      </div>
    </body>
    </html>
  `);
});

// Example Drive listing endpoint — pass `access_token` as query or in Authorization header
app.get('/api/drive/list', async (req, res) => {
  try {
    const accessToken = req.query.access_token || req.headers.authorization?.toString().replace('Bearer ', '');
    if (!accessToken) return res.status(400).json({ error: 'Missing access_token' });
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken as string });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const resp = await drive.files.list({ pageSize: 100, fields: 'files(id,name,mimeType,webViewLink,thumbnailLink)' });
    return res.json({ files: resp.data.files || [] });
  } catch (err: any) {
    console.error('Drive list error', err);
    return res.status(500).json({ error: err.message || 'Drive error' });
  }
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
