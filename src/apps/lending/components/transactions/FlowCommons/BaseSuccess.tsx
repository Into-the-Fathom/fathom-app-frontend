import { ExternalLinkIcon } from "@heroicons/react/outline";
import { CheckIcon } from "@heroicons/react/solid";
import { Box, Button, Link, SvgIcon, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";

export type BaseSuccessTxViewProps = {
  txHash?: string;
  children: ReactNode;
};

const ExtLinkIcon = () => (
  <SvgIcon sx={{ ml: "2px", fontSize: "11px" }}>
    <ExternalLinkIcon />
  </SvgIcon>
);

export const BaseSuccessView: FC<BaseSuccessTxViewProps> = ({
  txHash,
  children,
}) => {
  const { close, mainTxState } = useModalContext();
  const { currentNetworkConfig } = useProtocolDataContext();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "48px",
            height: "48px",
            bgcolor: "transparent",
            borderRadius: "50%",
            mt: 14,
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SvgIcon sx={{ color: "success.main", fontSize: "32px" }}>
            <CheckIcon />
          </SvgIcon>
        </Box>

        <Typography sx={{ mt: 4 }} variant="h2">
          All done!
        </Typography>

        {children}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Link
          variant="helperText"
          href={currentNetworkConfig.explorerLinkBuilder({
            tx: txHash ? txHash : mainTxState.txHash,
          })}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "right",
            mt: 6,
            mb: 3,
          }}
          underline="hover"
          target="_blank"
          rel="noreferrer noopener"
        >
          Review tx details
          <ExtLinkIcon />
        </Link>
        <Button
          onClick={close}
          variant="gradient"
          size="large"
          sx={{ minHeight: "44px" }}
          data-cy="closeButton"
        >
          Ok, Close
        </Button>
      </Box>
    </>
  );
};
