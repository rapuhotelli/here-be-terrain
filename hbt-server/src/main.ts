import express from 'express';
import http from 'http';
import path from 'path';
import { recFind } from './util';

const app = express();
const server = new http.Server(app);

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

app.use(express.static('public'));

app.get('/ip', (req, res) => {
  // const ip = getIp();
  res.send({ip});
});

app.get('/e', (req, res) => {
  const resources = recFind(pubdir('modules'), 'pack.json')
    .map(path => {
      const p = path.split('modules');
      return p[1] ? p[1] : null;
    }).filter(p => !!p);
  res.send(resources);
});

server.listen(port, () => {
  console.log(__dirname);
  console.log( `server started at http://${ip}:${ port }` );
});

