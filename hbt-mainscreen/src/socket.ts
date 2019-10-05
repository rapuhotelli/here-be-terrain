import * as SocketIo from 'socket.io-client';
import { ScreenEvents } from '../../hbt-common/socketIoEvents';

const socket = SocketIo.connect('/screen');

socket.on('welcome', () => {
  socket.emit(ScreenEvents.STARTED);
});

socket.on(ScreenEvents.RELOAD, () => {
  window.location.href = `/`;
});

export default socket;
