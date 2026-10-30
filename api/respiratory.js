export default async function handler(req, res) {
  try {
    const url =
      "https://raw.githubusercontent.com/nychealth/respiratory-illness-data/main/data/OpenData_NYC_Respiratory_Illness_Data.csv";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Healthscope-NYC"
      }
    });

    if (!response.ok) {
      throw new Error(`NYC respiratory data returned ${response.status}`);
    }

    const csv = await response.text();

    const lines = csv.trim().split(/\r?\n/);

    if (lines.length < 2) {
      throw new Error("CSV did not contain any data rows");
    }

    const headers = lines[0].split(",");

    const rows = lines.slice(1, 6).map(line => {
      const values = line.split(",");

      const row = {};

      headers.forEach((header, i) => {
        row[header] = values[i];
      });

      return row;
    });

    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );

    res.status(200).json({
      success: true,
      fetchedAt: new Date().toISOString(),
      headers,
      sampleRows: rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
