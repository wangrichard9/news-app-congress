from fastapi import APIRouter

router = APIRouter(
    prefix="/news",
    tags=["News"]
)

@router.get("/")
def get_news():
    return {"message": "Here are the latest news!"}

@router.get("/{article_id}")
def get_article(article_id: int):
    return {"id": article_id, "title": "Sample News"}