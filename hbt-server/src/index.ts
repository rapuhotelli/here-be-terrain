
import express from 'express';
import http from 'http';
import path from 'path';
import { setUpSockets } from './sockets';
import { getIp } from './util';

const app = express();
const server = new http.Server(app);
setUpSockets(server);
const port = 8081;

let ip = '0.0.0.0';

const pubdir = (uri: string): string => (path.join(__dirname, '..', '..', '..', 'public', uri));

app.get( '/', ( req: Express.Request, res ) => {
  if (process.env.NODE_ENV === 'prod') {
    res.sendFile(pubdir('index-prod.html'));
  } else {
    res.sendFile(pubdir('index.html'));
  }
});

app.get( '/dmscreen/', ( req: Express.Request, res ) => {
  res.sendFile(pubdir('dmscreen.html'));
});

app.use(express.static('public'));

app.get('/ip', (req, res) => {
  const ip = getIp();
  res.send({ip});
});

server.listen(port, () => {
  console.log( `server started at http://${ip}:${ port }` );
});

