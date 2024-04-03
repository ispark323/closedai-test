"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  city: z.string(),
}); 

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
    }
  })
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });
    try {
      const response = await fetch(`http://localhost:8000/search-city?city=${values.city}`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
   <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-md w-full flex flex-col gap-4"
      >
        <FormField control={form.control} name="city" render={({ field }) => {
          return <FormItem>
            <FormLabel>Weather Forecast</FormLabel>
            <FormControl>
              <Input placeholder='Search City'{...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        }} />
        <Button type='submit' className='w-full'>Submit</Button>
      </form>
    </Form>
   </main>
  );
}
