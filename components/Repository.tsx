type Props = {
	commitData: {name: string, commits: Array<{author: string, message: string}>};
};

export default function Repository(props: Props) {
	return (
		<div className="p-8">
			<h2 className="font-bold">{props.commitData.name}</h2>
			{props.commitData.commits.map((commit, index) => (
        <p key={index} className="text-sm">{commit.author}: {commit.message}</p>
      ))}
		</div>
	);
};
