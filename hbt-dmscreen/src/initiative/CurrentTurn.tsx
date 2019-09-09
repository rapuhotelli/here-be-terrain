import React from 'react';
import { CreatureInitiative } from '../../../hbt-server/src/initiative/InitiativeTracker';
import InitiativeElement from './InitiativeElement';


interface Props {
  initiative: CreatureInitiative;
  onDelete: (initiative: CreatureInitiative) => void;
}
export default function CurrentTurn(props: Props) {
  return (
    <InitiativeElement main initiative={props.initiative} onDelete={props.onDelete} />
  );
}
