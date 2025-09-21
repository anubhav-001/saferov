# Tourist Safety Score Model

This directory contains the trained machine learning models for the Tourist Safety Score prediction system.

## Files

- `safety_score_model.pkl`: The trained RandomForestClassifier model for predicting tourist safety scores
- `safety_score_scaler.pkl`: The StandardScaler used to normalize input features

## Model Details

The TouristSafetyScoreModel uses a Random Forest Classifier to predict safety scores on a scale of 1-10 for tourists based on various risk factors:

- Location risk (1-10 scale)
- Time of day risk (automatically calculated)
- Group size risk (solo travelers have higher risk)
- Tourist experience level (beginner, intermediate, expert)
- Trip planning status (planned vs unplanned)
- Age
- Health score

## Usage

The model is automatically loaded by the TouristSafetyScoreModel class in `ai_models.py`. The API endpoints for using this model are:

- POST `/api/safety/score`: Get a safety score prediction for a tourist
- POST `/api/safety/train`: Train the model with new data

## Training

To retrain the model with new data, use the `train_model.py` script or call the API endpoint.

```python
python -m train_model
```

## Testing

To test the model, use the `test_model.py` script:

```python
python -m test_model
```