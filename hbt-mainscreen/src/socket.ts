import * as SocketIo from 'socket.io-client';

const socket = SocketIo.connect('/screen');

socket.on('welcome', (data: string) => {
  console.log(data);
});

socket.on('reload', () => {
  window.location.href = `/`;
  // window.location.reload();
});

export default socket;
