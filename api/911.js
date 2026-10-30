export default async function handler(req, res) {
  try {
    const description =
      "Combined average response time to life threatening medical emergencies by ambulance and fire units";

    const params = new URLSearchParams({
      "$select": "month_name,borough,of_incidents,value",
      "$where": [
        "agency='Aggregate'",
        `description='${description.replaceAll("'", "''")}'`,
        "borough in('Bronx','Brooklyn','Manhattan','Queens','Staten Island')"
      ].join(" AND "),
      "$order": "month_name DESC",
      "$limit": "1000"
    });

    const url =
      "https://data.cityofnewyork.us/resource/gpny-cuvw.json?" +
      params.toString();

    const response = await fetch(url, {
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`NYC Open Data returned ${response.status}`);
    }

    const data = await response.json();

    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );

    res.status(200).json({
      success: true,
      fetchedAt: new Date().toISOString(),
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to retrieve NYC Open Data",
      details: error.message
    });
  }
}
