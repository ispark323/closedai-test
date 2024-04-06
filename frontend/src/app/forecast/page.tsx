type Request = {
  params: Record<string, string>;
  searchParams: Record<string, string>;
};

export interface Weather {
  temperature_min: number;
  temperature_max: number;
  weather: string;
  description: string;
  image: string;
}

export default async function ForecastPage(request: Request) {
  const searchParams = request.searchParams;
  const { cityKey } = searchParams;

  const response = await fetch(`http://localhost:8000/forecast?city_key=${cityKey}`);
  const weather: Weather = await response.json();

  return (
    <div>
      <h2>Weather Information</h2>
      {weather.weather}
      {weather.description}
    </div>
  );
}
