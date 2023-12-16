'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [time, setTime] = useState<Array<{continent: string, city: string, year: number, month: number, day: number, hour: number, minute: number, seconds: number, dayOfWeek: string}>>([]);

  useEffect(() => {
    const requestArray = [{ continent: 'Australia', city: 'Brisbane' }, { continent: 'Europe', city: 'Lisbon' }];

    const fetchTime = async (request: {continent: string, city: string}) => {
      try{
        const queryParams = new URLSearchParams(request);
        const response = await fetch(`api/gettime?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const { time } = await response.json();
        setTime(prevTime => {
          const updatedTime = [...prevTime];
          updatedTime.push({continent: request.continent, city: request.city, year: time.year, month: time.month, day: time.day, hour: time.hour, minute: time.minute, seconds: time.seconds, dayOfWeek: time.dayOfWeek});

          return updatedTime;
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    requestArray.forEach(request => fetchTime(request));
  }, []);

  return (
    <main>
      <header className="py-4 bg-zinc-700 text-white">
        <div className="flex flex-row justify-evenly mx-8">
          <Link href="#linkSection">Links</Link>
          <Link href="#noteSection">Notes</Link>
          <Link href="#emailSection">Emails</Link>
          <Link href="#docSection">Docs</Link>
        </div>
      </header>
      <section id="linkSection">
        <div>
          <p>The time in Brisbane is {time.find((data) => data.continent === "Australia" && data.city === "Brisbane")?.dayOfWeek}</p>
          <p>The time in Lisbon is {time.find((data) => data.continent === "Europe" && data.city === "Lisbon")?.dayOfWeek}</p>
        </div>
      </section>
    </main>
  );
};
