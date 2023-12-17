'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

import Clock from '../components/Clock';

export default function HomePage() {
  const [time, setTime] = useState<Array<{timeZone: string, time: string, date: string, dayOfWeek: string}>>([]);

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
          updatedTime.push(time);

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
        <div className="flex flex-row mx-auto my-16 rounded-2xl w-fit bg-zinc-300">
          {time.map((timeData, index) => (
            <Clock key={index} timeData={timeData} />
          ))}
        </div>
      </section>
    </main>
  );
};
