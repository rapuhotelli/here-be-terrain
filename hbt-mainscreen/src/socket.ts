import * as SocketIo from 'socket.io-client';
import { EncounterEvents } from '../../hbt-common/socketIoEvents';

const socket = SocketIo.connect('/screen');

socket.on('welcome', (data: string) => {
  console.log(data);
});

socket.on(EncounterEvents.RELOAD, () => {
  window.location.href = `/`;
});

export default socket;
