import styled, { css } from 'styled-components';

export const Section = styled.div`
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  
  ${(props: { main?: boolean }) => props.main && css`
    text-transform: uppercase;
    font-size: 16px;
    text-align: center;
  `}
`;
