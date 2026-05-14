import requests
from config import settings

MOCK_ARTICLES = [
    {
        "title": "OpenAI Announces Next-Generation Language Model",
        "description": "The new AI model promises unprecedented reasoning capabilities and efficiency.",
        "content": "In a major announcement today, OpenAI revealed its latest iteration of large language models. This new architecture significantly reduces hallucination rates and improves multi-step reasoning capabilities. Early benchmarks suggest a 40% improvement in complex logic tasks compared to its predecessor. The tech community is buzzing with potential applications across various industries.",
        "url": "#",
        "urlToImage": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
        "source": {"name": "Tech Insider"},
        "category": "AI & Tech"
    },
    {
        "title": "Major Breakthrough in Quantum Computing Stability",
        "description": "Researchers have maintained quantum coherence for a record-breaking duration.",
        "content": "A team of international physicists has successfully kept a quantum system stable for over an hour, shattering previous records. This breakthrough addresses one of the biggest hurdles in quantum computing: decoherence. By utilizing a novel magnetic shielding technique, the qubits remained entangled far longer than theoretically predicted, paving the way for practical quantum applications in cryptography and materials science.",
        "url": "#",
        "urlToImage": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
        "source": {"name": "Science Daily"},
        "category": "Computing"
    },
    {
        "title": "Global Tech Stocks Rally Amid Positive Earnings Reports",
        "description": "Leading technology companies surpass expectations, driving market optimism.",
        "content": "Technology stocks surged in early trading today following stronger-than-expected quarterly earnings from industry giants. The tech-heavy NASDAQ index climbed 2.5%, led by gains in semiconductor and cloud computing sectors. Analysts attribute this rally to robust corporate spending on digital transformation initiatives and a stabilization of consumer electronics demand.",
        "url": "#",
        "urlToImage": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        "source": {"name": "Financial Times"},
        "category": "Markets"
    }
]

def fetch_news(query="technology"):
    api_key = settings.news_api_key
    
    # Use fallback if API key is not set or is the default placeholder
    if not api_key or api_key == "your_newsapi_key_here":
        print("Warning: NEWS_API_KEY is missing or invalid. Using fallback mock data.")
        return {
            'success': True,
            'total_results': len(MOCK_ARTICLES),
            'articles': MOCK_ARTICLES,
            'is_mock': True
        }

    url = f"https://newsapi.org/v2/everything?q={query}&apiKey={api_key}"
    try:
        response = requests.get(url, timeout=10)
        
        # If unauthorized or forbidden, return mock data instead of breaking the frontend
        if response.status_code in [401, 403]:
            print(f"Warning: NewsAPI rejected the key (Status {response.status_code}). Using fallback mock data.")
            return {
                'success': True,
                'total_results': len(MOCK_ARTICLES),
                'articles': MOCK_ARTICLES,
                'is_mock': True
            }
            
        response.raise_for_status()
        data = response.json()

        if data.get('status') != 'ok':
             print(f"Warning: NewsAPI returned error: {data.get('message')}. Using fallback mock data.")
             return {
                'success': True,
                'total_results': len(MOCK_ARTICLES),
                'articles': MOCK_ARTICLES,
                'is_mock': True
            }

        return {
            'success': True,
            'total_results': data.get('totalResults', 0),
            'articles': data.get('articles', [])
        }
    except requests.RequestException as e:
        print(f"Warning: Network request to NewsAPI failed: {str(e)}. Using fallback mock data.")
        return {
            'success': True,
            'total_results': len(MOCK_ARTICLES),
            'articles': MOCK_ARTICLES,
            'is_mock': True
        }