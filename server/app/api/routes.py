from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from app.services.llm import query_grok
from app.services.csv_parser import parse_and_store
from app.models.schemas import UploadResponse, QueryRequest, QueryResponse
import uuid

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_csv(
    file: UploadFile = File(...),
    x_session_id: str | None = Header(default=None),
):
    print(f"Upload session_id received: {x_session_id}")
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    contents = await file.read()

    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

    session_id = x_session_id or str(uuid.uuid4())
    dataset = parse_and_store(session_id, contents, file.filename)

    return UploadResponse(success=True, dataset=dataset)

@router.post("/query", response_model=QueryResponse)
async def query(body: QueryRequest):
    try:
        print(f"Query session_id: {body.session_id}")
        result = query_grok(body.session_id, body.question)
        return result
    except ValueError as e:
        print(f"ValueError: {e}")  
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")