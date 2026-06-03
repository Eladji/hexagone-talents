from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import API_PREFIX, APP_NAME, APP_VERSION, CORS_ORIGINS, RESET_DB_ON_STARTUP
from app.db.init_db import init_db


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db(reset=RESET_DB_ON_STARTUP)
    yield


def create_app() -> FastAPI:
    app = FastAPI(title=APP_NAME, version=APP_VERSION, lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router, prefix=API_PREFIX)
    return app


app = create_app()
