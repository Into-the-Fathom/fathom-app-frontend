import React, { useCallback, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import {
  Grid,
  Typography,
  DialogTitle,
  IconButton,
  Dialog,
  Button,
  styled,
  TextField,
  Box,
  DialogContent,
  Divider,
  ListItem,
  ListItemText,
  List,
} from "@mui/material";
import { AppDialog } from "../AppComponents/AppDialog/AppDialog";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface PoolProps {
  pool: ICollatralPool;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function CustomizedDialogs(this: any, props: PoolProps) {
  const positionStore = useStores().positionStore;
  const poolStore = useStores().poolStore;
  const { onClose } = props;

  const { account, chainId } = useMetaMask()!;
  const [approveBtn, setApproveBtn] = useState(true);
  const [approvalPending, setApprovalPending] = useState(false);
  const [balance, setBalance] = useState(0);
  const [balanceError, setBalanceError] = useState(false);

  const [fathomToken, setFathomToken] = useState(0);
  const [collatral, setCollatral] = useState(0);
  const [collatralToBeLocked, setCollatralToBeLocked] = useState(0);
  const [fxdToBeBorrowed, setFxdToBeBorrowed] = useState(0);
  const [safeMax, setSafeMax] = useState(0);
  const [collatralAvailableToWithdraw, setCollatralAvailableToWithdraw] =
    useState(0);
  // const [priceWithSafetyMargin, setPriceWithSafetyMargin] = useState(0);
  const [safetyBuffer, setSafetyBuffer] = useState(0);
  const [debtRatio, setDebtRatio] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [fxdAvailableToBorrow, setFxdAvailableToBorrow] = useState(0);

  const [disableOpenPosition, setDisableOpenPosition] = useState(false);

  const approvalStatus = useCallback(async () => {
    let approved = await positionStore.approvalStatus(
      account,
      collatral,
      props.pool
    );
    approved ? setApproveBtn(false) : setApproveBtn(true);
  }, [positionStore, props.pool, account, collatral]);

  useEffect(() => {
    if (chainId) {
      setTimeout(() => approvalStatus());
    }
  }, [approvalStatus, chainId]);

  const handleUpdates = async (
    collateralInput: number,
    fathomTokenInput: number
  ) => {
    const availableFathom = parseInt(
      props.pool.availableFathom.replaceAll(",", "")
    );
    const disable = fathomTokenInput >= availableFathom;
    console.log(
      `Input token ${fathomTokenInput} and Pool Max: ${availableFathom}`
    );
    setDisableOpenPosition(disable);

    // check collateral input
    if (isNaN(collateralInput) || !collateralInput) {
      collateralInput = 0;
    }
    // console.log("COLLATERAL INPUT: ", collateralInput);
    setCollatralToBeLocked(+collateralInput);

    if (isNaN(fathomTokenInput) || !fathomTokenInput) {
      fathomTokenInput = 0;
    }
    // console.log("FXD TO BORROW: ", fxdToBorrow);
    setFxdToBeBorrowed(+fathomTokenInput);

    // GET USER BALANCE
    const balance = await poolStore.getUserTokenBalance(account, props.pool);
    setBalance(balance);

    // CHECK BALANCE
    // if the user does not have enough collateral -- show them a balance error
    if (+balance / 10 ** 18 < +collateralInput) {
      setBalanceError(true);
      return;
    } else {
      setBalanceError(false);
    }

    // GET PRICE WITH SAFETY MARGIN
    let priceWithSafetyMargin = 0;
    if (props.pool.name === "USDT") {
      priceWithSafetyMargin = 0.75188;
    } else {
      priceWithSafetyMargin = await poolStore.getPriceWithSafetyMargin(
        props.pool
      );
    }
    // setPriceWithSafetyMargin(+priceWithSafetyMargin);

    // SAFE MAX
    let safeMax = 0;
    if (priceWithSafetyMargin === 0) {
      safeMax = +collateralInput;
    } else {
      safeMax = +collateralInput * priceWithSafetyMargin * 0.99;
    }

    //TODO: TODO...
    safeMax = Math.floor(safeMax);

    setSafeMax(+safeMax);

    if (+fathomTokenInput > safeMax) {
      setFxdToBeBorrowed(0);
      setFathomToken(0);
    }

    let collatralAvailableToWithdraw = 0;
    if (+priceWithSafetyMargin === 0) {
      collatralAvailableToWithdraw = +collateralInput - +fathomTokenInput;
    } else {
      collatralAvailableToWithdraw =
        (+collateralInput * +priceWithSafetyMargin - +fathomTokenInput) /
        +priceWithSafetyMargin;
    }

    setCollatralAvailableToWithdraw(+collatralAvailableToWithdraw);

    // PRICE OF COLLATERAL FROM DEX
    const priceOfCollateralFromDex =
      props.pool.name === "USDT" ? 10 ** 18 : await poolStore.getDexPrice();

    // DEBT RATIO
    const debtRatio =
      +fathomTokenInput === 0
        ? 0
        : (+fathomTokenInput /
            ((+collateralInput * +priceOfCollateralFromDex) / 10 ** 18)) *
          100;
    setDebtRatio(+debtRatio);

    // FXD AVAILABLE TO BORROW
    const fxdAvailableToBorrow = safeMax - +fathomTokenInput;
    setFxdAvailableToBorrow(fxdAvailableToBorrow);

    // SAFETY BUFFER
    const safetyBuffer = collatralAvailableToWithdraw / +collateralInput;
    setSafetyBuffer(+safetyBuffer);

    // LIQUIDATION PRICE
    let liquidationPrice = 0;
    if (priceWithSafetyMargin === 0) {
      liquidationPrice =
        priceOfCollateralFromDex / 10 ** 18 -
        collatralAvailableToWithdraw / +collateralInput;
    } else {
      liquidationPrice =
        priceOfCollateralFromDex / 10 ** 18 -
        (collatralAvailableToWithdraw * priceWithSafetyMargin) /
          +collateralInput;
    }

    setLiquidationPrice(+liquidationPrice);
  };

  const updateFathomAmount = () => {
    setFathomToken(safeMax);
    handleUpdates(collatral, safeMax);
  };

  const openNewPosition = () => {
    positionStore.openPosition(account, props.pool, collatral, fathomToken);
  };

  const approve = async () => {
    setApprovalPending(true);
    try {
      await positionStore.approve(account, props.pool);
      handleCloseApproveBtn();
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  };

  const handleCloseApproveBtn = () => {
    setApproveBtn(false);
  };

  const handleClose = () => {
    onClose();
  };

  const handleCollatralTextFieldChange = (e: any) => {
    let value = e.target.value;
    if (!isNaN(value)) {
      setCollatral(value);
    }

    handleUpdates(value, fathomToken);
  };

  const handlefathomTokenTextFieldChange = (e: any) => {
    let value = e.target.value;
    if (!isNaN(value)) {
      setFathomToken(value);
    }
    handleUpdates(collatral, value);
  };

  return (
    <AppDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      maxWidth="md"
      open={true}
      color="primary"
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Open New Position
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <List sx={{ width: "100%" }}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${collatralToBeLocked.toFixed(2)} ${
                  props.pool.name
                }`}
              >
                <ListItemText primary="Collateral to be Locked" />
              </ListItem>
              <Divider component="li" />
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${collatralAvailableToWithdraw.toFixed(2)} ${
                  props.pool.name
                }`}
              >
                <ListItemText primary="Estimated Collateral Available to Withdraw" />
              </ListItem>
              <Divider component="li" />
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${fxdToBeBorrowed.toFixed(2)} FXD`}
              >
                <ListItemText primary="FXD to be Borrowed" />
              </ListItem>
              <Divider component="li" />
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${fxdAvailableToBorrow.toFixed(2)} FXD`}
              >
                <ListItemText primary="FXD Available to Borrow" />
              </ListItem>
              <Divider component="li" />
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${debtRatio.toFixed(2)} %`}
              >
                <ListItemText primary="LTV" />
              </ListItem>
              <Divider component="li" />
              <ListItem
                alignItems="flex-start"
                secondaryAction={`${(safetyBuffer * 100).toFixed(2)} %`}
              >
                <ListItemText primary="Safety Buffer" />
              </ListItem>
              <Divider component="li" />
              <ListItem
                alignItems="flex-start"
                secondaryAction={`$${liquidationPrice.toFixed(2)}`}
              >
                <ListItemText
                  primary={`Liquidation Price of ${props.pool.name}`}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem alignItems="flex-start" secondaryAction={`1.73%`}>
                <ListItemText primary={`Lending APR`} />
              </ListItem>
              <Divider component="li" />
              <ListItem alignItems="flex-start" secondaryAction={`0.22%`}>
                <ListItemText primary={`Fathom Rewards APR`} />
              </ListItem>
              <Divider component="li" />
              <ListItem alignItems="flex-start" secondaryAction={`0.00%`}>
                <ListItemText primary={`Stability Fee`} />
              </ListItem>
              <Divider component="li" />
              <ListItem alignItems="flex-start" secondaryAction={`1.96%`}>
                <ListItemText primary={`Total APR`} />
              </ListItem>
              <Divider component="li" />
              <ListItem alignItems="flex-start" secondaryAction={`1.98%`}>
                <ListItemText primary={`Total APY`} />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={5}>
            <Grid item xs={7}>
              <Typography sx={{ ml: 3 }}>
                {props.pool.name} balance: {(balance / 10 ** 18).toFixed(2)}
              </Typography>
            </Grid>
            <Box display="flex">
              <TextField
                id="outlined-helperText"
                label="Collateral Amount"
                defaultValue="Default Value"
                helperText="Enter the Collateral."
                sx={{ m: 3 }}
                value={collatral}
                onChange={handleCollatralTextFieldChange}
              />
              <TextField
                id="outlined-helperText"
                label="FXD"
                defaultValue="Default Value"
                helperText="Enter the desired FXD."
                sx={{ m: 3 }}
                value={fathomToken}
                onChange={handlefathomTokenTextFieldChange}
              />
            </Box>
            <Box display="flex" sx={{ mx: 3 }}>
              {safeMax > 0 && !balanceError ? (
                <Button
                  onClick={updateFathomAmount}
                  variant="outlined"
                  sx={{ mr: 2 }}
                >
                  Use Safe Max: {safeMax.toFixed(2)}
                </Button>
              ) : null}
              {balanceError ? (
                <Typography color="red" gutterBottom>
                  You do not have enough {props.pool.name}
                </Typography>
              ) : null}

              {approvalPending ? (
                <Typography display="inline">Pending ...</Typography>
              ) : approveBtn ? (
                <Button onClick={approve} variant="outlined">
                  Approve {props.pool.name}
                </Button>
              ) : null}

              <Button
                onClick={openNewPosition}
                disabled={approveBtn || balanceError || disableOpenPosition}
                variant="outlined"
              >
                Open
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </AppDialog>
  );
}
