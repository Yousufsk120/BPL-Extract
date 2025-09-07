from fastapi import APIRouter
from .endpoints import scraping, sentiment, social_media, predictions

router = APIRouter()

# Include all endpoint routers
router.include_router(scraping.router, prefix="/scraping", tags=["scraping"])
router.include_router(sentiment.router, prefix="/sentiment", tags=["sentiment"])
router.include_router(social_media.router, prefix="/social", tags=["social_media"])
router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "BPL-Extract API"}