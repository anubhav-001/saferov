from fastapi import FastAPI, WebSocket, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import translation
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
from datetime import datetime
import os
import shutil
import numpy as np
from .ai_models import SmartTouristSafetySystem, AutomatedEFIRGenerator, RealTimeTourismAnalytics, TouristSafetyScoreModel, GeoFencingSystem, TouristFlowPredictor, IncidentPredictor, MultilingualEmergencyProcessor, TouristVerificationSystem, CrowdAnalysisSystem, TouristAssistantChatbot
from .services.supabase_client import get_supabase
from .services.blockchain import anchor_id_hash
from .services.trip_blockchain import register_temporary_trip, check_trip_status, delete_expired_trip, cleanup_expired_trips
from web3 import Web3
from app.services.asr_service import asr_service

app = FastAPI(title="Smart Tourist Safety API")

# Include translation router
app.include_router(
    translation.router,
    prefix="/api/translation",
    tags=["translation"]
)

# CORS for local dev
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

safety_system = SmartTouristSafetySystem()
analytics = RealTimeTourismAnalytics()
efirs = AutomatedEFIRGenerator()
safety_score_model = TouristSafetyScoreModel()
geo_fencing = GeoFencingSystem()
flow_predictor = TouristFlowPredictor()
incident_predictor = IncidentPredictor()
emergency_processor = MultilingualEmergencyProcessor()
face_verification = TouristVerificationSystem()
crowd_analysis = CrowdAnalysisSystem()
chatbot = TouristAssistantChatbot()

class TouristUpdate(BaseModel):
  profile_data: Dict[str, Any] | None = None
  location_data: Dict[str, Any] | None = None
  behavior_data: list[list[float]] | None = None
  health_data: Dict[str, Any] | None = None

class EFIRPayload(BaseModel):
  incident_data: Dict[str, Any]

class SafetyScoreRequest(BaseModel):
  tourist_data: Dict[str, Any]

class TrainingDataRequest(BaseModel):
  training_data: List[Dict[str, Any]]

class RiskZoneRequest(BaseModel):
  zone_id: str
  coordinates: List[List[float]]  # List of [lat, lng] points
  risk_level: int  # 1-10 scale

class LocationCheckRequest(BaseModel):
  latitude: float
  longitude: float

class FaceRegistrationRequest(BaseModel):
  tourist_id: str
  image_path: str

class FaceVerificationRequest(BaseModel):
  tourist_id: str
  image_path: str

class CrowdAnalysisRequest(BaseModel):
  image_path: str
  location_id: Optional[str] = None
  timestamp: Optional[str] = None

class FlowPredictionRequest(BaseModel):
  location_id: int
  timestamp: str = None  # Optional, will use current time if not provided

class IncidentPredictionRequest(BaseModel):
  location_data: Dict[str, Any]
  tourist_data: Dict[str, Any]
  environmental_data: Dict[str, Any]

class EmergencyTextRequest(BaseModel):
  text: str
  language: str = 'auto'

class ASRLoadModelRequest(BaseModel):
  checkpoint_path: str

class ASRTranscribeRequest(BaseModel):
  language_id: Optional[str] = None
  decoder: str = 'ctc'

@app.get("/health")
async def health():
  return {"status": "ok"}

@app.post("/api/tourist/{tourist_id}/process")
async def process_update(tourist_id: str, payload: TouristUpdate):
  result = await safety_system.process_tourist_data(tourist_id, payload.model_dump(exclude_none=True))
  return result

@app.get("/api/dashboard/metrics")
async def get_metrics():
  return analytics.get_dashboard_metrics()

@app.post("/api/efir/create")
async def create_efir(body: EFIRPayload):
  efir = efirs.generate_efir(body.incident_data)
  return {"status": "ok", "efir_number": efir.get("complaint_number")}

@app.post("/api/safety/score")
async def get_safety_score(request: SafetyScoreRequest):
  score = safety_score_model.predict_safety_score(request.tourist_data)
  return {"status": "ok", "safety_score": score}

@app.post("/api/safety/train")
async def train_safety_model(request: TrainingDataRequest):
  safety_score_model.train_model(request.training_data)
  return {"status": "ok", "message": "Model trained successfully"}

@app.post("/api/geo/risk-zone")
async def add_risk_zone(request: RiskZoneRequest):
  geo_fencing.add_risk_zone(request.zone_id, request.coordinates, request.risk_level)
  return {"status": "ok", "message": f"Risk zone {request.zone_id} added successfully"}

@app.post("/api/geo/check-location")
async def check_location(request: LocationCheckRequest):
  risk_level = geo_fencing.check_location_risk(request.latitude, request.longitude)
  return {"status": "ok", "risk_level": risk_level}

@app.post("/api/geo/alert/{tourist_id}")
async def generate_geo_alert(tourist_id: str, request: LocationCheckRequest):
  risk_level = geo_fencing.check_location_risk(request.latitude, request.longitude)
  if risk_level > 5:  # Only generate alert if risk level is significant
    alert = geo_fencing.generate_alert(tourist_id, request.latitude, request.longitude, risk_level)
    return {"status": "ok", "alert": alert}
  return {"status": "ok", "message": "No alert generated, risk level too low"}

@app.post("/api/predict/tourist-flow")
async def predict_tourist_flow(request: FlowPredictionRequest):
  timestamp = request.timestamp or datetime.now().isoformat()
  predicted_flow = flow_predictor.predict_tourist_flow(request.location_id, timestamp)
  return {
    "status": "ok", 
    "location_id": request.location_id,
    "timestamp": timestamp,
    "predicted_tourist_flow": predicted_flow
  }

@app.post("/api/predict/incident-probability")
async def predict_incident(request: IncidentPredictionRequest):
  probability = incident_predictor.predict_incident_probability(
    request.location_data,
    request.tourist_data,
    request.environmental_data
  )
  return {
    "status": "ok",
    "incident_probability": probability,
    "risk_level": "high" if probability > 0.7 else "medium" if probability > 0.3 else "low"
  }

@app.post("/api/emergency/process-text")
async def process_emergency_text(request: EmergencyTextRequest):
  result = emergency_processor.process_emergency_text(request.text, request.language)
  
  # If immediate response is required, generate an EFIR
  if result.get('requires_immediate_response', False):
    incident_data = {
      'incident_type': 'EMERGENCY_ALERT',
      'severity': 'HIGH' if result['emergency_level'] >= 8 else 'MEDIUM',
      'circumstances': f"Emergency text received: {request.text}",
      'extracted_info': result['extracted_info']
    }
    efir = efirs.generate_efir(incident_data)
    result['efir_generated'] = True
    result['efir_number'] = efir.get('complaint_number')
  else:
    result['efir_generated'] = False
  
  return {
    "status": "ok",
    "emergency_analysis": result
  }

class ChatbotRequest(BaseModel):
  tourist_id: str
  message: str
  language: str = 'en'

@app.post("/api/chatbot/query")
async def chatbot_query(req: ChatbotRequest):
  result = chatbot.process_query(req.tourist_id, req.message, req.language)
  return {"status": "ok", "result": result}

class SMSMessageRequest(BaseModel):
  from_number: str
  message: str
  timestamp: str = None
  location_data: Dict[str, Any] = None

@app.post("/api/emergency/sms")
async def process_emergency_sms(request: SMSMessageRequest):
  # Process the SMS text using the multilingual processor
  result = emergency_processor.process_emergency_text(request.message)
  
  # Prepare response data
  response_data = {
    "status": "ok",
    "from_number": request.from_number,
    "emergency_level": result['emergency_level'],
    "language_detected": result['language'],
    "requires_immediate_response": result['requires_immediate_response'],
    "extracted_info": result['extracted_info']
  }
  
  # If high emergency level, generate EFIR and trigger alerts
  if result.get('requires_immediate_response', False):
    # Create incident data from SMS and any available location data
    incident_data = {
      'incident_type': 'SMS_EMERGENCY',
      'severity': 'HIGH' if result['emergency_level'] >= 8 else 'MEDIUM',
      'circumstances': f"Emergency SMS received: {request.message}",
      'contact_number': request.from_number,
      'last_activity': 'Unknown',
      'extracted_info': result['extracted_info']
    }
    
    # Add location data if available
    if request.location_data:
      incident_data['last_location'] = request.location_data
    
    # Generate EFIR
    efir = efirs.generate_efir(incident_data)
    response_data['efir_generated'] = True
    response_data['efir_number'] = efir.get('complaint_number')
    
    # In a real implementation, we would trigger emergency alerts here
    # For example, sending notifications to emergency services
    # safety_system.trigger_emergency_alert(efir.get('complaint_number'), request.from_number)
  else:
    response_data['efir_generated'] = False
  
  return response_data

# -----------------------
# Users + Blockchain
# -----------------------

class NewUser(BaseModel):
  tourist_id: str
  name: Optional[str] = None
  email: Optional[str] = None
  phone: Optional[str] = None
  nationality: Optional[str] = None

@app.post("/api/users/add")
def add_user(user: NewUser):
  """
  Create a new user record in Supabase and anchor their ID hash on-chain.
  Returns tx details and stored fields.
  """
  # Hash the plain ID (keccak256)
  id_hash = Web3.keccak(text=user.tourist_id).hex()

  # Try anchoring on-chain (will raise if blockchain env not configured)
  try:
    chain = anchor_id_hash(id_hash)
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Blockchain anchoring failed: {e}")

  # Insert into Supabase
  try:
    sb = get_supabase()
    payload = {
      "tourist_id": user.tourist_id,
      "name": user.name,
      "email": user.email,
      "phone": user.phone,
      "nationality": user.nationality,
      "id_hash": id_hash,
      "blockchain_tx_hash": chain.get("tx_hash"),
      "first_seen_at": chain.get("first_seen_at"),
      "created_at": datetime.utcnow().isoformat(),
    }
    res = sb.table("users").insert(payload).execute()
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Supabase insert failed: {e}")

  return {
    "status": "ok",
    "id_hash": id_hash,
    "blockchain": chain,
    "supabase": getattr(res, "data", None),
  }

# -----------------------
# Trip Blockchain APIs
# -----------------------

class TripData(BaseModel):
  title: str
  city: str
  start_date: str
  end_date: str
  travelers: int
  attractions: List[str]
  duration_hours: Optional[int] = 168  # Default 7 days

class TripStatusRequest(BaseModel):
  trip_id: str

@app.post("/api/trips/register")
def register_trip(trip_data: TripData):
  """
  Register a temporary trip ID on blockchain with auto-expiry.
  The trip ID will automatically be deleted after the specified duration.
  """
  try:
    # Convert trip data to dictionary
    trip_dict = {
      "title": trip_data.title,
      "city": trip_data.city,
      "start_date": trip_data.start_date,
      "end_date": trip_data.end_date,
      "travelers": trip_data.travelers,
      "attractions": trip_data.attractions,
      "created_at": datetime.now().isoformat()
    }
    
    # Register on blockchain
    result = register_temporary_trip(trip_dict, trip_data.duration_hours)
    
    return {
      "status": "success",
      "message": "Trip registered successfully with temporary blockchain ID",
      "trip_data": result
    }
    
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Trip registration failed: {e}")

@app.post("/api/trips/status")
def get_trip_status(request: TripStatusRequest):
  """
  Check the status of a trip ID on blockchain.
  Returns whether the trip is still active or has expired.
  """
  try:
    status = check_trip_status(request.trip_id)
    return {
      "status": "success",
      "trip_status": status
    }
    
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Failed to check trip status: {e}")

@app.post("/api/trips/delete")
def delete_trip(request: TripStatusRequest):
  """
  Manually delete a trip ID from blockchain.
  This is typically used for cleanup or early trip termination.
  """
  try:
    result = delete_expired_trip(request.trip_id)
    return {
      "status": "success",
      "message": "Trip deleted successfully",
      "deletion_data": result
    }
    
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Failed to delete trip: {e}")

@app.post("/api/trips/cleanup")
def cleanup_trips():
  """
  Clean up all expired trips from blockchain.
  This endpoint can be called periodically to maintain the blockchain.
  """
  try:
    result = cleanup_expired_trips()
    return {
      "status": "success",
      "cleanup_data": result
    }
    
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Failed to cleanup trips: {e}")

# Computer Vision API Endpoints

# Helper function to save uploaded files
def save_upload_file(upload_file: UploadFile, destination: str):
  try:
    # Ensure directory exists
    os.makedirs(os.path.dirname(destination), exist_ok=True)
    
    # Save the file
    with open(destination, "wb") as buffer:
      shutil.copyfileobj(upload_file.file, buffer)
    
    return True
  except Exception as e:
    print(f"Error saving file: {e}")
    return False

@app.post("/api/tourist/register-face")
async def register_tourist_face(tourist_id: str = Form(...), image: UploadFile = File(...)):
  # Create a directory for face images if it doesn't exist
  face_dir = "face_images"
  os.makedirs(face_dir, exist_ok=True)
  
  # Save the uploaded image
  image_path = os.path.join(face_dir, f"{tourist_id}_{image.filename}")
  if not save_upload_file(image, image_path):
    raise HTTPException(status_code=500, detail="Failed to save image")
  
  # Register the face
  result = face_verification.register_tourist_face(tourist_id, image_path)
  
  if not result:
    # If registration failed, delete the saved image
    if os.path.exists(image_path):
      os.remove(image_path)
    raise HTTPException(status_code=400, detail="Face registration failed. No face detected in the image.")
  
  return {
    "status": "success",
    "message": "Tourist face registered successfully",
    "tourist_id": tourist_id,
    "image_path": image_path
  }

@app.post("/api/tourist/verify-face")
async def verify_tourist_face(tourist_id: str = Form(...), image: UploadFile = File(...)):
  # Save the uploaded image temporarily
  temp_dir = "temp_images"
  os.makedirs(temp_dir, exist_ok=True)
  
  temp_path = os.path.join(temp_dir, f"verify_{tourist_id}_{image.filename}")
  if not save_upload_file(image, temp_path):
    raise HTTPException(status_code=500, detail="Failed to save image")
  
  try:
    # Load the image for verification
    try:
      import face_recognition
      current_image = face_recognition.load_image_file(temp_path)
    except ImportError:
      # Use mock data if face_recognition is not available
      current_image = np.ones((300, 300, 3), dtype=np.uint8) * 255
    
    # Verify the face
    result = face_verification.verify_tourist(tourist_id, current_image)
    
    # Clean up the temporary file
    if os.path.exists(temp_path):
      os.remove(temp_path)
    
    if not result:
      return {
        "status": "failed",
        "verified": False,
        "message": "Face verification failed. Tourist identity could not be confirmed."
      }
    
    return {
      "status": "success",
      "verified": True,
      "message": "Tourist identity verified successfully",
      "tourist_id": tourist_id
    }
  
  except Exception as e:
    # Clean up the temporary file in case of error
    if os.path.exists(temp_path):
      os.remove(temp_path)
    raise HTTPException(status_code=500, detail=f"Verification process failed: {str(e)}")

@app.post("/api/crowd/analyze")
async def analyze_crowd(image: UploadFile = File(...), location_id: str = Form(None), timestamp: str = Form(None)):
  # Save the uploaded image temporarily
  temp_dir = "temp_images"
  os.makedirs(temp_dir, exist_ok=True)
  
  temp_path = os.path.join(temp_dir, f"crowd_{image.filename}")
  if not save_upload_file(image, temp_path):
    raise HTTPException(status_code=500, detail="Failed to save image")
  
  try:
    # Analyze the crowd density
    result = crowd_analysis.analyze_crowd_density(temp_path)
    
    # Clean up the temporary file
    if os.path.exists(temp_path):
      os.remove(temp_path)
    
    # Add metadata to the result
    result['location_id'] = location_id
    result['timestamp'] = timestamp or datetime.now().isoformat()
    
    # Add safety recommendations based on density
    if result['density_score'] > 7:
      result['safety_recommendation'] = "High crowd density detected. Consider implementing crowd control measures."
    elif result['density_score'] > 4:
      result['safety_recommendation'] = "Moderate crowd density. Monitor the situation."
    else:
      result['safety_recommendation'] = "Low crowd density. No action required."
    
    return {
      "status": "success",
      "crowd_analysis": result
    }
  
  except Exception as e:
    # Clean up the temporary file in case of error
    if os.path.exists(temp_path):
      os.remove(temp_path)
    raise HTTPException(status_code=500, detail=f"Crowd analysis failed: {str(e)}")

# ASR Endpoints (AI4Bharat IndicConformer via NeMo if available)
@app.post("/api/asr/load-model")
async def asr_load_model(req: ASRLoadModelRequest):
  ok = asr_service.load_checkpoint(req.checkpoint_path)
  if not ok:
    return {"status": "failed", "message": "ASR model not loaded. Ensure NeMo and checkpoint are available."}
  return {"status": "ok", "message": "ASR model loaded."}

@app.post("/api/asr/transcribe")
async def asr_transcribe(language_id: str = Form(None), decoder: str = Form('ctc'), audio: UploadFile = File(...)):
  # Save uploaded audio temporarily
  temp_dir = "temp_audio"
  os.makedirs(temp_dir, exist_ok=True)
  temp_path = os.path.join(temp_dir, f"asr_{datetime.now().strftime('%Y%m%d%H%M%S')}_{audio.filename}")
  if not save_upload_file(audio, temp_path):
    raise HTTPException(status_code=500, detail="Failed to save audio")
  try:
    text = asr_service.transcribe(temp_path, language_id=language_id, decoder=decoder)
    return {"status": "ok", "text": text, "engine": "nemo" if asr_service.available else "fallback"}
  finally:
    try:
      if os.path.exists(temp_path):
        os.remove(temp_path)
    except Exception:
      pass

# WebSocket with optional Redis broadcast
from config import settings
try:
  import redis
  _redis = redis.from_url(settings.REDIS_URL) if settings.REDIS_URL else None
except Exception:
  _redis = None

@app.websocket("/ws/dashboard")
async def ws_dashboard(ws: WebSocket):
  await ws.accept()
  await ws.send_json({"type": "hello", "message": "connected"})
  try:
    while True:
      # If you later push messages to Redis channel 'dashboard_broadcast', forward them here
      _ = await ws.receive_text()
  except Exception:
    pass
