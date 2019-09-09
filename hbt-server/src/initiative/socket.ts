import SocketIo from 'socket.io';

import InitiativeTracker, { CreatureInitiative } from './InitiativeTracker';

export const InitiativeEvents = {
  INIT: 'initiative:init',
  UPDATE: 'initiative:update',
  ADD_CREATURE: 'initiative:add_creature',
  DELETE_CREATURE: 'initiative:delete_creature',
  NEXT: 'initiative:next',
  PREVIOUS: 'initiative:previous',
  SET_POSITION: 'initiative:set_position',
};

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
}