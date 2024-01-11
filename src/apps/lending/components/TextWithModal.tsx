import { InformationCircleIcon } from "@heroicons/react/outline";
import { Box, Button, IconButton, SvgIcon, Typography } from "@mui/material";
import { TypographyProps } from "@mui/material/Typography";
import { FC, ReactNode, useState } from "react";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";

export interface TextWithModalProps extends TypographyProps {
  text?: ReactNode;
  icon?: ReactNode;
  iconSize?: number;
  iconColor?: string;
  withContentButton?: boolean;
}

export const TextWithModal: FC<TextWithModalProps> = ({
  text,
  children,
  icon,
  iconSize = 12,
  iconColor = "#EAEBEF",
  withContentButton,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {text && <Typography {...rest}>{text}</Typography>}

        <IconButton
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: iconSize,
            height: iconSize,
            borderRadius: "50%",
            p: 0,
            minWidth: 0,
            ml: 0.5,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpen();
          }}
        >
          <SvgIcon
            sx={{ fontSize: iconSize, color: iconColor, borderRadius: "50%" }}
          >
            {icon || <InformationCircleIcon />}
          </SvgIcon>
        </IconButton>
      </Box>

      <BasicModal open={open} setOpen={setOpen}>
        {children}

        {withContentButton && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 8,
            }}
          >
            <Button variant="gradient" onClick={() => setOpen(false)}>
              Ok, I got it
            </Button>
          </Box>
        )}
      </BasicModal>
    </>
  );
};
