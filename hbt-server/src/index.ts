
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import socketIo from 'socket.io';
import { getAllEncounterPaths, getEncounterKeys } from './util';

const app = express();
const server = new http.Server(app);
const io = socketIo(server);
const port = 8081;

const pubdir = (uri: string): string => (path.join(__dirname, '..', 'public', uri));

app.get( '/', ( req: Express.Request, res ) => {
  res.sendFile(pubdir('index.html'));
});


app.get('/levelselect/:campaign?', (req , res) => {

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


  // res.send('');
});

app.use(express.static('public'));

io.of('dm')
  .on('connection', function (socket) {
    console.log(`DM socket ${socket.id} connected.`);

    socket.emit('welcome', 'hello dm!');
  });

let mainScreenSocket: any;
io.of('screen')
  .on('connection', function (socket) {
    console.log(`Mainscreen socket ${socket.id} connected.`);
    mainScreenSocket = socket;
    socket.emit('welcome', 'hello mainscreen!');
  });


app.get( '/e/:path', ( req: Express.Request, res ) => {
  mainScreenSocket.emit('load-encounter', path);
  res.send({});
});

server.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});