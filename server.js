import stream from './api/stream.js';
import express from 'express';
import cors from 'cors';
import formats from './api/format.js';


const app = express();
const  PORT = 3000;

app.get('/api/stream', formats);


app.listen(PORT, () => {
    console.log(`Server Is Running At: https://localhost:${PORT}`);
})


