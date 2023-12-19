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
  const [repositories, setRepositories] = useState<Array<{repository: {owner: string, name: string, url?: string}, commits: Array<{author: string, message: string, url: string}>}>>([]);

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

  const repositoryOwnerInputRef = useRef<HTMLInputElement | null>(null);
  const repositoryNameInputRef = useRef<HTMLInputElement | null>(null);

  const addRepository = async (request: {owner: string, repo: string}) => {
    try {
      const queryParams = new URLSearchParams(request);

      const commitResponse = await fetch(`api/github/list-commits?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const commits = await commitResponse.json();

      const repositoryResponse = await fetch(`api/github/home-page?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const repository = await repositoryResponse.json();

      if (repository && commits) {
        setRepositories((prevRepositories) => {
          const name = repository.name;
          const pageUrl = repository.homepage;
    
          const newCommits: Array<{author: string, message: string, url: string}> = [];
          commits.forEach((commit: {commit: {author: {name: string}, message: string}, html_url: string}) => {
            const author = commit.commit.author.name;
            const message = commit.commit.message;
            const commitUrl = commit.html_url;
            newCommits.push({author: author, message: message, url: commitUrl});
          });
    
          const updatedRepositories = [...prevRepositories];
          updatedRepositories.push({repository: {owner: request.owner, name: name, url: pageUrl}, commits: newCommits});
    
          return updatedRepositories;
        });
      };
    } catch (error) {
      console.error('Error fetching data: ', error);
    };
  };

  useEffect(() => {
    const repositoryArray = [{owner: 'jvink10', repo: 'your-local-wedding-guide'}, {owner: 'jvink10', repo: 'vink-home'}];
    repositoryArray.forEach((repository) => addRepository(repository));
  }, []);

  const repositoryOwnerInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      repositoryOwnerInputRef.current && repositoryNameInputRef.current && addRepository({owner: repositoryOwnerInputRef.current.value, repo: repositoryNameInputRef.current.value});
    };
  };

  const repositoryNameInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      repositoryOwnerInputRef.current && repositoryNameInputRef.current && addRepository({owner: repositoryOwnerInputRef.current.value, repo: repositoryNameInputRef.current.value});
    } else if (event.key === 'Tab') {
      event.preventDefault();
      repositoryOwnerInputRef.current && repositoryOwnerInputRef.current.focus();
    };
  };

  const removeTimeZone = (timeZone: string) => {
    setTime((prevTime) => {
      const updatedTime = prevTime.filter((timeData) => timeData.timeZone !== timeZone);
      return updatedTime;
    });
  };

  const refreshRepository = async (owner: string, repo: string) => {
    try {
      const queryParams = new URLSearchParams({owner: owner, repo: repo});

      const commitResponse = await fetch(`api/github/list-commits?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const commits = await commitResponse.json();

      if (commits) {
        setRepositories((prevRepositories) => {
          const newCommits: Array<{author: string, message: string, url: string}> = [];
          commits.forEach((commit: {commit: {author: {name: string}, message: string}, html_url: string}) => {
            const author = commit.commit.author.name;
            const message = commit.commit.message;
            const commitUrl = commit.html_url;
            newCommits.push({author: author, message: message, url: commitUrl});
          });
    
          const updatedRepositories = [...prevRepositories];
          const repositoryIndex = updatedRepositories.findIndex((repository) => repository.repository.name === repo);
          const updatedRepository = {...updatedRepositories[repositoryIndex]};
          updatedRepository.commits = newCommits;
          updatedRepositories[repositoryIndex] = updatedRepository;
    
          return updatedRepositories;
        });
      };
    } catch (error) {
      console.error('Error fetching data: ', error);
    };
  };

  const removeRepository = (repositoryName: string) => {
    setRepositories((prevRepositories) => {
      const updatedRepositories = prevRepositories.filter((repository) => repository.repository.name !== repositoryName);
      return updatedRepositories;
    });
  };

  return (
    <main className="dark:bg-zinc-700">
      <header className="border-b border-[#d0d7de] dark:border-black py-4 bg-zinc-200 dark:bg-zinc-900 dark:text-white">
        <div className="flex flex-row justify-evenly mx-8">
          <Link href="#clockSection">Clocks</Link>
          <Link href="#gitSection">Github</Link>
        </div>
      </header>
      <section id="clockSection">
        <div className="flex flex-row justify-center items-center my-8">
          <button onClick={() => selectTimeZone && addTimeZone({timeZone: selectTimeZone.value})} className="border border-black/25 rounded-md w-[38px] h-[38px] text-4xl bg-white"><IoAdd className="text-black/25" /></button>
          <Select options={timeZones} onChange={handleTimeZoneChange} onKeyDown={clockInputKeyDown} placeholder="Continent/City" className="ml-2 w-80" />
        </div>
        <div className="flex flex-row mx-auto my-8 border border-[#d0d7de] dark:border-black rounded-lg w-fit">
          {time.map((timeData, index) => (
            <Clock key={index} timeData={timeData} removeTimeZone={removeTimeZone} />
          ))}
        </div>
      </section>
      <section id="gitSection">
        <div className="flex flex-row justify-center items-center my-8">
            <button onClick={() => repositoryOwnerInputRef.current && repositoryNameInputRef.current && addRepository({owner: repositoryOwnerInputRef.current.value, repo: repositoryNameInputRef.current.value})} className="border border-black/25 rounded-md w-[38px] h-[38px] text-4xl bg-white"><IoAdd className="text-black/25" /></button>
            <input ref={repositoryOwnerInputRef} onKeyDown={repositoryOwnerInputKeyDown} type="text" placeholder="Repository Owner" className="ml-2 border border-black/25 rounded-md p-2 w-60 h-[38px]" />
            <input ref={repositoryNameInputRef} onKeyDown={repositoryNameInputKeyDown} type="text" placeholder="Repository Name" className="ml-2 border border-black/25 rounded-md p-2 w-60 h-[38px]" />
        </div>
        <div className="flex flex-row mx-auto my-8 border border-[#d0d7de] dark:border-black rounded-lg w-fit">
          {repositories.map((repository, index) => (
            <Repository key={index} repository={repository} refreshRepository={refreshRepository} removeRepository={removeRepository} />
          ))}
        </div>
      </section>
      <footer className="py-4 bg-zinc-200 dark:bg-zinc-800 dark:text-white">

      </footer>
    </main>
  );
};
