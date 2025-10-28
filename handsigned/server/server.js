import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

// Lazy import OpenAI to avoid requiring key unless used
let OpenAI = null;
let GoogleGenerativeAI = null;

const PORT = process.env.PORT || 8787;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const PROVIDER = (process.env.PROVIDER || 'demo').toLowerCase(); // 'openai' | 'gemini' | 'demo'
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: CORS_ORIGIN, credentials: false }));
app.use(rateLimit({ windowMs: 60 * 1000, max: 60 }));

const ScoreRequest = z.object({
  title: z.string().min(0).optional(),
  description: z.string().min(0).optional(),
  imageUrl: z.string().min(1).optional(), // may be a data: URL
});

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function seededScore(seedStr) {
  // Deterministic pseudo-random 50-100 score for demo reliability
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  const rng = (h >>> 0) / 0xffffffff;
  return Math.round(50 + rng * 50);
}

function isHttpUrl(url = '') {
  return /^https?:\/\//i.test(url || '');
}

function isDataUrl(url = '') {
  return /^data:\w+\/.+;base64,/i.test(url || '');
}

function parseDataUrl(dataUrl) {
  // data:<mime>;base64,<data>
  const match = /^data:([^;]+);base64,(.*)$/i.exec(dataUrl || '');
  if (!match) return null;
  const mimeType = match[1];
  const base64 = match[2];
  return { mimeType, base64 };
}

app.get('/health', (_req, res) => {
  const info = {
    ok: true,
    provider: PROVIDER,
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    openaiModel: OPENAI_MODEL,
    geminiModel: GEMINI_MODEL,
  };
  res.json(info);
});

app.post('/score', async (req, res) => {
  let parsed;
  try {
    parsed = ScoreRequest.parse(req.body || {});
  } catch (e) {
    return res.status(400).json({ error: 'INVALID_REQUEST', details: e.errors?.[0]?.message || String(e) });
  }

  const { title = '', description = '', imageUrl = '' } = parsed;

  // Provider: OpenAI
  if (PROVIDER === 'openai' && process.env.OPENAI_API_KEY) {
    try {
      if (!OpenAI) {
        const mod = await import('openai');
        OpenAI = mod.default;
      }
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const includeImage = isHttpUrl(imageUrl) || isDataUrl(imageUrl);
      const messages = [
        {
          role: 'system',
          content: `You are an expert art authenticity reviewer. Score the likelihood that an artwork was created by a human without AI generation. Respond ONLY with a JSON object: {"score": number from 0 to 100}. Higher is more human-made. Consider brushwork irregularities, compositional artifacts, text rendering, patterns, and cues from the description.`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Title: ${title || '(untitled)'}\nDescription: ${description || '(none)'}\nReturn strictly JSON with a numeric score field.` },
            ...(includeImage ? [{ type: 'image_url', image_url: { url: imageUrl } }] : [])
          ],
        },
      ];

      const response = await client.chat.completions.create({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.2,
      });

      const content = response.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[^}]*\}/);
      if (jsonMatch) {
        const obj = JSON.parse(jsonMatch[0]);
        const score = clamp(Math.round(Number(obj.score)), 0, 100);
        if (!Number.isNaN(score)) {
          return res.json({ score, model: OPENAI_MODEL, provider: 'openai', usedImage: includeImage });
        }
      }
    } catch (err) {
      console.error('OpenAI scoring failed:', err);
      // fallthrough
    }
  }

  // Provider: Gemini
  if (PROVIDER === 'gemini' && process.env.GEMINI_API_KEY) {
    try {
      if (!GoogleGenerativeAI) {
        const mod = await import('@google/generative-ai');
        GoogleGenerativeAI = mod.GoogleGenerativeAI;
      }
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      const parts = [
        { text: `You are an expert art authenticity reviewer. Score the likelihood that an artwork was created by a human without AI generation. Respond ONLY with JSON: {"score": 0-100}.` },
        { text: `Title: ${title || '(untitled)'}\nDescription: ${description || '(none)'}` },
      ];

      let usedImage = false;
      if (isDataUrl(imageUrl)) {
        const parsed = parseDataUrl(imageUrl);
        if (parsed) {
          parts.push({ inlineData: { data: parsed.base64, mimeType: parsed.mimeType } });
          usedImage = true;
        }
      } else if (isHttpUrl(imageUrl)) {
        // Fetch and inline to avoid needing Google File API
        try {
          const resp = await fetch(imageUrl);
          const buf = await resp.arrayBuffer();
          const base64 = Buffer.from(buf).toString('base64');
          // Best effort mime; if missing, assume image/jpeg
          const contentType = resp.headers.get('content-type') || 'image/jpeg';
          parts.push({ inlineData: { data: base64, mimeType: contentType } });
          usedImage = true;
        } catch (e) {
          console.warn('Failed to fetch image for Gemini, proceeding without image');
        }
      }

      const result = await model.generateContent(parts);
      const text = result?.response?.text?.() || '';
      const jsonMatch = text.match(/\{[^}]*\}/);
      if (jsonMatch) {
        const obj = JSON.parse(jsonMatch[0]);
        const score = clamp(Math.round(Number(obj.score)), 0, 100);
        if (!Number.isNaN(score)) {
          return res.json({ score, model: GEMINI_MODEL, provider: 'gemini', usedImage });
        }
      }
    } catch (err) {
      console.error('Gemini scoring failed:', err);
      // fallthrough
    }
  }

  // Demo deterministic scoring path (no external API, works offline)
  const seed = `${title}|${description}|${imageUrl?.slice(0, 64)}`;
  const score = seededScore(seed);
  return res.json({ score, provider: 'demo' });
});

app.listen(PORT, () => {
  console.log(`Score API listening on http://localhost:${PORT}`);
});
