import SocketIo from 'socket.io';

import { EncounterEvents } from '../../../hbt-common/socketIoEvents';

import { DMSockets, ScreenSockets } from '../sockets';
import { getAllEncounters, getEncounterData } from '../util';

function encounterPath(campaign: string, encounter: string) {
  return `modules/${campaign}/encounters/${encounter}`;
}

export function setUpDMEncounterSocket(socket: SocketIo.Socket) {
  socket.on(EncounterEvents.LIST_LOAD, async () => {
    const encounters = await getAllEncounters();
    socket.emit(EncounterEvents.LIST_UPDATE, encounters);
  });

  socket.on(EncounterEvents.LOAD, (campaign: string, encounter: string) => {
    ScreenSockets.emit(EncounterEvents.LOAD, encounterPath(campaign, encounter));
  });

  socket.on(EncounterEvents.SHOW, (campaign: string, encounter: string) => {
    ScreenSockets.emit(EncounterEvents.SHOW, encounterPath(campaign, encounter));
  });

  socket.on(EncounterEvents.DATA_GET, async (campaign: string, encounter: string) => {
    const encounterData = await getEncounterData(campaign, encounter);
    socket.emit(EncounterEvents.DATA_SEND, encounterData);
  });

  socket.on(EncounterEvents.LAYER_UPDATE, (campaign: string, encounter: string, layerId: string, pngDataUrl: string) => {
    ScreenSockets.emit(EncounterEvents.LAYER_UPDATE, encounterPath(campaign, encounter), layerId, pngDataUrl);
  });

  socket.on(EncounterEvents.RELOAD, () => {
    ScreenSockets.emit(EncounterEvents.RELOAD);
  });
}

export function setUpScreenEncounterSocket(socket: SocketIo.Socket) {
  socket.on(EncounterEvents.READY, () => {
    DMSockets.emit(EncounterEvents.READY);
  });
}
