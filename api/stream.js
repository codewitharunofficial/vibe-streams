// api/stream.js
import ytdl from '@distube/ytdl-core';

export default async function stream(req, res) {
    const { videoId, itag } = req.query;

    console.log(itag, videoId);

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
        });

        const info = await ytdl.getInfo(url);
        // console.log("INfo: ", info);
        const format = info.formats.find((f) => f.itag == itag);


        if (!format) {
            return res.status(404).json({ error: 'Format not found' });
        }

        res.setHeader('Content-Type', format.mimeType.split(';')[0]);
        res.setHeader('Content-Disposition', `inline; filename="${videoId}.${format.container || 'media'}"`);

        stream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Streaming failed' });
    }
}
