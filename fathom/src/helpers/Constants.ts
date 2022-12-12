import BigNumber from "bignumber.js";

export const XDC_BLOCK_TIME = 2; // 2 seconds

export enum ProposalStatus {
  Pending = "Pending",
  OpenToVote = "Open-to-Vote",
  Canceled = "Canceled",
  Defeated = "Defeated",
  Succeeded = "Succeeded",
  Queued = "Queued",
  Expired = "Expired",
  Executed= "Executed",
}

export class Constants {
  public static WeiPerWad = new BigNumber("1e18");
  public static WeiPerRay = new BigNumber("1e27");
  public static WeiPerRad = new BigNumber("1e45");
  public static ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  public static TransactionCheckUpdateInterval = 2000;
  public static DEFAULT_CHAIN_ID = 51;
  public static MAX_UINT256 =
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

  public static COUNT_PER_PAGE = 4;
}
