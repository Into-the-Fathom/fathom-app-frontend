import { useForm } from "react-hook-form";
import useMetaMask from "hooks/metamask";
import { useStores } from "stores";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { StakingLockFormPropsType } from "components/Staking/StakingLockForm";

const useStakingLockForm = (
  fetchOverallValues: StakingLockFormPropsType["fetchOverallValues"]
) => {
  const [balanceError, setBalanceError] = useState<boolean>(false);

  const { handleSubmit, watch, control, reset, getValues, setValue } = useForm({
    defaultValues: {
      lockDays: 30,
      stakePosition: 0,
    },
  });
  const { account, chainId } = useMetaMask()!;
  const { stakingStore } = useStores();

  const lockDays = watch("lockDays");
  const stakePosition = watch("stakePosition");

  const [approvedBtn, setApprovedBtn] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);

  const approvalStatus = useCallback(
    debounce(
      async (account: string, chainId: number, stakePosition: number) => {
        const approved = await stakingStore.approvalStatusStakingFTHM(
          account,
          stakePosition
        );

        console.log("Approve", approved);
        approved ? setApprovedBtn(false) : setApprovedBtn(true);
      },
      1000
    ),
    [stakingStore, setApprovedBtn, getValues]
  );

  useEffect(() => {
    if (chainId && stakePosition) {
      approvalStatus(account, chainId, stakePosition!);
    }
  }, [account, chainId, approvalStatus, stakePosition]);

  useEffect(() => {
    const getBalance = async () => {
      stakingStore.fetchWalletBalance(account);
    };

    if (account) getBalance();
  }, [account, stakingStore]);

  useEffect(() => {
    if (stakePosition > stakingStore.walletBalance) {
      setBalanceError(true)
    } else {
      setBalanceError(false)
    }
  }, [stakePosition, stakingStore.walletBalance])

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      const { stakePosition, lockDays } = values;

      await stakingStore.createLock(account, stakePosition, lockDays);
      await stakingStore.fetchLatestLock(account);
      reset();
      fetchOverallValues(account);
    },
    [stakingStore, account, fetchOverallValues, reset]
  );

  const approveFTHM = useCallback(async () => {
    setApprovalPending(true);
    try {
      await stakingStore.approveFTHM(account, chainId);
      setApprovedBtn(false);
    } catch (e) {
      setApprovedBtn(true);
    }

    setApprovalPending(false);
  }, [setApprovalPending, setApprovedBtn, account, chainId, stakingStore]);

  const setMax = useCallback(
    (balance: number) => {
      setValue("stakePosition", balance);
    },
    [setValue]
  );

  const setPeriod = useCallback(
    (period: number) => {
      setValue("lockDays", period);
    },
    [setValue]
  );

  const unlockDate = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() + lockDays);
    return now.toLocaleDateString();
  }, [lockDays]);

  return {
    balanceError,
    unlockDate,
    lockDays,
    approvedBtn,
    approvalPending,
    approveFTHM,
    control,
    handleSubmit,
    onSubmit,
    setMax,
    setPeriod,
    walletBalance: stakingStore.walletBalance,
  };
};

export default useStakingLockForm;
