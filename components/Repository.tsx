type Props = {
	repository: {name: string, status: string, commits: Array<{author: string, message: string}>};
};

export default function Repository(props: Props) {
	return (
		<div className="p-8 w-64">
			<h2 className="text-lg font-bold">{props.repository.name}</h2>
			<p>{props.repository.status}</p>
			{props.repository.commits.map((commit, index) => (
        <p key={index} className="text-sm">{commit.author}: {commit.message}</p>
      ))}
		</div>
	);
};
