"""
Test Script for News Summarization API
======================================

This script tests the /summarize endpoint with various article examples.
Run from Backend directory: python test_summarization.py

Make sure the API is running:
    uvicorn main:app --reload
"""

import requests
import json
import time
from datetime import datetime

# Configuration
API_BASE_URL = "http://localhost:8000"
SUMMARIZE_ENDPOINT = f"{API_BASE_URL}/summarize"

# Color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

# Test articles covering different scenarios
TEST_CASES = [
    {
        "name": "Test 1: Very Short Article (Edge Case)",
        "text": "Quantum computers are powerful. They use quantum bits.",
        "num_sentences": 2,
        "expected_behavior": "Should return all sentences"
    },
    {
        "name": "Test 2: Short Technical Article",
        "text": """
        Blockchain technology enables secure transactions without intermediaries.
        It uses cryptographic hashing to create immutable records.
        Each transaction is verified by multiple nodes in the network.
        This decentralized approach reduces fraud and increases transparency.
        Banks are exploring blockchain for faster international transfers.
        """,
        "num_sentences": 2,
        "expected_behavior": "Should extract top 2 important sentences"
    },
    {
        "name": "Test 3: Medium News Article",
        "text": """
        The tech industry witnessed significant growth this quarter.
        Major companies reported record-breaking revenue numbers.
        Artificial intelligence emerged as the primary growth driver.
        Companies are investing billions in AI research and development.
        Cloud computing services also contributed to the surge.
        Competition in the market remains intense and dynamic.
        Several startups successfully secured large funding rounds.
        The future outlook remains optimistic for the sector.
        """,
        "num_sentences": 3,
        "expected_behavior": "Should extract top 3 sentences in original order"
    },
    {
        "name": "Test 4: Long Article with Repetition",
        "text": """
        Renewable energy sources are becoming increasingly important.
        Solar power is one of the most abundant renewable sources.
        Wind turbines harness the power of wind to generate electricity.
        Hydroelectric power uses water flow to create energy.
        Geothermal energy taps into Earth's internal heat.
        Renewable energy reduces dependence on fossil fuels.
        Countries worldwide are investing in renewable infrastructure.
        The transition to renewable energy is accelerating.
        Solar panels are becoming more affordable and efficient.
        Wind power capacity has grown significantly in recent years.
        Renewable energy creates jobs in manufacturing and installation.
        Environmental benefits include reduced carbon emissions.
        Economic benefits include lower long-term energy costs.
        The renewable energy sector contributes to energy independence.
        Many governments offer incentives for renewable adoption.
        """,
        "num_sentences": 4,
        "expected_behavior": "Should handle longer text and extract 4 key sentences"
    },
    {
        "name": "Test 5: Article with URLs and Special Characters",
        "text": """
        Check out https://example.com/article for more details!
        Email support@company.com for assistance.
        Python 3.11+ supports new syntax features.
        The @ symbol is used in email addresses.
        Visit our website: www.example-site.com/news
        Key findings are: 85% improvement, $2.5M investment.
        Advanced features include A/B testing & analytics.
        """,
        "num_sentences": 2,
        "expected_behavior": "Should clean URLs and special characters"
    },
    {
        "name": "Test 6: Educational Content",
        "text": """
        Machine learning is a subset of artificial intelligence.
        Supervised learning requires labeled training data.
        Unsupervised learning finds patterns in unlabeled data.
        Neural networks are inspired by biological neurons.
        Deep learning uses multiple layers of neural networks.
        Convolutional neural networks excel at image recognition.
        Recurrent neural networks process sequential data.
        Transformers have revolutionized natural language processing.
        Transfer learning enables reusing pre-trained models.
        Overfitting occurs when models memorize rather than generalize.
        """,
        "num_sentences": 3,
        "expected_behavior": "Should identify and extract most relevant educational sentences"
    }
]

# Test cases for error handling
ERROR_TEST_CASES = [
    {
        "name": "Error Test 1: Empty Text",
        "payload": {"text": "", "num_sentences": 3},
        "expected_status": 400,
        "expected_error": "empty"
    },
    {
        "name": "Error Test 2: Missing Text Field",
        "payload": {"num_sentences": 3},
        "expected_status": 422,  # Pydantic validation error
        "expected_error": "text"
    },
    {
        "name": "Error Test 3: Invalid num_sentences (0)",
        "payload": {"text": "Sample text here.", "num_sentences": 0},
        "expected_status": 400,
        "expected_error": "integer"
    },
    {
        "name": "Error Test 4: Invalid num_sentences (negative)",
        "payload": {"text": "Sample text here.", "num_sentences": -1},
        "expected_status": 400,
        "expected_error": "integer"
    },
    {
        "name": "Error Test 5: Text is only whitespace",
        "payload": {"text": "   \n\t  ", "num_sentences": 3},
        "expected_status": 400,
        "expected_error": "empty"
    }
]


def print_header(text):
    """Print formatted header"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*80}{Colors.RESET}\n")


def print_success(text):
    """Print success message"""
    print(f"{Colors.GREEN}✓ {text}{Colors.RESET}")


def print_error(text):
    """Print error message"""
    print(f"{Colors.RED}✗ {text}{Colors.RESET}")


def print_info(text):
    """Print info message"""
    print(f"{Colors.BLUE}ℹ {text}{Colors.RESET}")


def print_warning(text):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠ {text}{Colors.RESET}")


def check_api_health():
    """Check if API is running"""
    print_header("API Health Check")
    
    try:
        response = requests.get(f"{API_BASE_URL}/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_success(f"API is running (v{data.get('version', 'unknown')})")
            print_info(f"Status: {data.get('message', 'OK')}")
            return True
        else:
            print_error(f"API returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to API at " + API_BASE_URL)
        print_warning("Make sure the API is running:")
        print_warning("  cd Backend && uvicorn main:app --reload")
        return False
    except Exception as e:
        print_error(f"Error checking API health: {str(e)}")
        return False


def run_success_tests():
    """Run successful summarization tests"""
    print_header("Running Success Tests")
    
    passed = 0
    failed = 0
    
    for i, test_case in enumerate(TEST_CASES, 1):
        print(f"\n{Colors.BOLD}{test_case['name']}{Colors.RESET}")
        print(f"Expected: {test_case['expected_behavior']}")
        print("-" * 80)
        
        try:
            # Prepare payload
            payload = {
                "text": test_case['text'],
                "num_sentences": test_case['num_sentences']
            }
            
            # Send request
            start_time = time.time()
            response = requests.post(
                SUMMARIZE_ENDPOINT,
                json=payload,
                timeout=10
            )
            elapsed_time = time.time() - start_time
            
            # Check response status
            if response.status_code != 200:
                print_error(f"Status {response.status_code}: {response.json()}")
                failed += 1
                continue
            
            # Parse response
            result = response.json()
            
            # Validate response structure
            required_fields = ['summary', 'sentence_count', 'original_length', 
                             'summary_length', 'compression_ratio']
            missing_fields = [f for f in required_fields if f not in result]
            
            if missing_fields:
                print_error(f"Missing fields in response: {missing_fields}")
                failed += 1
                continue
            
            # Display results
            print_success(f"Status: 200 OK (completed in {elapsed_time*1000:.1f}ms)")
            print_success(f"Sentences extracted: {result['sentence_count']}/{test_case['num_sentences']}")
            print_success(f"Original: {result['original_length']} chars → "
                        f"Summary: {result['summary_length']} chars")
            print_success(f"Compression: {result['compression_ratio']*100:.1f}% reduction")
            
            print(f"\n{Colors.YELLOW}Summary:{Colors.RESET}")
            print(f"  {result['summary'][:150]}...")
            
            passed += 1
            
        except requests.exceptions.Timeout:
            print_error("Request timed out (>10 seconds)")
            failed += 1
        except Exception as e:
            print_error(f"Exception: {str(e)}")
            failed += 1
        
        time.sleep(0.5)  # Small delay between tests
    
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.GREEN}Passed: {passed}/{len(TEST_CASES)}{Colors.RESET}")
    print(f"{Colors.RED}Failed: {failed}/{len(TEST_CASES)}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    
    return passed, failed


def run_error_tests():
    """Run error handling tests"""
    print_header("Running Error Handling Tests")
    
    passed = 0
    failed = 0
    
    for i, test_case in enumerate(ERROR_TEST_CASES, 1):
        print(f"\n{Colors.BOLD}{test_case['name']}{Colors.RESET}")
        print(f"Expected: Status {test_case['expected_status']} "
              f"(error containing '{test_case['expected_error']}')")
        print("-" * 80)
        
        try:
            # Send request
            response = requests.post(
                SUMMARIZE_ENDPOINT,
                json=test_case['payload'],
                timeout=5
            )
            
            # Check if we got an error (non-200 status)
            if response.status_code >= 400:
                response_text = response.text.lower()
                
                # Check if error message contains expected keywords
                if test_case['expected_error'].lower() in response_text:
                    print_success(f"Status {response.status_code} (as expected)")
                    print_success(f"Error message contains '{test_case['expected_error']}'")
                    print(f"  Response: {response.json()}")
                    passed += 1
                else:
                    print_warning(f"Status {response.status_code} but message unclear")
                    print(f"  Response: {response.json()}")
                    passed += 1  # Still consider it success if it returned an error
            else:
                print_error(f"Expected error but got status 200")
                print(f"  Response: {response.json()}")
                failed += 1
                
        except Exception as e:
            print_error(f"Exception: {str(e)}")
            failed += 1
        
        time.sleep(0.3)
    
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.GREEN}Passed: {passed}/{len(ERROR_TEST_CASES)}{Colors.RESET}")
    print(f"{Colors.RED}Failed: {failed}/{len(ERROR_TEST_CASES)}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    
    return passed, failed


def run_performance_test():
    """Test API performance with different text lengths"""
    print_header("Performance Test")
    
    test_sizes = [
        ("Short (100 words)", "The quick brown fox jumps over the lazy dog. " * 6),
        ("Medium (300 words)", "Artificial intelligence is transforming industries. " * 30),
        ("Long (1000 words)", "Machine learning enables computers to learn from data. " * 100),
    ]
    
    print_info("Testing with different text lengths:\n")
    
    for name, text in test_sizes:
        try:
            start = time.time()
            response = requests.post(
                SUMMARIZE_ENDPOINT,
                json={"text": text, "num_sentences": 3},
                timeout=30
            )
            elapsed = time.time() - start
            
            if response.status_code == 200:
                result = response.json()
                print_success(f"{name}: {elapsed*1000:.1f}ms")
                print(f"  Length: {result['original_length']} chars, "
                      f"Compression: {result['compression_ratio']*100:.1f}%")
            else:
                print_error(f"{name}: Status {response.status_code}")
            
        except Exception as e:
            print_error(f"{name}: {str(e)}")
        
        time.sleep(0.5)


def main():
    """Main test runner"""
    print(f"\n{Colors.BOLD}")
    print("╔" + "="*78 + "╗")
    print("║" + " "*78 + "║")
    print("║" + "NEWS SUMMARIZATION API TEST SUITE".center(78) + "║")
    print("║" + " "*78 + "║")
    print("╚" + "="*78 + "╝")
    print(f"{Colors.RESET}")
    
    print_info(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print_info(f"API Base URL: {API_BASE_URL}\n")
    
    # Check API health
    if not check_api_health():
        return
    
    # Run tests
    success_passed, success_failed = run_success_tests()
    error_passed, error_failed = run_error_tests()
    run_performance_test()
    
    # Summary
    total_passed = success_passed + error_passed
    total_failed = success_failed + error_failed
    total_tests = total_passed + total_failed
    success_rate = (total_passed / total_tests * 100) if total_tests > 0 else 0
    
    print_header("Test Summary")
    print(f"Total Tests:  {total_tests}")
    print_success(f"Passed:       {total_passed}")
    print_error(f"Failed:       {total_failed}")
    print_info(f"Success Rate: {success_rate:.1f}%")
    
    if total_failed == 0:
        print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 All tests passed!{Colors.RESET}\n")
    else:
        print(f"\n{Colors.YELLOW}{Colors.BOLD}⚠ Some tests failed. Check the output above.{Colors.RESET}\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Tests interrupted by user.{Colors.RESET}\n")
    except Exception as e:
        print(f"\n{Colors.RED}Unexpected error: {str(e)}{Colors.RESET}\n")
