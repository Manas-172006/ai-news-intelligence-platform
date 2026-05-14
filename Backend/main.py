"""
FastAPI News Summarization Backend
===================================
Main application file with endpoints for fetching news and generating summaries.

Routes:
- GET /: Health check
- GET /news: Fetch articles from NewsAPI
- POST /summarize: Generate summary from article text
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import logging

# Import modules
from config import settings
from news_fetcher import fetch_news
from summarizer import generate_summary

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="News Summarization API",
    description="AI-powered news fetching and summarization system",
    version="1.0.0"
)

# Configure CORS (allow requests from React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,  # Use configured secure origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Request/Response Models (Pydantic)
# ============================================================================

class SummarizeRequest(BaseModel):
    """Request model for /summarize endpoint"""
    text: str


# ============================================================================
# Health Check Endpoint
# ============================================================================

@app.get("/", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify API is running.
    
    Returns:
        dict: Status message
    """
    logger.info("Health check endpoint called")
    return {
        "status": "ok",
        "message": "News Summarization API is running",
        "version": "1.0.0"
    }


# ============================================================================
# News Fetching Endpoint
# ============================================================================

@app.get("/news", tags=["News"])
async def get_news(query: str = "technology"):
    """
    Fetch latest news articles from NewsAPI.
    
    Args:
        query (str): Search keyword (default: 'technology')
        
    Returns:
        dict: {
            'success': bool,
            'total_results': int,
            'articles': list of articles with title, description, content, etc.
        }
        
    Raises:
        HTTPException: If news fetching fails
    """
    try:
        logger.info(f"Fetching news for query: {query}")
        news_data = fetch_news(query)
        
        if not news_data['success']:
            raise HTTPException(status_code=400, detail="Failed to fetch news")
        
        return news_data
        
    except Exception as e:
        logger.error(f"Error fetching news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Text Summarization Endpoint
# ============================================================================

@app.post("/summarize", tags=["Summarization"])
async def summarize_text(request: SummarizeRequest):
    """Generate an extractive summary and sentiment metadata from article text."""
    logger.info("Summarize endpoint called")
    if not request.text or not request.text.strip():
        logger.warning("Empty text provided to summarize endpoint")
        raise HTTPException(status_code=400, detail="Text field cannot be empty")

    try:
        result = generate_summary(request.text)
        logger.info("Summary generated successfully")
        return result
    except Exception as e:
        logger.error(f"Error during summarization: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during summarization")


# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions with proper formatting"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )


# ============================================================================
# Server startup and shutdown
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("=" * 80)
    logger.info("News Summarization API Starting...")
    logger.info("Available endpoints:")
    logger.info("  GET  /             - Health check")
    logger.info("  GET  /news         - Fetch news articles")
    logger.info("  POST /summarize    - Summarize text")
    logger.info("=" * 80)


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("News Summarization API shutting down...")


# ============================================================================
# Run with: uvicorn main:app --reload
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
