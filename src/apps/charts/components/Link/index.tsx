import { Link as RebassLink } from "rebass";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import { lighten, darken } from "polished";
import { FC, ReactNode } from "react";

type WrappedLinkProps = {
  external: boolean;
  children: ReactNode;
} & Record<string, any>;

const WrappedLink: FC<WrappedLinkProps> = (props) => {
  const { external, children, ...rest } = props;
  return (
    <RebassLink
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {children}
    </RebassLink>
  );
};

const Link = styled(WrappedLink)`
  color: ${({ color, theme }) => (color ? color : theme.white)};
`;

export default Link;

export const CustomLink = styled(RouterLink)`
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: ${({ color, theme }) => (color ? color : theme.link)};

  &:visited {
    color: ${({ color, theme }) =>
      color ? lighten(0.1, color) : lighten(0.1, theme.link)};
  }

  &:hover {
    cursor: pointer;
    text-decoration: none;
    color: ${({ color, theme }) =>
      color ? darken(0.1, color) : darken(0.1, theme.link)};
  }
`;

export const BasicLink = styled(RouterLink)`
  text-decoration: none;
  color: inherit;
  &:hover {
    cursor: pointer;
    text-decoration: none;
  }
`;
