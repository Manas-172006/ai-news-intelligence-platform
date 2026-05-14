# Backend Setup & Startup Guide

## 1. Install Dependencies (One-time setup)

```bash
# Navigate to Backend folder
cd c:\ml_project\Backend

# Install Python packages
pip install fastapi uvicorn[standard] python-dotenv requests nltk scikit-learn numpy
```

## 2. Configure Environment Variables

The `.env` file in `Backend/` folder should contain:

```
NEWS_API_KEY=0d9614088a9b4eda97407e59a93b3764
BACKEND_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174
```

**To get NewsAPI key:**
- Visit https://newsapi.org/
- Sign up for free account
- Copy your API key
- Add it to `.env` file

## 3. Download NLTK Resources (One-time)

```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('vader_lexicon')"
```

## 4. Start Backend Server

### Option A: Simple Direct Command (RECOMMENDED)
```bash
cd c:\ml_project\Backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Option B: Using Python
```bash
cd c:\ml_project\Backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

## 5. Verify Backend Working

Open browser: http://127.0.0.1:8000/
Should see: `{"status":"ok","message":"News Summarization API is running","version":"1.0.0"}`

## 6. API Endpoints

- `GET /` - Health check
- `GET /news?query=technology` - Fetch news articles
- `POST /summarize` - Summarize text with sentiment & keywords

## Configuration Files

- `Backend/config.py` - Simple settings using os.getenv()
- `Backend/.env` - Environment variables
- `Backend/main.py` - FastAPI application
- `Backend/news_fetcher.py` - NewsAPI integration
- `Backend/summarizer.py` - NLP summarization pipeline

## Common Issues

### Port 8000 already in use?
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```
Then update Frontend `.env`: `VITE_API_BASE_URL=http://127.0.0.1:8001`

### NewsAPI key not working?
- Check `.env` file in Backend folder
- Verify API key is correct
- Ensure no extra spaces in `.env` file

### ImportError for nltk/sklearn?
```bash
pip install nltk scikit-learn numpy
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('vader_lexicon')"
```

## Architecture

```
Backend (FastAPI)
├── config.py → Settings (os.getenv + python-dotenv)
├── news_fetcher.py → NewsAPI integration
├── summarizer.py → NLP pipeline (TF-IDF, VADER sentiment, keywords)
├── main.py → FastAPI routes
└── .env → Environment variables

Frontend (React + Vite)
├── src/pages/Home.jsx → Main page with insights
├── src/components/Hero.jsx → Hero section
├── src/components/NewsCard.jsx → Article cards with summarization
├── src/components/SplashScreen.jsx → Animated intro
└── .env → VITE_API_BASE_URL=http://127.0.0.1:8000
```
