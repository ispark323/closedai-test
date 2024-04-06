'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  city: z.string(),
});

export interface City {
  key: string;
  name: string;
  country: string;
  state: string;
}

export default function Home() {
  const [cities, setCities] = useState<Array<City>>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
    },
  });

  const getCities = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`http://localhost:8000/search-city?city=${values.city}`);
      const data = await response.json();
      setCities(data.cities);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(getCities)} className="max-w-md w-full flex flex-col gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Weather Forecast</FormLabel>
                  <FormControl>
                    <Input placeholder="Search City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
      {cities.length > 0 && (
        <div>
          <ul>
            {cities.map((city: City) => (
              <li key={city.key}>
                <Link
                  href={{
                    pathname: '/forecast',
                    query: {
                      cityKey: city.key,
                    },
                  }}
                >
                  {city.name}, {city.state}, {city.country}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
