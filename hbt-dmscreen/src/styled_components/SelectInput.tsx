import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';
import { InputContainer, LabelText } from './TextInput';


const SelectElement = styled.select`
  flex: 1;
  padding: 8px 4px;

  ${(props: { withMargin?: boolean }) => props.withMargin && css`
    margin-bottom: 6px;
  `}
`;

const InlineLabelText = styled(LabelText)`
  text-align: right;
  align-self: center;
  padding-right: 8px;
`;

export class Select extends PureComponent<{ [x: string]: any }> {
  render() {
    const { children, ...selectProps } = this.props;
    return (
      <InputContainer>
        <SelectElement {...selectProps}>
          {children}
        </SelectElement>
      </InputContainer>
    );
  }
}

export class LabeledSelect extends PureComponent<{ labelText: string, [x: string]: any }> {
  render() {
    const { labelText, children, ...selectProps } = this.props;
    return (
      <InputContainer>
        <InlineLabelText>{labelText}</InlineLabelText>
        <Select {...selectProps}>
          {children}
        </Select>
      </InputContainer>
    );
  }
}
