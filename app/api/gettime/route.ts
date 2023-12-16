export async function GET(request: Request) {
  const baseLink = "https://timeapi.io/api/Time/current/zone?timeZone=";
  const { searchParams } = new URL(request.url);
	const continent = searchParams.get('continent');
	const city = searchParams.get('city');
  const finalLink = baseLink + continent + "/" + city;

	const response = await fetch(finalLink, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const time = await response.json();

	return Response.json({ time });
};
