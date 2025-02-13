import { Checkbox } from '@strapi/design-system';
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Menu = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: white;
  border: 0.1rem solid #ccc;
  border-radius: 0.4rem;
  max-height: 30rem;
  overflow-y: auto;
  z-index: 1000;
  padding: 0.8rem 0;
`;

export const Option = styled.div`
  padding: 0.4rem 0.8rem;
`;

export const OptionInner = styled.div<{ checked: boolean }>`
  padding: 0rem 1rem;
  border-radius: 0.4rem;
  background-color: ${({ checked }) => (checked ? 'rgba(72, 69, 255, 0.24)' : 'transparent')};

  &:hover {
    background-color: rgba(72, 69, 255, 0.24);
  }

  & > div > label {
    min-width: 100%;
    padding: 0.8rem 0;
  }
`;
