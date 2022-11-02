import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { Constants } from "helpers/Constants";
import { ProposeListViewProps } from "components/Governance/Propose";

const defaultValues = {
  withAction: false,
  descriptionTitle: "",
  description: "",
  inputValues: "",
  calldata: "",
  targets: "",
  link: "",
  agreement: false,
}

const useCreateProposal = (onClose: ProposeListViewProps["onClose"]) => {
  const { proposalStore } = useStores();
  const { account, chainId } = useMetaMask()!;

  const { handleSubmit, watch, control, reset, getValues } = useForm({
    defaultValues,
  });

  const withAction = watch("withAction");

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        proposalStore.getVeBalance(account, chainId);
      });
    }
  }, [account, chainId, proposalStore]);

  useEffect(() => {
    let values = localStorage.getItem('createProposal')
    if (values) {
      values = JSON.parse(values);
      reset(values as unknown as typeof defaultValues);
    }
  }, [reset])

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      try {
        if (!chainId) return;

        const {
          descriptionTitle,
          description,
          inputValues,
          calldata,
          targets,
          withAction,
        } = values;
        const combinedText =
          descriptionTitle + "----------------" + description;

        if (withAction) {
          const values = inputValues.trim().split(",").map(Number);
          const callData = calldata.trim().split(",");
          const targetsArray = targets.trim().split(",");

          await proposalStore.createProposal(
            targetsArray,
            values,
            callData,
            combinedText,
            account
          );
        } else {
          await proposalStore.createProposal(
            [Constants.ZERO_ADDRESS],
            [0],
            [Constants.ZERO_ADDRESS],
            combinedText,
            account
          );
        }
        reset();
        localStorage.removeItem('createProposal')
        onClose();
      } catch (err) {
        console.log(err);
      }
    },
    [reset, account, chainId, proposalStore]
  );

  const saveForLater = useCallback(() => {
    const values = getValues();
    localStorage.setItem('createProposal', JSON.stringify(values));
  }, [getValues])

  return {
    withAction,
    handleSubmit,
    watch,
    control,
    reset,
    account,
    chainId,
    onSubmit,
    vBalance: proposalStore.veBalance,
  };
};

export default useCreateProposal;
