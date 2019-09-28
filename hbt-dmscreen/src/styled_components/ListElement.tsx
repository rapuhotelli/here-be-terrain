import styled, { css } from 'styled-components';

export const ListElement = styled.div`
  position: relative;
  margin-top: -1px;
  border-top: 1px solid darkgrey;
  border-bottom: 1px solid darkgrey;
  padding: 8px 12px;
  text-align: center;

  ${(props: { main?: boolean }) => props.main && css`
    font-weight: 500;
    border-width: 2px;
    padding: 16px 12px;
    background: rgba(173, 230, 197, 0.6);
  `}
`;