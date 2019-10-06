export const InitiativeEvents = {
  INIT: 'initiative:init',
  UPDATE: 'initiative:update',
  RESET: 'initiative:reset',
  ADD_CREATURE: 'initiative:add_creature',
  DELETE_CREATURE: 'initiative:delete_creature',
  NEXT: 'initiative:next',
  PREVIOUS: 'initiative:previous',
  SET_POSITION: 'initiative:set_position',
  GROUPS_GET: 'initiative:groups:get',
  GROUPS_SEND: 'initiative:groups:send',
};

export const EncounterEvents = {
  LIST_LOAD: 'encounter:list:load',
  LIST_UPDATE: 'encounter:list:update',
  DATA_GET: 'encounter:data:get',
  DATA_SEND: 'encounter:data:send',
  LAYER_UPDATE: 'encounter:layer:update',
  LAYER_REMOVE: 'encounter:layer:remove',
  LOAD: 'encounter:load',
  SHOW: 'encounter:show',
  READY: 'encounter:ready',
};

export const ScreenEvents = {
  RELOAD: 'screen:reload',
  STARTED: 'screen:started',
};
