from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from dotenv import load_dotenv
import json
import os

from models import GenerateRequest, TimerSuggestion
from prompt import SYSTEM_PROMPT, build_user_message

load_dotenv()

app = FastAPI(title="Timer AI Service")

# Only allow internal calls from Node backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/generate-timer", response_model=TimerSuggestion)
async def generate_timer(req: GenerateRequest):
    user_message = build_user_message(
        req.product_title,
        req.product_category,
        req.intent
    )

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.4,
            max_tokens=200,
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content
        parsed = json.loads(raw)
        suggestion = TimerSuggestion(**parsed)
        return suggestion

    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="AI returned invalid JSON.")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI generation failed: {str(e)}")