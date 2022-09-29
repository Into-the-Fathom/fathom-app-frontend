import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  TextField,
  Slider
} from "@mui/material";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { LogLevel, useLogger } from "../../helpers/Logger";
import { useCallback, useEffect } from "react";
import { observer } from "mobx-react";
import ILockPosition from "../../stores/interfaces/ILockPosition";
import StakingModal from "./StakingModal";

const StakingView = observer(() => {

  const [lockDays, setLockDays] = React.useState(0);
  const [stakePosition, setStakePosition] = React.useState(0);
 // const [unlockPeriod, setUnlockPeriod] = React.useState(30);
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const rootStore = useStores();

  const stakingStore = rootStore.stakingStore;
  
 
  

  const fetchAll = useCallback(
    (account: string, chainId: number) => {
      console.log("HERRRRREEEE... fetcgALL");
      stakingStore.fetchLocks(account, chainId);
      stakingStore.fetchVOTEBalance(account, chainId);
      stakingStore.fetchWalletBalance(account, chainId);
      stakingStore.fetchAPR(chainId);
    },
    [stakingStore]
  );

  useEffect(() => {
    if (chainId) {
      logger.log(LogLevel.info, "fetching lock positions.");
      fetchAll(account, chainId);
      console.log("stakingStore.lockPositions: ");
      console.log(stakingStore.lockPositions);
    } else {
      stakingStore.setLocks([]);
    }
  }, [account, logger, stakingStore, chainId, fetchAll]);

  const createLock = useCallback(async () => {
    console.log(",,,,,stakingPositin", stakePosition)
    console.log(",,,,,Locking Days...", lockDays)
    await stakingStore.createLock(account, stakePosition, lockDays, chainId);
    fetchAll(account, chainId);
    
  }, [stakingStore, account, chainId, stakePosition, lockDays, fetchAll]);

  const claimRewards = useCallback(async () => {
    await stakingStore.handleClaimRewards(account, chainId);
    fetchAll(account, chainId);
  }, [stakingStore, account, chainId, fetchAll]);

  const claimRewardsSingle = useCallback(async (lockId: number) => {
    await stakingStore.handleClaimRewardsSingle(account, lockId, chainId);
    fetchAll(account, chainId);
  }, [stakingStore, account, chainId, fetchAll]);

  const withdrawRewards = useCallback(() => {
    stakingStore.handleWithdrawRewards(account, chainId);
  }, [stakingStore, account, chainId]);

  const handleEarlyWithdrawal = useCallback(async (lockId: number) => {
      await stakingStore.handleEarlyWithdrawal(account, lockId, chainId);
      fetchAll(account,chainId)
    },
    [stakingStore, account, chainId,fetchAll]
  );

  const handleUnlock = useCallback(async (lockId: number) => {
    await stakingStore.handleUnlock(account, lockId, chainId);
    fetchAll(account,chainId)
  },
  [stakingStore, account, chainId,fetchAll]
);

  const isItUnlockable = (lockId: number) => {
    const remainingTime = stakingStore.lockPositions[lockId - 1].EndTime
    const isItUnlockable = remainingTime === 0 || remainingTime < 0;
    return isItUnlockable
  }

  const isItClaimable = (lockId: number) => {
    let amountClaimable = stakingStore.lockPositions[lockId - 1].RewardsAvailable
    let integerAmountClaimable = Number(amountClaimable)
    const isItClaimable = integerAmountClaimable > 0
    return isItClaimable
  }

 
  const handleStakeChange = (e:any) => {
    setStakePosition(e.target.value)
    console.log(".......staking Positino trigerre?>", stakePosition)
  }



  const handleSliderChange = (e:any) => {
    setLockDays(e.target.value);
  }


  

  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        {/* <Grid  item xs={12} md={4} lg={3}>
          <StakingModalSubik />
        </Grid> */}
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        STAKING
      </Typography>
      {/* <StakingModalSubik apr={stakingStore.apr} voteBalance={stakingStore.voteBalance} stakedBalance={stakingStore.totalStakedPosition}/> */}
      <Grid container spacing={2}>
      <Grid item xs={8}>
        <div>
      <TextField
          id="outlined-helperText"
          label="Stake Position"
          defaultValue="Default Value"
          helperText="Enter the stake position."
          sx={{ m: 3 }}
          value={stakePosition}
          onChange={handleStakeChange}
         />
        </div>
        <Box>
        
          Unlock Period:
            <Slider
            aria-label="Temperature"
            defaultValue={30}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={365}
            value={lockDays}
            onChange={handleSliderChange}
        />
        {lockDays} days

         </Box>
         </Grid>
         <Grid item xs={4}>
            <StakingModal apr={100} stakedBalance={stakingStore.totalStakedPosition} />
          </Grid>
         </Grid>
        <div>
    
        <Button variant="outlined" onClick={() => createLock()}>
            Create Lock
        </Button>
      </div>
      <br/>

      {stakingStore.lockPositions.length === 0 ? (
        <Typography variant="h1">Loading Lock Positions</Typography>
      ) : (
        
        <TableContainer>
          
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Lock Position</TableCell>
                <TableCell>Vote Tokens Received</TableCell>
                <TableCell>Rewards</TableCell>
                <TableCell sx={{textAlign: 'center'}}>Remaining Period</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stakingStore.lockPositions.map((lockPosition: ILockPosition) => (
                <TableRow
                  key={lockPosition.lockId}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {lockPosition.MAINTokenBalance} FTHM
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {lockPosition.VOTETokenBalance} VOTES
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {lockPosition.RewardsAvailable}
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {lockPosition.EndTime > 0 && <Box sx={{textAlign: 'center'}}>{lockPosition.timeObject.days} days {lockPosition.timeObject.hour} hrs {lockPosition.timeObject.min} min {lockPosition.timeObject.sec} sec</Box>}
                    {lockPosition.EndTime < 0 &&  <Box sx={{textAlign: 'center'}}>Lock Open</Box>} 
                  </TableCell>

                  <TableCell component="th" scope="row" >
                    <Button onClick={() => handleUnlock(lockPosition.lockId)} disabled={!isItUnlockable(lockPosition.lockId)}>Unlock</Button>
                  </TableCell>

               

                  <TableCell component="th" scope="row" >
                    <Button onClick={() => handleEarlyWithdrawal(lockPosition.lockId)} disabled={isItUnlockable(lockPosition.lockId)}>Early Unlock</Button>
                  </TableCell>

                  {/* <TableCell component="th" scope="row" >
                    <Button onClick={() => claimRewardsSingle(lockPosition.lockId)} disabled={!isItClaimable(lockPosition.lockId)}>Claim Rewards</Button>
                  </TableCell> */}

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

  <br/>

      <Button variant="outlined" onClick={() => claimRewards()}>
          Claim Rewards
      </Button>
      <br/>

      <Button variant="outlined" onClick={() => withdrawRewards()}>
          Withdraw Rewards
      </Button>
      <br/>
    </Paper>
  );
});

export default StakingView;
