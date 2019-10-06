import React from 'react';
import { CreatureInitiative } from '../../../hbt-server/src/initiative/InitiativeTracker';
import InitiativeElement from './InitiativeElement';

interface Props {
  initiatives: CreatureInitiative[];
  currentCreature: CreatureInitiative;
  onDelete: (initiative: CreatureInitiative) => void;
  onEdit: (initiative: CreatureInitiative) => void;
}
export default function InitiativesList({ initiatives, onDelete, onEdit, currentCreature }: Props) {
  return (<>
    { initiatives.map((i) => <InitiativeElement main={currentCreature === i} initiative={i} key={i.creature} onDelete={onDelete} onEdit={onEdit} />) }
  </>);
}
