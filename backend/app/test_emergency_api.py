import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_emergency_text_processing():
    print("===== TESTING EMERGENCY TEXT PROCESSING API =====\n")
    
    # Test cases with different languages and emergency levels
    test_cases = [
        {
            "text": "Help! I've fallen and injured my leg near the waterfall. Need medical help!",
            "language": "english",
            "description": "High emergency in English"
        },
        {
            "text": "मदद करो! मैं पहाड़ी पर खो गया हूँ और मेरे पास पानी नहीं है",
            "language": "auto",  # Should detect Hindi
            "description": "Medium emergency in Hindi"
        },
        {
            "text": "I'm enjoying my vacation at the beach resort",
            "language": "english",
            "description": "No emergency in English"
        },
        {
            "text": "உதவி! நான் காட்டில் தொலைந்து போனேன், என்னை காப்பாற்றுங்கள்",
            "language": "auto",  # Should detect Tamil
            "description": "High emergency in Tamil"
        }
    ]
    
    for i, test_case in enumerate(test_cases):
        print(f"Test Case {i+1}: {test_case['description']}")
        print(f"Text: {test_case['text'][:30]}...")
        
        try:
            # Make API request
            response = requests.post(
                f"{BASE_URL}/api/emergency/process-text",
                json={
                    "text": test_case["text"],
                    "language": test_case["language"]
                }
            )
            
            # Check if request was successful
            if response.status_code == 200:
                result = response.json()
                print(f"Status: {result['status']}")
                print(f"Language Detected: {result['emergency_analysis']['language']}")
                print(f"Emergency Level: {result['emergency_analysis']['emergency_level']}/10")
                print(f"Requires Immediate Response: {result['emergency_analysis']['requires_immediate_response']}")
                print(f"EFIR Generated: {result['emergency_analysis']['efir_generated']}")
                if result['emergency_analysis']['efir_generated']:
                    print(f"EFIR Number: {result['emergency_analysis']['efir_number']}")
                print(f"Extracted Info: {result['emergency_analysis']['extracted_info']}")
            else:
                print(f"Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Exception: {str(e)}")
        
        print("\n" + "-"*50 + "\n")
    
    print("===== API TESTING COMPLETED =====\n")

if __name__ == "__main__":
    test_emergency_text_processing()