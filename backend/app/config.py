from pydantic import BaseModel
import os

class Settings(BaseModel):
  # External API Keys
  GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
  OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
  GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
  AZURE_SPEECH_KEY: str = os.getenv("AZURE_SPEECH_KEY", "")
  AZURE_SPEECH_REGION: str = os.getenv("AZURE_SPEECH_REGION", "")
  TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
  TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
  TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "+1234567890")
  EMERGENCY_CONTACT_NUMBER: str = os.getenv("EMERGENCY_CONTACT_NUMBER", "+91XXXXXXXXXX")
  
  # Database and Cache
  MONGODB_URI: str = os.getenv("MONGODB_URI", "")
  REDIS_URL: str = os.getenv("REDIS_URL", "")
  
  # AWS Services
  AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
  AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
  AWS_REGION: str = os.getenv("AWS_REGION", "")
  
  # Safety Model Configuration
  SAFETY_MODEL_PATH: str = os.getenv("SAFETY_MODEL_PATH", "./models/safety_score_model.pkl")
  SAFETY_SCALER_PATH: str = os.getenv("SAFETY_SCALER_PATH", "./models/safety_score_scaler.pkl")
  
  # Predictive Analytics Configuration
  FLOW_MODEL_PATH: str = os.getenv("FLOW_MODEL_PATH", "./models/tourist_flow_model.pkl")
  FLOW_SCALER_PATH: str = os.getenv("FLOW_SCALER_PATH", "./models/tourist_flow_scaler.pkl")
  INCIDENT_MODEL_PATH: str = os.getenv("INCIDENT_MODEL_PATH", "./models/incident_predictor_model.pkl")
  
  # External Service URLs
  EMERGENCY_SERVICE_URL: str = os.getenv("EMERGENCY_SERVICE_URL", "")
  TOURIST_DATA_API_URL: str = os.getenv("TOURIST_DATA_API_URL", "")
  WEATHER_API_URL: str = os.getenv("WEATHER_API_URL", "")
  
  # Blockchain (Polygon Amoy testnet recommended)
  BLOCKCHAIN_RPC_URL: str = os.getenv("BLOCKCHAIN_RPC_URL", "")
  BLOCKCHAIN_PRIVATE_KEY: str = os.getenv("BLOCKCHAIN_PRIVATE_KEY", "PnhzYWiaenARDmvNlBnD9")
  BLOCKCHAIN_CHAIN_ID: int = int(os.getenv("BLOCKCHAIN_CHAIN_ID", "80002"))
  BLOCKCHAIN_CONTRACT_ADDRESS: str = os.getenv("BLOCKCHAIN_CONTRACT_ADDRESS", "")
  BLOCKCHAIN_API_KEY: str = os.getenv("BLOCKCHAIN_API_KEY", "PnhzYWiaenARDmvNlBnD9")

  # Supabase
  SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
  SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

settings = Settings()
