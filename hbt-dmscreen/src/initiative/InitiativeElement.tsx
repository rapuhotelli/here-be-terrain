import React from 'react';
import styled from 'styled-components';

import { CreatureInitiative } from '../../../hbt-server/src/initiative/InitiativeTracker';

import { ListElement } from '../styled_components/ListElement';

const DeleteButton = styled.button`
  font-size: 16px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50px;

  cursor: pointer;
  background: transparent;
  border: none;
`;

interface Props {
  initiative: CreatureInitiative;
  onDelete: (initiative: CreatureInitiative) => void;
  main?: boolean;
}
export default function InitiativeElement(props: Props) {
  if (!props.initiative) {
    return (<ListElement main>No creatures in the initiative.</ListElement>);
  }
  const { initiative, onDelete, main } = props;
  return (
    <ListElement main={main}>
      <DeleteButton onClick={() => onDelete(initiative)}>&#x2716;</DeleteButton>
      {initiative.creature} ( {initiative.initiative} )
    </ListElement>
  );
}
