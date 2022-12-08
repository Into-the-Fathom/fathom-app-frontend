import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProposalStatus, XDC_BLOCK_TIME } from "helpers/Constants";
import { useStores } from "stores";
import { Web3Utils } from "helpers/Web3Utils";
import IProposal from "stores/interfaces/IProposal";

const useViewProposalItem = (proposal: IProposal) => {
  const { chainId, account } = useWeb3React();
  const [status, setStatus] = useState<ProposalStatus>();
  const { proposalStore } = useStores();

  const [timestamp, setTimestamp] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const getTimestamp = useCallback(async () => {
    const instance = Web3Utils.getWeb3Instance(chainId!);

    const { timestamp } = await instance.eth.getBlock(proposal.startBlock);

    const endTimestamp =
      timestamp +
      (Number(proposal.endBlock) - Number(proposal.startBlock)) *
        XDC_BLOCK_TIME;

    const now = Date.now() / 1000;
    setTimestamp(endTimestamp);

    if (endTimestamp - now <= 0) {
      return setSeconds(0);
    } else {
      setSeconds(endTimestamp - now);
    }
  }, [proposal, chainId, setSeconds, setTimestamp]);

  const fetchProposalState = useCallback(async () => {
    const status = await proposalStore.fetchProposalState(
      proposal.proposalId,
      account!
    );
    // @ts-ignore
    setStatus(Object.values(ProposalStatus)[status]);
  }, [proposalStore, proposal, account]);

  useEffect(() => {
    if (proposal && chainId && account) {
      getTimestamp();
      fetchProposalState();
    }
  }, [proposal, chainId, account, getTimestamp, fetchProposalState]);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => {
        setSeconds(seconds - 1)
      }, 1000)
    }
  }, [seconds, setSeconds])

  const proposalTitle = useMemo(() => {
    const title = proposal.description.split("----------------")[0];
    return title.substring(0, 50) + (title.length > 50 ? "... " : "");
  }, [proposal.description]);

  return {
    proposalTitle,
    timestamp,
    seconds,
    status
  }
};


export default useViewProposalItem;
