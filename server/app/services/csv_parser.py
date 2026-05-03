import pandas as pd
import io
from app.models.schemas import DatasetMeta

# In-memory store — keyed by session_id for MVP
_store: dict[str, pd.DataFrame] = {}

def parse_and_store(session_id: str, contents: bytes, filename: str) -> DatasetMeta:
    df = pd.read_csv(io.BytesIO(contents))
    df.columns = df.columns.str.strip()
    _store[session_id] = df

    return DatasetMeta(
        filename=filename,
        rows=len(df),
        columns=df.columns.tolist(),
        sample=df.head(5).fillna("").to_dict(orient="records"),
    )

def get_dataframe(session_id: str) -> pd.DataFrame | None:
    return _store.get(session_id)