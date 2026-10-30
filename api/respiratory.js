export default async function handler(req, res) {
  try {
    const url =
      "https://api.github.com/repos/nychealth/respiratory-illness-data/contents/data";

    const response = await fetch(url, {
      headers: {
        "Accept": "application/vnd.github+json",
        "User-Agent": "Healthscope-NYC"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub returned ${response.status}`);
    }

    const files = await response.json();

    res.status(200).json({
      success: true,
      files: files.map(file => ({
        name: file.name,
        downloadUrl: file.download_url
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
