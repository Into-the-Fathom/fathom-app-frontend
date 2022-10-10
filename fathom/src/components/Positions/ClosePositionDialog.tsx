import React, {
  FC,
  useCallback,
  useMemo
} from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import IOpenPosition from "../../stores/interfaces/IOpenPosition";
import { Constants } from "../../helpers/Constants";
import { AppDialog } from "../AppComponents/AppDialog/AppDialog";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface ClosePositionProps {
  position: IOpenPosition;
}

enum ClosingType {
  Full,
  Partial,
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

const ClosePositionDialog: FC<ClosePositionProps> = ({ position }) => {
  const rootStore = useStores();
  const positionStore = rootStore.positionStore;
  const poolStore = rootStore.poolStore;
  const [open, setOpen] = React.useState(false);
  const [collateral, setCollateral] = React.useState(0);
  const [fathomToken, setFathomToken] = React.useState(0);
  const [price, setPrice] = React.useState(0);
  const [closingType, setType] = React.useState(ClosingType.Full);

  const { account } = useMetaMask()!;

  const pool = useMemo(() => poolStore.getPool(position.pool), [position.pool, poolStore]);
  const debtShare = position.debtShare.div(Constants.WeiPerWad).toNumber();

  const lockedColateral = position.lockedCollateral
    .div(Constants.WeiPerWad)
    .toNumber();

const closePosition = useCallback(async () => {
  try {
    console.log(`Fathom Token : ${fathomToken} && Original Debt Share: ${position.debtShare.toNumber()}`)
    if(closingType === ClosingType.Full || debtShare === fathomToken ){
        console.log('Closing Full...')
        positionStore.closePosition(
          position.id,
          pool,
          account,
          position.lockedCollateral
        );
    }else{
      console.log('Partial Closing...')
        positionStore.partialyClosePosition(
          position,
          pool,
          account,
          fathomToken,
          collateral
        );
    }
    setOpen(false);
  } catch (e) {}
}, [position, pool, account, fathomToken, collateral, positionStore]);


  const handleClickOpen = async () => {
    const priceWithSafetyMargin = await poolStore.getPriceWithSafetyMargin(
      pool
    );
    setType(ClosingType.Full);
    setPrice(priceWithSafetyMargin);
    setFathomToken(debtShare);
    setOpen(true);
    setCollateral(lockedColateral);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlefathomTokenTextFieldChange = (e: any) => {
    const { value } = e.target;
    if (isNaN(+value)) {
      return;
    }

    setFathomToken(value);
    setCollateral(value / price);
  };

  const handleTypeChange = (e: any) => {
    if (e.target.value === ClosingType.Full) {
      setFathomToken(debtShare);
      setCollateral(lockedColateral);
    }

    setType(e.target.value);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Close
      </Button>
      <AppDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="md"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Close Position
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <Container>
                <Grid container spacing={2}>
                  <Grid item xs={7}>
                    <Typography gutterBottom>Locked Collateral</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography gutterBottom>{`${lockedColateral} → ${
                      lockedColateral - +collateral
                    } ${pool.name}`}</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography gutterBottom>FXD Borrowed</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography gutterBottom>
                      {`${debtShare} → ${debtShare - fathomToken} FXD`}{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography gutterBottom>Liquidation Price</Typography>
                  </Grid>
                  <Grid item xs={5}>{`1 FXD = ${1 / price} ${pool.name}`}</Grid>
                  <Grid item xs={7}>
                    <Typography gutterBottom>LTV</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    {position.ltv.toNumber() / 10}%
                  </Grid>
                </Grid>
              </Container>
            </Grid>
            <Grid item xs={5}>
              <FormControl fullWidth>
                <InputLabel sx={{ m: 3 }} id="closing-type"></InputLabel>
                <Select
                  id="closing-type-select"
                  value={closingType}
                  onChange={handleTypeChange}
                >
                  <MenuItem value={ClosingType.Full}>
                    Close entire position
                  </MenuItem>
                  <MenuItem value={ClosingType.Partial}>
                    Partialy close position
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  disabled={closingType === ClosingType.Full}
                  id="outlined-helperText"
                  label="FXD"
                  helperText="Enter the desired FXD."
                  sx={{ m: 3 }}
                  value={fathomToken}
                  onChange={handlefathomTokenTextFieldChange}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" autoFocus onClick={closePosition}>
            Submit
          </Button>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </AppDialog>
    </>
  );
};

export default ClosePositionDialog;
