import React, { FC, memo, useMemo } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import StakingViewItem from "components/Staking/StakingViewItem";
import { useStores } from "stores";
import ClaimRewardsDialog from "components/Staking/Dialog/ClaimRewardsDialog";
import { DialogActions } from "hooks/useStakingView";
import UnstakeDialog from "components/Staking/Dialog/UnstakeDialog";
import EarlyUnstakeDialog from "components/Staking/Dialog/EarlyUnstakeDialog";
import { NoResults } from "components/AppComponents/AppBox/AppBox";
import { Grid } from "@mui/material";
import UnclaimedRewardsDialog from "components/Staking/Dialog/UnclaimedRewardsDialog";
import ClaimRewardsCoolDown from "components/Staking/Dialog/ClaimRewardsCoolDown";
import useStakingContext from "context/staking";

type StreamItemProps = {
  token: string;
};

const StreamItem: FC<StreamItemProps> = ({ token }) => {
  const { stakingStore } = useStores();

  const {
    totalRewards,
    setUnstake,
    setEarlyUnstake,
    dialogAction,
    unstake,
    earlyUnstake,
    onClose,
    processFlow,
  } = useStakingContext();

  return (
    <>
      {useMemo(
        () => (
          <>
            {stakingStore.lockPositions.length === 0 ? (
              <NoResults variant="h6">You have no open positions!</NoResults>
            ) : (
              <Grid container sx={{ gap: "12px" }}>
                {stakingStore.lockPositions.map(
                  (lockPosition: ILockPosition, index: number) => (
                    <StakingViewItem
                      index={index}
                      key={lockPosition.lockId}
                      token={token}
                      lockPosition={lockPosition}
                      setUnstake={setUnstake}
                      setEarlyUnstake={setEarlyUnstake}
                    />
                  )
                )}
              </Grid>
            )}
          </>
        ),
        [stakingStore.lockPositions, token, setUnstake, setEarlyUnstake]
      )}

      {useMemo(() => {
        return (
          dialogAction === DialogActions.CLAIM_REWARDS && (
            <ClaimRewardsDialog
              token={token}
              totalRewards={totalRewards}
              onClose={onClose}
              onSkip={
                unstake || earlyUnstake ? () => processFlow("skip") : null
              }
              onClaim={() => processFlow("claim-cooldown")}
            />
          )
        );
      }, [
        totalRewards,
        unstake,
        earlyUnstake,
        token,
        dialogAction,
        onClose,
        processFlow,
      ])}

      {useMemo(() => {
        return (
          dialogAction === DialogActions.CLAIM_REWARDS_COOLDOWN && (
            <ClaimRewardsCoolDown
              totalRewards={totalRewards}
              token={token}
              onClose={onClose}
              onContinue={() => processFlow("continue")}
            />
          )
        );
      }, [totalRewards, token, dialogAction, onClose, processFlow])}

      {useMemo(
        () =>
          dialogAction === DialogActions.UNSTAKE && (
            <UnstakeDialog
              onClose={onClose}
              token={token}
              lockPosition={unstake}
            />
          ),
        [unstake, token, dialogAction, onClose]
      )}

      {useMemo(
        () =>
          dialogAction === DialogActions.EARLY_UNSTAKE && (
            <EarlyUnstakeDialog
              token={token}
              onClose={onClose}
              lockPosition={earlyUnstake!}
              onFinish={() => processFlow("unstake-cooldown")}
            />
          ),
        [token, dialogAction, earlyUnstake, onClose, processFlow]
      )}

      {useMemo(() => {
        return (
          dialogAction === DialogActions.UNCLAIMED && (
            <UnclaimedRewardsDialog
              position={(unstake || earlyUnstake)!}
              token={token}
              onClose={onClose}
              onSkip={() => processFlow("skip")}
              onClaim={() => processFlow("claim")}
            />
          )
        );
      }, [unstake, earlyUnstake, token, dialogAction, onClose, processFlow])}
    </>
  );
};

export default memo(StreamItem);
