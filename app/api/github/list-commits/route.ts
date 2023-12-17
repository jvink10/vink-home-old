import { Octokit } from 'octokit';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const owner = searchParams.get('owner');
	const repo = searchParams.get('repo');

	const octokit = new Octokit({
		auth: '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'
	});
	const response = await octokit.request(`GET /repos/${owner}/${repo}/commits`, {
		owner: owner,
		repo: repo,
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		},
		per_page: 3,
	});
	
	const commits = response.data;
	return Response.json(commits);
};
