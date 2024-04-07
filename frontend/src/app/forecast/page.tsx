import { Card, CardTitle, CardDescription, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import Nav from '@/components/Nav';

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

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const response = await fetch(`${backend_url}/forecast?city_key=${cityKey}`);
  const weather: Weather = await response.json();

  return (
    <div className="p-5">
      <Nav />

      <section className="flex flex-col items-center gap-8 p-10">
        <Card>
          <CardHeader className="gap-2">
            <CardTitle>Weather Information</CardTitle>
            <CardDescription>{weather.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <p>High: {weather.temperature_max} &deg;C</p>
            <p>Low: {weather.temperature_min} &deg;C</p>
            <div className="text-xl font-bold pt-3">{weather.weather}</div>
          </CardContent>
          <CardFooter>
            <img src={weather.image} alt="weather image" width="250" height="250"></img>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
