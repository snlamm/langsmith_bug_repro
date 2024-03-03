import 'dotenv/config';
import express from 'express';
import { getRouter as getExamplesRouter } from './services/exampleRest/router.js';
import { getRouter as getAiRouter } from './services/ai/router.js';

const app = express();
const port = 3002;

// use JSON to pass data around
app.use(express.json());

app.use('/examples', getExamplesRouter());
app.use('/ai', getAiRouter());

app.get('/ping', (req, res) => res.json('pong'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
