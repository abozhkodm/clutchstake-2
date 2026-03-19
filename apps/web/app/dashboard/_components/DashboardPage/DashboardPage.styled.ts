import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Root = styled.div`
  min-height: 100vh;
  background: #0a0a0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 50% at 50% -5%, rgba(255, 80, 30, 0.1) 0%, transparent 60%);
    pointer-events: none;
  }
`;

export const Card = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  backdrop-filter: blur(24px);
  animation: ${fadeIn} 0.4s ease forwards;
  text-align: center;
`;

export const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
`;

export const Avatar = styled.img`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 3px solid rgba(255, 80, 30, 0.5);
  display: block;
  object-fit: cover;
`;

export const OnlineDot = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid #0a0a0f;
`;

export const Username = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px;
  letter-spacing: -0.3px;
`;

export const SteamId = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  margin: 0 0 28px;
  font-family: var(--font-geist-mono);
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 28px;
`;

export const StatCard = styled.div`
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #ff501e;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 10px;
`;

export const PrimaryButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff501e 0%, #ff8c42 100%);
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled.button`
  padding: 12px 20px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
    color: rgba(255, 255, 255, 0.8);
  }
`;
