import React, { Component } from 'react';
import { CreatureInitiative } from '../../../hbt-server/src/initiative/InitiativeTracker';
import { Form, FormTitle, SubmitButton } from '../styled_components/Form';
import { TextInput } from '../styled_components/TextInput';

interface Props {
  onSubmit: (creatureInitiative: CreatureInitiative) => void;
}
interface State {
  creature: string;
  initiative: string;
}

export default class AddCreatureInitiative extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      creature: '',
      initiative: '',
    };

    this.handleCreatureChange = this.handleCreatureChange.bind(this);
    this.handleInitiativeChange = this.handleInitiativeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCreatureChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ creature: event.target.value });
  }

  handleInitiativeChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ initiative: event.target.value });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { creature, initiative } = this.state;

    this.props.onSubmit({
      creature,
      initiative: parseInt(initiative, 10),
    });
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormTitle>Add creature to initiative</FormTitle>
        <TextInput withMargin placeholder='Name' value={this.state.creature} onChange={this.handleCreatureChange} />
        <TextInput withMargin placeholder='Initiative' pattern='[0-9]+' value={this.state.initiative} onChange={this.handleInitiativeChange} />
        <SubmitButton type='submit'>Add</SubmitButton>
      </Form>
    );
  }
}