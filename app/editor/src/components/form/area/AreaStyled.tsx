import styled from 'styled-components';

export const Area = styled.div`
  background-color: white;
  height: fit-content;
  padding: 3%;
  width: fit-content;
  .space-right {
    margin-right: 25px;
  }
  .label {
    font-weight: 700;
  }
  .lrg {
    width: 680px;
    height: 40px;
  }
  .md {
    width: 320px;
    height: 40px;
  }

  .md-lrg {
    width: 400px;
    height: 40px;
    margin-right: 40px;
  }

  .sm {
    height: 40px;
    width: 140px;
  }

  .chk {
    padding-bottom: 5%;
    margin-right: 2%;
    .label {
      width: 110px;
    }
  }
`;
