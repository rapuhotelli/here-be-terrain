import styled from 'styled-components';

export const baseButtonStyles = `
  cursor: pointer;
  border: 1px solid darkgray;
  background-color: lightgray;
  border-radius: 2px;
  padding: 2px 12px;
  text-decoration: none;
  color: black;

  &:hover,
  &:active,
  &:focus {
    border-color: gray;
    background-color: darkgray;
    text-decoration: none;
    color: black;
  }
`;

export const Button = styled.button`
${baseButtonStyles}
`;
