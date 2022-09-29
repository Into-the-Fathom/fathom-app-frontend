//import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import { observer } from "mobx-react";
import { Paper, Typography } from "@mui/material";


const StakingModalSubik = observer((props:any) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: 240,
      }}
    >
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
          {props.apr} % APR
      </Typography>
      <Typography color="text.secondary">
        Staked Balance
      </Typography>
      <Typography component="p" variant="h6">
          {props.stakedBalance}
      </Typography>

     
    </Paper>
  );
});

export default StakingModalSubik;
