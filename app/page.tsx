'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import Select from 'react-select';
import timeZones from '../data/time-zones';
import { IoAdd } from "react-icons/io5";
import Clock from '../components/Clock';
import Repository from '../components/Repository';

export default function HomePage() {
  const [time, setTime] = useState<Array<{timeZone: string, time: string}>>([]);
  const [selectTimeZone, setSelectTimeZone] = useState<{value: string, label: string} | undefined>();
  const [repositories, setRepositories] = useState<Array<{repository: {name: string, url?: string}, deployment: {status: string, url?: string}, commits: Array<{author: string, message: string, url: string}>}>>([]);

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

  const addTimeZone = async (request: {timeZone: string}) => {
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

  const handleTimeZoneChange = (value: any) => {
    setSelectTimeZone(value);
  };

  const clockInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      selectTimeZone && addTimeZone({timeZone: selectTimeZone.value});
    };
  };

  useEffect(() => {
    const requestArray = [{timeZone: "Australia/Brisbane"}, {timeZone: "Europe/Lisbon"}];
    requestArray.forEach((request) => addTimeZone(request));
  }, []);

  const storeRepositories = (repository: {name: string, homepage?: string}, deployment: Array<{state: string, environment_url?: string}>, commitData: Array<{commit: {author: {name: string}, message: string}, html_url: string}>) => {
    setRepositories((prevRepositories) => {
      const name = repository.name;
      const pageUrl = repository.homepage;

      const status = deployment[0].state;
      const deploymentUrl = deployment[0].environment_url;

      const newCommits: Array<{author: string, message: string, url: string}> = [];
      commitData.forEach((commit) => {
        const author = commit.commit.author.name;
        const message = commit.commit.message;
        const commitUrl = commit.html_url;
        newCommits.push({author: author, message: message, url: commitUrl});
      });

      const updatedRepositories = [...prevRepositories];
      updatedRepositories.push({repository: {name: name, url: pageUrl}, deployment: {status: status, url: deploymentUrl}, commits: newCommits});

      return updatedRepositories;
    });
  };

  useEffect(() => {
    const repositoryArray = [{owner: 'jvink10', repo: 'your-local-wedding-guide'}, {owner: 'jvink10', repo: 'vink-home'}];

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

        
        const deploymentResponse = await fetch(`api/github/deployment-status?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const deployment = await deploymentResponse.json();

        const repositoryResponse = await fetch(`api/github/home-page?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const repository = await repositoryResponse.json();

        if (commits && deployment && repository) {
          storeRepositories(repository, deployment, commits);
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
    <main className="dark:bg-zinc-700">
      <header className="border-b border-[#d0d7de] dark:border-black py-4 bg-zinc-200 dark:bg-zinc-900 dark:text-white">
        <div className="flex flex-row justify-evenly mx-8">
          <Link href="#favouriteSection">Favourites</Link>
          <Link href="#emailSection">Emails</Link>
          <Link href="#gitSection">Github</Link>
          <Link href="#docSection">Docs</Link>
        </div>
      </header>
      <section id="favouriteSection">
        <div className="flex flex-row justify-center items-center my-8">
          <button onClick={() => selectTimeZone && addTimeZone({timeZone: selectTimeZone.value})} className="border border-black/25 rounded-md w-[38px] h-[38px] text-4xl bg-white"><IoAdd className="text-black/25" /></button>
          <Select options={timeZones} onChange={handleTimeZoneChange} onKeyDown={clockInputKeyDown} placeholder="Continent/City" className="ml-2 w-80" />
        </div>
        <div className="flex flex-row mx-auto mt-8 mb-16 border border-[#d0d7de] dark:border-black rounded-lg w-fit">
          {time.map((timeData, index) => (
            <Clock key={index} timeData={timeData} removeTimeZone={removeTimeZone} />
          ))}
        </div>
      </section>
      <section id="emailSection">
        
      </section>
      <section id="gitSection">
        <div className="flex flex-row mx-auto my-16 border border-[#d0d7de] dark:border-black rounded-lg w-fit">
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
