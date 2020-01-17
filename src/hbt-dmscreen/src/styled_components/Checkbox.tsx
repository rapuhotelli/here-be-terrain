import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';
import { InputContainer, LabelText } from './TextInput';

const Input = styled.input`
  margin-right: 8px;
  ${(props: { withMargin?: boolean }) => props.withMargin && css`
    margin-bottom: 6px;
  `}
`;

const CheckboxContainer = styled(InputContainer)`
  padding: 8px 4px;
  text-align: center;

  cursor: pointer;
`;

const CheckboxLabel = styled(LabelText)`
  line-height: 1.4em;
`;


export class CheckboxInput extends PureComponent<{ labelText: string, [x: string]: any }> {
  render() {
    const { labelText, ...inputProps } = this.props;
    return (
      <CheckboxContainer>
        <Input type='checkbox' {...inputProps} />
        <CheckboxLabel>{labelText}</CheckboxLabel>
      </CheckboxContainer>
    );
  }
}
