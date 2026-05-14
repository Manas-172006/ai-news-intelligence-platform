"""
NLP Summarization Backend Module
================================
This module implements extractive text summarization using NLP preprocessing,
TF-IDF sentence ranking, and top-sentence extraction.
"""

import re
import logging

import nltk
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)


import os

def download_nltk_resources():
    """Download required NLTK models if they are missing."""
    # Ensure a writable directory exists for NLTK data (Render has /tmp as writable)
    nltk_data_dir = os.environ.get('NLTK_DATA', '/tmp/nltk_data')
    os.makedirs(nltk_data_dir, exist_ok=True)
    
    # Append it to NLTK's data path if not already there
    if nltk_data_dir not in nltk.data.path:
        nltk.data.path.append(nltk_data_dir)

    resources = [
        ("tokenizers/punkt", "punkt"),
        ("corpora/stopwords", "stopwords"),
        ("sentiment/vader_lexicon", "vader_lexicon"),
    ]

    for resource, package in resources:
        try:
            nltk.data.find(resource)
        except LookupError:
            logger.info(f"Downloading NLTK resource: {package} to {nltk_data_dir}")
            try:
                nltk.download(package, download_dir=nltk_data_dir, quiet=True)
            except Exception as e:
                logger.error(f"Failed to download NLTK resource {package}: {e}")


download_nltk_resources()
STOPWORDS = set(stopwords.words("english"))
SIA = SentimentIntensityAnalyzer()


def analyze_sentiment(text: str) -> dict:
    """Compute sentiment label and score using VADER."""
    raw_text = (text or "").strip()
    if not raw_text:
        return {"sentiment": "Neutral", "score": 0.0}

    try:
        scores = SIA.polarity_scores(raw_text)
    except Exception as e:
        logger.warning(f"Sentiment analysis failed: {e}")
        scores = {}

    compound_score = round(float(scores.get("compound", 0.0)), 2)

    if compound_score >= 0.05:
        sentiment = "Positive"
    elif compound_score <= -0.05:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return {"sentiment": sentiment, "score": compound_score}


def preprocess_text(text: str) -> str:
    """Lowercase text, remove URLs, and normalize whitespace."""
    text = text.strip().lower()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(r"\s+", " ", text)
    return text


def tokenize_sentences(text: str) -> list[str]:
    """Split text into sentences using NLTK's punkt tokenizer."""
    try:
        sentences = sent_tokenize(text)
    except LookupError:
        logger.warning("NLTK punkt missing. Falling back to regex split.")
        sentences = re.split(r'(?<=[.!?])\s+', text)
    return [sentence.strip() for sentence in sentences if sentence.strip()]


def clean_sentence(sentence: str) -> str:
    """Remove punctuation and stopwords from a sentence."""
    sentence = re.sub(r"[^a-zA-Z0-9\s]", "", sentence)
    words = sentence.split()
    filtered_words = [word for word in words if word not in STOPWORDS and len(word) > 1]
    return " ".join(filtered_words)


def build_sentence_matrix(sentences: list[str]):
    """Turn cleaned sentences into a TF-IDF matrix."""
    cleaned_sentences = [clean_sentence(sentence) for sentence in sentences]
    if not any(cleaned_sentences):
        return None

    try:
        vectorizer = TfidfVectorizer()
        matrix = vectorizer.fit_transform(cleaned_sentences)
        return matrix
    except ValueError as exception:
        logger.warning(f"TF-IDF vectorization failed: {exception}")
        return None


def extract_keywords(text: str, top_n: int = 5) -> list[str]:
    """Extract top keywords using TF-IDF scores across document sentences."""
    raw_text = (text or "").strip()
    if not raw_text:
        return []

    sentences = tokenize_sentences(raw_text)
    if not sentences:
        return []

    try:
        vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_df=0.85,
            min_df=1,
        )
        matrix = vectorizer.fit_transform(sentences)
        if matrix.shape[1] == 0:
            return []

        feature_names = vectorizer.get_feature_names_out()
        score_sums = matrix.sum(axis=0).A1
        sorted_indices = score_sums.argsort()[::-1]

        keywords = []
        for index in sorted_indices:
            term = feature_names[index].strip()
            if len(term) < 2 or term.isnumeric():
                continue
            if term in keywords:
                continue
            keywords.append(term)
            if len(keywords) >= top_n:
                break

        return keywords
    except Exception as exception:
        logger.warning(f"Keyword extraction failed: {exception}")
        return []


def rank_sentences(sentences: list[str]) -> list[tuple[int, float]]:
    """Rank sentences by similarity to the overall document vector."""
    if not sentences:
        return []

    matrix = build_sentence_matrix(sentences)
    if matrix is None or matrix.shape[1] == 0:
        return [(index, 0.0) for index in range(len(sentences))]

    average_vector = matrix.mean(axis=0)
    similarity_scores = cosine_similarity(matrix, average_vector)
    scores = similarity_scores.flatten().tolist()

    ranked = sorted(
        [(index, float(score)) for index, score in enumerate(scores)],
        key=lambda item: item[1],
        reverse=True,
    )
    return ranked


def generate_summary(text: str, max_sentences: int = 3) -> dict:
    """Generate an extractive summary using the most important sentences."""
    if not isinstance(text, str) or not text.strip():
        return {
            "summary": "",
            "sentence_count": 0,
            "original_length": 0,
            "summary_length": 0,
            "compression_ratio": 0.0,
            "sentiment": "Neutral",
            "score": 0.0,
            "keywords": [],
        }

    max_sentences = max(1, min(4, int(max_sentences)))
    cleaned_text = preprocess_text(text)
    sentences = tokenize_sentences(cleaned_text)

    sentiment_data = analyze_sentiment(text)

    keywords = extract_keywords(text)

    if len(sentences) <= max_sentences:
        summary_text = " ".join(sentences)
        return {
            "summary": summary_text,
            "sentence_count": len(sentences),
            "original_length": len(text),
            "summary_length": len(summary_text),
            "compression_ratio": 0.0,
            "sentiment": sentiment_data["sentiment"],
            "score": sentiment_data["score"],
            "keywords": keywords,
        }

    ranked = rank_sentences(sentences)
    selected_indices = sorted([index for index, _ in ranked[:max_sentences]])
    summary_sentences = [sentences[index] for index in selected_indices]
    summary_text = " ".join(summary_sentences)

    original_length = len(text)
    summary_length = len(summary_text)
    compression_ratio = round(
        (original_length - summary_length) / original_length,
        2,
    ) if original_length > 0 else 0.0

    return {
        "summary": summary_text,
        "sentence_count": len(summary_sentences),
        "original_length": original_length,
        "summary_length": summary_length,
        "compression_ratio": compression_ratio,
        "sentiment": sentiment_data["sentiment"],
        "score": sentiment_data["score"],
        "keywords": keywords,
    }
