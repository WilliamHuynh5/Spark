import app from './app';
import { PORT, HOST } from './config.json';

app.listen(PORT, HOST, () =>
  console.log(`Server is listening on port ${PORT}`),
);
// We do this because supertest cringe
// Not setting the app to listen in ./app.ts means super-test will pick a free port to talk to the app.
