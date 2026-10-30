export default async function handler(req, res) {
  try {
    const url =
      "https://data.cityofnewyork.us/resource/gpny-cuvw.json?$limit=1000";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NYC Open Data returned ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json({
      success: true,
      updatedAt: new Date().toISOString(),
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to retrieve NYC Open Data"
    });
  }
}
