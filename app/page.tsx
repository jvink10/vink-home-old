'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import Clock from '../components/Clock';
import Repository from '../components/Repository';

export default function HomePage() {
  const [time, setTime] = useState<Array<{timeZone: string, time: string, date: string, dayOfWeek: string}>>([]);
  const [repositories, setRepositories] = useState<Array<{name: string, status: string, commits: Array<{author: string, message: string}>}>>([]);

  const incrementTime = () => {
    setTime((prevTime) => {
      const updatedTime = prevTime.map((timeZone) => {
        const [hour, minute]: Array<string | number> = timeZone.time.split(":");
        const updatedMinute = (parseInt(minute) + 1) % 60;
        const updatedHour = updatedMinute === 0 ? (parseInt(hour) + 1) % 24 : parseInt(hour);

        const newTime = `${updatedHour.toString().padStart(2, '0')}:${updatedMinute.toString().padStart(2, '0')}`;
        return { ...timeZone, time: newTime };
      });

      return updatedTime;
    });
  };

  const minuteIntervalMounted = useRef(true);

  useEffect(() => {
    const requestArray = [{timeZone: "Australia/Brisbane"}, {timeZone: "Europe/Lisbon"}];

    const fetchTime = async (request: {timeZone: string}) => {
      try{
        const queryParams = new URLSearchParams(request);
        const response = await fetch(`api/get-time?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const { time } = await response.json();
        setTime((prevTime) => {
          const updatedTime = [...prevTime];
          updatedTime.push(time);

          return updatedTime;
        });

        if (minuteIntervalMounted.current) {
          const timeoutSeconds = 60 - time.seconds;
          setTimeout(() => {
            incrementTime();
            const minuteInterval = setInterval(() => {
              incrementTime();
            }, 60000);
            return () => clearInterval(minuteInterval);
          }, timeoutSeconds * 1000);
          minuteIntervalMounted.current = false;
        };
      } catch (error) {
        console.error('Error fetching time: ', error);
      };
    };

    requestArray.forEach((request) => fetchTime(request));
  }, []);

  const storeRepositories = (repository: string, deploymentStatus: Array<{state: string}>, commitData: Array<{commit: {author: {name: string}, message: string}}>) => {
    setRepositories((prevRepositories) => {
      const status = deploymentStatus[0].state;

      const newCommits: Array<{author: string, message: string}> = [];
      commitData.forEach((commit) => {
        const author = commit.commit.author.name;
        const message = commit.commit.message;
        newCommits.push({author: author, message: message});
      });

      const updatedRepositories = [...prevRepositories];
      updatedRepositories.push({name: repository, status: status, commits: newCommits});

      return updatedRepositories;
    });
  };

  useEffect(() => {
    const repositoryArray = [{owner: 'jvink10', repo: 'room-view'}, {owner: 'jvink10', repo: 'your-local-wedding-guide'}, {owner: 'jvink10', repo: 'vink-home'}];

    const fetchRepository = async (request: {owner: string, repo: string}) => {
      try {
        const queryParams = new URLSearchParams(request);
        const commitResponse = await fetch(`api/github/list-commits?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const commits = await commitResponse.json();

        if (commits) {
          const queryParams = new URLSearchParams(request);
          const deploymentResponse = await fetch(`api/github/deployment-status?${queryParams}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const deploymentStatus = await deploymentResponse.json();

          storeRepositories(request.repo, deploymentStatus, commits);
        };
      } catch (error) {
        console.error('Error fetching data: ', error);
      };
    };

    repositoryArray.forEach(repository => fetchRepository(repository));
  }, []);

  const removeTimeZone = (timeZone: string) => {
    setTime((prevTime) => {
      const updatedTime = prevTime.filter((timeData) => timeData.timeZone !== timeZone);
      return updatedTime;
    });
  };

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
            <Clock key={index} timeData={timeData} removeTimeZone={removeTimeZone} />
          ))}
        </div>
      </section>
      <section id="emailSection">
        
      </section>
      <section id="gitSection">
        <div className="flex flex-row mx-auto my-16 rounded-2xl w-fit bg-zinc-300">
          {repositories.map((repository, index) => (
            <Repository key={index} repository={repository} />
          ))}
        </div>
      </section>
      <section id="docSection">

      </section>
    </main>
  );
};
