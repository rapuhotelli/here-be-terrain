import SocketIo from 'socket.io';

import { EncounterEvents } from '../../../hbt-common/socketIoEvents';

import { ScreenSockets } from '../sockets';
import { getAllEncounters } from '../util';

export function setUpDMEncounterSocket(socket: SocketIo.Socket) {
  socket.on(EncounterEvents.LOAD_LIST, async () => {
    const encounters = await getAllEncounters();
    socket.emit(EncounterEvents.UPDATE_LIST, encounters);
  });

  socket.on(EncounterEvents.LOAD, async (campaign: string, encounter: string) => {
    ScreenSockets.emit(EncounterEvents.LOAD, `modules/${campaign}/encounters/${encounter}`);
  });
}
