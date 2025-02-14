import { TextInput } from '@strapi/design-system';
import styled from 'styled-components';

export const InputWrapper = styled.div`
  padding: 0.8rem 0 0 2rem;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: #fff;
`;

export const Input = styled(TextInput)``;

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
  max-height: 40rem;
  overflow-y: auto;
  padding-right: 2rem;
  z-index: 1000;
`;

export const Option = styled.div<{ isFirst: boolean }>`
  padding: 0.4rem 0 0 ${({ isFirst }) => (isFirst ? '2' : '3')}rem;
`;

export const OptionInner = styled.div<{ checked: boolean; selectable: boolean }>`
  padding: 0rem 1rem;
  border-radius: 0.4rem;
  background-color: ${({ checked, selectable }) =>
    checked && selectable ? 'rgba(72, 69, 255, 0.24)' : 'transparent'};
  border: ${({ selectable }) => (!selectable ? '1px solid #dcdce4' : 'none')};

  &:hover {
    background-color: ${({ selectable }) =>
      selectable ? 'rgba(72, 69, 255, 0.24)' : 'rgba(220, 220, 228, 0.4)'};
  }

  & > div > label {
    min-width: 100%;
    padding: 0.8rem 0;
  }
`;

export const Select = styled.div`
  width: 100%;
  font-size: 1.4rem;
  border: 1px solid #dcdce4;
  border-radius: 0.4rem;
  padding: 0.8rem 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SelectedCategoriesMenu = styled.div`
  width: 100%;
  background: white;
  border: 0.1rem solid #ccc;
  border-radius: 0.4rem;
  max-height: 40rem;
  overflow-y: auto;
  padding: 0.8rem 2rem 0.8rem 0;
  margin-top: 1rem;
`;

export const SelectedCategory = styled.div`
  padding: 0.8rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.4rem;
`;

export const Chevron = styled.div<{ isOpen: boolean }>`
  transition: all 300ms ease;
  transform: rotate(${({ isOpen }) => (isOpen ? '180' : '0')}deg);
`;
