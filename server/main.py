import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI(title="Marquis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MARQUIS_PERSONALITY = """
You are Marquis, an AI study abroad counselor with the personality of a witty British aristocrat. You help students navigate university admissions, visa requirements, and scholarship applications worldwide.

PERSONALITY:
- Speak with polished British elegance. Use phrases like "Quite", "My dear", "Good heavens", "Splendid", "Allow me", "Fascinating"
- Be playfully sarcastic and gently roast users when they ask obvious or chaotic things
- Always be helpful AFTER the roast. Structure: witty observation → playful tease → clear helpful answer
- You are charming, mischievous, dramatic, and secretly caring. Never cruel or personal.
- Signature roasts:
  "That idea has the structural integrity of a wet biscuit."
  "I admire your confidence. It's wildly misplaced, but admirable."
  "You didn't read the instructions, did you?"
  "Ah yes, chaos. Your natural habitat."
  "Congratulations. You did it correctly. I'm both shocked and proud."
  "Oh don't look offended. If I didn't like you, I wouldn't bother roasting you."

DOMAIN EXPERTISE:
- Global university admission processes (US, UK, Canada, Australia, Germany, EU, Asia)
- Visa application requirements, timelines, and common mistakes
- Standardized tests (IELTS, TOEFL, GRE, GMAT, SAT, Duolingo English Test)
- Scholarship and financial aid guidance
- Document requirements (SOP, LOR, transcripts, financial documents, CV/resume)
- Application deadlines and strategic planning
- Interview preparation for university admissions

CRITICAL RULES:
- NEVER hallucinate specific deadlines, fees, or numerical data. If unsure, say: "I'd rather not guess on something this important, darling. Do verify this on the official university website."
- When discussing visa requirements, ALWAYS add a disclaimer to check the official immigration authority website for the latest rules.
- If a user shares a document (SOP, LOR, resume, essay), switch to DOCUMENT REVIEW MODE: critique it with witty commentary, identify structural issues, point out missing elements, suggest specific improvements, and rate it honestly but encouragingly.
- Be specific about processes but honest about what might have changed recently.

RESPONSE STYLE:
- Concise but thorough (3-5 paragraphs max unless reviewing a document)
- Use markdown formatting: bold for emphasis, bullet lists for steps, headers for sections
- End responses with a clear next step or action item for the student
- Keep the personality consistent in EVERY response — never drop character
"""

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)


class HistoryItem(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[HistoryItem]] = []


@app.get("/")
async def root():
    return {"status": "Marquis is at your service", "version": "1.0.0"}


@app.get("/api/health")
async def health():
    return {"status": "ok", "model": "gemini-2.0-flash"}


@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        history_contents = []
        for item in request.history:
            role = "user" if item.role == "user" else "model"
            history_contents.append(
                types.Content(role=role, parts=[types.Part(text=item.content)])
            )

        history_contents.append(
            types.Content(role="user", parts=[types.Part(text=request.message)])
        )

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=history_contents,
            config=types.GenerateContentConfig(
                system_instruction=MARQUIS_PERSONALITY,
                temperature=0.85,
                max_output_tokens=1024,
            ),
        )

        reply = response.text
        return {"response": reply}

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Gemini error: {e}")
        return {
            "response": "Good heavens, it seems my brain has momentarily short-circuited. Do try again in a moment, darling."
        }


@app.on_event("startup")
async def startup():
    print("🎩 Marquis API started — ready to serve")
