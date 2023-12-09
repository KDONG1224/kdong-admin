import styled from 'styled-components';

export const StyledPageLoader = styled.div`
  width: 100%;
  height: calc(100vh);
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(36, 41, 47, 0.4);
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 1000000;
`;
