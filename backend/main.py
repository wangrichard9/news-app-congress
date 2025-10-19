from fastapi import FastAPI
from routers import news
from fastapi.middleware.cors import CORSMiddleware


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = FastAPI()

app.include_router(news.router)

@app.get("/")
def root():
    return {"message": "Backend running successfully."}
