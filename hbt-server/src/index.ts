
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import socketIo from 'socket.io';
import { getAllEncounters } from './util';

const app = express();
const server = new http.Server(app);
const io = socketIo(server);
const port = 8081;

const pubdir = (uri: string): string => (path.join(__dirname, '..', 'public', uri));

app.get( '/', ( req: Express.Request, res ) => {
  console.log(process.env);
  if (process.env.NODE_ENV === 'prod') {
    res.sendFile(pubdir('index-prod.html'));
  } else {
    res.sendFile(pubdir('index.html'));
  }
});


app.get('/levelselect/:campaign/:encounter', (req, res) => {
  if (req.params.campaign && req.params.encounter) {
    mainScreenSocket.emit('load-encounter', `modules/${req.params.campaign}/encounters/${req.params.encounter}`);
    res.send('ok');
  }
  res.send({});
});

app.get('/levelselect/:campaign?', async (req , res) => {
  if (!req.params.campaign) {
    await getAllEncounters().then(stuff => {
      res.send(stuff);
    }).catch(() => {
      res.send('error');
    });
  }
  /*
  console.log(req.params);
  if (req.params.campaign) {
    getEncounterKeys(req.params.campaign, (data) => {
      res.send({
        data: data,
      });
    });
    return;
  }
  getAllEncounterPaths((paths: any) => {
    res.send(paths);
  });
  */
});



app.use(express.static('public'));

io.of('dm')
  .on('connection', function (socket) {
    console.log(`DM socket ${socket.id} connected.`);

    socket.emit('welcome', 'hello dm!');
  });

let mainScreenSocket: socketIo.Socket;
io.of('screen')
  .on('connection', function (socket) {
    console.log(`Mainscreen socket ${socket.id} connected.`);
    mainScreenSocket = socket;
    socket.emit('welcome', 'hello mainscreen!');
  });


app.get( '/e/:path', ( req, res ) => {
  if (req.params.path && mainScreenSocket) {
    mainScreenSocket.emit('load-encounter', req.params.path);
  }
  res.send({});
});

app.get('/reload', (req, res) => {
  mainScreenSocket.emit('reload');
  res.send('reload');
});

server.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});