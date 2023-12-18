import { FC } from "react";
import styled, { css, keyframes } from "styled-components";

const pulse = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Wrapper = styled.div<{ fill?: string; height?: boolean }>`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  ${(props) =>
    props.fill && !props.height
      ? css`
          height: 100vh;
        `
      : css`
          height: 180px;
        `}
`;

const AnimatedImg = styled.div`
  animation: ${pulse} 800ms linear infinite;
  & > * {
    width: 160px;
  }
`;

import imgSrc from "../../assets/Fathom-app-logo.svg";

type LocalLoader = {
  fill?: string;
};

const LocalLoader: FC<LocalLoader> = ({ fill }) => {
  return (
    <Wrapper fill={fill}>
      <AnimatedImg>
        <img src={imgSrc} alt="loading-icon" />
      </AnimatedImg>
    </Wrapper>
  );
};

export default LocalLoader;