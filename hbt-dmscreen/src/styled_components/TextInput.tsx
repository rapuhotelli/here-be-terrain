import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';

export const InputContainer = styled.label`
  display: flex;
  font-weight: 500;
`;
export const LabelText = styled.div`
  min-width: 10em;
  flex-shrink: 0;
`;
const Input = styled.input`
  flex: 1;
  padding: 8px 4px;

  ${(props: { withMargin?: boolean }) => props.withMargin && css`
    margin-bottom: 6px;
  `}
`;

export class TextInput extends PureComponent<{ [x: string]: any }> {
  render() {
    return (
      <InputContainer>
        <Input type='text' {...this.props} />
      </InputContainer>
    );
  }
}

export class LabeledTextInput extends PureComponent<{ labelText: string, [x: string]: any }> {
  render() {
    const { labelText, ...inputProps } = this.props;
    return (
      <InputContainer>
        <LabelText>{labelText}</LabelText>
        <Input type='text' {...inputProps} />
      </InputContainer>
    );
  }
}
