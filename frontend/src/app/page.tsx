'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Nav from '@/components/Nav';

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

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  const getCities = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`${backend_url}/search-city?city=${values.city}`);
      const data = await response.json();
      setCities(data.cities);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <main className="p-5">
      <Nav />

      <section className="flex flex-col items-center gap-8 p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(getCities)} className="max-w-md w-full flex flex-col gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Find Weather</FormLabel>
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
        <div>
          {cities.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Showing locations</p>
              <ul className="p-2">
                {cities.map((city: City) => (
                  <li key={city.key} className="p-2">
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
        </div>
      </section>
    </main>
  );
}
