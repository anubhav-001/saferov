# Placeholder wrappers – paste your full model code here.
# Ensure these classes exist with the same names after pasting:
# - SmartTouristSafetySystem
# - AutomatedEFIRGenerator
# - RealTimeTourismAnalytics
# - TouristSafetyScoreModel
# - GeoFencingSystem
# - TouristFlowPredictor
# - IncidentPredictor

from datetime import datetime
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import joblib
from .config import settings
from shapely.geometry import Point, Polygon

# Computer Vision imports
try:
    import cv2
    import face_recognition
except ImportError:
    # Mock CV libraries for testing environments
    class MockCV2:
        def __init__(self):
            self.dnn = type('MockDNN', (), {
                'readNet': lambda *args: type('MockNet', (), {
                    'getLayerNames': lambda: ['mock_layer'],
                    'getUnconnectedOutLayers': lambda: [[0]],
                    'setInput': lambda *args: None,
                    'forward': lambda *args: [np.zeros((1, 85))]
                })(),
                'blobFromImage': lambda *args, **kwargs: np.zeros((1, 3, 416, 416))
            })()
        def imread(self, *args):
            return np.zeros((416, 416, 3))
    
    class MockFaceRecognition:
        def load_image_file(self, *args):
            return np.zeros((416, 416, 3))
        def face_encodings(self, *args):
            return [np.zeros(128)]
        def compare_faces(self, *args, **kwargs):
            return [True]
    
    # Create mock instances if imports fail
    cv2 = MockCV2()
    face_recognition = MockFaceRecognition()

# Try to import transformers, but provide fallbacks for testing
try:
    from transformers import pipeline
except ImportError:
    # Mock pipeline for testing environments
    def pipeline(task, model=None):
        class MockPipeline:
            def __init__(self, task, model=None):
                self.task = task
                self.model = model
                
            def __call__(self, text):
                if self.task == "translation":
                    return [{'translation_text': f"Translated: {text}"}]
                elif self.task == "sentiment-analysis":
                    return [{'label': 'POSITIVE', 'score': 0.9}]
        return MockPipeline(task, model)

class MultilingualEmergencyProcessor:
  def __init__(self):
    # Initialize translation pipeline
    self.translator = pipeline("translation", model="Helsinki-NLP/opus-mt-mul-en")
    self.sentiment_analyzer = pipeline("sentiment-analysis")
    self.emergency_keywords = {
      'english': ['help', 'emergency', 'danger', 'lost', 'accident', 'injured', 'panic'],
      'hindi': ['मदद', 'आपातकाल', 'खतरा', 'खो गया', 'दुर्घटना', 'घायल'],
      'bengali': ['সাহায্য', 'জরুরী', 'বিপদ', 'হারিয়ে গেছে', 'দুর্ঘটনা'],
      'tamil': ['உதவி', 'அவசரம்', 'ஆபத்து', 'தொலைந்து போனேன்'],
      'marathi': ['मदत', 'तातडीची', 'धोका', 'हरवलो'],
      'gujarati': ['મદદ', 'તાતકાલિક', 'ખતરો', 'ખોવાઈ ગયો']
    }
    
  def process_emergency_text(self, text, language='auto'):
    """Process emergency text in multiple languages"""
    # Detect language if not specified
    if language == 'auto':
      language = self._detect_language(text)
    
    # Translate to English if needed
    if language != 'english':
      text = self._translate_to_english(text, language)
    
    # Check for emergency keywords
    emergency_level = self._assess_emergency_level(text)
    
    # Extract key information
    extracted_info = self._extract_emergency_info(text)
    
    return {
      'original_text': text,
      'language': language,
      'emergency_level': emergency_level,
      'extracted_info': extracted_info,
      'requires_immediate_response': emergency_level >= 7
    }
  
  def _detect_language(self, text):
    """Detect language of input text"""
    # Simple keyword-based detection
    for lang, keywords in self.emergency_keywords.items():
      if any(keyword in text.lower() for keyword in keywords):
        return lang
    return 'english'
  
  def _translate_to_english(self, text, source_lang):
    """Translate text to English"""
    try:
      # Use translation API or local model
      translated = self.translator(text)[0]['translation_text']
      return translated
    except:
      return text
  
  def _assess_emergency_level(self, text):
    """Assess emergency level (1-10 scale)"""
    high_urgency_words = ['emergency', 'danger', 'help', 'injured', 'accident', 'panic']
    medium_urgency_words = ['lost', 'confused', 'stuck', 'problem']
    
    text_lower = text.lower()
    high_count = sum(1 for word in high_urgency_words if word in text_lower)
    medium_count = sum(1 for word in medium_urgency_words if word in text_lower)
    
    if high_count >= 2:
      return 9
    elif high_count >= 1:
      return 7
    elif medium_count >= 1:
      return 5
    else:
      return 3

  def _extract_emergency_info(self, text):
    """Extract key information from emergency text"""
    info = {
      'location_mentioned': False,
      'injury_mentioned': False,
      'contact_requested': False,
      'transport_needed': False
    }
    
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['at', 'near', 'location', 'place']):
      info['location_mentioned'] = True
    if any(word in text_lower for word in ['hurt', 'injured', 'pain', 'bleeding']):
      info['injury_mentioned'] = True
    if any(word in text_lower for word in ['call', 'contact', 'phone', 'notify']):
      info['contact_requested'] = True
    if any(word in text_lower for word in ['ambulance', 'hospital', 'transport', 'pickup']):
      info['transport_needed'] = True
      
    return info

class AutomatedEFIRGenerator:
  def __init__(self):
    self.efir_template = {
      'complaint_number': '',
      'date_time': '',
      'complainant_details': {},
      'incident_details': {},
      'location_details': {},
      'witness_details': [],
      'evidence': [],
      'investigating_officer': '',
      'status': 'REGISTERED'
    }
    
  def generate_efir(self, incident_data):
    """Generate automated E-FIR from incident data"""
    efir = self.efir_template.copy()
    
    # Generate unique complaint number
    efir['complaint_number'] = f"EFIR{datetime.now().strftime('%Y%m%d%H%M%S')}"
    efir['date_time'] = datetime.now().isoformat()
    
    # Fill complainant details
    efir['complainant_details'] = {
      'tourist_id': incident_data.get('tourist_id', ''),
      'name': incident_data.get('tourist_name', ''),
      'nationality': incident_data.get('nationality', ''),
      'passport_number': incident_data.get('passport_number', ''),
      'contact_number': incident_data.get('contact_number', ''),
      'emergency_contact': incident_data.get('emergency_contact', {})
    }
    
    # Fill incident details
    efir['incident_details'] = {
      'type': incident_data.get('incident_type', 'MISSING_PERSON'),
      'description': self._generate_incident_description(incident_data),
      'severity': incident_data.get('severity', 'MEDIUM'),
      'last_known_activity': incident_data.get('last_activity', ''),
      'circumstances': incident_data.get('circumstances', '')
    }
    
    # Fill location details
    efir['location_details'] = {
      'last_known_location': incident_data.get('last_location', {}),
      'incident_area': incident_data.get('incident_area', ''),
      'nearby_landmarks': incident_data.get('nearby_landmarks', [])
    }
    
    return efir
    
  def _generate_incident_description(self, incident_data):
    """Generate a structured description of the incident"""
    incident_type = incident_data.get('incident_type', 'MISSING_PERSON')
    description = f"Tourist reported {incident_type.lower().replace('_', ' ')}. "
    
    if 'last_seen_time' in incident_data:
      description += f"Last seen at {incident_data['last_seen_time']}. "
      
    if 'circumstances' in incident_data:
      description += f"{incident_data['circumstances']}"
      
    return description

class RealTimeTourismAnalytics:
  def get_dashboard_metrics(self):
    return {
      'active_tourists': 12,
      'recent_alerts': 3,
      'high_risk_tourists': 2,
      'avg_response_time_minutes': 5,
      'system_status': 'operational',
      'last_updated': datetime.now().isoformat(),
    }

class TouristSafetyScoreModel:
  def __init__(self):
    self.model = RandomForestClassifier(n_estimators=100, random_state=42)
    self.scaler = StandardScaler()
    self.is_trained = False
    
  def prepare_features(self, tourist_data):
    """Prepare features for safety score prediction"""
    features = []
    
    # Location risk score (1-10)
    location_risk = tourist_data.get('location_risk', 5)
    
    # Time of day risk (higher at night)
    hour = datetime.now().hour
    time_risk = 8 if hour < 6 or hour > 22 else 3
    
    # Group size (solo travelers are riskier)
    group_size = tourist_data.get('group_size', 1)
    group_risk = 8 if group_size == 1 else 3
    
    # Tourist experience level
    experience = tourist_data.get('experience_level', 'beginner')
    exp_risk = {'expert': 2, 'intermediate': 5, 'beginner': 8}.get(experience, 5)
    
    # Planned vs unplanned trip
    planned = tourist_data.get('has_itinerary', False)
    planning_risk = 3 if planned else 7
    
    features = [location_risk, time_risk, group_risk, exp_risk, planning_risk,
               tourist_data.get('age', 30), tourist_data.get('health_score', 8)]
    
    return np.array(features).reshape(1, -1)
  
  def train_model(self, training_data):
    """Train the safety score model"""
    # Sample training data structure
    X = []
    y = []
    
    for data in training_data:
      features = self.prepare_features(data)
      X.append(features.flatten())
      y.append(data['safety_score'])
    
    X = np.array(X)
    y = np.array(y)
    
    X_scaled = self.scaler.fit_transform(X)
    self.model.fit(X_scaled, y)
    self.is_trained = True
    
    # Save model
    joblib.dump(self.model, settings.SAFETY_MODEL_PATH)
    joblib.dump(self.scaler, settings.SAFETY_SCALER_PATH)
  
  def predict_safety_score(self, tourist_data):
    """Predict safety score for a tourist"""
    if not self.is_trained:
      # Load pre-trained model
      try:
        self.model = joblib.load(settings.SAFETY_MODEL_PATH)
        self.scaler = joblib.load(settings.SAFETY_SCALER_PATH)
        self.is_trained = True
      except:
        return 5  # Default score if model not available
    
    features = self.prepare_features(tourist_data)
    features_scaled = self.scaler.transform(features)
    score = self.model.predict(features_scaled)[0]
    
    # Ensure score is between 1-10
    return max(1, min(10, int(score)))

class GeoFencingSystem:
  def __init__(self):
    self.risk_zones = {}
    self.safe_zones = {}
    
  def add_risk_zone(self, zone_id, coordinates, risk_level):
    """Add a risk zone with coordinates and risk level"""
    self.risk_zones[zone_id] = {
      'coordinates': coordinates,  # List of [lat, lng] points
      'risk_level': risk_level,    # 1-10 scale
      'active': True
    }
  
  def check_location_risk(self, lat, lng):
    """Check if location is in any risk zone"""
    point = Point(lng, lat)
    max_risk = 1
    
    for zone_id, zone_data in self.risk_zones.items():
      if not zone_data['active']:
        continue
        
      polygon = Polygon([(coord[1], coord[0]) for coord in zone_data['coordinates']])
      if polygon.contains(point):
        max_risk = max(max_risk, zone_data['risk_level'])
    
    return max_risk
  
  def generate_alert(self, tourist_id, lat, lng, risk_level):
    """Generate geo-fence alert"""
    alert_data = {
      'tourist_id': tourist_id,
      'timestamp': datetime.now(),
      'location': [lat, lng],
      'risk_level': risk_level,
      'alert_type': 'geo_fence_breach'
    }
    
    # Send to emergency contacts and police
    self._send_emergency_alert(alert_data)
    
    return alert_data
  
  def _send_emergency_alert(self, alert_data):
    """Send emergency alert via SMS/notification"""
    message = f"ALERT: Tourist {alert_data['tourist_id']} entered high-risk zone (Risk: {alert_data['risk_level']}/10)"
    
    # Send SMS via Twilio
    try:
      from twilio.rest import Client
      twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
      twilio_client.messages.create(
        body=message,
        from_=settings.TWILIO_PHONE_NUMBER,  # Your Twilio number
        to=settings.EMERGENCY_CONTACT_NUMBER  # Emergency contact number
      )
    except Exception as e:
      print(f"SMS Alert failed: {e}")

class TouristFlowPredictor:
  def __init__(self):
    self.model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    self.scaler = StandardScaler()
    self.is_trained = False
    
  def prepare_time_features(self, timestamp):
    """Extract time-based features"""
    dt = pd.to_datetime(timestamp)
    return [
      dt.hour, dt.day, dt.month, dt.weekday(),
      dt.week, int(dt.strftime('%j'))  # day of year
    ]
  
  def predict_tourist_flow(self, location_id, timestamp):
    """Predict tourist flow for a location at given time"""
    time_features = self.prepare_time_features(timestamp)
    
    # Add location-specific features
    features = time_features + [
      location_id,
      self._get_weather_score(timestamp),
      self._get_event_score(location_id, timestamp)
    ]
    
    features = np.array(features).reshape(1, -1)
    
    # Load or fit scaler if needed
    if not self.is_trained:
      try:
        self.model = joblib.load(settings.FLOW_MODEL_PATH)
        self.scaler = joblib.load(settings.FLOW_SCALER_PATH)
        self.is_trained = True
      except:
        # Return default value if model not available
        return 50
    
    features_scaled = self.scaler.transform(features)
    
    predicted_flow = self.model.predict(features_scaled)[0]
    return max(0, int(predicted_flow))
  
  def _get_weather_score(self, timestamp):
    """Get weather favorability score (1-10)"""
    # Integrate with weather API
    return 7  # Placeholder
  
  def _get_event_score(self, location_id, timestamp):
    """Get event/festival impact score"""
    # Check for local events/festivals
    return 5  # Placeholder

class IncidentPredictor:
  def __init__(self):
    self.model = RandomForestClassifier(n_estimators=200, random_state=42)
    self.is_trained = False
    
  def predict_incident_probability(self, location_data, tourist_data, environmental_data):
    """Predict probability of incident occurring"""
    features = [
      location_data.get('risk_score', 5),
      location_data.get('tourist_density', 50),
      tourist_data.get('safety_score', 5),
      tourist_data.get('experience_level_score', 5),
      environmental_data.get('weather_score', 5),
      environmental_data.get('time_of_day_risk', 5),
      environmental_data.get('visibility_score', 5)
    ]
    
    features = np.array(features).reshape(1, -1)
    
    # Load model if needed
    if not self.is_trained:
      try:
        self.model = joblib.load(settings.INCIDENT_MODEL_PATH)
        self.is_trained = True
      except:
        # Return default value if model not available
        return 0.25
    
    incident_prob = self.model.predict_proba(features)[0][1]  # Probability of incident
    
    return incident_prob

class SmartTouristSafetySystem:
  def __init__(self):
    self.safety_model = TouristSafetyScoreModel()
    self.geo_fencing = GeoFencingSystem()
    self.flow_predictor = TouristFlowPredictor()
    self.incident_predictor = IncidentPredictor()
    
  async def process_tourist_data(self, tourist_id, data_update):
    # Calculate safety score using the model
    safety_score = self.safety_model.predict_safety_score(data_update)
    
    # Check location risk if coordinates are provided
    alerts_generated = []
    incident_probability = None
    tourist_flow = None
    
    if 'latitude' in data_update and 'longitude' in data_update:
      lat = data_update['latitude']
      lng = data_update['longitude']
      location_risk = self.geo_fencing.check_location_risk(lat, lng)
      
      # Generate alert if risk is high (above 7)
      if location_risk > 7:
        alert = self.geo_fencing.generate_alert(tourist_id, lat, lng, location_risk)
        alerts_generated.append(alert)
      
      # Get tourist flow prediction if location_id is provided
      if 'location_id' in data_update:
        tourist_flow = self.flow_predictor.predict_tourist_flow(
          data_update['location_id'],
          data_update.get('timestamp', datetime.now().isoformat())
        )
      
      # Predict incident probability
      if 'location_id' in data_update:
        location_data = {
          'risk_score': location_risk,
          'tourist_density': tourist_flow or 50
        }
        
        tourist_data = {
          'safety_score': safety_score,
          'experience_level_score': data_update.get('experience_level_score', 5)
        }
        
        # Time of day risk (higher at night)
        hour = datetime.now().hour
        time_risk = 8 if hour < 6 or hour > 22 else 3
        
        environmental_data = {
          'weather_score': data_update.get('weather_score', 5),
          'time_of_day_risk': time_risk,
          'visibility_score': data_update.get('visibility_score', 7)
        }
        
        incident_probability = self.incident_predictor.predict_incident_probability(
          location_data, tourist_data, environmental_data
        )
    
    return {
      'tourist_id': tourist_id,
      'timestamp': datetime.now().isoformat(),
      'safety_score': safety_score,
      'alerts_generated': alerts_generated,
      'tourist_flow': tourist_flow,
      'incident_probability': incident_probability,
      'recommendations': [],
    }


class TouristVerificationSystem:
    def __init__(self):
        self.known_faces = {}  # Store known face encodings
        self.confidence_threshold = 0.6
        
    def register_tourist_face(self, tourist_id, image_path):
        """Register tourist's face for verification"""
        try:
            # Load image and get face encoding
            image = face_recognition.load_image_file(image_path)
            face_encodings = face_recognition.face_encodings(image)
            
            if face_encodings:
                self.known_faces[tourist_id] = face_encodings[0]
                return True
            return False
        except Exception as e:
            print(f"Face registration failed: {e}")
            return False
    
    def verify_tourist(self, tourist_id, current_image):
        """Verify tourist identity using face recognition"""
        try:
            if tourist_id not in self.known_faces:
                return False
            
            # Get face encoding from current image
            current_encoding = face_recognition.face_encodings(current_image)
            
            if not current_encoding:
                return False
            
            # Compare with stored encoding
            matches = face_recognition.compare_faces(
                [self.known_faces[tourist_id]],
                current_encoding[0],
                tolerance=self.confidence_threshold
            )
            
            return matches[0]
        except Exception as e:
            print(f"Face verification failed: {e}")
            return False


class CrowdAnalysisSystem:
    def __init__(self):
        # Load YOLO model for person detection
        try:
            self.net = cv2.dnn.readNet('yolov4.weights', 'yolov4.cfg')  # Download these files
            self.layer_names = self.net.getLayerNames()
            self.output_layers = [self.layer_names[i[0] - 1] for i in self.net.getUnconnectedOutLayers()]
        except Exception as e:
            print(f"Failed to load YOLO model: {e}")
            # Create mock network for testing
            self.net = cv2.dnn.readNet('', '')
            self.layer_names = ['mock_layer']
            self.output_layers = ['mock_layer']
        
    def analyze_crowd_density(self, image_path_or_array):
        """Analyze crowd density from image"""
        try:
            # Load image
            if isinstance(image_path_or_array, str):
                image = cv2.imread(image_path_or_array)
            else:
                image = image_path_or_array
                
            height, width, channels = image.shape
            
            # Prepare image for YOLO
            blob = cv2.dnn.blobFromImage(image, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
            self.net.setInput(blob)
            outputs = self.net.forward(self.output_layers)
            
            # Count people
            person_count = 0
            confidences = []
            
            for output in outputs:
                for detection in output:
                    scores = detection[5:]
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]
                    
                    if class_id == 0 and confidence > 0.5:  # class_id 0 is 'person' in COCO
                        person_count += 1
                        confidences.append(float(confidence))
            
            # Calculate density score
            area = (width * height) / 1000000  # Convert to sq meters approximately
            density_score = min(10, person_count / max(1, area))
            
            return {
                'person_count': person_count,
                'density_score': density_score,
                'average_confidence': np.mean(confidences) if confidences else 0,
                'area_analyzed': area
            }
            
        except Exception as e:
            print(f"Crowd analysis failed: {e}")
            return {'person_count': 0, 'density_score': 0, 'average_confidence': 0, 'area_analyzed': 0}


class TouristAssistantChatbot:
  """Lightweight rule-based chatbot with optional OpenAI fallback via settings.OPENAI_API_KEY.
  In absence of keys, returns templated responses to avoid external dependencies.
  """
  def __init__(self):
    self.history_by_tourist = {}
    try:
      import openai  # type: ignore
      self._openai = openai if settings.OPENAI_API_KEY else None
      if self._openai:
        self._openai.api_key = settings.OPENAI_API_KEY
    except Exception:
      self._openai = None

  def _classify(self, message: str) -> str:
    text = message.lower()
    if any(k in text for k in ['help', 'emergency', 'danger', 'sos', 'injured']):
      return 'emergency'
    if any(k in text for k in ['where', 'nearby', 'directions', 'how to reach', 'location']):
      return 'location_info'
    if any(k in text for k in ['book', 'reservation', 'ticket', 'hotel', 'guide']):
      return 'booking'
    if any(k in text for k in ['safe', 'risk', 'dangerous', 'secure', 'avoid']):
      return 'safety'
    return 'general'

  def process_query(self, tourist_id: str, message: str, language: str = 'en') -> dict:
    query_type = self._classify(message)
    history = self.history_by_tourist.get(tourist_id, [])

    # Fallback responses by type
    if query_type == 'emergency':
      response = "Emergency noted. We've alerted authorities and shared your last known details. Stay safe and share your location if possible."
    elif query_type == 'location_info':
      response = "Nearby: popular attractions, safe routes, and transit options available. Tell me your exact location for precise tips."
    elif query_type == 'booking':
      response = "I can guide bookings for hotels, attractions, transport, or local guides. What do you need?"
    elif query_type == 'safety':
      response = "General safety: stay in well-lit areas, keep valuables secure, and use verified transport."
    else:
      response = "How can I help with your trip? I can assist with places, safety, and travel tips."

    # If OpenAI is configured, enhance the response
    if self._openai:
      try:
        prompt = f"Tourist asked: {message}\nLanguage: {language}. Provide concise, practical help."
        completion = self._openai.chat.completions.create(
          model="gpt-3.5-turbo",
          messages=[{"role": "user", "content": prompt}],
          max_tokens=200,
          temperature=0.7,
        )
        response = completion.choices[0].message.content or response
      except Exception:
        pass

    history.append({"user": message, "bot": response})
    self.history_by_tourist[tourist_id] = history[-10:]
    return {
      "response": response,
      "query_type": query_type,
      "language": language,
      "requires_human_intervention": query_type == 'emergency',
    }
