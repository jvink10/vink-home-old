'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

import Clock from '../components/Clock';
import Repository from '../components/Repository';

export default function HomePage() {
  const [time, setTime] = useState<Array<{timeZone: string, time: string, date: string, dayOfWeek: string}>>([]);
  const [commits, setCommits] = useState<Array<{name: string, commits: Array<{author: string, message: string}>}>>([]);

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
      };
    };

    requestArray.forEach(request => fetchTime(request));
  }, []);

  const filterCommits = (repo: string, commitData: Array<{commit: {author: {name: string}, message: string}}>) => {
    setCommits((prevCommits) => {
      const newCommits: Array<{author: string, message: string}> = [];
      commitData.forEach((commit) => {
        const author = commit.commit.author.name;
        const message = commit.commit.message;
        newCommits.push({author: author, message: message});
      });

      const updatedCommits = [...prevCommits];
      updatedCommits.push({name: repo, commits: newCommits});

      return updatedCommits;
    });
  };

  useEffect(() => {
    const fetchCommits = async (request: {owner: string, repo: string}) => {
      try {
        const queryParams = new URLSearchParams(request);
        const response = await fetch(`api/github/list-commits?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const commits = await response.json();
        filterCommits(request.repo, commits);
      } catch (error) {
        console.error('Error fetching data: ', error);
      };
    };

    fetchCommits({owner: 'jvink10', repo: 'vink-home'});
  }, []);

  return (
    <main>
      <header className="py-4 bg-zinc-700 text-white">
        <div className="flex flex-row justify-evenly mx-8">
          <Link href="#favouriteSection">Favourites</Link>
          <Link href="#emailSection">Emails</Link>
          <Link href="#gitSection">Github</Link>
          <Link href="#docSection">Docs</Link>
        </div>
      </header>
      <section id="favouriteSection">
        <div className="flex flex-row mx-auto my-16 rounded-2xl w-fit bg-zinc-300">
          {time.map((timeData, index) => (
            <Clock key={index} timeData={timeData} />
          ))}
        </div>
      </section>
      <section id="emailSection">
        
      </section>
      <section id="gitSection">
        <div className="flex flex-row mx-auto my-16 rounded-2xl w-fit bg-zinc-300">
          {commits.map((repository, index) => (
            <Repository key={index} commitData={repository} />
          ))}
        </div>
      </section>
      <section id="docSection">

      </section>
    </main>
  );
};
