from os import getenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.staticfiles import StaticFiles
from routes import auth, comments, posts, users

TITLE: str = "Segmentation Fault API"
""" Title of the API. """

DESCRIPTION: str = "RESTful API for Segmentation Fault"
""" Description of the API. """

VERSION: str = "0.0.1"
""" Version of the API. """

app = FastAPI(
    title=TITLE,
    description=DESCRIPTION,
    version=VERSION,
    docs_url=None,
    redoc_url=None,
    debug=getenv("DEBUG") == "True",
)
""" The API application. """

app.add_middleware(
    CORSMiddleware,
    allow_origins=[getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="segmentation_fault/static"), name="static")


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html_cdn():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - Docs",
        swagger_css_url="/static/swagger-ui.css",
    )


app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(comments.router, prefix="/comments", tags=["Comments"])
app.include_router(posts.router, prefix="/posts", tags=["Posts"])
app.include_router(users.router, prefix="/users", tags=["Users"])
