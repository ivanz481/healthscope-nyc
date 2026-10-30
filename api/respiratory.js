function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;

      row.push(field);

      if (row.some(v => v !== "")) {
        rows.push(row);
      }

      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows[0].map(h => h.trim());

  return rows.slice(1).map(values => {
    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = values[index]?.trim() ?? "";
    });

    return obj;
  });
}

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
    const rows = parseCSV(csv);

    const validRows = rows.filter(row =>
      row.Date &&
      row.Metric &&
      row.Value
    );

    const newestDate = validRows
      .map(row => new Date(row.Date))
      .filter(date => !isNaN(date))
      .sort((a, b) => b - a)[0];

    if (!newestDate) {
      throw new Error("No valid respiratory dates found");
    }

    const latestDateString =
      String(newestDate.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(newestDate.getDate()).padStart(2, "0") +
      "/" +
      newestDate.getFullYear();

    const latestRows = validRows.filter(
      row => row.Date === latestDateString
    );

    const overall = latestRows.find(row =>
      row.Metric.toLowerCase().includes("respiratory illness") &&
      row.Submetric.toLowerCase() === "overall"
    );

    const covid = latestRows.find(row =>
      row.Metric.toLowerCase().includes("covid")
    );

    const flu = latestRows.find(row =>
      row.Metric.toLowerCase().includes("influenza") ||
      row.Metric.toLowerCase().includes("flu")
    );

    const rsv = latestRows.find(row =>
      row.Metric.toLowerCase().includes("rsv")
    );

    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );

    res.status(200).json({
      success: true,
      fetchedAt: new Date().toISOString(),
      weekEnding: latestDateString,
      dataAsOf:
        overall?.["Data as of"] ||
        covid?.["Data as of"] ||
        flu?.["Data as of"] ||
        rsv?.["Data as of"] ||
        null,

      respiratory: overall
        ? {
            value: Number(overall.Value),
            display: overall.Display
          }
        : null,

      covid: covid
        ? {
            value: Number(covid.Value),
            display: covid.Display,
            metric: covid.Metric,
            submetric: covid.Submetric
          }
        : null,

      flu: flu
        ? {
            value: Number(flu.Value),
            display: flu.Display,
            metric: flu.Metric,
            submetric: flu.Submetric
          }
        : null,

      rsv: rsv
        ? {
            value: Number(rsv.Value),
            display: rsv.Display,
            metric: rsv.Metric,
            submetric: rsv.Submetric
          }
        : null
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
