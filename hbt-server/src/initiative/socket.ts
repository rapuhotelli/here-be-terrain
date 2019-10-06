import SocketIo from 'socket.io';

import { InitiativeEvents } from '../../../hbt-common/socketIoEvents';

import { getPlayerGroups } from '../util';
import InitiativeTracker, { CreatureInitiative } from './InitiativeTracker';

export function setUpInitiativeSocket(socket: SocketIo.Socket) {
  let tracker: InitiativeTracker = new InitiativeTracker();
  socket.on(InitiativeEvents.INIT, () => {
    socket.emit(InitiativeEvents.UPDATE, tracker);
  });

  socket.on(InitiativeEvents.ADD_CREATURE, (creatureInitiative: CreatureInitiative) => {
    tracker.setCreatureInitiative(creatureInitiative);
    socket.emit(InitiativeEvents.UPDATE, tracker);
  });

  socket.on(InitiativeEvents.DELETE_CREATURE, (creatureInitiative: CreatureInitiative) => {
    tracker.removeCreature(creatureInitiative.creature);
    socket.emit(InitiativeEvents.UPDATE, tracker);
  });

  socket.on(InitiativeEvents.NEXT, () => {
    tracker.nextCreature();
    socket.emit(InitiativeEvents.UPDATE, tracker);
  });

  socket.on(InitiativeEvents.PREVIOUS, () => {
    tracker.prevCreature();
    socket.emit(InitiativeEvents.UPDATE, tracker);
  });

  socket.on(InitiativeEvents.SET_POSITION, (newPosition: number) => {
    tracker.setPosition(newPosition);
    socket.emit(InitiativeEvents.UPDATE, tracker);
  });

  socket.on(InitiativeEvents.RESET, () => {
    tracker.reset();
    socket.emit(InitiativeEvents.UPDATE, tracker);
  });

  socket.on(InitiativeEvents.GROUPS_GET, async () => {
    socket.emit(InitiativeEvents.GROUPS_SEND, await getPlayerGroups());
  });
}