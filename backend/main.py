import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import httpx
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import time

# Basic models for simplified API
class SearchQuery(BaseModel):
    query: str
    max_results: int = 10
    sources: Optional[List[str]] = None

class SearchResult(BaseModel):
    title: str
    summary: str
    source: str
    url: str
    year: Optional[int] = None
    authors: List[str] = []

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total_found: int
    sources_used: List[str]
    execution_time: float

class ResearchRequest(BaseModel):
    query: str
    execution_mode: str = "full"

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("MARIS Backend Starting (Simplified Version)...")
    yield
    print("MARIS Backend Shutting Down...")

app = FastAPI(
    title="MARIS - Multi-Agent Research Intelligence System",
    description="Simplified version compatible with Python 3.8",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Basic search function using Tavily
async def search_with_tavily(query: str, max_results: int = 10) -> List[SearchResult]:
    """Search using Tavily API"""
    tavily_api_key = os.getenv("TAVILY_API_KEY")
    if not tavily_api_key:
        return []
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.tavily.com/search",
                json={
                    "api_key": tavily_api_key,
                    "query": query,
                    "search_depth": "basic",
                    "include_answer": False,
                    "include_raw_content": False,
                    "max_results": max_results
                }
            )
            response.raise_for_status()
            data = response.json()
            
            results = []
            for result in data.get('results', []):
                results.append(SearchResult(
                    title=result.get('title', ''),
                    summary=result.get('content', '')[:500],
                    source="tavily",
                    url=result.get('url', '')
                ))
            return results
    except Exception as e:
        print(f"Tavily search error: {e}")
        return []

@app.get("/")
async def root():
    return {"message": "MARIS Backend API (Simplified Version)", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/search")
async def search(search_query: SearchQuery):
    """Basic search endpoint"""
    start_time = time.time()
    
    # Use Tavily for search
    results = await search_with_tavily(search_query.query, search_query.max_results)
    
    execution_time = time.time() - start_time
    
    return SearchResponse(
        query=search_query.query,
        results=results,
        total_found=len(results),
        sources_used=["tavily"],
        execution_time=execution_time
    )

@app.get("/search/sources")
async def get_available_sources():
    """Get list of available search sources"""
    return {
        "sources": [
            {
                "name": "tavily",
                "description": "Web search with AI-powered results",
                "type": "web"
            }
        ]
    }

@app.post("/research")
async def start_research(request: ResearchRequest):
    """Start a simplified research session"""
    research_id = f"research_{int(time.time())}"
    
    return {
        "research_id": research_id,
        "status": "started",
        "query": request.query,
        "message": "Research started with simplified search functionality"
    }

@app.get("/research/{research_id}")
async def get_research_status(research_id: str):
    """Get research status"""
    return {
        "research_id": research_id,
        "status": "completed",
        "progress": 100,
        "current_step": "search_completed",
        "message": "Simplified research completed"
    }

@app.get("/research/{research_id}/results")
async def get_research_results(research_id: str):
    """Get research results"""
    # Mock results for now
    return {
        "research_id": research_id,
        "original_query": "Sample research query",
        "optimized_query": "Sample optimized query",
        "research_plan": [
            "Step 1: Search for relevant information",
            "Step 2: Analyze findings",
            "Step 3: Generate summary"
        ],
        "literature_results": [],
        "web_results": [
            {
                "title": "Sample Web Result",
                "summary": "This is a sample result from the simplified search",
                "source": "tavily",
                "url": "https://example.com"
            }
        ],
        "gaps_identified": [
            "More detailed analysis needed"
        ],
        "hypotheses": [
            "Sample hypothesis based on findings"
        ],
        "methodology": {},
        "suggested_datasets": [],
        "ris_score": {
            "novelty": 75,
            "feasibility": 80,
            "impact": 70,
            "risk": 30,
            "final_score": 75,
            "reasoning": "Simplified RIS scoring based on available data"
        },
        "reflection": "This is a simplified research result without the full multi-agent functionality.",
        "execution_time": 5.0,
        "completed_at": "2024-01-01T00:00:00Z",
        "status": "completed"
    }

@app.get("/history")
async def get_history():
    """Get research history"""
    return {
        "entries": [],
        "total": 0
    }

@app.delete("/history/{memory_id}")
async def delete_history_entry(memory_id: str):
    """Delete a history entry"""
    return {"message": "Entry deleted"}

if __name__ == "__main__":
    try:
        print("Starting MARIS Backend (Simplified Version)...")
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=5000,  # Use port 5000 as requested
            reload=False,  # Disable reload to prevent issues
            log_level="info"
        )
    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        traceback.print_exc()
