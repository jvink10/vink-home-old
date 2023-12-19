import { IoIosRefresh } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Link from 'next/link';

type Props = {
	repository: {repository: {owner: string, name: string, url?: string}, commits: Array<{author: string, message: string, url: string}>};
	refreshRepository: Function;
	removeRepository: Function;
};

export default function Repository(props: Props) {
	const name = props.repository.repository.name.replaceAll("-", " ");

	const refreshRepository = () => {
		props.refreshRepository(props.repository.repository.owner, props.repository.repository.name);
	};

	const removeRepository = () => {
		props.removeRepository(props.repository.repository.name);
	};

	return (
		<div className="group first:rounded-l-lg last:rounded-r-lg w-64 overflow-hidden dark:text-white">
			<div className="flex flex-row justify-between border-b border-[#d0d7de] dark:border-[#30363d] px-8 py-4 bg-zinc-200 dark:bg-zinc-900">
				<a href={props.repository.repository.url} target="_blank" className={`font-bold truncate ${props.repository.repository.url ? 'hover:underline' : 'cursor-default'}`}>{name}</a>
				<div className="hidden group-hover:flex group-hover:flex-row group-hover:gap-1">
					<button onClick={refreshRepository}><IoIosRefresh /></button>
					<button onClick={removeRepository}><MdDelete /></button>
				</div>
			</div>
			<div className="px-8 divide-y divide-[#d0d7de] dark:divide-[#30363d] bg-zinc-100 dark:bg-zinc-800">
				{props.repository.commits.map((commit, index) => (
      	  <Link key={index} href={commit.url} target="_blank" className="block py-4 text-sm truncate hover:underline">{commit.message}</Link>
				))}
			</div>
		</div>
	);
};
