import { Button } from '@strapi/design-system';
import styled from 'styled-components';

export const Page = styled.main`
  padding: 2.5rem;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
`;

export const SaveButton = styled(Button)`
  & > span {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
`;

export const Box = styled.div`
  padding: 2.5rem;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 0.3rem;
`;

export const TextFieldsBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin-bottom: 2rem;
`;
