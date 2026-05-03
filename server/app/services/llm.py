from openai import OpenAI
from app.core.config import settings
from app.models.schemas import ChartData, QueryResponse
from app.services.csv_parser import get_dataframe
import json
import re

client = OpenAI(
    api_key=settings.GROK_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

SYSTEM_PROMPT = """You are a senior data analyst. The user will give you a dataset summary and a question.

You MUST respond with ONLY a valid JSON object in this exact format — no markdown, no backticks, no explanation:

{
  "insight": "2-3 paragraphs of executive-level analysis answering the question",
  "chart": {
    "type": "bar",
    "title": "Descriptive chart title",
    "data": [
      { "label": "Category A", "value": 123 },
      { "label": "Category B", "value": 456 }
    ]
  }
}

STRICT RULES:
- insight must directly answer the user's question in 2-3 paragraphs
- chart.type must be exactly "bar" or "line"
- chart.data must have between 3 and 8 items
- all chart values must be numbers, never strings
- if no chart is relevant, set chart to null
- return ONLY the JSON object, nothing else"""


def _build_context(session_id: str) -> str:
    df = get_dataframe(session_id)
    if df is None:
        raise ValueError("Dataset not found. Please upload a CSV first.")

    sample = df.head(40).fillna("").to_dict(orient="records")

    return json.dumps({
        "columns": df.columns.tolist(),
        "total_rows": len(df),
        "sample_rows": sample,
    })


def _parse_response(raw: str) -> QueryResponse:
    # Strip markdown fences
    clean = re.sub(r"```json|```", "", raw).strip()
    
    # Remove control characters that break json.loads
    clean = re.sub(r'[\x00-\x1f\x7f](?<![\n\t])', '', clean)
    
    # Normalise newlines inside strings
    clean = clean.replace('\n', ' ').replace('\r', '')

    try:
        parsed = json.loads(clean)
    except json.JSONDecodeError as e:
        raise ValueError(f"Grok returned invalid JSON: {e}\nRaw: {raw[:300]}")

    chart = None
    if parsed.get("chart"):
        chart = ChartData(
            type=parsed["chart"].get("type", "bar"),
            title=parsed["chart"].get("title", "Chart"),
            data=parsed["chart"].get("data", []),
        )

    return QueryResponse(
        insight=parsed.get("insight", "No insight returned."),
        chart=chart,
    )

def query_grok(session_id: str, question: str) -> QueryResponse:
    context = _build_context(session_id)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Dataset:\n{context}\n\nQuestion: {question}"},
        ],
        temperature=0.3,   # lower = more consistent JSON output
    )

    raw = response.choices[0].message.content
    return _parse_response(raw)