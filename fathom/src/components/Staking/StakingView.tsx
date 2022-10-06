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
  Grid,
  CircularProgress,
} from "@mui/material";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { LogLevel, useLogger } from "../../helpers/Logger";
import { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react";
import ILockPosition from "../../stores/interfaces/ILockPosition";
import StakingModal from "./StakingModal";
import StakingViewItem from "./StakingViewItem";
import StakingLockForm from "./StakingLockForm";

export type StakingViewItemMethodsPropsType = {
  handleEarlyWithdrawal: (lockId: number) => void;
  isItUnlockable: (lockId: number) => boolean;
  handleUnlock: (lockId: number) => void;
};

export type ActionType = { type: string; id: number | null };

const StakingView = observer(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<ActionType>();
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const rootStore = useStores();

  const stakingStore = rootStore.stakingStore;

  const fetchAll = useCallback(
    async (account: string, chainId: number) => {
      setIsLoading(true);
      Promise.all([
        stakingStore.fetchLocks(account, chainId),
        stakingStore.fetchVOTEBalance(account, chainId),
        stakingStore.fetchWalletBalance(account, chainId),
        stakingStore.fetchAPR(chainId),
      ]).then(() => {
        setIsLoading(false);
      });
    },
    [stakingStore, setIsLoading]
  );

  const fetchOverallValues = useCallback(
    async (account: string, chainId: number) => {
      setIsLoading(true);
      await Promise.all([
        stakingStore.fetchVOTEBalance(account, chainId),
        stakingStore.fetchWalletBalance(account, chainId),
        stakingStore.fetchAPR(chainId),
      ]).then(() => {
        setIsLoading(false);
      });
    },
    [stakingStore, setIsLoading]
  );

  useEffect(() => {
    if (chainId) {
      logger.log(LogLevel.info, "Fetching lock positions.");
      fetchAll(account, chainId);
    } else {
      stakingStore.setLocks([]);
    }
  }, [account, logger, stakingStore, chainId, fetchAll]);

  const claimRewards = useCallback(async () => {
    setAction({ type: "claim", id: null });
    try {
      await stakingStore.handleClaimRewards(account, chainId);
    } catch (e) {
      logger.log(LogLevel.error, "Claim error");
    }
    setAction(undefined);
  }, [stakingStore, account, chainId, setAction, logger]);

  const withdrawRewards = useCallback(async () => {
    setAction({ type: "withdraw", id: null });
    try {
      await stakingStore.handleWithdrawRewards(account, chainId);
    } catch (e) {
      logger.log(LogLevel.error, "Withdraw error");
    }
    setAction(undefined);
  }, [stakingStore, account, chainId, setAction, logger]);

  const handleEarlyWithdrawal = useCallback(
    async (lockId: number) => {
      setAction({
        type: "early",
        id: lockId,
      });
      await stakingStore.handleEarlyWithdrawal(account, lockId, chainId);
      await stakingStore.fetchLockPositionAfterUnlock(lockId);
      setAction(undefined);
      fetchOverallValues(account, chainId);
    },
    [stakingStore, account, chainId, fetchOverallValues, setAction]
  );

  const handleUnlock = useCallback(
    async (lockId: number) => {
      setAction({
        type: "unlock",
        id: lockId,
      });
      await stakingStore.handleUnlock(account, lockId, chainId);
      await stakingStore.fetchLockPositionAfterUnlock(lockId);
      setAction(undefined);
      fetchOverallValues(account, chainId);
    },
    [stakingStore, account, chainId, fetchOverallValues, setAction]
  );

  const isItUnlockable = useCallback(
    (lockId: number) => {
      const remainingTime = stakingStore.lockPositions[lockId - 1].EndTime;
      const isItUnlockable = remainingTime <= 0;
      return isItUnlockable;
    },
    [stakingStore.lockPositions]
  );

  const stakingViewItemProps: StakingViewItemMethodsPropsType = {
    handleEarlyWithdrawal,
    isItUnlockable,
    handleUnlock,
  };

  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        STAKING
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <StakingLockForm fetchAll={fetchAll} />
        </Grid>
        <Grid item xs={4}>
          <StakingModal
            apr={100}
            stakedBalance={stakingStore.totalStakedPosition}
            voteBalance={stakingStore.voteBalance}
          />
        </Grid>
      </Grid>
      <TableContainer sx={{ my: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{
                th: { textAlign: "center", fontSize: "1rem" },
              }}
            >
              <TableCell component="th">Lock Position</TableCell>
              <TableCell component="th">Vote Tokens Received</TableCell>
              <TableCell component="th">Stream Rewards</TableCell>
              <TableCell component="th">Remaining Period</TableCell>
              <TableCell component="th">Unlock</TableCell>
              <TableCell component="th">Early Unlock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell align="center" colSpan={6}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              stakingStore.lockPositions.map((lockPosition: ILockPosition) => (
                <StakingViewItem
                  key={lockPosition.lockId}
                  lockPosition={lockPosition}
                  action={action}
                  {...stakingViewItemProps}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <br />

      <Button variant="outlined" onClick={claimRewards} sx={{ my: 2 }}>
        {action?.type === "claim" ? (
          <CircularProgress size={30} />
        ) : (
          "Claim Stream Rewards"
        )}
      </Button>
      <Button variant="outlined" onClick={withdrawRewards}>
        {action?.type === "withdraw" ? (
          <CircularProgress size={30} />
        ) : (
          "Withdraw All Rewards and Remaining Unlocked FTHM"
        )}
      </Button>
    </Paper>
  );
});

export default StakingView;
