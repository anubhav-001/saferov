# Computer Vision Models for Smart Tourist Safety System

## Overview

This document provides information about the Computer Vision models implemented in the Smart Tourist Safety System. These models enhance tourist safety through facial recognition for identity verification and crowd density analysis for monitoring tourist areas.

## Models

### 1. TouristVerificationSystem

A facial recognition system that verifies tourist identities using face recognition technology.

#### Features
- Face Registration: Registers tourist faces for future verification
- Face Verification: Verifies tourist identity by comparing with registered face data
- Confidence Threshold: Configurable matching threshold for verification accuracy

### 2. CrowdAnalysisSystem

A crowd density analysis system that detects and counts people in images to assess crowd levels in tourist areas.

#### Features
- Person Detection: Identifies people in images using YOLO object detection
- Crowd Density Calculation: Computes density score based on person count and area
- Area Analysis: Considers the image area for accurate density assessment
- Confidence Scoring: Provides confidence levels for detections

## API Endpoints

### Tourist Verification Endpoints

#### 1. Register Tourist Face
```
POST /api/tourist/register-face
```

#### 2. Verify Tourist Face
```
POST /api/tourist/verify-face
```

### Crowd Analysis Endpoints

#### 1. Analyze Crowd Density
```
POST /api/crowd/analyze
```

## Integration with Smart Tourist Safety System

The Computer Vision models integrate with other components of the Smart Tourist Safety System:

1. **Tourist Verification**: Works with the tourist registration system to verify tourist identities
2. **Crowd Analysis**: Provides input to the GeoFencingSystem and RealTimeTourismAnalytics
3. **Safety Recommendations**: Generates safety recommendations based on crowd density analysis

## Dependencies
- face_recognition: For facial recognition and encoding
- opencv-python (cv2): For image processing and YOLO implementation
- numpy: For numerical operations
- YOLOv4 weights and configuration: Required for the CrowdAnalysisSystem

## Testing
- Unit Tests (test_computer_vision.py): Tests the core functionality of the Computer Vision models
- API Tests (test_computer_vision_api.py): Tests the API endpoints for the Computer Vision models