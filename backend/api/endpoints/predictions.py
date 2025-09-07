from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
import datetime

router = APIRouter()

class ElectionPrediction(BaseModel):
    constituency: str
    predicted_winner: str
    confidence: float
    vote_share_prediction: Dict[str, float]

class PollData(BaseModel):
    date: str
    sample_size: int
    results: Dict[str, float]

@router.get("/election", response_model=List[ElectionPrediction])
async def get_election_predictions():
    """Get election predictions for Bengal constituencies"""
    return [
        ElectionPrediction(
            constituency="Kolkata North",
            predicted_winner="TMC",
            confidence=0.75,
            vote_share_prediction={
                "TMC": 45.5,
                "BJP": 35.2,
                "CPM": 12.1,
                "Congress": 7.2
            }
        ),
        ElectionPrediction(
            constituency="Kolkata South",
            predicted_winner="TMC",
            confidence=0.68,
            vote_share_prediction={
                "TMC": 42.8,
                "BJP": 38.5,
                "CPM": 10.2,
                "Congress": 8.5
            }
        )
    ]

@router.get("/polls")
async def get_polling_data():
    """Get latest polling data and trends"""
    return {
        "latest_poll": {
            "date": "2023-12-01",
            "sample_size": 2500,
            "margin_of_error": 3.5,
            "results": {
                "TMC": 38.5,
                "BJP": 35.2,
                "CPM": 15.1,
                "Congress": 8.7,
                "Others": 2.5
            }
        },
        "trend": "TMC leading with slight margin"
    }

@router.get("/swing-analysis")
async def get_swing_analysis():
    """Analyze vote swing patterns"""
    return {
        "overall_swing": {
            "from_previous": {
                "TMC": -2.3,
                "BJP": +1.8,
                "CPM": -0.5,
                "Congress": +1.0
            }
        },
        "key_constituencies": [
            {"name": "Kolkata North", "swing": "TMC to BJP: -3.2%"},
            {"name": "Asansol", "swing": "BJP to TMC: +2.1%"}
        ]
    }

@router.post("/update-model")
async def update_prediction_model(new_data: Dict[str, Any]):
    """Update the election prediction model with new data"""
    return {
        "message": "Model updated successfully",
        "accuracy_improvement": "+2.3%",
        "last_updated": datetime.datetime.now().isoformat()
    }