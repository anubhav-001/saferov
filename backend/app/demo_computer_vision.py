import os
import numpy as np
from ai_models import TouristVerificationSystem, CrowdAnalysisSystem

def create_test_image(filename, width=416, height=416):
    """Create a test image for demo purposes"""
    # Create a dummy image
    image = np.ones((height, width, 3), dtype=np.uint8) * 255
    
    # Add some random shapes to simulate faces or people
    for _ in range(5):
        x1, y1 = np.random.randint(0, width-50), np.random.randint(0, height-50)
        x2, y2 = x1 + 50, y1 + 50
        color = tuple(np.random.randint(0, 255, 3).tolist())
        
        # Draw rectangle
        image[y1:y2, x1:x2] = color
    
    # Save the image
    try:
        import cv2
        cv2.imwrite(filename, image)
        print(f"Created test image: {filename}")
        return True
    except ImportError:
        # If cv2 is not available, create a simple file
        with open(filename, 'wb') as f:
            f.write(b'dummy image content')
        print(f"Created dummy file: {filename} (cv2 not available)")
        return True
    except Exception as e:
        print(f"Failed to create image: {e}")
        return False


def demo_tourist_verification():
    print("\n===== TOURIST VERIFICATION DEMO =====")
    verification_system = TouristVerificationSystem()
    
    # Create test images for different tourists
    tourist_ids = ['tourist001', 'tourist002', 'tourist003']
    image_paths = {}
    
    for tourist_id in tourist_ids:
        image_path = f"{tourist_id}_face.jpg"
        if create_test_image(image_path, 300, 300):
            image_paths[tourist_id] = image_path
    
    # Register tourist faces
    print("\nRegistering tourist faces...")
    for tourist_id, image_path in image_paths.items():
        result = verification_system.register_tourist_face(tourist_id, image_path)
        print(f"Registered {tourist_id}: {result}")
    
    # Verify tourists
    print("\nVerifying tourist identities...")
    for tourist_id, image_path in image_paths.items():
        try:
            import face_recognition
            current_image = face_recognition.load_image_file(image_path)
        except ImportError:
            # Use mock data if face_recognition is not available
            current_image = np.ones((300, 300, 3), dtype=np.uint8) * 255
        
        # Verify correct tourist
        result = verification_system.verify_tourist(tourist_id, current_image)
        print(f"Verifying {tourist_id} with correct image: {result}")
        
        # Try to verify with wrong tourist ID
        wrong_id = [tid for tid in tourist_ids if tid != tourist_id][0]
        result = verification_system.verify_tourist(wrong_id, current_image)
        print(f"Verifying {wrong_id} with {tourist_id}'s image: {result}")
    
    # Clean up test images
    for image_path in image_paths.values():
        if os.path.exists(image_path):
            os.remove(image_path)


def demo_crowd_analysis():
    print("\n===== CROWD ANALYSIS DEMO =====")
    crowd_system = CrowdAnalysisSystem()
    
    # Create test images with different dimensions to simulate different areas
    test_images = [
        ('small_area.jpg', 416, 416),      # Small area
        ('medium_area.jpg', 832, 624),     # Medium area
        ('large_area.jpg', 1248, 936)      # Large area
    ]
    
    image_paths = []
    for filename, width, height in test_images:
        if create_test_image(filename, width, height):
            image_paths.append(filename)
    
    # Analyze crowd density in different images
    print("\nAnalyzing crowd density in different areas...")
    for image_path in image_paths:
        result = crowd_system.analyze_crowd_density(image_path)
        print(f"\nAnalysis for {image_path}:")
        print(f"  Person count: {result['person_count']}")
        print(f"  Density score (0-10): {result['density_score']:.2f}")
        print(f"  Average confidence: {result['average_confidence']:.2f}")
        print(f"  Area analyzed (sq m): {result['area_analyzed']:.2f}")
    
    # Clean up test images
    for image_path in image_paths:
        if os.path.exists(image_path):
            os.remove(image_path)


if __name__ == "__main__":
    print("===== COMPUTER VISION MODELS DEMO =====")
    print("This demo showcases the Tourist Verification System and Crowd Analysis System")
    
    # Run the demos
    demo_tourist_verification()
    demo_crowd_analysis()
    
    print("\n===== DEMO COMPLETED =====")