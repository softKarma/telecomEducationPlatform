import trafilatura
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

app = FastAPI()

class ScraperRequest(BaseModel):
    url: str

class ScraperResponse(BaseModel):
    content: str
    status: str
    url: str

@app.post("/api/scrape", response_model=ScraperResponse)
async def scrape_url(request: ScraperRequest):
    """
    Endpoint to scrape content from a telecom-related website.
    """
    try:
        # Download and extract the main content
        downloaded = trafilatura.fetch_url(request.url)
        if not downloaded:
            raise HTTPException(status_code=400, detail="Could not download the URL content")
        
        # Extract the main text content
        content = trafilatura.extract(downloaded)
        if not content:
            raise HTTPException(status_code=404, detail="Could not extract content from the URL")
        
        return ScraperResponse(
            content=content,
            status="success",
            url=request.url
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scraping content: {str(e)}")

@app.get("/api/telecom_resources")
async def get_telecom_resources():
    """
    Returns a list of recommended telecom resources to scrape.
    """
    resources = [
        {
            "name": "3GPP Specifications",
            "url": "https://www.3gpp.org/specifications",
            "description": "Official 3GPP specifications including SMS and GSM standards"
        },
        {
            "name": "GSMA Technical Resources",
            "url": "https://www.gsma.com/newsroom/resources/",
            "description": "Technical resources from the GSM Association"
        },
        {
            "name": "ETSI Standards",
            "url": "https://www.etsi.org/standards",
            "description": "European Telecommunications Standards Institute documents"
        }
    ]
    return {"resources": resources}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)