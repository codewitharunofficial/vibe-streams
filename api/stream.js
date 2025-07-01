import youtubedl from 'youtube-dl-exec';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { proxies } from '../proxies.js';

export default async function stream(req, res) {
    const { videoId, itag } = req.query;

    if (!videoId || !itag) {
        return res.status(400).json({ error: 'Missing videoId or itag' });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    console.log(Math.floor(Math.random() * 10));

    try {
        const proxyUrl = proxies[Math.floor(Math.random() * 10)];
        const options = {
            format: itag,
            getUrl: true,
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            addHeader: [
                'Accept: */*',
                'Accept-Language: en-US,en;q=0.9',
                'Referer: https://www.youtube.com/',
                'Origin: https://www.youtube.com'
            ],
        };

        // if (proxyUrl) {
        //     options.proxy = proxyUrl;
        // }

        const streamUrl = await youtubedl(url, {...options, proxy: proxyUrl});
        return res.redirect(streamUrl);
    } catch (err) {
        console.error('Error:', err);
        if (err.statusCode === 429) {
            return res.status(429).json({ error: 'Rate limit exceeded' });
        }
        return res.status(500).json({ error: 'Streaming failed', details: err.message });
    }
}