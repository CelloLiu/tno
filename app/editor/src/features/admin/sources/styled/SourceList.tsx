import styled from 'styled-components';
import { FormPage } from 'tno-core';

export const SourceList = styled(FormPage)`
  .filter {
    display: flex;
    align-items: center;
    input {
      margin-top: 3.5%;
    }
    button {
      background-color: white;
    }
    background-color: #f5f5f5;
  }

  div.row {
    cursor: pointer;

    div.column {
      overflow: hidden;
    }
  }
`;
