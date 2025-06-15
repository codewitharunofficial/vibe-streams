import stream from './api/stream.js';
import express from 'express';
import cors from 'cors';


const app = express();
const  PORT = 3000;

app.get('/api/stream', stream);


app.listen(PORT, () => {
    console.log(`Server Is Running At: https://localhost:${PORT}`);
})


