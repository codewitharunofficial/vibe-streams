// api/formats.js
import ytdl from '@distube/ytdl-core';

export default async function formats(req, res) {
    const { videoId } = req.query;

    if (!videoId) {
        return res.status(400).json({ error: 'Missing videoId' });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    if (!ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid videoId' });
    }

    try {
        const info = await ytdl.getInfo(url, {
            
        });

        const formats = info.formats.map((format) => ({
            itag: format.itag,
            qualityLabel: format.qualityLabel || null,
            mimeType: format.mimeType,
            audioBitrate: format.audioBitrate || null,
            hasVideo: format.hasVideo,
            hasAudio: format.hasAudio,
            isLive: format.isLive,
            url: format.url,
        })).filter((item) => item.hasAudio === true);

        // res.status(200).json({
        //     title: info.videoDetails.title,
        //     videoId: info.videoDetails.videoId,
        //     lengthSeconds: info.videoDetails.lengthSeconds,
        //     formats,
        // });

        console.log("Trying To Play: ", formats.find((item) => item.itag === 251).url);

        res.redirect(formats.find((item) => item.itag === 251).url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve video formats' });
    }
}
