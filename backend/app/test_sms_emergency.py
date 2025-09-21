import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_sms_emergency_endpoint():
    print("===== TESTING SMS EMERGENCY ENDPOINT =====\n")
    
    # Test cases with different emergency levels and languages
    test_cases = [
        {
            "from_number": "+1234567890",
            "message": "Help! I've fallen and injured my leg near the waterfall. Need medical help!",
            "description": "High emergency in English",
            "location_data": {"latitude": 12.3456, "longitude": 78.9012}
        },
        {
            "from_number": "+9198765432",
            "message": "मदद करो! मैं पहाड़ी पर खो गया हूँ और मेरे पास पानी नहीं है",
            "description": "Medium emergency in Hindi",
            "location_data": None
        },
        {
            "from_number": "+4412345678",
            "message": "I'm enjoying my vacation at the beach resort",
            "description": "No emergency in English",
            "location_data": {"latitude": 34.5678, "longitude": 56.7890}
        }
    ]
    
    for i, test_case in enumerate(test_cases):
        print(f"Test Case {i+1}: {test_case['description']}")
        print(f"From: {test_case['from_number']}")
        print(f"Message: {test_case['message'][:30]}...")
        
        try:
            # Make API request
            payload = {
                "from_number": test_case["from_number"],
                "message": test_case["message"],
                "timestamp": "2023-06-15T12:34:56Z",
                "location_data": test_case["location_data"]
            }
            
            response = requests.post(
                f"{BASE_URL}/api/emergency/sms",
                json=payload
            )
            
            # Check if request was successful
            if response.status_code == 200:
                result = response.json()
                print(f"Status: {result['status']}")
                print(f"Emergency Level: {result['emergency_level']}/10")
                print(f"Language Detected: {result['language_detected']}")
                print(f"Requires Immediate Response: {result['requires_immediate_response']}")
                print(f"EFIR Generated: {result.get('efir_generated', False)}")
                if result.get('efir_generated', False):
                    print(f"EFIR Number: {result['efir_number']}")
                print(f"Extracted Info: {result['extracted_info']}")
            else:
                print(f"Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Exception: {str(e)}")
        
        print("\n" + "-"*50 + "\n")
    
    print("===== SMS EMERGENCY TESTING COMPLETED =====\n")

if __name__ == "__main__":
    test_sms_emergency_endpoint()