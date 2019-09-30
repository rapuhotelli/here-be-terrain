import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { baseButtonStyles } from './styled_components/Button';

const NavBar = styled.div`
  text-align: center;
  padding: 4px 0;
  border-bottom: 1px solid #ddd;
`;

const NavButton = styled(Link)`
  margin: 0 2px;
  display: inline-block;
  ${baseButtonStyles}
`;

export default function Navigation() {
  return (
    <NavBar>
      <NavButton to='/'>Encounters</NavButton>
      <NavButton to='/initiative'>Initiative</NavButton>
    </NavBar>
  );
}