import { Octokit } from 'octokit';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const owner = searchParams.get('owner');
	const repo = searchParams.get('repo');

	const octokit = new Octokit({
		auth: process.env.REPO_READ_TOKEN
	});
	const deploymentResponse = await octokit.request(`GET /repos/${owner}/${repo}/deployments`, {
		owner: owner,
		repo: repo,
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		},
		per_page: 1,
	});
	const deployment = deploymentResponse.data;

  if (deployment.length > 0) {
    const deploymentId = deployment[0].id;

    const deploymentStatusResponse = await octokit.request(`GET /repos/${owner}/${repo}/deployments/${deploymentId}/statuses`, {
      owner: owner,
			repo: repo,
			deployment_id: deploymentId,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			},
			per_page: 1,
    });

		const deploymentStatus = deploymentStatusResponse.data;
		return Response.json(deploymentStatus);
  } else {
		return Response.json([{state: "Undeployed"}]);
	};
};
