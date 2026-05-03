from pydantic import BaseModel
from typing import Any

# ---------------UPLOAD----------------------

class DatasetMeta(BaseModel):
    filename: str
    rows: int
    columns: list[str]
    sample: list[dict[str, Any]]   # first 5 rows for preview

class UploadResponse(BaseModel):
    success: bool
    dataset: DatasetMeta
    
# -------------------QUERY------------------------
class QueryRequest(BaseModel):
    question: str
    session_id: str

class ChartData(BaseModel):
    type: str                      # "bar" | "line"
    title: str
    data: list[dict[str, Any]]     # [{ label, value }]

class QueryResponse(BaseModel):
    insight: str
    chart: ChartData | None