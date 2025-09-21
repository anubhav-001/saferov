import requests
import json

def test_geofencing_api():
    print("Testing GeoFencingSystem API Endpoints...\n")
    
    # Base URL for API
    base_url = "http://localhost:8000"
    
    # Test data
    delhi_risk_zone = {
        "zone_id": "delhi_red_fort",
        "coordinates": [
            [28.656450, 77.241500],
            [28.656450, 77.244000],
            [28.654000, 77.244000],
            [28.654000, 77.241500]
        ],
        "risk_level": 8
    }
    
    test_location = {
        "latitude": 28.655000,
        "longitude": 77.242500
    }
    
    tourist_id = "TOURIST123"
    
    # Test 1: Add Risk Zone
    print("1. Testing Add Risk Zone API...")
    try:
        response = requests.post(
            f"{base_url}/api/geo/risk-zone",
            json=delhi_risk_zone
        )
        print(f"Response: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: Check Location Risk
    print("\n2. Testing Check Location Risk API...")
    try:
        response = requests.post(
            f"{base_url}/api/geo/check-location",
            json=test_location
        )
        print(f"Response: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: Generate Alert
    print("\n3. Testing Generate Alert API...")
    try:
        response = requests.post(
            f"{base_url}/api/geo/alert/{tourist_id}",
            json=test_location
        )
        print(f"Response: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\nGeoFencingSystem API test completed!")

if __name__ == "__main__":
    test_geofencing_api()