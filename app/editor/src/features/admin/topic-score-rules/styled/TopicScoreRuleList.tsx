import styled from 'styled-components';

export const TopicScoreRuleList = styled.div`
  width: auto;
  min-height: 100%;
  display: flex;
  justify-content: center;

  .form-page {
    max-width: none;
    width: 95vw;
  }

  .filter-bar {
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

  .row-header {
    font-weight: bold;
    padding: 0.25em 0.5em 0.25em 0.5em;
    border-top: solid 2px black;
    border-bottom: solid 2px black;

    .f2 {
      flex: 2 2 0;
    }
    .f3 {
      flex: 3 2 0;
    }
    & > div {
      flex: 1 1 0;
    }
  }

  .row {
    padding: 0.5em 0.5em 0 0.5em;

    .f2 {
      flex: 2 2 0;
    }
    .f3 {
      flex: 3 2 0;
    }
    & > div {
      flex: 1 1 0;
    }

    &:nth-child(4n) {
      background-color: #f5f5f5;
    }

    textarea {
      height: 39.6px;
    }

    &.adding {
      background-color: ${(props) => props.theme.css.primaryLightColor};
      border-radius: 0.5em;
    }

    .actions {
      flex-wrap: nowrap;
    }

    button.move {
      height: 40%;

      padding: 0;
      margin-right: 0.5em;

      svg {
        height: 100%;
      }
    }
  }

  .add-row {
    background-color: ${(props) => props.theme.css.borderColor};
    height: 5px;
    align-content: center;
    justify-content: center;
    z-index: 2;

    &:hover {
      background-color: ${(props) => props.theme.css.lightVariantColor};
      cursor: pointer;

      svg {
        background-color: white;
        color: ${(props) => props.theme.css.activeColor};
        border-radius: 1em;
      }
    }
  }

  .form-footer {
    // It overlaps the bottom row and it's impossible to scroll further.
    /* position: fixed; */
    bottom: 0;
    width: 100%;
    background-color: ${(props) => props.theme.css.backgroundColor};
    z-index: 2;
  }
`;
