import styled from '@emotion/styled';

export const Root = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 24px;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108, 71, 255, 0.15) 0%, transparent 70%),
    #0d0d1a;
  text-align: center;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a78bfa;
  background: rgba(108, 71, 255, 0.12);
  border: 1px solid rgba(108, 71, 255, 0.3);
  border-radius: 100px;
  padding: 5px 14px;
  margin-bottom: 28px;
`;

export const Title = styled.h1`
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: #f0f0ff;
  margin-bottom: 20px;

  span {
    background: linear-gradient(135deg, #a78bfa 0%, #6c47ff 50%, #4f9fff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const Subtitle = styled.p`
  font-size: clamp(16px, 2.5vw, 20px);
  color: #7a7a9a;
  max-width: 520px;
  line-height: 1.6;
  margin-bottom: 48px;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 80px;
`;

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const StatValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #f0f0ff;
  letter-spacing: -0.02em;
`;

export const StatLabel = styled.span`
  font-size: 13px;
  color: #5a5a7a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const StatDivider = styled.div`
  width: 1px;
  height: 36px;
  background: #2a2a40;

  @media (max-width: 480px) {
    display: none;
  }
`;
