import ytdl from '@distube/ytdl-core';

export default async function stream(req, res) {
    const { videoId, itag } = req.query;

    if (!videoId || !itag) {
        return res.status(400).json({ error: 'Missing videoId or itag' });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    if (!ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid videoId' });
    }

    try {
        // Enhanced request options with additional headers
        const requestOptions = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.youtube.com/',
                'Origin': 'https://www.youtube.com'
            }
        };

        // Optional: Use a proxy to mask server IP (uncomment if needed)
        // const agent = new HttpsProxyAgent('http://your-proxy-server:port');
        // requestOptions.agent = agent;

        const info = await ytdl.getInfo(url, { requestOptions });

        const format = info.formats.find((f) => f.itag == Number(itag));

        if (!format) {
            return res.status(404).json({ error: 'Format not found' });
        }

        res.redirect(format.url);
    } catch (err) {
        console.error('Error fetching stream:', err);
        if (err.statusCode === 403) {
            return res.status(403).json({ error: 'Access forbidden by YouTube, try again later or check server configuration' });
        }
        res.status(500).json({ error: 'Streaming failed' });
    }
}