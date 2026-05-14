# AI-Powered News Summarization System

A full-stack news summarization project using React, Tailwind CSS, Axios, FastAPI, and Python NLP.

## Architecture

React Frontend → Axios → FastAPI Backend → NLP Pipeline

### Backend
- `FastAPI` REST API
- `NewsAPI` live article fetching
- `NLTK` preprocessing and VADER sentiment analysis
- `scikit-learn` TF-IDF summarization and keyword extraction
- Configuration via `.env`

### Frontend
- `React` + `Vite`
- `Tailwind CSS` UI styling
- `Axios` API communication
- Live news cards with summarization, sentiment, and keywords

## Setup

### 1. Backend

1. Navigate to the backend folder:
   ```powershell
   cd Backend
   ```
2. Create a virtual environment:
   ```powershell
   python -m venv venv
   ```
3. Activate the virtual environment:
   ```powershell
   venv\Scripts\activate
   ```
4. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
5. Copy the example environment file:
   ```powershell
   copy .env.example .env
   ```
6. Update `.env` with your `NEWS_API_KEY`.
7. Run the backend:
   ```powershell
   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

### 2. Frontend

1. Navigate to the frontend folder:
   ```powershell
   cd Frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Copy the example environment file:
   ```powershell
   copy .env.example .env
   ```
4. Start the frontend:
   ```powershell
   npm run dev
   ```

## Environment Variables

### Backend (`Backend/.env`)
- `NEWS_API_KEY` - your NewsAPI API key
- `BACKEND_CORS_ORIGINS` - comma-separated list of allowed frontend origins

### Frontend (`Frontend/.env`)
- `VITE_API_BASE_URL` - URL for the backend API, e.g. `http://127.0.0.1:8000`

## API Endpoints

### `GET /news`
Fetches live news articles.

Response:
```json
{
  "success": true,
  "total_results": 20,
  "articles": [ ... ]
}
```

### `POST /summarize`
Generates a summary, sentiment, score, and keywords from article text.

Request body:
```json
{ "text": "Article content here" }
```

Response:
```json
{
  "summary": "...",
  "sentence_count": 3,
  "original_length": 240,
  "summary_length": 110,
  "compression_ratio": 0.54,
  "sentiment": "Positive",
  "score": 0.72,
  "keywords": ["AI", "technology"]
}
```

## Deployment Notes

### Backend
- Use Render, Railway, or any Python-friendly host.
- Set environment variables on the hosting platform rather than storing `.env` in version control.
- Configure production CORS origins via `BACKEND_CORS_ORIGINS`.

### Frontend
- Use Vercel, Netlify, or similar.
- Point `VITE_API_BASE_URL` to the deployed backend URL.
- Build using `npm run build` and deploy the generated output.

## Production Readiness Improvements

- Secrets moved to environment variables
- Backend configuration centralized in `Backend/config.py`
- `.env.example` files added for backend and frontend
- Root `.gitignore` added to protect local environment files
- Backend CORS origins configurable via environment variables
- Better error messages for missing API keys and failed requests

## Notes

- Do not commit `.env` files or sensitive API keys.
- Use the `.env.example` files as templates for configuration.
