import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { CreatureInitiative } from '../../../hbt-server/src/initiative/InitiativeTracker';

import { CheckboxInput } from '../styled_components/Checkbox';
import { Form, FormTitle, SubmitButton } from '../styled_components/Form';
import { Keypad, KeypadButton } from '../styled_components/Keypad';
import { TextInput } from '../styled_components/TextInput';

const Container = styled.div`
  position: absolute;
  top: 0;
  z-index: 2;

  min-height: 100%;

  background-color: white;

  ${(props: { hide?: boolean }) => props.hide && css`
    display: none;
  `}
`;

interface Props {
  show: boolean;
  addMore?: boolean;
  onSubmit: (creatureInitiative: CreatureInitiative, addMore: boolean) => void;
  onCancel: () => void;
}
interface State {
  creature: string;
  initiative: string;
  addMore: boolean;
}

export default class AddCreatureInitiative extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      creature: '',
      initiative: '',
      addMore: !!props.addMore,
    };

    this.handleCreatureChange = this.handleCreatureChange.bind(this);
    this.handleInitiativeChange = this.handleInitiativeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateValues = this.updateValues.bind(this);
  }

  handleCreatureChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ creature: event.target.value });
  }

  handleInitiativeChange(newInitiative: number) {
    this.setState({ initiative: `${newInitiative}` });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { creature, initiative, addMore } = this.state;

    this.props.onSubmit({
      creature,
      initiative: parseInt(initiative, 10),
    }, addMore);
  }

  updateValues({ creature, initiative }: CreatureInitiative, addMore: boolean) {
    this.setState({ creature, initiative: `${initiative}`, addMore });
  }

  render() {
    const initValues = [...Array(30).keys()].map(i => i + 1);
    const keyPadButtons = initValues.map(key => {
      return (
        <KeypadButton type='submit' key={key}
          active={key === +this.state.initiative}
          onClick={() => this.handleInitiativeChange(key)}>
          {key}
        </KeypadButton>
      );
    });
    return (
      <Container hide={!this.props.show}>
        <Form onSubmit={this.handleSubmit}>
          <FormTitle>Add creature to initiative</FormTitle>
          <TextInput withMargin placeholder='Name' value={this.state.creature} onChange={this.handleCreatureChange} required />
          <Keypad>
            {keyPadButtons}
          </Keypad>
          <CheckboxInput
            labelText='Add one more of the same'
            defaultChecked={this.state.addMore}
            onChange={() => this.setState({ addMore: !this.state.addMore })} />
          <SubmitButton type='reset' onClick={this.props.onCancel}>Skip</SubmitButton>
        </Form>
      </Container>
    );
  }
}