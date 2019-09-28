import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '../styled_components/Button';
import { Form } from '../styled_components/Form';
import { Section, SectionTitle } from '../styled_components/Section';
import { TextInput } from '../styled_components/TextInput';

const FlexContainer = styled.div`
  display: flex;
`;
const FlexForm = styled(Form)`
  flex: 1;
  margin: 0;
  padding: 0 8px;
`;
const FlexButton = styled(Button)`
  flex-shrink: 0;
`;

interface Props {
  position: number;
  onSubmit: (newPosition: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}
interface State {
  position: string;
}

export default class InitiativePosition extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      position: `${this.props.position}`,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ position: event.target.value });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.onSubmit(parseInt(this.state.position, 10));
  }

  updateValue(position: number) {
    this.setState({ position: `${position}` });
  }

  render() {
    return (
      <Section>
        <SectionTitle>Current turn initiative:</SectionTitle>
        <FlexContainer>
          <FlexButton onClick={this.props.onPrevious}>&lt; Prev turn</FlexButton>
          <FlexForm onSubmit={this.handleSubmit}>
            <TextInput placeholder='Position' pattern='[0-9]+' value={this.state.position} onChange={this.handleChange} />
          </FlexForm>
          <FlexButton onClick={this.props.onNext}>Next turn &gt;</FlexButton>
        </FlexContainer>
      </Section>
    );
  }
}