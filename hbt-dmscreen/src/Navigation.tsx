import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { baseButtonStyles, Button } from './styled_components/Button';

const NavContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px 8px 2px;
  text-align: right;
  background: white;
  border-bottom: 1px solid #ddd;
  border-left: 1px solid #ddd;
  z-index: 10;
`;

const MenuButton = styled(Button)`
  margin-bottom: 6px;
`;

const NavBar = styled.div`
  display: none;  
  text-align: center;

  ${(props: { show?: boolean }) => props.show && css`
    display: block;
  `}
`;

const NavButton = styled(Link)`
  margin-bottom: 6px;
  display: block;
  ${baseButtonStyles}
`;

export default function Navigation() {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <NavContainer>
      <MenuButton onClick={() => setOpenMenu(!openMenu)}>Nav</MenuButton>
      <NavBar show={openMenu}>
        <NavButton onClick={() => setOpenMenu(!openMenu)} to='/'>Encounters</NavButton>
        <NavButton onClick={() => setOpenMenu(!openMenu)} to='/initiative'>Initiative</NavButton>
      </NavBar>
    </NavContainer>
  );
}