import sys
import os

# Add the current directory to the path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_models import GeoFencingSystem
from config import settings

def test_geofencing_system():
    print("Testing GeoFencingSystem...\n")
    
    # Create a GeoFencingSystem instance
    geo_system = GeoFencingSystem()
    
    # Add some risk zones
    # Delhi Red Fort area (high risk)
    delhi_coordinates = [
        [28.656450, 77.241500],  # [lat, lng]
        [28.656450, 77.244000],
        [28.654000, 77.244000],
        [28.654000, 77.241500]
    ]
    geo_system.add_risk_zone("delhi_red_fort", delhi_coordinates, 8)
    
    # Mumbai Gateway area (medium risk)
    mumbai_coordinates = [
        [18.922000, 72.834000],
        [18.922000, 72.836000],
        [18.920000, 72.836000],
        [18.920000, 72.834000]
    ]
    geo_system.add_risk_zone("mumbai_gateway", mumbai_coordinates, 5)
    
    # Test locations
    test_locations = [
        # Inside Delhi risk zone
        {"name": "Inside Delhi Red Fort", "lat": 28.655000, "lng": 77.242500},
        # Outside Delhi risk zone
        {"name": "Outside Delhi Red Fort", "lat": 28.657000, "lng": 77.245000},
        # Inside Mumbai risk zone
        {"name": "Inside Mumbai Gateway", "lat": 28.921000, "lng": 72.835000},
        # Random safe location
        {"name": "Safe Location", "lat": 22.567000, "lng": 88.347000}
    ]
    
    # Check risk levels for test locations
    print("Checking risk levels for test locations:")
    for location in test_locations:
        risk_level = geo_system.check_location_risk(location["lat"], location["lng"])
        print(f"Location: {location['name']} - Risk Level: {risk_level}/10")
    
    # Test alert generation
    print("\nTesting alert generation:")
    high_risk_location = test_locations[0]  # Delhi Red Fort location
    tourist_id = "TOURIST123"
    
    # Disable actual SMS sending for test
    original_send_method = geo_system._send_emergency_alert
    geo_system._send_emergency_alert = lambda alert_data: print(f"Alert would be sent: {alert_data}")
    
    # Generate alert
    alert = geo_system.generate_alert(
        tourist_id, 
        high_risk_location["lat"], 
        high_risk_location["lng"], 
        8
    )
    
    print(f"\nAlert generated: {alert}")
    print("\nGeoFencingSystem test completed successfully!")

if __name__ == "__main__":
    test_geofencing_system()