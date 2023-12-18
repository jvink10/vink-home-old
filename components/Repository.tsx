import Link from 'next/link';

type Props = {
	repository: {repository: {name: string, url?: string}, deployment: {status: string, url?: string}, commits: Array<{author: string, message: string, url: string}>};
};

export default function Repository(props: Props) {
	const name = props.repository.repository.name.replaceAll("-", " ");

	return (
		<div className="first:rounded-l-2xl last:rounded-r-2xl w-64 overflow-hidden dark:text-white">
			<div className="border-b border-[#d0d7de] dark:border-[#30363d] px-8 py-4 bg-[#f6f8fa] dark:bg-[#0d1117]">
				<a href={props.repository.repository.url} target="_blank" className={`font-bold truncate ${props.repository.repository.url ? 'hover:underline' : 'cursor-default'}`}>{name}</a>
			</div>
			<div className="px-8 py-4 divide-y divide-[#d0d7de] dark:divide-[#30363d] dark:bg-[#161b22]">
				<a href={props.repository.deployment.url} target="_blank" className={`block pb-2 truncate ${props.repository.deployment.url ? 'hover:underline' : 'cursor-default'}`}>{props.repository.deployment.status}</a>
				{props.repository.commits.map((commit, index) => (
      	  <Link key={index} href={commit.url} target="_blank" className="block py-5 text-sm truncate hover:underline">{commit.author}: {commit.message}</Link>
				))}
			</div>
		</div>
	);
};
