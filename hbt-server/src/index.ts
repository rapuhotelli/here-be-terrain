
import express from 'express';
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