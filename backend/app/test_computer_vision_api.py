import unittest
import os
import shutil
import tempfile
from fastapi.testclient import TestClient
from main import app

class TestComputerVisionAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        
        # Create temporary directories for test files
        self.test_dir = tempfile.mkdtemp()
        self.face_dir = os.path.join(self.test_dir, "face_images")
        self.temp_dir = os.path.join(self.test_dir, "temp_images")
        os.makedirs(self.face_dir, exist_ok=True)
        os.makedirs(self.temp_dir, exist_ok=True)
        
        # Create a test image
        self.test_image_path = os.path.join(self.test_dir, "test_face.jpg")
        with open(self.test_image_path, "wb") as f:
            f.write(b"dummy image content")
    
    def tearDown(self):
        # Clean up test directories
        shutil.rmtree(self.test_dir)
    
    def test_register_face_endpoint(self):
        # Test face registration endpoint
        with open(self.test_image_path, "rb") as f:
            response = self.client.post(
                "/api/tourist/register-face",
                files={"image": ("test_face.jpg", f, "image/jpeg")},
                data={"tourist_id": "test_tourist_001"}
            )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["tourist_id"], "test_tourist_001")
    
    def test_verify_face_endpoint(self):
        # First register a face
        with open(self.test_image_path, "rb") as f:
            self.client.post(
                "/api/tourist/register-face",
                files={"image": ("test_face.jpg", f, "image/jpeg")},
                data={"tourist_id": "test_tourist_002"}
            )
        
        # Then verify the face
        with open(self.test_image_path, "rb") as f:
            response = self.client.post(
                "/api/tourist/verify-face",
                files={"image": ("test_face.jpg", f, "image/jpeg")},
                data={"tourist_id": "test_tourist_002"}
            )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertTrue(data["verified"])
        self.assertEqual(data["tourist_id"], "test_tourist_002")
    
    def test_verify_face_failure(self):
        # Try to verify a face that hasn't been registered
        with open(self.test_image_path, "rb") as f:
            response = self.client.post(
                "/api/tourist/verify-face",
                files={"image": ("test_face.jpg", f, "image/jpeg")},
                data={"tourist_id": "nonexistent_tourist"}
            )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "failed")
        self.assertFalse(data["verified"])
    
    def test_crowd_analysis_endpoint(self):
        # Test crowd analysis endpoint
        with open(self.test_image_path, "rb") as f:
            response = self.client.post(
                "/api/crowd/analyze",
                files={"image": ("test_crowd.jpg", f, "image/jpeg")},
                data={"location_id": "location_001"}
            )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        
        # Check crowd analysis result structure
        crowd_data = data["crowd_analysis"]
        self.assertIn("person_count", crowd_data)
        self.assertIn("density_score", crowd_data)
        self.assertIn("average_confidence", crowd_data)
        self.assertIn("area_analyzed", crowd_data)
        self.assertIn("safety_recommendation", crowd_data)
        self.assertEqual(crowd_data["location_id"], "location_001")


if __name__ == "__main__":
    unittest.main()