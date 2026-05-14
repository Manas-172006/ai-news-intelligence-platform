# System Architecture & Flow Diagrams

## 1. Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NEWS SUMMARIZATION SYSTEM                           │
└─────────────────────────────────────────────────────────────────────────────┘

                              FRONTEND LAYER
┌──────────────────────────────────────────────────────────────────────────────┐
│  React.js Application (http://localhost:3000)                               │
│  ├─ App.jsx (Main component)                                                │
│  ├─ NewsCard.jsx (Display articles + summaries)                             │
│  └─ API calls via Axios                                                     │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
                           HTTP Requests (Axios)
                                    ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY (FastAPI)                              │
│                    http://localhost:8000 (CORS enabled)                      │
├──────────────────────────────────────────────────────────────────────────────┤
│  GET  /             → Health check                                           │
│  GET  /news         → Fetch from NewsAPI                                     │
│  POST /summarize    → NEW: Summarize article text                            │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
                    ┌───────────────┴───────────────┐
                    ↓                               ↓
        ┌─────────────────────┐      ┌──────────────────────┐
        │  NEWS FETCHER       │      │  NLP SUMMARIZER      │
        │  ─────────────────  │      │  ───────────────────  │
        │ main: fetch_news()  │      │ main: generate_      │
        │                     │      │       summary()      │
        │ Calls NewsAPI       │      │                      │
        └─────────────────────┘      │ Dependencies:        │
                ↓                    │ • nltk               │
        ┌─────────────────────┐      │ • scikit-learn       │
        │   NewsAPI.org       │      │ • numpy              │
        │  External Service   │      │                      │
        └─────────────────────┘      │ Key Functions:       │
                                     │ • preprocess_text()  │
                                     │ • tokenize_sent...() │
                                     │ • calculate_scores() │
                                     │ • extract_top_sent() │
                                     │ • generate_summary() │
                                     └──────────────────────┘
                                            ↓
                            ┌───────────────┴───────────────┐
                            ↓                               ↓
                    ┌─────────────────┐        ┌────────────────────┐
                    │  TF-IDF Engine  │        │  Similarity Scorer │
                    │  ─────────────  │        │  ─────────────────  │
                    │ • Vectorize     │        │ • Cosine Similarity │
                    │ • Weight terms  │        │ • Score sentences   │
                    │ • Find patterns │        │ • Rank importance   │
                    └─────────────────┘        └────────────────────┘
```

---

## 2. Request/Response Flow

### Flow: Frontend → Summarization Endpoint

```
USER ACTION
    ↓
[User clicks "Summarize" button]
    ↓
[React component sends POST request]
    ↓
React.js (Frontend)
    │
    ├─ Payload:
    │  {
    │    "text": "full article text...",
    │    "num_sentences": 3
    │  }
    │
    └→ axios.post("http://localhost:8000/summarize", payload)
        │
        ↓
FastAPI /summarize Endpoint
    │
    ├─ Validate Input
    │  ├─ Check text not empty
    │  ├─ Check num_sentences is valid
    │  └─ Raise HTTPException if invalid
    │
    ├─ Call summarizer.generate_summary()
    │  │
    │  ├─ Step 1: preprocess_text()
    │  │          (clean URLs, lowercase, normalize)
    │  │
    │  ├─ Step 2: tokenize_sentences()
    │  │          (split into sentences)
    │  │
    │  ├─ Step 3: calculate_sentence_scores()
    │  │          ├─ Remove stopwords/punctuation
    │  │          ├─ TF-IDF vectorization
    │  │          ├─ Calculate cosine similarity
    │  │          └─ Return score dict
    │  │
    │  └─ Step 4: extract_top_sentences()
    │             ├─ Rank sentences by score
    │             ├─ Select top N
    │             └─ Preserve original order
    │
    ├─ Format Response
    │  {
    │    "summary": "Top sentences combined",
    │    "sentence_count": 3,
    │    "original_length": 5000,
    │    "summary_length": 800,
    │    "compression_ratio": 0.84
    │  }
    │
    └→ Return 200 OK + JSON response
        │
        ↓
React.js (Frontend) Receives Response
    │
    ├─ Parse response.json()
    ├─ Update state with summary
    └─ Re-render NewsCard with summary displayed
        │
        ↓
USER SEES SUMMARY IN UI
```

---

## 3. NLP Processing Pipeline (Detailed)

```
┌──────────────────────────────────────────────────────────────────┐
│                    INPUT: RAW ARTICLE TEXT                       │
│                    (2000+ words, unformatted)                    │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                    PHASE 1: PREPROCESSING                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input:  "Check https://example.com for details! Price: $100"   │
│                                                                  │
│  1. Remove URLs & Emails                                         │
│     "Check for details! Price: $100"                            │
│                                                                  │
│  2. Convert to Lowercase                                         │
│     "check for details! price: $100"                            │
│                                                                  │
│  3. Normalize Whitespace                                         │
│     "check for details! price: $100"                            │
│                                                                  │
│  Output: "check for details! price: $100"                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                   PHASE 2: TOKENIZATION                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Split into sentences (NLTK punkt tokenizer)                    │
│                                                                  │
│  Input:  Full article (50+ sentences)                           │
│  ├─ Sentence 1: "check for details!"                           │
│  ├─ Sentence 2: "price: $100"                                  │
│  └─ ...                                                         │
│                                                                  │
│  Output: List of 50 sentences                                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│              PHASE 3: CLEANING & VECTORIZATION                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  For each sentence:                                              │
│  ├─ Remove punctuation: "check for details price 100"          │
│  ├─ Remove stopwords:   "check details price"                  │
│  └─ Keep content words only                                     │
│                                                                  │
│  TF-IDF Vectorization:                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Sentence:     "check details price"                       │  │
│  │                                                            │  │
│  │ TF-IDF Vector:                                            │  │
│  │ [check: 0.45, details: 0.52, price: 0.38, ...]          │  │
│  │                                                            │  │
│  │ Meaning: How important is each word in this sentence?    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Result: TF-IDF Matrix (50 sentences × 5000+ features)         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│               PHASE 4: IMPORTANCE SCORING                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Calculate Average Vector (Document Centroid)                │
│     All vectors averaged → represents "most important terms"   │
│                                                                  │
│     Average = (Sent1 + Sent2 + ... + Sent50) / 50              │
│                                                                  │
│  2. Cosine Similarity Against Average                           │
│     For each sentence:                                          │
│     Similarity = (Sentence · Average) / (|Sent| × |Avg|)       │
│                                                                  │
│     Result: Scores from 0 to 1                                  │
│                                                                  │
│     Sent1: 0.85  ← High similarity, important                   │
│     Sent2: 0.72  ← Medium similarity                            │
│     Sent3: 0.45  ← Low similarity                               │
│     ...                                                          │
│     Sent50: 0.15 ← Very low, unimportant                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                  PHASE 5: EXTRACTION                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Sort by Score (Descending)                                  │
│     Sent1: 0.85 ✓                                              │
│     Sent5: 0.82 ✓                                              │
│     Sent12: 0.78 ✓                                             │
│     Sent8: 0.71 ✗ (not in top 3)                               │
│     ...                                                         │
│                                                                  │
│  2. Select Top N (e.g., 3 sentences)                            │
│     Selected: [Sent1, Sent5, Sent12]                            │
│                                                                  │
│  3. Reorder to Match Original Article                           │
│     Original order: Sent1 → Sent5 → Sent12                     │
│     (Preserve narrative flow)                                   │
│                                                                  │
│     Final: [Sent1, Sent5, Sent12]                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                       OUTPUT: SUMMARY                            │
│                                                                  │
│  "Sentence 1. Sentence 5. Sentence 12."                         │
│                                                                  │
│  Metrics:                                                        │
│  - Original: 2000 characters                                    │
│  - Summary: 350 characters                                      │
│  - Compression: 82.5% reduction                                │
│  - Sentences: 3                                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. TF-IDF Concept Visualization

```
EXAMPLE DOCUMENT WITH 3 SENTENCES:

Sentence 1: "Machine learning is transforming the industry."
Sentence 2: "AI systems require massive computational power."
Sentence 3: "The implementation is complex."

TERM FREQUENCY (TF) - How often each word appears:

              Sent1  Sent2  Sent3
machine        1      0      0      (appears only in Sent1)
learning       1      0      0      (appears only in Sent1)
transforming   1      0      0      (appears only in Sent1)
industry       1      0      0      (appears only in Sent1)
the            1      0      1      (appears in Sent1 and Sent3)
is             1      0      1      (appears in Sent1 and Sent3)
AI             0      1      0      (appears only in Sent2)
systems        0      1      0      (appears only in Sent2)
computational  0      1      0      (appears only in Sent2)
implementation 0      0      1      (appears only in Sent3)
complex        0      0      1      (appears only in Sent3)

INVERSE DOCUMENT FREQUENCY (IDF) - How unique is each word:

machine        → IDF = 2.0  (rare, appears in 1/3 sentences)
learning       → IDF = 2.0  (rare)
transforming   → IDF = 2.0  (rare)
industry       → IDF = 2.0  (rare)
the            → IDF = 0.41 (common, appears in 2/3 sentences)
is             → IDF = 0.41 (common)
AI             → IDF = 2.0  (rare)
systems        → IDF = 2.0  (rare)
computational  → IDF = 2.0  (rare)
implementation → IDF = 2.0  (rare)
complex        → IDF = 2.0  (rare)

TF-IDF SCORES (TF × IDF):

                Sent1    Sent2    Sent3
machine         2.0 ✓    0        0
learning        2.0 ✓    0        0
transforming    2.0 ✓    0        0
industry        2.0 ✓    0        0
the             0.41     0        0.41
is              0.41     0        0.41
AI              0        2.0 ✓    0
systems         0        2.0 ✓    0
computational   0        2.0 ✓    0
implementation  0        0        2.0 ✓
complex         0        0        2.0 ✓

IMPORTANCE RANKING:

Sent1: Multiple high-scoring words (machine, learning, transforming, industry)
       → Average score: HIGH → IMPORTANT ✓

Sent2: Multiple high-scoring words (AI, systems, computational)
       → Average score: HIGH → IMPORTANT ✓

Sent3: Mostly low-scoring words (the, is) + some unique words
       → Average score: MEDIUM → LESS IMPORTANT

SUMMARY SELECTION:

Top 2 sentences: Sent1 + Sent2
```

---

## 5. Error Handling Flow

```
User Request
    ↓
    ├─→ Text empty or whitespace?
    │   └─ YES → Return 400 "Text cannot be empty"
    │
    ├─→ num_sentences invalid?
    │   └─ YES → Return 400 "num_sentences must be >= 2"
    │
    ├─→ Text too short (< 2 sentences)?
    │   └─ YES → Warn "Text too short" but continue
    │
    └─→ Summarization fails?
        └─ YES → Return 500 with error message
        
Success → Return 200 + Summary JSON
```

---

## 6. Data Structure Examples

### Input Request
```
POST /summarize HTTP/1.1
Content-Type: application/json

{
  "text": "Article text here...",
  "num_sentences": 3
}
```

### Processing Stages

**Stage 1: Tokenized Sentences**
```python
[
  "Machine learning is transforming industry.",
  "AI systems require computational power.",
  "The implementation is complex.",
  ...
]
```

**Stage 2: Scored Sentences**
```python
{
  "Machine learning is transforming industry.": 0.85,
  "AI systems require computational power.": 0.78,
  "The implementation is complex.": 0.42,
  ...
}
```

**Stage 3: Selected Sentences**
```python
[
  "Machine learning is transforming industry.",  # Rank 1
  "AI systems require computational power.",     # Rank 2
]
```

### Output Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "summary": "Machine learning is transforming industry. AI systems require computational power.",
  "sentence_count": 2,
  "original_length": 450,
  "summary_length": 120,
  "compression_ratio": 0.73
}
```

---

## 7. Performance Timeline

```
Request starts
    ↓
Preprocessing:      5ms    (clean text, lowercase, etc.)
    ↓
Tokenization:       10ms   (split into sentences)
    ↓
Vectorization:      30ms   (TF-IDF calculation)
    ↓
Scoring:            20ms   (cosine similarity)
    ↓
Extraction:         5ms    (sort & select)
    ↓
Response:           2ms    (format & return)
    ↓
TOTAL:              ~72ms  (for medium article)

[For 1500 word article]
```

---

## 8. Integration Points

```
┌─ Frontend (React)
│  └─ Axios HTTP client
│     └─ POST /summarize
│        └─ FastAPI Router
│           └─ summarizer.generate_summary()
│              ├─ NLTK (tokenization)
│              ├─ Scikit-learn (vectorization)
│              └─ NumPy (calculations)
```

---

## 9. Deployment Architecture

```
Development:
├─ React dev server (localhost:3000)
├─ FastAPI dev server (localhost:8000)
└─ CORS enabled for local development

Production:
├─ React app (Deployed to static hosting)
├─ FastAPI (Deployed to cloud service)
└─ CORS configured for production domain
```

---

**End of Architecture Documentation**
