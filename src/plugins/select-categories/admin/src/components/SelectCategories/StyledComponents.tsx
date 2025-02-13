import styled from 'styled-components';
import { Button } from '@strapi/design-system';
import { Accordion } from '@strapi/design-system';
import { IconButton } from '@strapi/design-system';

export const AddParentButton = styled(Button)`
  border-radius: 100%;
  padding: 0;
  width: 3rem;
  height: 3rem;
  position: relative;
  z-index: 10;

  & > span {
    width: 1.6rem;
    height: 1.6rem;
  }

  &:hover {
    background-color: #2b28c5;
    border-color: #2b28c5;
  }
`;

export const AddParentButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  margin-left: 0.5rem;
`;

export const AccordionRoot = styled(Accordion.Root)<{ isNestedFirst: boolean; index: number }>`
  border: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: transparent;
  position: relative;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    width: 0.5rem;
    height: 100%;
    background-color: rgba(72, 69, 255, 0.66);
    // bottom: -1rem;
    bottom: ${({ isNestedFirst }) => (isNestedFirst ? 0 : '-1.5rem')};
    left: ${({ isNestedFirst, index }) => (isNestedFirst ? '2.24rem' : `${42 + index}px`)};
    z-index: -1;
  }
`;

export const DeleteButton = styled(IconButton)`
  border: none;
`;

export const AccordionItem = styled(Accordion.Item)`
  box-shadow: none !important;

  & > h2,
  h3,
  h4,
  h5,
  h6 {
    padding-left: 1.6rem;
  }

  &:hover {
    box-shadow: none !important;

    & > h2,
    h3,
    h4,
    h5,
    h6 {
      background-color: #fff !important;
    }
  }
`;
