function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export default async function handler(req, res) {
  try {
    const url =
      "https://www.nyc.gov/site/doh/data/data-sets/childhood-vaccination-data.page";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Healthscope-NYC/1.0",
        Accept: "text/html"
      }
    });

    if (!response.ok) {
      throw new Error(`NYC Health returned ${response.status}`);
    }

    const text = stripHtml(await response.text());

    const flu = text.match(
      /As of\s+([A-Za-z]+\s+\d{1,2},\s+\d{4}),\s+(\d+(?:\.\d+)?)%\s+of NYC children and adolescents ages 6 months to 17 years had received an annual flu vaccine during the\s+([0-9]{4}-[0-9]{2})\s+influenza season/i
    );

    const updated = text.match(
      /Last updated on\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})\s+with data through\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i
    );

    if (!flu) {
      throw new Error("Could not parse NYC childhood influenza coverage");
    }

    const payload = {
      coverage: Number(flu[2]),
      coverageDate: flu[1],
      season: flu[3],
      pageLastUpdated: updated?.[1] || null,
      dataThrough: updated?.[2] || flu[1]
    };

    res.setHeader(
      "Cache-Control",
      "s-maxage=21600, stale-while-revalidate=86400"
    );

    res.status(200).json({
      success: true,
      fetchedAt: new Date().toISOString(),
      source:
        "NYC Department of Health and Mental Hygiene Childhood Vaccination Data Explorer",
      ...payload
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to retrieve NYC childhood vaccination data",
      details: error.message
    });
  }
}
