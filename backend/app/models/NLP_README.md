# Natural Language Processing Module

## Overview
The Natural Language Processing (NLP) module enhances the Smart Tourist Safety System with multilingual emergency text processing and automated Electronic First Information Report (E-FIR) generation capabilities. This module enables the system to understand and respond to emergency communications from tourists in multiple languages, assess the severity of situations, and automatically generate official documentation when necessary.

## Features

### 1. Multilingual Emergency Processing
- **Language Detection**: Automatically identifies the language of emergency communications
- **Translation**: Converts non-English text to English for standardized processing
- **Emergency Level Assessment**: Evaluates the severity of situations on a 1-10 scale
- **Information Extraction**: Identifies key details like location mentions, injuries, contact requests, and transport needs

### 2. Automated E-FIR Generation
- **Structured Documentation**: Creates standardized electronic reports for incidents
- **Unique Identification**: Generates unique complaint numbers for tracking
- **Comprehensive Data Capture**: Records complainant details, incident information, and location data
- **Incident Description Generation**: Automatically creates structured descriptions of incidents

## Implementation Details

### MultilingualEmergencyProcessor Class

```python
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
```

**Key Methods**:
- `process_emergency_text(text, language='auto')`: Main method for processing emergency text
- `_detect_language(text)`: Identifies the language of the input text
- `_translate_to_english(text, source_lang)`: Translates non-English text to English
- `_assess_emergency_level(text)`: Evaluates emergency severity on a 1-10 scale
- `_extract_emergency_info(text)`: Extracts key information from the text

### AutomatedEFIRGenerator Class

```python
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
```

**Key Methods**:
- `generate_efir(incident_data)`: Creates a structured E-FIR from incident data
- `_generate_incident_description(incident_data)`: Produces a standardized incident description

## API Endpoints

### Emergency Text Processing
```
POST /api/emergency/process-text
```

**Request Body**:
```json
{
  "text": "Help! I'm lost near the waterfall.",
  "language": "auto"  // Optional, defaults to "auto"
}
```

**Response**:
```json
{
  "status": "ok",
  "emergency_analysis": {
    "original_text": "Help! I'm lost near the waterfall.",
    "language": "english",
    "emergency_level": 7,
    "extracted_info": {
      "location_mentioned": true,
      "injury_mentioned": false,
      "contact_requested": false,
      "transport_needed": false
    },
    "requires_immediate_response": true,
    "efir_generated": true,
    "efir_number": "EFIR20230615123456"
  }
}
```

### E-FIR Creation
```
POST /api/efir/create
```

**Request Body**:
```json
{
  "incident_data": {
    "tourist_id": "T12345",
    "tourist_name": "John Doe",
    "nationality": "USA",
    "passport_number": "A1234567",
    "contact_number": "+1234567890",
    "incident_type": "MISSING_PERSON",
    "severity": "HIGH",
    "last_activity": "Hiking",
    "circumstances": "Separated from group during hike",
    "last_location": {
      "latitude": 12.3456,
      "longitude": 78.9012
    }
  }
}
```

**Response**:
```json
{
  "status": "ok",
  "efir_number": "EFIR20230615123456"
}
```

## Integration with Smart Tourist Safety System

The NLP module integrates with other components of the Smart Tourist Safety System:

1. **Emergency Communication**: Processes emergency messages from tourists
2. **Incident Response**: Triggers appropriate responses based on emergency level
3. **Documentation**: Generates official E-FIRs for serious incidents
4. **Multilingual Support**: Enables the system to serve tourists from diverse linguistic backgrounds

## Dependencies

- **Transformers**: For translation and sentiment analysis pipelines
- **FastAPI**: For API endpoint implementation
- **Pydantic**: For request/response data validation

## Testing

Two test scripts are provided to verify the functionality of the NLP module:

1. **test_nlp_emergency.py**: Unit tests for the MultilingualEmergencyProcessor class
2. **test_emergency_api.py**: Integration tests for the emergency text processing API endpoint

## Future Enhancements

1. **Advanced Language Detection**: Implement more sophisticated language identification
2. **Expanded Language Support**: Add support for additional languages
3. **Sentiment Analysis**: Incorporate sentiment analysis for better emergency assessment
4. **Named Entity Recognition**: Extract specific entities like landmarks, people, and organizations
5. **Voice Processing**: Add capability to process spoken emergency communications