import styled from 'styled-components';

import { IFormPageProps } from '../FormPage';

export const FormPage = styled.div<IFormPageProps>`
  background-color: white;
  min-height: fit-content;
  ${(props) => (props.minWidth !== '' ? `min-width: ${props.minWidth ?? '1200px'}` : '')};
  ${(props) => (props.maxWidth !== '' ? `max-width: ${props.maxWidth ?? '1200px'}` : '')};
  :not(.no-padding) {
    padding: 0.5em 2em 0 2em;
  }
  margin: 0px auto;
  overflow: auto;
  overflow-x: hidden;

  div[role='rowgroup'] {
    min-height: 100px;
    max-height: calc(100vh - 400px);
    overflow-y: scroll;
    overflow-x: hidden;
  }

  p[role='alert'] {
    font-size: 0.85em;
    color: ${(props) => props.theme.css.dangerColor};
  }
`;
