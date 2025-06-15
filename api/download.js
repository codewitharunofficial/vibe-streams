// api/audio.js
import ytdl from '@distube/ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { PassThrough } from 'stream';

export default async function handler(req, res) {
    const { videoId } = req.query;

    if (!videoId) {
        return res.status(400).send('Missing videoId');
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    console.log("Song Url: ", url);

    if (!ytdl.validateURL(url)) {
        return res.status(400).send('Invalid videoId');
    }

    try {
        const audioStream = ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
        });

        const outputStream = new PassThrough();

        ffmpeg.setFfmpegPath(ffmpegPath);

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader(
            'Content-Disposition',
            `inline; filename="${videoId}.mp3"`
        );

        ffmpeg(audioStream)
            .audioBitrate(128)
            .format('mp3')
            .on('error', (err) => {
                console.error('FFmpeg error:', err);
                if (!res.headersSent) res.status(500).end('Audio processing error');
            })
            .pipe(outputStream);

        outputStream.pipe(res);
    } catch (err) {
        console.error('General error:', err);
        res.status(500).send('Internal server error');
    }
}
