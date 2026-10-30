export default async function handler(req, res) {
  try {
    const sourceUrl =
      "https://www.nyc.gov/assets/doh/respiratory-illness-data/";

    const response = await fetch(sourceUrl, {
      headers: {
        "User-Agent": "Healthscope-NYC/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(`NYC Health returned ${response.status}`);
    }

    const html = await response.text();

    const clean = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ");

    const dateMatch = clean.match(
      /week ending\s+([A-Za-z]{3,9}\.?\s+\d{1,2},\s+\d{4})/i
    );

    const overallMatch = clean.match(
      /Overall Respiratory Illness[\s\S]{0,500}?(\d+(?:\.\d+)?)%\s*(\d+(?:\.\d+)?)%/i
    );

    const covidMatch = clean.match(
      /COVID-19[\s\S]{0,400}?(\d+(?:\.\d+)?)%\s*(\d+(?:\.\d+)?)%/i
    );

    const fluMatch = clean.match(
      /Flu[\s\S]{0,400}?(\d+(?:\.\d+)?)%\s*(\d+(?:\.\d+)?)%/i
    );

    const rsvMatch = clean.match(
      /RSV[\s\S]{0,400}?(\d+(?:\.\d+)?)%\s*(\d+(?:\.\d+)?)%/i
    );

    if (!dateMatch || !overallMatch || !covidMatch || !fluMatch || !rsvMatch) {
      throw new Error("Could not parse respiratory metrics");
    }

    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );

    res.status(200).json({
      success: true,
      fetchedAt: new Date().toISOString(),

      source:
        "NYC Department of Health and Mental Hygiene Respiratory Illness Data",

      weekEnding: dateMatch[1],

      respiratory: {
        previous: Number(overallMatch[1]),
        current: Number(overallMatch[2])
      },

      covid: {
        previous: Number(covidMatch[1]),
        current: Number(covidMatch[2])
      },

      flu: {
        previous: Number(fluMatch[1]),
        current: Number(fluMatch[2])
      },

      rsv: {
        previous: Number(rsvMatch[1]),
        current: Number(rsvMatch[2])
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to retrieve NYC respiratory illness data",
      details: error.message
    });
  }
}
