import SocketIo from 'socket.io-client';

const socket = SocketIo.connect('/dm');

export default socket;
