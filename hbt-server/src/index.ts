
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import socketIo from 'socket.io';

const app = express();
const server = new http.Server(app);
const io = socketIo(server);
const port = 8081;

const pubdir = (uri: string): string => (path.join(__dirname, '..', 'public', uri));

app.get( '/', ( req: Express.Request, res ) => {
  res.sendFile(pubdir('index.html'));
});

app.get('/levelselect', (req: Express.Request, res) => {
  const directoryPath = path.join(__dirname, '..', 'public', 'encounters', 'testcampaign');
  let encounters = [];
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }


    encounters = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const encounterData = <string><unknown>fs.readFileSync(path.join(directoryPath, file));
        return JSON.parse(encounterData);
      });

    res.send({
      data: encounters,
    });
  });
});

app.use(express.static('public'));

io.of('dm')
  .on('connection', function (socket) {
    console.log(`DM socket ${socket.id} connected.`);

    socket.emit('welcome', 'hello dm!');
  });

io.of('screen')
  .on('connection', function (socket) {
    console.log(`Mainscreen socket ${socket.id} connected.`);

    socket.emit('welcome', 'hello mainscreen!');
  });

server.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});