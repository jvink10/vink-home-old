import { Octokit } from 'octokit';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const owner = searchParams.get('owner');
	const repo = searchParams.get('repo');

	const octokit = new Octokit({
		auth: process.env.REPO_READ_TOKEN
	});
	const response = await octokit.request(`GET /repos/${owner}/${repo}/commits`, {
		owner: owner,
		repo: repo,
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		},
		per_page: 5,
	});
	
	const commits = response.data;
	return Response.json(commits);
};
