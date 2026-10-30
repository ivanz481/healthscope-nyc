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
      if (row.some(v => v !== "")) rows.push(row);
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

function isoDate(mmddyyyy) {
  const [m, d, y] = String(mmddyyyy).split("/");
  if (!m || !d || !y) return null;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export default async function handler(req, res) {
  try {
    const url =
      "https://raw.githubusercontent.com/nychealth/respiratory-illness-data/main/data/OpenData_NYC_Respiratory_Illness_Data.csv";

    const response = await fetch(url, {
      headers: { "User-Agent": "Healthscope-NYC" }
    });

    if (!response.ok) {
      throw new Error(`NYC respiratory data returned ${response.status}`);
    }

    const rows = parseCSV(await response.text());

    const metricMap = {
      "Respiratory illness visits": "respiratory",
      "COVID-19 visits": "covid",
      "Influenza visits": "flu",
      "RSV visits": "rsv"
    };

    const byDate = new Map();

    for (const row of rows) {
      if (row.Submetric !== "Overall") continue;
      const key = metricMap[row.Metric];
      if (!key) continue;

      const date = isoDate(row.Date);
      const value = Number(row.Value);
      if (!date || !Number.isFinite(value)) continue;

      if (!byDate.has(date)) {
        byDate.set(date, {
          date,
          dataAsOf: row["Data as of"] || null,
          respiratory: null,
          covid: null,
          flu: null,
          rsv: null
        });
      }

      const item = byDate.get(date);
      item[key] = value;
      if (row["Data as of"]) item.dataAsOf = row["Data as of"];
    }

    const history = [...byDate.values()]
      .filter(x =>
        [x.respiratory, x.covid, x.flu, x.rsv]
          .every(v => Number.isFinite(v))
      )
      .sort((a, b) => a.date.localeCompare(b.date));

    if (!history.length) {
      throw new Error("No complete respiratory history found");
    }

    const latest = history[history.length - 1];
    const previous = history.length > 1 ? history[history.length - 2] : null;

    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );

    res.status(200).json({
      success: true,
      fetchedAt: new Date().toISOString(),
      latest,
      previous,
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to retrieve NYC respiratory illness data",
      details: error.message
    });
  }
}
