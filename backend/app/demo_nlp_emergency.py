from ai_models import MultilingualEmergencyProcessor, AutomatedEFIRGenerator
import json

def demo_emergency_processing():
    print("===== DEMO: MULTILINGUAL EMERGENCY PROCESSING =====\n")
    
    # Initialize processors
    emergency_processor = MultilingualEmergencyProcessor()
    efir_generator = AutomatedEFIRGenerator()
    
    # Sample emergency messages in different languages
    emergency_messages = [
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
    
    # Process each message
    for i, message in enumerate(emergency_messages):
        print(f"\nMessage {i+1}: {message['description']}")
        print(f"Text: {message['text']}")
        
        # Process the emergency text
        result = emergency_processor.process_emergency_text(message['text'], message['language'])
        
        print(f"\nProcessing Results:")
        print(f"Language Detected: {result['language']}")
        print(f"Emergency Level: {result['emergency_level']}/10")
        print(f"Requires Immediate Response: {result['requires_immediate_response']}")
        print(f"Extracted Information:")
        for key, value in result['extracted_info'].items():
            print(f"  - {key.replace('_', ' ').title()}: {value}")
        
        # Generate EFIR if needed
        if result['requires_immediate_response']:
            print("\nGenerating E-FIR...")
            incident_data = {
                'tourist_id': 'T12345',
                'tourist_name': 'John Doe',
                'nationality': 'USA',
                'passport_number': 'A1234567',
                'contact_number': '+1234567890',
                'incident_type': 'EMERGENCY_ALERT',
                'severity': 'HIGH' if result['emergency_level'] >= 8 else 'MEDIUM',
                'last_activity': 'Tourism',
                'circumstances': f"Emergency text received: {message['text']}",
                'last_location': {'latitude': 12.3456, 'longitude': 78.9012},
                'extracted_info': result['extracted_info']
            }
            
            efir = efir_generator.generate_efir(incident_data)
            print(f"E-FIR Generated: {efir['complaint_number']}")
            print(f"E-FIR Details:\n{json.dumps(efir, indent=2)}")
        
        print("\n" + "-"*50)
    
    print("\n===== DEMO COMPLETED =====\n")

if __name__ == "__main__":
    demo_emergency_processing()