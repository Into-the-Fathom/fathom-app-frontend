import React, { forwardRef, ReactNode } from "react";
import { NavLink, NavLinkProps, useLocation } from "react-router-dom";
import { ListItem } from "@mui/material";
import { styled } from "@mui/material/styles";

const ExternalLink = styled("a")`
  display: flex;
  align-items: center;
`;

export interface AppMenuItemComponentProps {
  className?: string;
  link?: string | null; // because the InferProps props allows null value
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  target?: string | null; // because the InferProps props allows null value
}

const AppMenuItemComponent: React.FC<AppMenuItemComponentProps> = (props) => {
  const { className, onClick, link, children } = props;
  const location = useLocation();

  // If link is not set return the orinary ListItem
  if (!link || typeof link !== "string") {
    return (
      <ListItem
        button
        className={className}
        children={children}
        onClick={onClick}
      />
    );
  }

  if (props.target) {
    return (
      <ExternalLink
        target={props.target}
        href={props.link as string}
        className={props.className}
      >
        {props.children}
      </ExternalLink>
    );
  }

  // Return a LitItem with a link component
  return (
    <ListItem
      button
      className={className}
      children={children}
      component={forwardRef((props: NavLinkProps) => {
        const className =
          // @ts-ignore
          !props.className.includes("active") &&
          location.pathname.includes("dao")
            ? `${props.className} active`
            : props.className;

        return <NavLink {...{ ...props, className }} />;
      })}
      to={link}
    />
  );
};

export default AppMenuItemComponent;
