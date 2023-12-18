import Link from 'next/link';

type Props = {
	repository: {repository: {name: string, url?: string}, deployment: {status: string, url?: string}, commits: Array<{author: string, message: string, url: string}>};
};

export default function Repository(props: Props) {
	return (
		<div className="p-8 w-64">
			<a href={props.repository.repository.url} target="_blank" className="text-lg font-bold">{props.repository.repository.name}</a>
			<a href={props.repository.deployment.url} target="_blank" className="block">{props.repository.deployment.status}</a>
			{props.repository.commits.map((commit, index) => (
        <Link key={index} href={commit.url} target="_blank" className="block text-sm">{commit.author}: {commit.message}</Link>
      ))}
		</div>
	);
};
