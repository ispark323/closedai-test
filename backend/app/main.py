import os
import requests
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv


app = FastAPI()

load_dotenv()

ACCU_API_KEY = os.getenv("ACCU_API_KEY")
GIPHY_API_KEY = os.getenv("GIPHY_API_KEY")
CITY_SEARCH_URL = os.getenv("CITY_SEARCH_URL")


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
