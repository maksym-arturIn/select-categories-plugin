import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Menu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 0.1rem solid #ccc;
  borderRadius: 0.4rem;
  maxHeight: 20rem;,
  overflow-y: auto,
  z-index: 1000,
  padding: 0.8rem 0;
`;

export const Option = styled.div`
  padding: 0.8rem;
`;
