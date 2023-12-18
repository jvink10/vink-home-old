export async function GET(request: Request) {
  const baseLink = "https://timeapi.io/api/Time/current/zone?timeZone=";
  const { searchParams } = new URL(request.url);
	const timeZone = searchParams.get('timeZone');
  const finalLink = baseLink + timeZone;

	const response = await fetch(finalLink, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const time = await response.json();

	return Response.json({ time });
};
