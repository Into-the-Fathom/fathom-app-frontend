import { gql } from "@apollo/client";

export const FXD_STATS = gql`
  query FxdStats {
    protocolStat(id: "fathom_stats") {
      id
      totalSupply
      tvl
    }
  }
`;

export const FXD_POOLS = gql`
  query FXDPools {
    pools {
      collateralLastPrice
      collateralPrice
      debtAccumulatedRate
      debtCeiling
      id
      liquidationRatio
      lockedCollateral
      poolName
      priceWithSafetyMargin
      stabilityFeeRate
      totalAvailable
      totalBorrowed
      tvl
      tokenAdapterAddress
    }
  }
`;

export const FXD_POSITIONS = gql`
  query FXDPositions($walletAddress: String!, $first: Int!, $skip: Int!) {
    positions(
      first: $first
      skip: $skip
      orderBy: positionId
      orderDirection: desc
      where: { walletAddress: $walletAddress, positionStatus: active }
    ) {
      collateralPool
      collateralPoolName
      debtShare
      id
      liquidationPrice
      lockedCollateral
      positionAddress
      positionId
      positionStatus
      safetyBuffer
      safetyBufferInPercent
      tvl
      walletAddress
    }
  }
`;

export const FXD_USER = gql`
  query FXDUser($walletAddress: String!) {
    users(where: { address: $walletAddress }) {
      id
      activePositionsCount
    }
  }
`;

export const GOVERNANCE_PROPOSALS = gql`
  query GovernanceProposals($first: Int!, $skip: Int!) {
    proposals(
      first: $first
      skip: $skip
      orderBy: blockNumber
      orderDirection: desc
    ) {
      id
      proposalId
      proposer
      startBlock
      endBlock
      description
      forVotes
      againstVotes
      abstainVotes
      calldatas
      signatures
      values
      targets
      blockTimestamp
    }
  }
`;

export const GOVERNANCE_PROPOSAL_ITEM = gql`
  query GovernanceProposalItem($id: ID!) {
    proposal(id: $id) {
      id
      proposalId
      proposer
      startBlock
      endBlock
      blockNumber
      blockTimestamp
      description
      forVotes
      againstVotes
      abstainVotes
      calldatas
      signatures
      values
      targets
    }
  }
`;

export const GOVERNANCE_STATS = gql`
  query GovernanceStats($id: ID!) {
    governanceStat(id: $id) {
      totalProposalsCount
    }
  }
`;
