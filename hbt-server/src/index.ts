
import express from 'express';
import http from 'http';
import path from 'path';
import { EncounterEvents } from '../../hbt-common/socketIoEvents';
import { ScreenSockets, setUpSockets } from './sockets';
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

app.get('/levelselect/:campaign/:encounter', (req, res) => {
  if (req.params.campaign && req.params.encounter) {
    ScreenSockets.emit(EncounterEvents.LOAD, `modules/${req.params.campaign}/encounters/${req.params.encounter}`);
    res.send({ok: true});
  } else {
    res.send({ok: false});
  }
});
/*
app.get('/levelselect/:campaign?', async (req , res) => {
  if (!req.params.campaign) {
    await getAllEncounters().then(stuff => {
      res.send(stuff);
    }).catch(() => {
      res.send('error');
    });
  }
});
*/
app.use(express.static('public'));


app.get('/e/:path', (req, res) => {
  if (req.params.path) {
    ScreenSockets.emit(EncounterEvents.LOAD, req.params.path);
  }
  res.send({});
});

app.get('/reload', (req, res) => {
  ScreenSockets.emit('reload');
  res.send('reload');
});

app.get('/ip', (req, res) => {
  const ip = getIp();
  res.send({ip});
});

server.listen(port, () => {
  console.log( `server started at http://${ip}:${ port }` );
});

