import React from 'react';
import { CreatureInitiative } from '../../../hbt-server/src/initiative/InitiativeTracker';
import InitiativeElement from './InitiativeElement';

interface Props {
  initiatives: CreatureInitiative[];
  onDelete: (initiative: CreatureInitiative) => void;
}
export default function InitiativesList({ initiatives, onDelete }: Props) {
  return (<>
    { initiatives.map((i) => <InitiativeElement initiative={i} key={i.creature} onDelete={onDelete} />) }
  </>);
}
