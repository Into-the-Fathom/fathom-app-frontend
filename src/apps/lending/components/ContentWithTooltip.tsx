import { Box, ClickAwayListener, Popper, styled, Tooltip } from "@mui/material";
import {
  FC,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useState,
} from "react";

interface ContentWithTooltipProps {
  children: ReactNode;
  // eslint-disable-next-line
  tooltipContent: ReactElement<any, string | JSXElementConstructor<any>>;
  placement?: "top" | "bottom";
  withoutHover?: boolean;
  open?: boolean;
  setOpen?: (value: boolean) => void;
  offset?: [number, number];
}

export const PopperComponent = styled(Popper)(({ theme }) =>
  theme.unstable_sx({
    ".MuiTooltip-tooltip": {
      color: "text.primary",
      backgroundColor: "background.paper",
      p: 0,
      borderRadius: "6px",
      boxShadow:
        "0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "280px",
    },
    ".MuiTooltip-arrow": {
      color: "background.paper",
      "&:before": {
        boxShadow:
          "0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)",
      },
    },
  })
);

export const ContentWithTooltip: FC<ContentWithTooltipProps> = ({
  children,
  tooltipContent,
  placement = "top",
  withoutHover,
  open,
  setOpen,
  offset,
}) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const formattedOpen = typeof open !== "undefined" ? open : openTooltip;
  const toggleOpen = () =>
    typeof setOpen !== "undefined"
      ? setOpen(!formattedOpen)
      : setOpenTooltip(!formattedOpen);
  const handleClose = () =>
    typeof setOpen !== "undefined" ? setOpen(false) : setOpenTooltip(false);

  return (
    <Tooltip
      open={formattedOpen}
      onClose={handleClose}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      placement={placement}
      PopperComponent={PopperComponent}
      componentsProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: offset ?? [],
              },
            },
          ],
          onClick: (e) => {
            e.stopPropagation();
          },
        },
      }}
      title={
        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchStart"
          onClickAway={handleClose}
        >
          <Box
            sx={{
              py: 1,
              px: 2,
              fontSize: "12px",
              lineHeight: "16px",
              color: "#000c24",
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "8px",
              a: {
                fontSize: "13px",
                lineHeight: "16px",
                fontWeight: 500,
                "&:hover": { textDecoration: "underline" },
              },
            }}
          >
            {tooltipContent}
          </Box>
        </ClickAwayListener>
      }
      arrow
    >
      <Box
        sx={{
          display: "inline-flex",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": { opacity: withoutHover ? 1 : formattedOpen ? 1 : 0.5 },
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleOpen();
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
};
