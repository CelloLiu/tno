import styled from 'styled-components';
import { FormPage } from 'tno-core';

export const ContentListView = styled(FormPage)`
  min-height: fit-content;

  hr {
    width: 100%;
    height: 0.75em;
    border: none;
    background-color: #003366;
  }

  .content-list {
    border-radius: 4px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-flow: column;
    width: 100%;

    div[role='rowgroup'] {
      min-height: 100px;
      max-height: calc(100vh - 600px);
      overflow-y: overlay;
      overflow-x: hidden;
    }

    .headline {
      & > svg:first-child {
        margin-right: 0.5em;
      }
    }

    .table {
      background: transparent;

      .rows {
        min-height: 100px;
        max-height: calc(-380px + 100vh);
      }

      .column {
        overflow: hidden;
      }

      .row:hover {
        cursor: pointer;
      }
    }
  }

  .content-actions {
    button {
      display: block;
    }
  }

  .top-pane {
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
  }

  .bottom-pane {
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
  }

  .h-status {
    text-align: center;
    align-items: center;
    justify-content: center;
  }

  .h-publishedOn {
    text-align: center;
    align-items: center;
    justify-content: center;
  }

  .h-use {
    text-align: center;
    align-items: center;
    justify-content: center;
  }

  .ready {
    color: ${(props) => props.theme.css.cancelledColor};
  }

  .completed {
    color: ${(props) => props.theme.css.completedColor};
  }

  .failed {
    color: ${(props) => props.theme.css.dangerColor};
  }
`;
