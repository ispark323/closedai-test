import os
import requests
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


app = FastAPI()

load_dotenv()

ACCU_API_KEY = os.getenv("ACCU_API_KEY")
GIPHY_API_KEY = os.getenv("GIPHY_API_KEY")
CITY_SEARCH_URL = os.getenv("CITY_SEARCH_URL")
FORECAST_URL = os.getenv("FORECAST_URL")
GIPHY_URL = os.getenv("GIPHY_URL")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/search-city")
async def search_city(request: Request):
    city = request.query_params.get("city")

    if not city:
        raise HTTPException(status_code=400, detail="city parameter is required")

    response = requests.get(CITY_SEARCH_URL, params={"q": city, "apikey": ACCU_API_KEY})
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code)

    data = response.json()

    json_data = {
        "cities": [],
    }

    for city in data:
        json_data["cities"].append(
            {
                "key": city["Key"],
                "name": city["LocalizedName"],
                "country": city["Country"]["LocalizedName"],
                "state": city["AdministrativeArea"]["LocalizedName"],
            }
        )

    return JSONResponse(json_data)


@app.get("/forecast")
async def forecast(request: Request):
    city_key = request.query_params.get("city_key")

    if not city_key:
        raise HTTPException(status_code=400, detail="city_key parameter is required")

    response = requests.get(
        f"{FORECAST_URL}/{city_key}?apikey={ACCU_API_KEY}&metric=true"
    )
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code)

    data = response.json()

    json_data = {
        "temperature_min": data["DailyForecasts"][0]["Temperature"]["Minimum"]["Value"],
        "temperature_max": data["DailyForecasts"][0]["Temperature"]["Maximum"]["Value"],
        "weather": data["Headline"]["Category"],
        "description": data["Headline"]["Text"],
    }

    # Get Giphy image for the weather
    response = requests.get(
        f"{GIPHY_URL}?api_key={GIPHY_API_KEY}&q={json_data['weather']}"
    )
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code)

    # Get the image URL from the response
    json_data["image"] = response.json()["data"][0]["images"]["downsized"]["url"]

    return JSONResponse(json_data)
