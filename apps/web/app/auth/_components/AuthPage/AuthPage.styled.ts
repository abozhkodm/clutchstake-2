import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
`;

export const Root = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0f;
  position: relative;
  overflow: hidden;
`;

export const Background = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255, 80, 30, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(100, 60, 200, 0.08) 0%, transparent 50%);
  pointer-events: none;
`;

export const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
`;

export const Card = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 48px 40px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  backdrop-filter: blur(24px);
  animation: ${fadeIn} 0.5s ease forwards;

  @media (max-width: 480px) {
    margin: 16px;
    padding: 36px 24px;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
  justify-content: center;
`;

export const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff501e 0%, #ff8c42 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1px;
  flex-shrink: 0;
`;

export const LogoText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;

  span {
    color: #ff501e;
  }
`;

export const Heading = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
`;

export const Subheading = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  margin: 0 0 40px;
  line-height: 1.5;
`;

export const SteamButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 14px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1b2838 0%, #2a475e 100%);
  border: 1px solid rgba(102, 192, 244, 0.25);
  color: #c7d5e0;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 192, 244, 0.18);
    border-color: rgba(102, 192, 244, 0.5);
    color: #ffffff;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SteamIcon = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    fill: #66c0f4;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.07);
  }

  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.25);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

export const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
`;

export const FeatureDot = styled.div<{ color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ color }) => color};
  flex-shrink: 0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const Footer = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.2);
  text-align: center;
  margin: 28px 0 0;
  line-height: 1.5;
`;
