// Unified API client for AI backend integration
// Base URL is configurable via VITE_API_URL, defaults to http://localhost:8000
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(`${API_BASE_URL}${path}`, {
      signal: controller.signal,
      headers: { 
        'Content-Type': 'application/json',
        ...(init?.headers || {}) 
      },
      ...init,
    });

    clearTimeout(timeoutId);

    // Handle non-2xx responses
    if (!res.ok) {
      let errorDetails;
      try {
        errorDetails = await res.json().catch(() => ({}));
      } catch {
        errorDetails = { message: await res.text() };
      }
      throw new ApiError(
        errorDetails.message || res.statusText || 'API request failed',
        res.status,
        errorDetails
      );
    }

    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your connection and try again.');
    }
    if (error instanceof TypeError) {
      throw new ApiError('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

async function httpForm<T>(path: string, form: FormData, init?: RequestInit): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      body: form,
      signal: controller.signal,
      ...(init || {}),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorDetails;
      try {
        errorDetails = await res.json().catch(() => ({}));
      } catch {
        errorDetails = { message: await res.text() };
      }
      throw new ApiError(
        errorDetails.message || res.statusText || 'API request failed',
        res.status,
        errorDetails
      );
    }

    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your connection and try again.');
    }
    if (error instanceof TypeError) {
      throw new ApiError('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

export { ApiError };

// Types
export interface ProcessTouristDataPayload {
  profile_data?: Record<string, unknown>;
  location_data?: { lat: number; lng: number; timestamp?: string | Date; speed?: number; direction?: number };
  behavior_data?: number[][];
  health_data?: Record<string, unknown>;
}

export interface ProcessTouristDataResult {
  tourist_id: string;
  timestamp: string;
  safety_score?: number;
  alerts_generated: Array<{ type: string; severity?: string; message?: string }>;
  recommendations: Array<{ type: string; priority: string; message: string }>;
}

export interface DashboardMetrics {
  active_tourists: number;
  recent_alerts: number;
  high_risk_tourists: number;
  avg_response_time_minutes: number;
  system_status: string;
  last_updated: string;
}

export interface EFIRResponse { status: string; efir_number?: string }

export interface TripData {
  title: string;
  city: string;
  start_date: string;
  end_date: string;
  travelers: number;
  attractions: string[];
  duration_hours?: number;
}

export interface TripRegistrationResponse {
  status: string;
  message: string;
  trip_data: {
    trip_id: string;
    trip_id_hash: string;
    tx_hash: string;
    block_number: number;
    expiry_timestamp: number;
    expiry_date: string;
    status: string;
  };
}

export interface TripStatusResponse {
  status: string;
  trip_status: {
    trip_id: string;
    is_active: boolean;
    expiry_timestamp: number;
    expiry_date: string;
    status: string;
  };
}

// Endpoints
export const api = {
  // Orchestrator: process incoming tourist update (maps to SmartTouristSafetySystem.process_tourist_data)
  processTouristUpdate: (touristId: string, payload: ProcessTouristDataPayload) =>
    http<ProcessTouristDataResult>(`/api/tourist/${encodeURIComponent(touristId)}/process`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Metrics for dashboards
  getDashboardMetrics: () => http<DashboardMetrics>(`/api/dashboard/metrics`),

  // Create e-FIR from complaint
  createEFIR: (body: Record<string, unknown>) =>
    http<EFIRResponse>(`/api/efir/create`, { method: "POST", body: JSON.stringify(body) }),

  // Safety score and training
  getSafetyScore: (touristData: Record<string, unknown>) =>
    http<{ status: string; safety_score: number }>(`/api/safety/score`, {
      method: "POST",
      body: JSON.stringify({ tourist_data: touristData }),
    }),
  trainSafetyModel: (trainingData: Array<Record<string, unknown>>) =>
    http<{ status: string; message: string }>(`/api/safety/train`, {
      method: "POST",
      body: JSON.stringify({ training_data: trainingData }),
    }),

  // Geo-fencing
  addRiskZone: (zone: { zone_id: string; coordinates: number[][]; risk_level: number }) =>
    http<{ status: string; message: string }>(`/api/geo/risk-zone`, {
      method: "POST",
      body: JSON.stringify(zone),
    }),
  checkLocationRisk: (coords: { latitude: number; longitude: number }) =>
    http<{ status: string; risk_level: number }>(`/api/geo/check-location`, {
      method: "POST",
      body: JSON.stringify(coords),
    }),
  generateGeoAlert: (touristId: string, coords: { latitude: number; longitude: number }) =>
    http<{ status: string; alert?: any; message?: string }>(`/api/geo/alert/${encodeURIComponent(touristId)}`, {
      method: "POST",
      body: JSON.stringify(coords),
    }),

  // Predictive analytics
  predictTouristFlow: (payload: { location_id: number; timestamp?: string }) =>
    http<{ status: string; location_id: number; timestamp: string; predicted_tourist_flow: number }>(
      `/api/predict/tourist-flow`,
      { method: "POST", body: JSON.stringify(payload) }
    ),
  predictIncidentProbability: (payload: {
    location_data: Record<string, unknown>;
    tourist_data: Record<string, unknown>;
    environmental_data: Record<string, unknown>;
  }) =>
    http<{ status: string; incident_probability: number; risk_level: "low" | "medium" | "high" }>(
      `/api/predict/incident-probability`,
      { method: "POST", body: JSON.stringify(payload) }
    ),

  // Emergency processing
  processEmergencyText: (payload: { text: string; language?: string }) =>
    http<{ status: string; emergency_analysis: any }>(`/api/emergency/process-text`, {
      method: "POST",
      body: JSON.stringify({ language: "auto", ...payload }),
    }),
  processEmergencySms: (payload: { from_number: string; message: string; timestamp?: string; location_data?: Record<string, unknown> }) =>
    http<{
      status: string;
      from_number: string;
      emergency_level: number;
      language_detected: string;
      requires_immediate_response: boolean;
      extracted_info: Record<string, unknown>;
      efir_generated?: boolean;
      efir_number?: string;
    }>(`/api/emergency/sms`, { method: "POST", body: JSON.stringify(payload) }),

  // Computer Vision: face registration and verification
  registerTouristFace: (touristId: string, file: File) => {
    const form = new FormData();
    form.append("tourist_id", touristId);
    form.append("image", file);
    return httpForm<{ status: string; message: string; tourist_id: string; image_path: string }>(
      `/api/tourist/register-face`,
      form
    );
  },
  verifyTouristFace: (touristId: string, file: File) => {
    const form = new FormData();
    form.append("tourist_id", touristId);
    form.append("image", file);
    return httpForm<{ status: "success" | "failed"; verified: boolean; message: string; tourist_id?: string }>(
      `/api/tourist/verify-face`,
      form
    );
  },

  // Computer Vision: crowd analysis
  analyzeCrowd: (file: File, opts?: { location_id?: string; timestamp?: string }) => {
    const form = new FormData();
    form.append("image", file);
    if (opts?.location_id) form.append("location_id", opts.location_id);
    if (opts?.timestamp) form.append("timestamp", opts.timestamp);
    return httpForm<{ status: string; crowd_analysis: any }>(`/api/crowd/analyze`, form);
  },

  // Chatbot
  chatbotQuery: (payload: { tourist_id: string; message: string; language?: string }) =>
    http<{ status: string; result: { response: string; query_type: string; language: string; requires_human_intervention: boolean } }>(
      `/api/chatbot/query`,
      { method: "POST", body: JSON.stringify({ language: 'en', ...payload }) }
    ),

  // ASR: load model (server-side if NeMo available)
  asrLoadModel: (checkpoint_path: string) =>
    http<{ status: string; message: string }>(`/api/asr/load-model`, {
      method: 'POST',
      body: JSON.stringify({ checkpoint_path })
    }),

  // ASR: transcribe given audio file
  asrTranscribe: (file: File, opts?: { language_id?: string; decoder?: 'ctc' | 'rnnt' }) => {
    const form = new FormData();
    form.append('audio', file);
    if (opts?.language_id) form.append('language_id', opts.language_id);
    if (opts?.decoder) form.append('decoder', opts.decoder);
    return httpForm<{ status: string; text: string; engine: 'nemo' | 'fallback' }>(`/api/asr/transcribe`, form);
  },

  // Blockchain Trip Management
  registerTrip: (tripData: TripData) =>
    http<TripRegistrationResponse>(`/api/trips/register`, {
      method: "POST",
      body: JSON.stringify(tripData),
    }),

  getTripStatus: (tripId: string) =>
    http<TripStatusResponse>(`/api/trips/status`, {
      method: "POST",
      body: JSON.stringify({ trip_id: tripId }),
    }),

  deleteTrip: (tripId: string) =>
    http<{ status: string; message: string; deletion_data: any }>(`/api/trips/delete`, {
      method: "POST",
      body: JSON.stringify({ trip_id: tripId }),
    }),

  cleanupTrips: () =>
    http<{ status: string; cleanup_data: any }>(`/api/trips/cleanup`, {
      method: "POST",
    }),
};

// WebSocket helpers (compatible with FastAPI/websockets)
export function connectDashboardWS(onMessage: (msg: any) => void): WebSocket {
  const wsUrl = (API_BASE_URL.startsWith("https") ? "wss" : "ws") + API_BASE_URL.slice(API_BASE_URL.indexOf(":"));
  const ws = new WebSocket(`${wsUrl}/ws/dashboard`);
  ws.onmessage = (e) => {
    try { onMessage(JSON.parse(e.data)); } catch { /* ignore */ }
  };
  return ws;
}


