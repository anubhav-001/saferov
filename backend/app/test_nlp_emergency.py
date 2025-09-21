import unittest
from unittest.mock import MagicMock, patch

# Mock the transformers pipeline to avoid dependency issues
class MockPipeline:
    def __call__(self, text):
        return [{'translation_text': f"Translated: {text}"}]

# Create a patch for the pipeline import
patch('transformers.pipeline', return_value=MockPipeline()).start()

# Now import the processor
from ai_models import MultilingualEmergencyProcessor

class TestMultilingualEmergencyProcessor(unittest.TestCase):
    def setUp(self):
        # Initialize the processor
        self.processor = MultilingualEmergencyProcessor()
    
    def test_language_detection(self):
        # Test English detection
        self.assertEqual(self.processor._detect_language("Help me, I'm lost"), "english")
        
        # Test Hindi detection
        self.assertEqual(self.processor._detect_language("मदद करो, मैं खो गया हूँ"), "hindi")
        
        # Test Bengali detection
        self.assertEqual(self.processor._detect_language("সাহায্য করুন, আমি হারিয়ে গেছি"), "bengali")
        
        # Test Tamil detection
        self.assertEqual(self.processor._detect_language("உதவி செய்யுங்கள், நான் தொலைந்து போனேன்"), "tamil")
    
    def test_emergency_level_assessment(self):
        # Test high emergency level
        self.assertEqual(self.processor._assess_emergency_level("Help! Emergency! I'm injured in an accident"), 9)
        
        # Test medium emergency level
        self.assertEqual(self.processor._assess_emergency_level("Help, I'm lost"), 7)
        
        # Test low emergency level
        self.assertEqual(self.processor._assess_emergency_level("I'm confused about the directions"), 5)
        
        # Test minimal emergency level
        self.assertEqual(self.processor._assess_emergency_level("The view is beautiful here"), 3)
    
    def test_info_extraction(self):
        # Test location extraction
        info = self.processor._extract_emergency_info("I need help at the beach near the lighthouse")
        self.assertTrue(info['location_mentioned'])
        
        # Test injury extraction
        info = self.processor._extract_emergency_info("I'm hurt and bleeding after falling")
        self.assertTrue(info['injury_mentioned'])
        
        # Test contact request extraction
        info = self.processor._extract_emergency_info("Please call my emergency contact")
        self.assertTrue(info['contact_requested'])
        
        # Test transport need extraction
        info = self.processor._extract_emergency_info("I need an ambulance immediately")
        self.assertTrue(info['transport_needed'])
    
    def test_full_processing(self):
        # Test English emergency
        result = self.processor.process_emergency_text("Help! I'm injured near the waterfall. Need ambulance!")
        self.assertEqual(result['language'], 'english')
        self.assertTrue(result['emergency_level'] >= 7)
        self.assertTrue(result['requires_immediate_response'])
        self.assertTrue(result['extracted_info']['location_mentioned'])
        self.assertTrue(result['extracted_info']['injury_mentioned'])
        self.assertTrue(result['extracted_info']['transport_needed'])
        
        # Test non-emergency
        result = self.processor.process_emergency_text("The weather is nice today at the beach")
        self.assertEqual(result['language'], 'english')
        self.assertTrue(result['emergency_level'] < 7)
        self.assertFalse(result['requires_immediate_response'])
        self.assertTrue(result['extracted_info']['location_mentioned'])
        self.assertFalse(result['extracted_info']['injury_mentioned'])

if __name__ == "__main__":
    print("===== TESTING MULTILINGUAL EMERGENCY PROCESSOR =====\n")
    unittest.main(argv=['first-arg-is-ignored'], exit=False)
    print("\n===== ALL TESTS COMPLETED =====\n")
    
    # Manual test examples
    processor = MultilingualEmergencyProcessor()
    
    test_cases = [
        "Help! I've fallen and injured my leg near the waterfall. Need medical help!",
        "मदद करो! मैं पहाड़ी पर खो गया हूँ और मेरे पास पानी नहीं है",  # Hindi: Help! I'm lost on the mountain and don't have water
        "I'm enjoying my vacation at the beach resort",
        "உதவி! நான் காட்டில் தொலைந்து போனேன், என்னை காப்பாற்றுங்கள்"  # Tamil: Help! I'm lost in the forest, save me
    ]
    
    print("===== MANUAL TEST EXAMPLES =====\n")
    for i, text in enumerate(test_cases):
        result = processor.process_emergency_text(text)
        print(f"Example {i+1}: {text[:30]}...")
        print(f"  Language: {result['language']}")
        print(f"  Emergency Level: {result['emergency_level']}/10")
        print(f"  Requires Immediate Response: {result['requires_immediate_response']}")
        print(f"  Extracted Info: {result['extracted_info']}")
        print()
    
    print("===== MANUAL TESTS COMPLETED =====\n")