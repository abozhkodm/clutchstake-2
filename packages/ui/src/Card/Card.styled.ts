import styled from '@emotion/styled';

export const Root = styled.div<{ accent?: string }>`
  background: #16162a;
  border: 1.5px solid ${({ accent }) => accent ?? '#2e2e45'};
  border-radius: 12px;
  padding: 20px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: ${({ accent }) => accent ?? '#6c47ff'};
    box-shadow: 0 0 0 1px ${({ accent }) => accent ?? '#6c47ff'}33;
  }
`;

export const Title = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #e8e8f0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::after {
    content: '→';
    font-size: 13px;
    color: #6c47ff;
    transition: transform 0.15s ease;
  }

  ${Root}:hover &::after {
    transform: translateX(3px);
  }
`;

export const Body = styled.p`
  font-size: 13px;
  color: #7a7a9a;
  line-height: 1.5;
`;
