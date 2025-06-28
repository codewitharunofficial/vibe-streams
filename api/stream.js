// api/stream.js
import ytdl from '@distube/ytdl-core';

export default async function stream(req, res) {
    const { videoId, itag } = req.query;

    // console.log(itag, videoId);

    process.env.YTDL_NO_UPDATE = '1';


    if (!videoId || !itag) {
        return res.status(400).json({ error: 'Missing videoId or itag' });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    if (!ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid videoId' });
    }

    try {
        const stream = ytdl(url, {
            filter: (format) => format.itag == itag,
            quality: itag,
            requestOptions: {
                headers: {
                    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
                }
            }
        });

        const info = await ytdl.getInfo(url, {});

        const format = info.formats.find((f) => f.itag == itag);


        if (!format) {
            return res.status(404).json({ error: 'Format not found' });
        }

        res.redirect(format.url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Streaming failed' });
    }
}
