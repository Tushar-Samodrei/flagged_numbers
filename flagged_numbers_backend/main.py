from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="Flagged Numbers Proxy API")

# ---------------------------------------------------------
# CORS (Allow frontend at localhost:5173)
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_URL = "https://backend.samodrei.com/tele-prescribers-requests/flagged-numbers"

# ---------------------------------------------------------
# MAIN PAGINATION ENDPOINT
# ---------------------------------------------------------
@app.get("/flagged")
async def get_flagged_numbers(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):
    """
    Proxy endpoint → Fetch flagged numbers LIVE from Samodrei backend.
    No database. No sync. Just real-time data.
    """

    url = f"{BASE_URL}?page={page}"

    try:
        print(f"FETCH → Calling API Page {page}: {url}")

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(url)

        print(f"FETCH → Status {response.status_code}")

        if response.status_code != 200:
            return {"success": False, "error": "Upstream API error", "status": response.status_code}

        data = response.json()

        # safety checks
        if "data" not in data:
            return {"success": False, "error": "Invalid API response structure"}

        # Return AS-IS so frontend can use pagination directly
        return data

    except Exception as e:
        print("FETCH ERROR:", str(e))
        return {"success": False, "error": str(e)}
