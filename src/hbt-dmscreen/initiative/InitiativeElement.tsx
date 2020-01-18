import React from 'react';
import styled from 'styled-components';

import { CreatureInitiative } from '../../../hbt-server/src/initiative/InitiativeTracker';

import { ListElement } from '../styled_components/ListElement';

const DeleteButton = styled.button`
  font-size: 20px;
  line-height: 1em;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50px;

  cursor: pointer;
  background: transparent;
  border: none;
`;

const EditButton = styled(DeleteButton)`
  left: 0;
  right: auto;
`;

interface Props {
  initiative: CreatureInitiative;
  onDelete: (initiative: CreatureInitiative) => void;
  onEdit: (initiative: CreatureInitiative) => void;
  main?: boolean;
}
export default function InitiativeElement(props: Props) {
  if (!props.initiative) {
    return (<ListElement main>No creatures in the initiative.</ListElement>);
  }
  const { initiative, onDelete, onEdit, main } = props;
  return (
    <ListElement main={main}>
      <DeleteButton onClick={(e) => {
        e.stopPropagation();
        onDelete(initiative);
      }}>&#x2716;</DeleteButton>
      <EditButton onClick={(e) => {
        e.stopPropagation();
        onEdit(initiative);
      }}>&#10000;</EditButton>
      {initiative.creature} ( {initiative.initiative} )
    </ListElement>
  );
}
