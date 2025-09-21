import unittest
import numpy as np
import os
from ai_models import TouristVerificationSystem, CrowdAnalysisSystem

class TestTouristVerificationSystem(unittest.TestCase):
    def setUp(self):
        self.verification_system = TouristVerificationSystem()
        
        # Create a mock image for testing
        self.test_image_path = 'test_face.jpg'
        if not os.path.exists(self.test_image_path):
            # Create a dummy image file for testing
            dummy_image = np.ones((300, 300, 3), dtype=np.uint8) * 255
            try:
                import cv2
                cv2.imwrite(self.test_image_path, dummy_image)
            except ImportError:
                # If cv2 is not available, we'll use the mock
                with open(self.test_image_path, 'wb') as f:
                    f.write(b'dummy image content')
    
    def tearDown(self):
        # Clean up test image
        if os.path.exists(self.test_image_path):
            os.remove(self.test_image_path)
    
    def test_register_tourist_face(self):
        # Test face registration
        result = self.verification_system.register_tourist_face('tourist123', self.test_image_path)
        self.assertTrue(result)
        self.assertIn('tourist123', self.verification_system.known_faces)
    
    def test_verify_tourist(self):
        # Register a face first
        self.verification_system.register_tourist_face('tourist123', self.test_image_path)
        
        # Test verification with same image
        try:
            import face_recognition
            current_image = face_recognition.load_image_file(self.test_image_path)
        except ImportError:
            # Use mock data if face_recognition is not available
            current_image = np.ones((300, 300, 3), dtype=np.uint8) * 255
            
        result = self.verification_system.verify_tourist('tourist123', current_image)
        self.assertTrue(result)
        
        # Test verification with unknown tourist
        result = self.verification_system.verify_tourist('unknown_tourist', current_image)
        self.assertFalse(result)


class TestCrowdAnalysisSystem(unittest.TestCase):
    def setUp(self):
        self.crowd_system = CrowdAnalysisSystem()
        
        # Create a mock image for testing
        self.test_image_path = 'test_crowd.jpg'
        if not os.path.exists(self.test_image_path):
            # Create a dummy image file for testing
            dummy_image = np.ones((416, 416, 3), dtype=np.uint8) * 255
            try:
                import cv2
                cv2.imwrite(self.test_image_path, dummy_image)
            except ImportError:
                # If cv2 is not available, we'll use the mock
                with open(self.test_image_path, 'wb') as f:
                    f.write(b'dummy image content')
    
    def tearDown(self):
        # Clean up test image
        if os.path.exists(self.test_image_path):
            os.remove(self.test_image_path)
    
    def test_analyze_crowd_density_with_path(self):
        # Test crowd analysis with image path
        result = self.crowd_system.analyze_crowd_density(self.test_image_path)
        
        # Verify the structure of the result
        self.assertIsInstance(result, dict)
        self.assertIn('person_count', result)
        self.assertIn('density_score', result)
        self.assertIn('average_confidence', result)
        self.assertIn('area_analyzed', result)
    
    def test_analyze_crowd_density_with_array(self):
        # Test crowd analysis with numpy array
        image_array = np.ones((416, 416, 3), dtype=np.uint8) * 255
        result = self.crowd_system.analyze_crowd_density(image_array)
        
        # Verify the structure of the result
        self.assertIsInstance(result, dict)
        self.assertIn('person_count', result)
        self.assertIn('density_score', result)
        self.assertIn('average_confidence', result)
        self.assertIn('area_analyzed', result)


if __name__ == '__main__':
    unittest.main()