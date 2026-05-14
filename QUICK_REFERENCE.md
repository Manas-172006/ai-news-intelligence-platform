# Quick Reference Guide - News Summarization System

## 🚀 Quick Start (5 Minutes)

### Step 1: Copy Files to Backend Directory
```bash
cd Backend

# Copy the new files
cp summarizer.py .
# Replace main.py with updated version
# Update requirements.txt
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Start the Server
```bash
uvicorn main:app --reload
```

**Output should show:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Test the API
```bash
# In another terminal
curl -X POST http://localhost:8000/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "AI is transforming technology. Machine learning enables computers to learn. Deep learning uses neural networks.",
    "num_sentences": 2
  }'
```

**Expected Response:**
```json
{
  "summary": "AI is transforming technology. Machine learning enables computers to learn.",
  "sentence_count": 2,
  "original_length": 145,
  "summary_length": 87,
  "compression_ratio": 0.4
}
```

---

## 📁 File Structure

```
Backend/
├── main.py                    ✓ Updated with /summarize endpoint
├── news_fetcher.py           (existing - no changes)
├── summarizer.py             ✓ NEW - NLP module
├── requirements.txt          ✓ Updated dependencies
└── test_summarization.py     ✓ NEW - Test suite
```

---

## 📡 API Endpoints

### 1. Health Check
```
GET /
```
**Response:** `{"status": "ok", "message": "...", "version": "1.0.0"}`

### 2. Fetch News
```
GET /news?query=technology
```
**Response:** News articles from NewsAPI

### 3. Summarize Text (NEW)
```
POST /summarize
Content-Type: application/json

{
  "text": "your article text",
  "num_sentences": 3
}
```

**Response:**
```json
{
  "summary": "...",
  "sentence_count": 3,
  "original_length": 5000,
  "summary_length": 800,
  "compression_ratio": 0.84
}
```

---

## 🧪 Testing

### Run Test Suite
```bash
python test_summarization.py
```

**Features:**
- ✓ Health check
- ✓ 6 success tests (different article types)
- ✓ 5 error handling tests
- ✓ Performance benchmarks
- ✓ Colored output for easy reading

### Manual Testing with cURL

**Short article:**
```bash
curl -X POST http://localhost:8000/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Sentence 1. Sentence 2. Sentence 3. Sentence 4. Sentence 5.",
    "num_sentences": 2
  }'
```

**Error case (empty text):**
```bash
curl -X POST http://localhost:8000/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "", "num_sentences": 3}'
```

### Python Testing
```python
import requests

response = requests.post(
    "http://localhost:8000/summarize",
    json={
        "text": "Your article here...",
        "num_sentences": 3
    }
)

if response.status_code == 200:
    result = response.json()
    print(result['summary'])
else:
    print(f"Error: {response.json()}")
```

---

## 🔧 Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'nltk'"
```bash
pip install nltk
```

### Issue: "ConnectionError: Can't connect to API"
```bash
# Make sure API is running
uvicorn main:app --reload

# Check it's accessible
curl http://localhost:8000/
```

### Issue: CORS Error in Frontend
Check main.py has CORS middleware:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
)
```

### Issue: Summary is empty or too short
- Ensure text has multiple sentences (min 2)
- Increase `num_sentences` parameter
- Check text preprocessing isn't removing content

---

## 📊 Understanding the Algorithm

### TF-IDF Scoring
```
Score = (Word Frequency in Sentence) × (Rarity across All Sentences)

High Score = Word appears frequently in this sentence + is rare elsewhere
Low Score = Word is common everywhere (e.g., "the", "is")
```

### Sentence Ranking
```
1. Calculate TF-IDF for each sentence
2. Find average importance vector
3. Score each sentence vs. average
4. Rank by score
5. Extract top N
6. Preserve original order
```

### Example:
```
Article: "AI is changing tech. ML learns from data. Deep learning is powerful."

Sentence Scores:
- "AI is changing tech." → 0.85 ✓ SELECTED
- "ML learns from data." → 0.78 ✓ SELECTED  
- "Deep learning is powerful." → 0.42 ✗ NOT SELECTED

Summary: "AI is changing tech. ML learns from data."
```

---

## 🎯 Integration with React

```javascript
// NewsCard.jsx
import axios from 'axios';
import { useState } from 'react';

export function NewsCard({ article }) {
  const [summary, setSummary] = useState(null);

  const handleSummarize = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/summarize',
        {
          text: article.content,
          num_sentences: 3
        }
      );
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Summarization failed:', error);
    }
  };

  return (
    <div className="card">
      <h2>{article.title}</h2>
      <p>{article.description}</p>
      {summary ? (
        <div className="summary">
          <strong>Summary:</strong>
          <p>{summary}</p>
        </div>
      ) : (
        <button onClick={handleSummarize}>Summarize</button>
      )}
    </div>
  );
}
```

---

## 📈 Performance Tips

### For Faster Summarization:
1. Limit text length: `text[:3000]` (first 3000 chars)
2. Use fewer sentences: `num_sentences=2`
3. Add caching for repeated articles

### For Better Quality:
1. Increase sentences: `num_sentences=4`
2. Pre-filter short articles
3. Domain-specific preprocessing

### Typical Times:
- Short text (500 words): 50ms
- Medium text (1500 words): 100ms
- Long text (3000+ words): 200ms

---

## 🐛 Debugging

### Enable Verbose Logging
```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
```

### Test Summarizer Directly
```python
from summarizer import generate_summary

result = generate_summary("Your test text here.", num_sentences=2)
print(result)
```

### Check Dependencies
```bash
pip list | grep -E "fastapi|nltk|scikit-learn"
```

---

## 📚 Functions Reference

### Main Function
```python
generate_summary(text: str, num_sentences: int = 3) -> dict
```
**Returns:** `{'summary': str, 'sentence_count': int, 'original_length': int, ...}`

### Utility Functions
```python
preprocess_text(text: str) -> str
tokenize_sentences(text: str) -> list
remove_punctuation_and_stopwords(sentence: str) -> str
calculate_sentence_scores(sentences: list) -> dict
extract_top_sentences(sentences: list, num_sentences: int) -> list
```

---

## 🔐 Security Notes

- Input is validated (empty string, type checking)
- No arbitrary code execution (safe string operations)
- No SQL injection risk (no database in this version)
- Request size limits handled by FastAPI

---

## 📋 Deployment Checklist

- [ ] All files copied to Backend/
- [ ] requirements.txt updated
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] API starts without errors: `uvicorn main:app --reload`
- [ ] Health check works: `GET http://localhost:8000/`
- [ ] /summarize endpoint responds: `POST http://localhost:8000/summarize`
- [ ] Test suite passes: `python test_summarization.py`
- [ ] Frontend can connect and call API
- [ ] CORS headers are correct

---

## 📞 Need Help?

### Check Logs
```bash
# If using uvicorn
uvicorn main:app --reload --log-level debug
```

### Test Each Component
```python
# Test NLTK
from nltk.tokenize import sent_tokenize
print(sent_tokenize("First sentence. Second sentence."))

# Test Sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
vectorizer = TfidfVectorizer()
print("Sklearn OK")

# Test FastAPI
from main import app
print("FastAPI OK")
```

### Run Full Test Suite
```bash
python test_summarization.py
```

---

## 🎓 Learning Resources

**NLTK:**
- https://www.nltk.org/
- `nltk.download()` - Download required data

**Scikit-learn:**
- https://scikit-learn.org/stable/
- TF-IDF: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html

**FastAPI:**
- https://fastapi.tiangolo.com/
- Tutorial: https://fastapi.tiangolo.com/tutorial/

**Text Summarization:**
- Extractive vs. Abstractive: https://arxiv.org/search/?query=text+summarization
- TF-IDF explained: https://en.wikipedia.org/wiki/Tf%E2%80%93idf

---

## ✨ What's Next?

**Phase 2 Ideas:**
- Add text caching to avoid re-summarizing same articles
- Support multiple languages
- Implement abstractive summarization (generates new sentences)
- Add sentiment analysis
- Extract keywords automatically

**Phase 3 Ideas:**
- Database integration for storing articles and summaries
- User authentication and saved summaries
- Real-time news streaming
- Advanced analytics dashboard

---

## 📝 Quick Command Reference

```bash
# Install dependencies
pip install -r requirements.txt

# Start API server
uvicorn main:app --reload

# Start API with custom port
uvicorn main:app --reload --port 8001

# Run test suite
python test_summarization.py

# Test with curl
curl http://localhost:8000/
curl -X POST http://localhost:8000/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"...", "num_sentences":3}'

# Check specific imports
python -c "from summarizer import generate_summary; print('OK')"

# View API documentation
# Visit: http://localhost:8000/docs
# or: http://localhost:8000/redoc
```

---

**Happy Summarizing! 🎉**
