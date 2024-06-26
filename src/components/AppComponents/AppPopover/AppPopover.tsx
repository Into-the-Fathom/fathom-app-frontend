import { cloneElement, FC, ReactElement, ReactNode, useState } from "react";
import { Popover, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";

const AppPopoverWrapper = styled(Popover)<{ type: PopoverType }>`
  .MuiPaper-root {
    background: ${({ type }) =>
      type === PopoverType.Error ? "#FF6767" : "rgba(255, 255, 255, 0.9)"};
    border-radius: 8px;
    padding: 8px 12px;
    color: #000c24;
    max-width: 400px;

    p {
      font-size: 13px;
      line-height: 16px;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    .MuiPaper-root {
      max-width: 350px;
      p {
        font-size: 12px;
        line-height: 15px;
      }
    }
  }
`;

export enum PopoverType {
  Info = "info",
  Error = "error",
}

type AppPopoverProps = {
  id: string;
  text: ReactNode;
  element?: ReactElement;
  type?: PopoverType;
  iconSize?: string;
};

const AppPopover: FC<AppPopoverProps> = ({
  id,
  text,
  element,
  type = PopoverType.Info,
  iconSize = "18px",
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {element ? (
        cloneElement(element, {
          onMouseEnter: handlePopoverOpen,
          onMouseLeave: handlePopoverClose,
          "aria-owns": open ? id : undefined,
          style: { cursor: "pointer" },
        })
      ) : (
        <span
          style={{ display: "inline-flex", cursor: "pointer" }}
          aria-owns={open ? id : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <InfoIcon sx={{ fontSize: iconSize }} />
        </span>
      )}
      <AppPopoverWrapper
        id={id}
        sx={{
          pointerEvents: "none",
        }}
        type={type}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>{text}</Typography>
      </AppPopoverWrapper>
    </>
  );
};

export default AppPopover;
