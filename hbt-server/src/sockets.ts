import http from 'http';
import SocketIo from 'socket.io';
import { setUpDMEncounterSocket } from './encounter/socket';
import { setUpInitiativeSocket } from './initiative/socket';

export const SocketNamespace = {
  DM: 'dm',
  MAINSCREEN: 'screen',
};

export let DMSockets: SocketIo.Namespace;
export let ScreenSockets: SocketIo.Namespace;

export function setUpSockets(server: http.Server) {
  const SocketIoServer = SocketIo(server);
  
  DMSockets = SocketIoServer.of(SocketNamespace.DM);
  DMSockets.on('connection', function (socket) {
    console.log(`DM socket ${socket.id} connected.`);
    socket.emit('welcome', 'hello dm!');

    setUpInitiativeSocket(socket);
    setUpDMEncounterSocket(socket);
  });

  ScreenSockets = SocketIoServer.of(SocketNamespace.MAINSCREEN);
  ScreenSockets.on('connection', function (socket) {
    console.log(`Mainscreen socket ${socket.id} connected.`);
    socket.emit('welcome', 'hello mainscreen!');
  });
}
